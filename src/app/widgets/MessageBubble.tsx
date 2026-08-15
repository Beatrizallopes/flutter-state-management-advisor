import ReactMarkdown from "react-markdown";
import styles from "./MessageBubble.module.css";
import type { ChatMessage } from "@/types/chat";

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === "user";

  return (
    <div className={`${styles.bubble} ${isUser ? styles.user : styles.bot}`}>
      {isUser ? message.text : <ReactMarkdown>{message.text}</ReactMarkdown>}
    </div>
  );
}
