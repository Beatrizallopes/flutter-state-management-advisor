"use client";

import { useEffect, useRef, useState } from "react";
import ChatHeader from "@/app/widgets/ChatHeader";
import ChatInputBar from "@/app/widgets/ChatInputBar";
import InfoCard from "@/app/widgets/InfoCard";
import MessageBubble from "@/app/widgets/MessageBubble";
import TypingIndicator from "@/app/widgets/TypingIndicator";
import styles from "./ChatAdvisorScreen.module.css";
import { CHAT_API_ENDPOINT, JSON_CONTENT_TYPE_HEADERS } from "@/constants/api";
import { GREETING_MESSAGE, GENERIC_ERROR_MESSAGE } from "@/constants/messages";

type ChatMessage = { id: string; sender: "bot" | "user"; text: string };
type wizardState = {
  answers: Record<string, string>;
  currentIndex: number;
  finished: boolean;
} | null;

let messageCount = 0;
function createMessage(
  sender: ChatMessage["sender"],
  text: string,
): ChatMessage {
  messageCount += 1;
  return { id: `msg-${messageCount}`, sender, text };
}

async function sendMessage(message: string, wizardState: wizardState) {
  const res = await fetch(CHAT_API_ENDPOINT, {
    method: "POST",
    headers: JSON_CONTENT_TYPE_HEADERS,
    body: JSON.stringify({ message, wizardState }),
  });
  return res.json();
}

async function startWizard() {
  const res = await fetch(CHAT_API_ENDPOINT, {
    method: "POST",
    headers: JSON_CONTENT_TYPE_HEADERS,
    body: JSON.stringify({ start: true, wizardState: null }),
  });
  return res.json();
}

export default function ChatAdvisorScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("bot", GREETING_MESSAGE),
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
        createMessage("bot", GENERIC_ERROR_MESSAGE),
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
