import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import type { ChatCompletionTool } from "openai/resources/chat/completions";

interface ToolParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

interface ToolDef {
  name: string;
  description: string;
  friendly_label: string;
  parameters: ToolParameter[];
}

export interface ChatbotConfig {
  model: {
    name: string;
    temperature: number;
    max_output_tokens: number;
    top_p: number;
  };
  persona: {
    name: string;
    greeting: string;
  };
  limits: {
    max_message_length: number;
    max_history_length: number;
    max_react_iterations: number;
    rate_limit_per_minute: number;
  };
  system_prompt: string;
  tools: ToolDef[];
}

let cachedConfig: ChatbotConfig | null = null;

export function loadConfig(): ChatbotConfig {
  if (cachedConfig && process.env.NODE_ENV === "production") return cachedConfig;

  const configPath = path.join(process.cwd(), "chatbot.config.yaml");
  const raw = fs.readFileSync(configPath, "utf-8");
  cachedConfig = yaml.load(raw) as ChatbotConfig;
  return cachedConfig;
}

export function getFriendlyLabel(toolName: string): string {
  const config = loadConfig();
  const tool = config.tools.find((t) => t.name === toolName);
  return tool?.friendly_label ?? "Thinking...";
}

export function buildTools(): ChatCompletionTool[] {
  const config = loadConfig();

  return config.tools.map((tool) => {
    const properties: Record<string, { type: string; description: string }> = {};
    const required: string[] = [];

    for (const param of tool.parameters) {
      properties[param.name] = {
        type: param.type === "string" ? "string" : param.type,
        description: param.description,
      };
      if (param.required) {
        required.push(param.name);
      }
    }

    return {
      type: "function" as const,
      function: {
        name: tool.name,
        description: tool.description,
        ...(tool.parameters.length > 0
          ? {
              parameters: {
                type: "object" as const,
                properties,
                ...(required.length > 0 ? { required } : {}),
              },
            }
          : {}),
      },
    };
  });
}
