import styles from "./InfoCard.module.css";
import { STATE_MANAGEMENT_LIBRARIES } from "@/constants/libraries";

export default function InfoCard() {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>F</div>
        <div>
          <h1 className={styles.title}>FlutterGuide</h1>
          <p className={styles.subtitle}>State Management Advisor</p>
        </div>
      </div>

      <p className={styles.description}>
        Não sabe qual biblioteca de gerenciamento de estado usar no seu projeto Flutter? Este
        chatbot analisa o <strong>tamanho do projeto</strong>, <strong>nível da equipe</strong>,
        necessidade de <strong>testabilidade</strong> e outros fatores para recomendar a solução
        ideal — entre Vanilla, Provider, Riverpod, BLoC, GetX e MobX.
      </p>

      <ul className={styles.tags}>
        {STATE_MANAGEMENT_LIBRARIES.map((tag) => (
          <li key={tag} className={styles.tag}>
            {tag}
          </li>
        ))}
      </ul>
    </section>
  );
}
