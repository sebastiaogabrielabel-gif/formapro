import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export const MODEL = "claude-sonnet-4-20250514";

export interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

// Appel générique avec streaming optionnel
export async function callClaude({
  system,
  messages,
  maxTokens = 4096,
}: {
  system?: string;
  messages: ClaudeMessage[];
  maxTokens?: number;
}): Promise<string> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages,
  });

  const block = response.content[0];
  if (block.type !== "text") throw new Error("Réponse Claude inattendue");
  return block.text;
}

// Appel avec streaming — retourne un ReadableStream pour les réponses longues
export async function callClaudeStream({
  system,
  messages,
  maxTokens = 8192,
}: {
  system?: string;
  messages: ClaudeMessage[];
  maxTokens?: number;
}): Promise<ReadableStream<string>> {
  const stream = await anthropic.messages.stream({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(chunk.delta.text);
        }
      }
      controller.close();
    },
  });
}

export { anthropic };
