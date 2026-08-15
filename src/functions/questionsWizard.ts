import { questions } from "@/constants/questions";
import type { wizardField, wizardState } from "@/types/wizard";

export { questions };
export type { wizardField, wizardState };

export const initialState: wizardState = {
  answers: {},
  currentIndex: 0,
  finished: false,
};
