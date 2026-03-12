import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { loadConfig, buildTools, getFriendlyLabel } from "@/lib/chatbot-config";
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

const MAX_BODY_SIZE = 100_000;
const MAX_HISTORY_MSG_LENGTH = 500;

// ---------- Helpers ----------

function encode(obj: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(obj) + "\n");
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function toOpenAIHistory(messages: ChatMessage[]): ChatCompletionMessageParam[] {
  return messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));
}

// ---------- Route handler ----------

export async function POST(request: Request) {
  const config = loadConfig();

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

  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
    return Response.json({ error: "Request too large." }, { status: 413 });
  }

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

  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    return Response.json(
      { error: "Chat is temporarily unavailable." },
      { status: 503 }
    );
  }

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
  });

  const tools = buildTools();

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: config.system_prompt },
    ...toOpenAIHistory(safeHistory),
    { role: "user", content: message },
  ];

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let iterations = 0;

        while (iterations <= config.limits.max_react_iterations) {
          const response = await openai.chat.completions.create({
            model: config.model.name,
            messages,
            tools,
            temperature: config.model.temperature,
            max_tokens: config.model.max_output_tokens,
            top_p: config.model.top_p,
          });

          const choice = response.choices[0];
          if (!choice) break;

          const assistantMessage = choice.message;
          const toolCalls = assistantMessage.tool_calls;

          if (!toolCalls || toolCalls.length === 0) {
            const finalText = assistantMessage.content ?? "";
            controller.enqueue(encode({ type: "text", content: finalText }));
            controller.enqueue(encode({ type: "done" }));
            break;
          }

          messages.push(assistantMessage);

          for (const toolCall of toolCalls) {
            if (toolCall.type !== "function") continue;
            const { name } = toolCall.function;
            let args: Record<string, string> = {};
            try {
              args = JSON.parse(toolCall.function.arguments || "{}");
            } catch {
              args = {};
            }

            controller.enqueue(
              encode({ type: "status", text: getFriendlyLabel(name) })
            );

            let result: string;
            if (name === "send_message" && isMessageRateLimited(ip)) {
              result = '{"success": false, "error": "Message limit reached. Please try again later."}';
            } else if (isValidTool(name)) {
              const conversation =
                name === "send_message"
                  ? [...safeHistory, { role: "user" as const, content: message }]
                  : undefined;
              result =
                (await executeTool(name, args, { conversation })) ?? '{"error": "No data found."}';
            } else {
              result = '{"error": "Unknown tool."}';
            }

            messages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: result,
            });
          }

          iterations++;
        }

        if (iterations > config.limits.max_react_iterations) {
          controller.enqueue(
            encode({ type: "text", content: "I took too many steps processing that. Could you try rephrasing?" })
          );
          controller.enqueue(encode({ type: "done" }));
        }
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
