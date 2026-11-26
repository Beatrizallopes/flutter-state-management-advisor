import { NextRequest, NextResponse } from "next/server";
import {
  questions,
  wizardState,
  initialState,
} from "@/functions/questionsWizard";
import { interpretAnswer } from "@/functions/interpretAnswer";
import { generateRecommendation } from "@/functions/generateRecommendation";
import {
  RATE_LIMIT_MESSAGE,
  MODEL_UNAVAILABLE_MESSAGE,
  WIZARD_ALREADY_FINISHED_MESSAGE,
  UNRECOGNIZED_ANSWER_PREFIX,
} from "@/constants/messages";

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
      reply: WIZARD_ALREADY_FINISHED_MESSAGE,
      wizardState: state,
    });
  }

  const currentQuestion = questions[state.currentIndex];
  const { value, erro } = await interpretAnswer(message, state.currentIndex);

  if (erro === "rate_limit") {
    return NextResponse.json({
      reply: RATE_LIMIT_MESSAGE,
      wizardState: state,
    });
  }

  if (erro === "unavailable") {
    return NextResponse.json({
      reply: MODEL_UNAVAILABLE_MESSAGE,
      wizardState: state,
    });
  }

  if (!value) {
    return NextResponse.json({
      reply: `${UNRECOGNIZED_ANSWER_PREFIX}${currentQuestion.question}${
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

  const { reply, ok } = await generateRecommendation(newState.answers);

  if (!ok) {
    // Mantém o estado anterior: o usuário reenvia a última resposta para tentar de novo
    return NextResponse.json({ reply, wizardState: state });
  }

  return NextResponse.json({
    reply,
    wizardState: { ...newState, finished: true },
  });
}
