import { NextRequest, NextResponse } from "next/server";
import { PERGUNTAS, EstadoWizard, ESTADO_INICIAL } from "@/lib/wizardPerguntas";
import { interpretarResposta } from "@/lib/interpretarResposta";
import { gerarRecomendacao } from "@/lib/gerarRecomendacao";

export async function POST(req: NextRequest) {
  const { message, estadoWizard, iniciar } = await req.json();
  const estado: EstadoWizard = estadoWizard ?? ESTADO_INICIAL;

  if (iniciar) {
    const primeiraPergunta = PERGUNTAS[estado.indiceAtual];
    return NextResponse.json({
      reply: `${primeiraPergunta.pergunta}${
        primeiraPergunta.ajuda ? ` (${primeiraPergunta.ajuda})` : ""
      }`,
      estadoWizard: estado,
    });
  }

  if (estado.finalizado) {
    return NextResponse.json({
      reply:
        "Sua recomendação já foi gerada! Se quiser recomeçar, atualize a página.",
      estadoWizard: estado,
    });
  }

  const perguntaAtual = PERGUNTAS[estado.indiceAtual];
  const { valor, erro } = await interpretarResposta(message, estado.indiceAtual);

  if (erro === "rate_limit") {
    return NextResponse.json({
      reply:
        "Estou recebendo muitas mensagens agora e bati o limite da API. Aguarde um minuto e tente novamente. 🙏",
      estadoWizard: estado,
    });
  }

  if (!valor) {
    return NextResponse.json({
      reply: `Não consegui identificar bem sua resposta. ${perguntaAtual.pergunta}${
        perguntaAtual.ajuda ? ` (${perguntaAtual.ajuda})` : ""
      }`,
      estadoWizard: estado,
    });
  }

  const novoEstado: EstadoWizard = {
    ...estado,
    respostas: { ...estado.respostas, [perguntaAtual.campo]: valor },
    indiceAtual: estado.indiceAtual + 1,
  };

  if (novoEstado.indiceAtual < PERGUNTAS.length) {
    const proxima = PERGUNTAS[novoEstado.indiceAtual];
    return NextResponse.json({
      reply: `${proxima.pergunta}${proxima.ajuda ? ` (${proxima.ajuda})` : ""}`,
      estadoWizard: novoEstado,
    });
  }

  novoEstado.finalizado = true;
  const recomendacao = await gerarRecomendacao(novoEstado.respostas);

  return NextResponse.json({ reply: recomendacao, estadoWizard: novoEstado });
}
