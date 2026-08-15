export interface OptionButtonProps {
  label: string;
  onClick: () => void;
}

export interface ChatInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}
