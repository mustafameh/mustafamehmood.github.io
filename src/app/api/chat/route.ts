import { GoogleGenerativeAI, type Content, type Part } from "@google/generative-ai";
import { loadConfig, buildFunctionDeclarations, getFriendlyLabel } from "@/lib/chatbot-config";
import { executeTool, isValidTool } from "@/lib/chatbot-tools";

// ---------- Rate limiter (in-memory, per-IP) ----------

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string, maxPerMinute: number): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);

  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  bucket.count++;
  return bucket.count > maxPerMinute;
}

// ---------- Message send rate limiter (per-IP, 3/hour) ----------

const messageBuckets = new Map<string, { count: number; resetAt: number }>();
const MAX_MESSAGES_PER_HOUR = 3;

function isMessageRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = messageBuckets.get(ip);

  if (!bucket || now > bucket.resetAt) {
    messageBuckets.set(ip, { count: 1, resetAt: now + 3_600_000 });
    return false;
  }

  bucket.count++;
  return bucket.count > MAX_MESSAGES_PER_HOUR;
}

// Periodic cleanup so the maps don't grow forever
setInterval(() => {
  const now = Date.now();
  for (const [ip, bucket] of rateBuckets) {
    if (now > bucket.resetAt) rateBuckets.delete(ip);
  }
  for (const [ip, bucket] of messageBuckets) {
    if (now > bucket.resetAt) messageBuckets.delete(ip);
  }
}, 120_000);

// ---------- Global LLM call limit (in-memory, per-instance) ----------

const globalLlmBucket = { count: 0, resetAt: Date.now() + 3_600_000 };
const MAX_LLM_CALLS_PER_HOUR = 50;

function isGlobalLlmLimitReached(): boolean {
  const now = Date.now();
  if (now > globalLlmBucket.resetAt) {
    globalLlmBucket.count = 1;
    globalLlmBucket.resetAt = now + 3_600_000;
    return false;
  }
  globalLlmBucket.count++;
  return globalLlmBucket.count > MAX_LLM_CALLS_PER_HOUR;
}

// ---------- Limits ----------

const MAX_BODY_SIZE = 100_000; // 100 KB
const MAX_HISTORY_MSG_LENGTH = 500;

// ---------- Helpers ----------

function encode(obj: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(obj) + "\n");
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function toGeminiHistory(messages: ChatMessage[]): Content[] {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

// ---------- Route handler ----------

export async function POST(request: Request) {
  const config = loadConfig();

  // --- IP extraction ---
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip, config.limits.rate_limit_per_minute)) {
    return Response.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  if (isGlobalLlmLimitReached()) {
    return Response.json(
      { error: "The assistant is currently busy. Please try again later." },
      { status: 429 }
    );
  }

  // --- Body size guard ---
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
    return Response.json({ error: "Request too large." }, { status: 413 });
  }

  // --- Parse & validate body ---
  let rawText: string;
  try {
    rawText = await request.text();
  } catch {
    return Response.json({ error: "Could not read request." }, { status: 400 });
  }

  if (rawText.length > MAX_BODY_SIZE) {
    return Response.json({ error: "Request too large." }, { status: 413 });
  }

  let body: { message: string; history: ChatMessage[] };
  try {
    body = JSON.parse(rawText);
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { message, history } = body;

  if (!message || typeof message !== "string") {
    return Response.json({ error: "Message is required." }, { status: 400 });
  }

  if (message.length > config.limits.max_message_length) {
    return Response.json(
      { error: `Message too long (max ${config.limits.max_message_length} chars).` },
      { status: 400 }
    );
  }

  const safeHistory = Array.isArray(history)
    ? history
        .slice(-config.limits.max_history_length)
        .filter(
          (m): m is ChatMessage =>
            m != null &&
            typeof m.content === "string" &&
            (m.role === "user" || m.role === "assistant")
        )
        .map((m) => ({
          ...m,
          content: m.content.slice(0, MAX_HISTORY_MSG_LENGTH),
        }))
    : [];

  // --- Initialize Gemini ---
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return Response.json(
      { error: "Chat is temporarily unavailable." },
      { status: 503 }
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: config.model.name,
    systemInstruction: config.system_prompt,
    generationConfig: {
      temperature: config.model.temperature,
      maxOutputTokens: config.model.max_output_tokens,
      topP: config.model.top_p,
    },
    tools: [{ functionDeclarations: buildFunctionDeclarations() }],
  });

  const chat = model.startChat({
    history: toGeminiHistory(safeHistory),
  });

  // --- Stream SSE ---
  const stream = new ReadableStream({
    async start(controller) {
      try {
        let response = await chat.sendMessage(message);
        let iterations = 0;

        // ReAct loop: keep resolving function calls
        while (iterations < config.limits.max_react_iterations) {
          const candidate = response.response.candidates?.[0];
          const parts: Part[] = candidate?.content?.parts ?? [];

          const functionCalls = parts.filter((p) => "functionCall" in p);

          if (functionCalls.length === 0) break;

          const functionResponses: Part[] = [];

          for (const part of functionCalls) {
            if (!("functionCall" in part)) continue;
            const { name, args } = part.functionCall as { name: string; args: Record<string, string> };

            // Send sanitized status to client
            controller.enqueue(
              encode({ type: "status", text: getFriendlyLabel(name) })
            );

            // Execute tool
            let result: string;
            if (name === "send_message" && isMessageRateLimited(ip)) {
              result = '{"success": false, "error": "Message limit reached. Please try again later."}';
            } else if (isValidTool(name)) {
              const conversation =
                name === "send_message"
                  ? [...safeHistory, { role: "user" as const, content: message }]
                  : undefined;
              result =
                (await executeTool(name, args ?? {}, { conversation })) ?? '{"error": "No data found."}';
            } else {
              result = '{"error": "Unknown tool."}';
            }

            functionResponses.push({
              functionResponse: {
                name,
                response: { content: result },
              },
            });
          }

          response = await chat.sendMessage(functionResponses);
          iterations++;
        }

        // Extract final text
        const finalText =
          response.response.candidates?.[0]?.content?.parts
            ?.filter((p): p is Part & { text: string } => "text" in p)
            .map((p) => p.text)
            .join("") ?? "";

        controller.enqueue(encode({ type: "text", content: finalText }));
        controller.enqueue(encode({ type: "done" }));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Something went wrong.";
        controller.enqueue(
          encode({ type: "error", content: errorMessage })
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
