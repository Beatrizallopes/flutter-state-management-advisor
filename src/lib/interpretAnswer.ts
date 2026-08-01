/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenAI, Type } from "@google/genai";
import { questions } from "./questionsWizard";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function comRetry<T>(
  fn: () => Promise<T>,
  tentativas = 2,
  delayMs = 3000,
): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (err.status === 429 && tentativas > 0) {
      await new Promise((r) => setTimeout(r, delayMs));
      return comRetry(fn, tentativas - 1, delayMs * 2); // dobra o tempo a cada nova tentativa
    }
    throw err;
  }
}

export async function interpretAnswer(
  userMessage: string,
  questionIndex: number,
): Promise<{ value: string | null; erro?: "rate_limit" | "outro" }> {
  const question = questions[questionIndex];

  if (!question.options) {
    return { value: userMessage.trim() || null };
  }

  try {
    const response = await comRetry(() =>
      ai.models.generateContent({
        model: "gemini-3.5-flash",
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
    if (err.status === 429) {
      return { value: null, erro: "rate_limit" };
    }
    console.error("Erro ao interpretar resposta:", err);
    return { value: null, erro: "outro" };
  }
}
