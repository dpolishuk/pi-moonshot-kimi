import type { OAuthCredentials, OAuthLoginCallbacks } from "@mariozechner/pi-ai";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

const defaultCost = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};

const kimiModel = (
  id: string,
  name: string,
  options: {
    input?: ["text"] | ["text", "image"];
    contextWindow: number;
    maxTokens: number;
    cost?: typeof defaultCost;
  }
) => ({
  id,
  name,
  reasoning: true,
  input: options.input ?? ["text", "image"],
  cost: options.cost ?? defaultCost,
  contextWindow: options.contextWindow,
  maxTokens: options.maxTokens,
});

async function loginKimi(callbacks: OAuthLoginCallbacks): Promise<OAuthCredentials> {
  const key = await callbacks.onPrompt({
    message: "Enter your Kimi Code API key (stored for this profile):",
  });

  if (!key?.trim()) {
    throw new Error("No API key provided");
  }

  return {
    refresh: key.trim(),
    access: key.trim(),
    expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
  };
}

export default function (pi: ExtensionAPI) {
  pi.registerProvider("kimi-coding", {
    baseUrl: "https://api.kimi.com/coding",
    apiKey: "KIMI_API_KEY",
    api: "anthropic-messages",
    authHeader: true,
    models: [
      kimiModel("kimi-for-coding", "Kimi for Coding", {
        contextWindow: 262144,
        maxTokens: 32768,
      }),
      kimiModel("k2p5", "Kimi K2.5", {
        contextWindow: 262144,
        maxTokens: 32768,
      }),
      kimiModel("kimi-k2-thinking", "Kimi K2 Thinking", {
        input: ["text"],
        contextWindow: 262144,
        maxTokens: 32768,
      }),
    ],
    oauth: {
      name: "Kimi Code (API Key)",
      login: loginKimi,
      async refreshToken(credentials) {
        return credentials;
      },
      getApiKey(credentials) {
        return credentials.access;
      },
    },
  });
}
