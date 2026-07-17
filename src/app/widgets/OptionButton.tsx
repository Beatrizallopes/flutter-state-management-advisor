import styles from "./OptionButton.module.css";

interface OptionButtonProps {
  label: string;
  onClick: () => void;
}

export default function OptionButton({ label, onClick }: OptionButtonProps) {
  return (
    <button type="button" className={styles.option} onClick={onClick}>
      {label}
    </button>
  );
}
