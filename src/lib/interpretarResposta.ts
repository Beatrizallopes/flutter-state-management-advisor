/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenAI, Type } from "@google/genai";
import { PERGUNTAS } from "./wizardPerguntas";

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

export async function interpretarResposta(
  mensagemUsuario: string,
  indicePergunta: number,
): Promise<{ valor: string | null; erro?: "rate_limit" | "outro" }> {
  const pergunta = PERGUNTAS[indicePergunta];

  if (!pergunta.opcoes) {
    return { valor: mensagemUsuario.trim() || null };
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
                text: `Pergunta feita ao usuário: "${pergunta.pergunta}"
Resposta do usuário: "${mensagemUsuario}"

Classifique a resposta em UMA destas opções: ${pergunta.opcoes.join(", ")}.
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
              valor: { type: Type.STRING, nullable: true },
            },
            required: ["valor"],
          },
        },
      }),
    );

    if (!response.text) {
      return { valor: null, erro: "outro" };
    }

    const parsed = JSON.parse(response.text);
    return { valor: parsed.valor };
  } catch (err: any) {
    if (err.status === 429) {
      return { valor: null, erro: "rate_limit" };
    }
    console.error("Erro ao interpretar resposta:", err);
    return { valor: null, erro: "outro" };
  }
}
