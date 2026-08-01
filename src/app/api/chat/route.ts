import { NextRequest, NextResponse } from "next/server";
import { questions, wizardState, initialState } from "@/lib/questionsWizard";
import { interpretAnswer } from "@/lib/interpretAnswer";
import { generateRecommendation } from "@/lib/generateRecommendation";

export async function POST(req: NextRequest) {
  const { message, wizardState, start } = await req.json();
  const estado: wizardState = wizardState ?? initialState;

  if (start) {
    const primeiraPergunta = questions[estado.indiceAtual];
    return NextResponse.json({
      reply: `${primeiraPergunta.question}${
        primeiraPergunta.help ? ` (${primeiraPergunta.help})` : ""
      }`,
      wizardState: estado,
    });
  }

  if (estado.finalizado) {
    return NextResponse.json({
      reply:
        "Sua recomendação já foi gerada! Se quiser recomeçar, atualize a página.",
      wizardState: estado,
    });
  }

  const perguntaAtual = questions[estado.indiceAtual];
  const { valor, erro } = await interpretAnswer(message, estado.indiceAtual);

  if (erro === "rate_limit") {
    return NextResponse.json({
      reply:
        "Estou recebendo muitas mensagens agora e bati o limite da API. Aguarde um minuto e tente novamente. 🙏",
      wizardState: estado,
    });
  }

  if (!valor) {
    return NextResponse.json({
      reply: `Não consegui identificar bem sua resposta. ${perguntaAtual.question}${
        perguntaAtual.help ? ` (${perguntaAtual.help})` : ""
      }`,
      wizardState: estado,
    });
  }

  const novoEstado: wizardState = {
    ...estado,
    respostas: { ...estado.respostas, [perguntaAtual.field]: valor },
    indiceAtual: estado.indiceAtual + 1,
  };

  if (novoEstado.indiceAtual < questions.length) {
    const proxima = questions[novoEstado.indiceAtual];
    return NextResponse.json({
      reply: `${proxima.question}${proxima.help ? ` (${proxima.help})` : ""}`,
      wizardState: novoEstado,
    });
  }

  novoEstado.finalizado = true;
  const recomendacao = await generateRecommendation(novoEstado.respostas);

  return NextResponse.json({ reply: recomendacao, wizardState: novoEstado });
}
