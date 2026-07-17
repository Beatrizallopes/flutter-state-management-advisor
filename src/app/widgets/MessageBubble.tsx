import type { ChatMessage } from "@/lib/advisor";
import styles from "./MessageBubble.module.css";

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === "user";

  return (
    <p className={`${styles.bubble} ${isUser ? styles.user : styles.bot}`}>{message.text}</p>
  );
}
