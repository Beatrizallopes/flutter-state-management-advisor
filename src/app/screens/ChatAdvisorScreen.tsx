"use client";

import { useEffect, useRef, useState } from "react";
import ChatHeader from "@/app/widgets/ChatHeader";
import ChatInputBar from "@/app/widgets/ChatInputBar";
import InfoCard from "@/app/widgets/InfoCard";
import MessageBubble from "@/app/widgets/MessageBubble";
import TypingIndicator from "@/app/widgets/TypingIndicator";
import styles from "./ChatAdvisorScreen.module.css";

type ChatMessage = { id: string; sender: "bot" | "user"; text: string };
type wizardState = {
  respostas: Record<string, string>;
  indiceAtual: number;
  finalizado: boolean;
} | null;

const GREETING =
  "Olá! 👋 Sou o FlutterGuide, seu assistente para escolha de biblioteca de gerenciamento de estado Flutter. Vou te fazer algumas perguntas sobre seu projeto pra encontrar a melhor opção.";

let messageCount = 0;
function createMessage(
  sender: ChatMessage["sender"],
  text: string,
): ChatMessage {
  messageCount += 1;
  return { id: `msg-${messageCount}`, sender, text };
}

async function sendMessage(message: string, wizardState: wizardState) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, wizardState }),
  });
  return res.json();
}

async function startWizard() {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ start: true, wizardState: null }),
  });
  return res.json();
}

export default function ChatAdvisorScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("bot", GREETING),
  ]);
  const [wizardState, setWizardState] = useState<wizardState>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    (async () => {
      setIsTyping(true);
      const data = await startWizard();
      setWizardState(data.wizardState);
      setMessages((prev) => [...prev, createMessage("bot", data.reply)]);
      setIsTyping(false);
    })();
  }, []);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  async function handleSend() {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    setInputValue("");
    setMessages((prev) => [...prev, createMessage("user", text)]);
    setIsTyping(true);

    try {
      const data = await sendMessage(text, wizardState);
      setWizardState(data.wizardState);
      setMessages((prev) => [...prev, createMessage("bot", data.reply)]);
    } catch {
      setMessages((prev) => [
        ...prev,
        createMessage("bot", "Desculpe, ocorreu um erro. Pode tentar de novo?"),
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

        <div className={styles.messages} ref={messagesRef}>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isTyping && <TypingIndicator />}
        </div>

        <ChatInputBar
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
        />
      </section>
    </div>
  );
}
