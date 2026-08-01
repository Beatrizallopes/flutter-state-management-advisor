"use client";

import { useEffect, useRef, useState } from "react";
import ChatHeader from "@/app/widgets/ChatHeader";
import ChatInputBar from "@/app/widgets/ChatInputBar";
import InfoCard from "@/app/widgets/InfoCard";
import MessageBubble from "@/app/widgets/MessageBubble";
import TypingIndicator from "@/app/widgets/TypingIndicator";
import styles from "./ChatAdvisorScreen.module.css";

type ChatMessage = { id: string; sender: "bot" | "user"; text: string };
type EstadoWizard = {
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

async function sendMessage(message: string, estadoWizard: EstadoWizard) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, estadoWizard }),
  });
  return res.json(); // { reply, estadoWizard }
}

async function iniciarWizard() {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ iniciar: true, estadoWizard: null }),
  });
  return res.json(); // { reply, estadoWizard }
}

export default function ChatAdvisorScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("bot", GREETING),
  ]);
  const [estadoWizard, setEstadoWizard] = useState<EstadoWizard>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const iniciouRef = useRef(false);

  // dispara a primeira pergunta do wizard assim que o chat abre
  useEffect(() => {
    if (iniciouRef.current) return;
    iniciouRef.current = true;

    (async () => {
      setIsTyping(true);
      const data = await iniciarWizard();
      setEstadoWizard(data.estadoWizard);
      setMessages((prev) => [...prev, createMessage("bot", data.reply)]);
      setIsTyping(false);
    })();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  async function handleSend() {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    setInputValue("");
    setMessages((prev) => [...prev, createMessage("user", text)]);
    setIsTyping(true);

    try {
      const data = await sendMessage(text, estadoWizard);
      setEstadoWizard(data.estadoWizard);
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

        <div className={styles.messages}>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isTyping && <TypingIndicator />}

          <div ref={bottomRef} />
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
