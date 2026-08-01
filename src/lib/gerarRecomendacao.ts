/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenAI } from "@google/genai";
import { getTodasRespostas } from "./googleSheets";
import bibliografiaData from "@/data/bibliografia.json";
import { CampoWizard } from "./wizardPerguntas";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function gerarRecomendacao(
  respostasUsuario: Partial<Record<CampoWizard, string>>,
): Promise<string> {
  const dataset = await getTodasRespostas();
  const bibliografia = bibliografiaData.map((b: any) => b.texto).join("\n\n");

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

Seja direto e objetivo, em português, como se estivesse conversando com o usuário no chat.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  return response.text ?? "";
}
