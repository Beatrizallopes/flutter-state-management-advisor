import { questions } from "@/constants/questions";

export { questions };

export type wizardField = (typeof questions)[number]["field"];

export type wizardState = {
  answers: Partial<Record<wizardField, string>>;
  currentIndex: number;
  finished: boolean;
};

export const initialState: wizardState = {
  answers: {},
  currentIndex: 0,
  finished: false,
};
