import styles from "./ChatInputBar.module.css";

interface ChatInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export default function ChatInputBar({ value, onChange, onSend }: ChatInputBarProps) {
  return (
    <form
      className={styles.bar}
      onSubmit={(event) => {
        event.preventDefault();
        onSend();
      }}
    >
      <input
        className={styles.input}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ou use os botões acima para responder..."
      />
      <button type="submit" className={styles.send} aria-label="Enviar mensagem">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
          <path
            d="M3 11.5 20.5 3 12 20.5l-2.2-6.8L3 11.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}
