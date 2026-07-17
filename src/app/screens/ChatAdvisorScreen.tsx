"use client";

import { useEffect, useRef, useState } from "react";
import { QUESTIONS, recommend, type ChatMessage } from "@/lib/advisor";
import ChatHeader from "@/app/widgets/ChatHeader";
import ChatInputBar from "@/app/widgets/ChatInputBar";
import InfoCard from "@/app/widgets/InfoCard";
import MessageBubble from "@/app/widgets/MessageBubble";
import OptionButton from "@/app/widgets/OptionButton";
import styles from "./ChatAdvisorScreen.module.css";

const GREETING =
  "Olá! 👋 Sou o FlutterGuide, seu assistente para escolha de biblioteca de gerenciamento de estado Flutter. Vou te fazer algumas perguntas para encontrar a melhor opção para o seu projeto.";

let messageCount = 0;
function createMessage(sender: ChatMessage["sender"], text: string): ChatMessage {
  messageCount += 1;
  return { id: `msg-${messageCount}`, sender, text };
}

export default function ChatAdvisorScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createMessage("bot", GREETING),
    createMessage("bot", QUESTIONS[0].text),
  ]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentQuestion = QUESTIONS[step];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function answerQuestion(value: string, label: string) {
    const nextAnswers = { ...answers, [currentQuestion.id]: value };
    const nextQuestion = QUESTIONS[step + 1];

    setAnswers(nextAnswers);
    setMessages((prev) => [
      ...prev,
      createMessage("user", label),
      nextQuestion
        ? createMessage("bot", nextQuestion.text)
        : createMessage("bot", recommend(nextAnswers)),
    ]);
    setStep(step + 1);
  }

  function handleSend() {
    const text = inputValue.trim();
    if (!text || !currentQuestion) return;

    const match = currentQuestion.options.find((option) =>
      option.label.toLowerCase().includes(text.toLowerCase())
    );

    setInputValue("");

    if (match) {
      answerQuestion(match.value, match.label);
      return;
    }

    setMessages((prev) => [
      ...prev,
      createMessage("user", text),
      createMessage("bot", "Por favor, escolha uma das opções acima para continuar."),
    ]);
  }

  return (
    <div className={styles.wrapper}>
      <InfoCard />

      <section className={styles.chatCard}>
        <ChatHeader />

        <div className={styles.messages}>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {currentQuestion && (
            <div className={styles.options}>
              {currentQuestion.options.map((option) => (
                <OptionButton
                  key={option.value}
                  label={option.label}
                  onClick={() => answerQuestion(option.value, option.label)}
                />
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <ChatInputBar value={inputValue} onChange={setInputValue} onSend={handleSend} />
      </section>
    </div>
  );
}
