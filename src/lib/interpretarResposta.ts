import { GoogleGenAI, Type } from "@google/genai";
import { PERGUNTAS } from "./wizardPerguntas";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function interpretarResposta(
  mensagemUsuario: string,
  indicePergunta: number,
): Promise<{ valor: string | null; precisaEsclarecer: boolean }> {
  const pergunta = PERGUNTAS[indicePergunta];

  // pergunta aberta (tipoApp) — aceita o texto quase como veio, só limpa
  if (!pergunta.opcoes) {
    return { valor: mensagemUsuario.trim(), precisaEsclarecer: false };
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `O usuário respondeu à pergunta "${pergunta.pergunta}" com: "${mensagemUsuario}".
Classifique a resposta em UMA das opções válidas: ${pergunta.opcoes.join(", ")}.
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
  });

  if (response && response.text) {
    const parsed = JSON.parse(response.text);

    return {
      valor: parsed.valor,
      precisaEsclarecer: !parsed.valor,
    };
  } else {
    return {
      valor: "",
      precisaEsclarecer: true,
    };
  }
}
