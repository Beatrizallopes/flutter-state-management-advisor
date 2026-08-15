import { questions } from "@/constants/questions";

export type wizardField = (typeof questions)[number]["field"];

export type wizardState = {
  answers: Partial<Record<wizardField, string>>;
  currentIndex: number;
  finished: boolean;
};
