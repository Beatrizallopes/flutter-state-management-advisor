/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllAnswers } from "./googleSheets";
import bibliographyData from "@/data/bibliography.json";
import { wizardField } from "./questionsWizard";
import { withModelFallback } from "./withModelFallback";
import { ai } from "./genAiClient";
import {
  HTTP_STATUS_RATE_LIMIT,
  HTTP_STATUS_SERVICE_UNAVAILABLE,
} from "@/constants/ai";
import {
  NO_RECOMMENDATION_MESSAGE,
  RATE_LIMIT_MESSAGE,
  MODEL_UNAVAILABLE_MESSAGE,
  RECOMMENDATION_FAILED_MESSAGE,
  SURVEY_DATA_UNAVAILABLE_MESSAGE,
} from "@/constants/messages";

// ok = false indica falha; a rota usa isso para permitir que o usuário tente de novo
export type RecommendationResult = { reply: string; ok: boolean };

export async function generateRecommendation(
  userAnswers: Partial<Record<wizardField, string>>,
): Promise<RecommendationResult> {
  let dataset: Awaited<ReturnType<typeof getAllAnswers>>;
  try {
    dataset = await getAllAnswers();
  } catch (err: any) {
    console.error("Erro ao ler as planilhas de respostas:", err);
    return { reply: SURVEY_DATA_UNAVAILABLE_MESSAGE, ok: false };
  }
  const bibliography = bibliographyData.map((b: any) => b.texto).join("\n\n");

  // Ordem importa: o conteúdo fixo (instruções + bibliografia + dataset) vem primeiro
  // para o Gemini reaproveitar o prefixo via cache implícito; o perfil do usuário,
  // que muda a cada chamada, fica no final.
  const prompt = `Você é um assistente especializado em recomendar bibliotecas de gerenciamento de estado para projetos Flutter, com base em pesquisa acadêmica (TCC).

### BIBLIOGRAFIA (análise da pesquisadora sobre cada biblioteca)
${bibliography}

### DADOS EMPÍRICOS (${dataset.length} respostas de profissionais Flutter reais)
${JSON.stringify(dataset)}

### PERFIL DO PROJETO DO USUÁRIO
${JSON.stringify(userAnswers, null, 2)}

Com base nesses três elementos, responda:
1. Qual biblioteca de gerenciamento de estado você recomenda para este projeto específico?
2. Justifique cruzando a bibliography (teoria) com os dados empíricos (o que profissionais com perfil semelhante relataram).
3. Quantas respostas na pesquisa têm perfil parecido com o do usuário, e o que essas pessoas usaram e reportaram de satisfação?
4. Cite alternativas caso o cenário mude (ex: se o prazo for mais apertado, ou a equipe menos experiente).

Responda em texto corrido e conversacional, como num chat — evite títulos markdown (###) e lines divisórias (---). Pode usar **negrito** pontual e listas curtas quando ajudar a clareza, mas mantenha o tom de conversa, não de relatório formal.`;

  try {
    const response = await withModelFallback((model) =>
      ai.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    );
    if (!response.text) {
      return { reply: NO_RECOMMENDATION_MESSAGE, ok: false };
    }
    return { reply: response.text, ok: true };
  } catch (err: any) {
    if (err.status === HTTP_STATUS_RATE_LIMIT) {
      return { reply: RATE_LIMIT_MESSAGE, ok: false };
    }
    if (err.status === HTTP_STATUS_SERVICE_UNAVAILABLE) {
      return { reply: MODEL_UNAVAILABLE_MESSAGE, ok: false };
    }
    console.error("Erro ao gerar recomendação:", err);
    return { reply: RECOMMENDATION_FAILED_MESSAGE, ok: false };
  }
}
