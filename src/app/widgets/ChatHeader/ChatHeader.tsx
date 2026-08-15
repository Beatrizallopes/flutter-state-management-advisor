import styles from "./ChatHeader.module.css";

export default function ChatHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.avatar}>🤖</div>
      <div>
        <p className={styles.name}>FlutterGuide Bot</p>
        <p className={styles.status}>
          <span className={styles.dot} />
          online
        </p>
      </div>
    </header>
  );
}
