/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenAI } from "@google/genai";
import { getAllAnswers } from "./googleSheets";
import bibliographyData from "@/data/bibliography.json";
import { wizardField } from "./questionsWizard";

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
      return comRetry(fn, tentativas - 1, delayMs * 2);
    }
    throw err;
  }
}

export async function generateRecommendation(
  respostasUsuario: Partial<Record<wizardField, string>>,
): Promise<string> {
  const dataset = await getAllAnswers();
  const bibliografia = bibliographyData.map((b: any) => b.texto).join("\n\n");

  const prompt = `Você é um assistente especializado em recomendar bibliotecas de gerenciamento de estado para projetos Flutter, com base em pesquisa acadêmica (TCC).

### PERFIL DO PROJETO DO USUÁRIO
${JSON.stringify(respostasUsuario, null, 2)}

### BIBLIOGRAFIA (análise da pesquisadora sobre cada biblioteca)
${bibliografia}

### DADOS EMPÍRICOS (${dataset.length} respostas de profissionais Flutter reais)
${JSON.stringify(dataset)}

Com base nesses três elementos, responda:
1. Qual biblioteca de gerenciamento de estado você recomenda para este projeto específico?
2. Justifique cruzando a bibliografia (teoria) com os dados empíricos (o que profissionais com perfil semelhante relataram).
3. Quantas respostas na pesquisa têm perfil parecido com o do usuário, e o que essas pessoas usaram e reportaram de satisfação?
4. Cite alternativas caso o cenário mude (ex: se o prazo for mais apertado, ou a equipe menos experiente).

Responda em texto corrido e conversacional, como num chat — evite títulos markdown (###) e lines divisórias (---). Pode usar **negrito** pontual e listas curtas quando ajudar a clareza, mas mantenha o tom de conversa, não de relatório formal.`;

  try {
    const response = await comRetry(() =>
      ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    );
    if (!response.text) {
      return "Desculpe, não consegui gerar sua recomendação. Tente novamente em instantes.";
    }
    return response.text;
  } catch (err: any) {
    console.log(err);
    if (err.status === 429) {
      return "Estou recebendo muitas mensagens agora e bati o limite da API. Aguarde um minuto e tente novamente. 🙏";
    }
    console.error("Erro ao gerar recomendação:", err);
    return "Desculpe, ocorreu um erro ao gerar sua recomendação. Tente novamente em instantes.";
  }
}
