import { NextRequest, NextResponse } from "next/server";
import { questions, wizardState, initialState } from "@/lib/questionsWizard";
import { interpretAnswer } from "@/lib/interpretAnswer";
import { generateRecommendation } from "@/lib/generateRecommendation";

export async function POST(req: NextRequest) {
  const { message, wizardState, start } = await req.json();
  const state: wizardState = wizardState ?? initialState;

  if (start) {
    const firstQuestion = questions[state.currentIndex];
    return NextResponse.json({
      reply: `${firstQuestion.question}${
        firstQuestion.help ? ` (${firstQuestion.help})` : ""
      }`,
      wizardState: state,
    });
  }

  if (state.finished) {
    return NextResponse.json({
      reply:
        "Sua recomendação já foi gerada! Se quiser recomeçar, atualize a página.",
      wizardState: state,
    });
  }

  const currentQuestion = questions[state.currentIndex];
  const { value, erro } = await interpretAnswer(message, state.currentIndex);

  if (erro === "rate_limit") {
    return NextResponse.json({
      reply:
        "Estou recebendo muitas mensagens agora e bati o limite da API. Aguarde um minuto e tente novamente. 🙏",
      wizardState: state,
    });
  }

  if (!value) {
    return NextResponse.json({
      reply: `Não consegui identificar bem sua resposta. ${currentQuestion.question}${
        currentQuestion.help ? ` (${currentQuestion.help})` : ""
      }`,
      wizardState: state,
    });
  }

  const newState: wizardState = {
    ...state,
    answers: { ...state.answers, [currentQuestion.field]: value },
    currentIndex: state.currentIndex + 1,
  };

  if (newState.currentIndex < questions.length) {
    const next = questions[newState.currentIndex];
    return NextResponse.json({
      reply: `${next.question}${next.help ? ` (${next.help})` : ""}`,
      wizardState: newState,
    });
  }

  newState.finished = true;
  const recommendation = await generateRecommendation(newState.answers);

  return NextResponse.json({ reply: recommendation, wizardState: newState });
}
