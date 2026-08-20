/* eslint-disable @typescript-eslint/no-explicit-any */
import { Type } from "@google/genai";
import { questions } from "./questionsWizard";
import { withRetry } from "./withRetry";
import { ai } from "./genAiClient";
import { GEMINI_MODEL, HTTP_STATUS_RATE_LIMIT } from "@/constants/ai";

export async function interpretAnswer(
  userMessage: string,
  questionIndex: number,
): Promise<{ value: string | null; erro?: "rate_limit" | "outro" }> {
  const question = questions[questionIndex];

  if (!question.options) {
    return { value: userMessage.trim() || null };
  }

  try {
    const response = await withRetry(() =>
      ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Pergunta feita ao usuário: "${question.question}"
Resposta do usuário: "${userMessage}"

Classifique a resposta em UMA destas opções: ${question.options.join(", ")}.
Se a resposta não permitir identificar claramente uma opção, retorne valor null.`,
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              value: { type: Type.STRING, nullable: true },
            },
            required: ["value"],
          },
        },
      }),
    );

    if (!response.text) {
      return { value: null, erro: "outro" };
    }

    const parsed = JSON.parse(response.text);
    return { value: parsed.value };
  } catch (err: any) {
    if (err.status === HTTP_STATUS_RATE_LIMIT) {
      return { value: null, erro: "rate_limit" };
    }
    console.error("Erro ao interpretar resposta:", err);
    return { value: null, erro: "outro" };
  }
}
