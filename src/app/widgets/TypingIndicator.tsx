import styles from "./TypingIndicator.module.css";

export default function TypingIndicator() {
  return (
    <div className={styles.bubble} aria-label="FlutterGuide está digitando" role="status">
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  );
}
