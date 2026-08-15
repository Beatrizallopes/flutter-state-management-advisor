/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllAnswers } from "./googleSheets";
import bibliographyData from "@/data/bibliography.json";
import { wizardField } from "./questionsWizard";
import { withRetry } from "./withRetry";
import { ai } from "./genAiClient";
import { GEMINI_MODEL, HTTP_STATUS_RATE_LIMIT } from "@/constants/ai";
import {
  NO_RECOMMENDATION_MESSAGE,
  RATE_LIMIT_MESSAGE,
  RECOMMENDATION_FAILED_MESSAGE,
} from "@/constants/messages";

export async function generateRecommendation(
  userAnswers: Partial<Record<wizardField, string>>,
): Promise<string> {
  const dataset = await getAllAnswers();
  const bibliography = bibliographyData.map((b: any) => b.texto).join("\n\n");

  const prompt = `Você é um assistente especializado em recomendar bibliotecas de gerenciamento de estado para projetos Flutter, com base em pesquisa acadêmica (TCC).

### PERFIL DO PROJETO DO USUÁRIO
${JSON.stringify(userAnswers, null, 2)}

### BIBLIOGRAFIA (análise da pesquisadora sobre cada biblioteca)
${bibliography}

### DADOS EMPÍRICOS (${dataset.length} respostas de profissionais Flutter reais)
${JSON.stringify(dataset)}

Com base nesses três elementos, responda:
1. Qual biblioteca de gerenciamento de estado você recomenda para este projeto específico?
2. Justifique cruzando a bibliography (teoria) com os dados empíricos (o que profissionais com perfil semelhante relataram).
3. Quantas respostas na pesquisa têm perfil parecido com o do usuário, e o que essas pessoas usaram e reportaram de satisfação?
4. Cite alternativas caso o cenário mude (ex: se o prazo for mais apertado, ou a equipe menos experiente).

Responda em texto corrido e conversacional, como num chat — evite títulos markdown (###) e lines divisórias (---). Pode usar **negrito** pontual e listas curtas quando ajudar a clareza, mas mantenha o tom de conversa, não de relatório formal.`;

  try {
    const response = await withRetry(() =>
      ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    );
    if (!response.text) {
      return NO_RECOMMENDATION_MESSAGE;
    }
    return response.text;
  } catch (err: any) {
    console.log(err);
    if (err.status === HTTP_STATUS_RATE_LIMIT) {
      return RATE_LIMIT_MESSAGE;
    }
    console.error("Erro ao gerar recomendação:", err);
    return RECOMMENDATION_FAILED_MESSAGE;
  }
}
