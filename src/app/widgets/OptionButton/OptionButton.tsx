import styles from "./OptionButton.module.css";
import type { OptionButtonProps } from "@/types/components";

export default function OptionButton({ label, onClick }: OptionButtonProps) {
  return (
    <button type="button" className={styles.option} onClick={onClick}>
      {label}
    </button>
  );
}
