/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThinkingLevel, Type } from "@google/genai";
import { questions } from "./questionsWizard";
import { withModelFallback } from "./withModelFallback";
import { ai } from "./genAiClient";
import {
  HTTP_STATUS_RATE_LIMIT,
  HTTP_STATUS_SERVICE_UNAVAILABLE,
} from "@/constants/ai";

// Normaliza para comparação: minúsculas, sem acentos, sem pontuação nas pontas
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
}

export async function interpretAnswer(
  userMessage: string,
  questionIndex: number,
): Promise<{
  value: string | null;
  erro?: "rate_limit" | "unavailable" | "outro";
}> {
  const question = questions[questionIndex];

  if (!question.options) {
    return { value: userMessage.trim() || null };
  }

  // Resposta igual a uma das opções: não precisa chamar a IA
  const exactMatch = question.options.find(
    (option) => normalize(option) === normalize(userMessage),
  );
  if (exactMatch) {
    return { value: exactMatch };
  }

  try {
    const response = await withModelFallback((model) =>
      ai.models.generateContent({
        model,
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
          // Classificação simples: raciocínio não melhora o resultado e é cobrado como saída
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
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
    if (err.status === HTTP_STATUS_SERVICE_UNAVAILABLE) {
      return { value: null, erro: "unavailable" };
    }
    console.error("Erro ao interpretar resposta:", err);
    return { value: null, erro: "outro" };
  }
}
