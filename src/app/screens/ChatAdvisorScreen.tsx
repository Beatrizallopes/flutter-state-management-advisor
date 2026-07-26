"use client";

import { useEffect, useRef, useState } from "react";
import { QUESTIONS, recommend, type ChatMessage } from "@/lib/advisor";
import ChatHeader from "@/app/widgets/ChatHeader";
import ChatInputBar from "@/app/widgets/ChatInputBar";
import InfoCard from "@/app/widgets/InfoCard";
import MessageBubble from "@/app/widgets/MessageBubble";
import OptionButton from "@/app/widgets/OptionButton";
import TypingIndicator from "@/app/widgets/TypingIndicator";
import styles from "./ChatAdvisorScreen.module.css";

const GREETING =
  "Olá! 👋 Sou o FlutterGuide, seu assistente para escolha de biblioteca de gerenciamento de estado Flutter. Vou te fazer algumas perguntas para encontrar a melhor opção para o seu projeto.";

let messageCount = 0;
function createMessage(sender: ChatMessage["sender"], text: string): ChatMessage {
  messageCount += 1;
  return { id: `msg-${messageCount}`, sender, text };
}

async function sendMessage(message: string) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  return data.reply;
}

export default function ChatAdvisorScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [queue, setQueue] = useState<ChatMessage[]>(() => [
    createMessage("bot", GREETING),
    createMessage("bot", QUESTIONS[0].text),
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentQuestion = QUESTIONS[step];
  // Só liberamos as opções depois que todas as mensagens do bot foram entregues.
  const showOptions = Boolean(currentQuestion) && queue.length === 0 && !isTyping;

  // Entrega as mensagens do bot uma a uma, com o indicador de "digitando" entre elas.
  useEffect(() => {
    if (queue.length === 0) return;

    const [next] = queue;
    setIsTyping(true);
    // Um tempinho proporcional ao tamanho do texto, como num chat real.
    const delay = Math.min(1600, 500 + next.text.length * 12);

    const timer = setTimeout(() => {
      setMessages((prev) => [...prev, next]);
      setQueue((prev) => prev.slice(1));
      setIsTyping(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [queue]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  function answerQuestion(value: string, label: string) {
    const nextAnswers = { ...answers, [currentQuestion.id]: value };
    const nextQuestion = QUESTIONS[step + 1];

    setAnswers(nextAnswers);
    setMessages((prev) => [...prev, createMessage("user", label)]);
    setQueue((prev) => [
      ...prev,
      nextQuestion
        ? createMessage("bot", nextQuestion.text)
        : createMessage("bot", recommend(nextAnswers)),
    ]);
    setStep(step + 1);
  }

  async function handleSend() {
    const text = inputValue.trim();
    if (!text) return;

    if (currentQuestion) {
      const match = currentQuestion.options.find((option) =>
        option.label.toLowerCase().includes(text.toLowerCase())
      );

      setInputValue("");

      if (match) {
        answerQuestion(match.value, match.label);
        return;
      }

      setMessages((prev) => [...prev, createMessage("user", text)]);
      setQueue((prev) => [
        ...prev,
        createMessage("bot", "Por favor, escolha uma das opções acima para continuar."),
      ]);
      return;
    }

    setInputValue("");
    setMessages((prev) => [...prev, createMessage("user", text)]);
    setIsTyping(true);

    try {
      const reply = await sendMessage(text);
      setMessages((prev) => [...prev, createMessage("bot", reply)]);
    } catch {
      setMessages((prev) => [
        ...prev,
        createMessage("bot", "Desculpe, ocorreu um erro ao buscar a resposta."),
      ]);
    } finally {
      setIsTyping(false);
    }
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

          {isTyping && <TypingIndicator />}

          {showOptions && currentQuestion && (
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
