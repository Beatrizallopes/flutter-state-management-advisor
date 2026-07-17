export type MessageSender = "bot" | "user";

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
}

export interface QuestionOption {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

export const QUESTIONS: Question[] = [
  {
    id: "size",
    text: "Qual é o tamanho do seu projeto Flutter?",
    options: [
      { label: "Pequeno (app simples, poucos estados)", value: "small" },
      { label: "Médio (múltiplas features, alguma complexidade)", value: "medium" },
      { label: "Grande (muitos módulos, equipe grande)", value: "large" },
    ],
  },
  {
    id: "team",
    text: "Qual é o nível de experiência da sua equipe?",
    options: [
      { label: "Iniciante em Flutter", value: "beginner" },
      { label: "Experiência intermediária", value: "intermediate" },
      { label: "Time avançado / sênior", value: "advanced" },
    ],
  },
  {
    id: "testability",
    text: "Qual a necessidade de testabilidade do projeto?",
    options: [
      { label: "Baixa (protótipo ou MVP)", value: "low" },
      { label: "Média (testes unitários básicos)", value: "medium" },
      { label: "Alta (cobertura extensa, CI rigoroso)", value: "high" },
    ],
  },
  {
    id: "priority",
    text: "O que mais importa para o seu projeto?",
    options: [
      { label: "Simplicidade e curva de aprendizado curta", value: "simplicity" },
      { label: "Performance em telas com muito estado", value: "performance" },
      { label: "Escalabilidade a longo prazo", value: "scalability" },
    ],
  },
];

type LibraryKey = "vanilla" | "provider" | "riverpod" | "bloc" | "getx" | "mobx";

const LIBRARIES: Record<LibraryKey, { name: string; reason: string }> = {
  vanilla: {
    name: "Vanilla (setState)",
    reason:
      "não adiciona dependências e é suficiente para apps pequenos sem necessidade de testes extensos.",
  },
  provider: {
    name: "Provider",
    reason:
      "tem curva de aprendizado baixa, boa documentação e se integra bem com times iniciantes ou projetos médios.",
  },
  riverpod: {
    name: "Riverpod",
    reason:
      "oferece segurança em tempo de compilação, ótima testabilidade e escala bem para projetos médios e grandes.",
  },
  bloc: {
    name: "BLoC",
    reason:
      "impõe uma arquitetura previsível, ideal para equipes avançadas, alta testabilidade e projetos grandes.",
  },
  getx: {
    name: "GetX",
    reason: "prioriza simplicidade e produtividade, com pouco boilerplate e ótimo desempenho.",
  },
  mobx: {
    name: "MobX",
    reason: "usa reatividade automática, boa para performance em telas com muito estado compartilhado.",
  },
};

const SCORING: Record<string, Record<string, Partial<Record<LibraryKey, number>>>> = {
  size: {
    small: { vanilla: 2, provider: 1 },
    medium: { provider: 2, riverpod: 2 },
    large: { riverpod: 2, bloc: 2 },
  },
  team: {
    beginner: { provider: 2, getx: 1 },
    intermediate: { riverpod: 2, provider: 1 },
    advanced: { bloc: 2, mobx: 1 },
  },
  testability: {
    low: { getx: 2, vanilla: 1 },
    medium: { provider: 1, riverpod: 1 },
    high: { bloc: 2, riverpod: 2 },
  },
  priority: {
    simplicity: { getx: 2, provider: 1 },
    performance: { mobx: 2, getx: 1 },
    scalability: { bloc: 2, riverpod: 2 },
  },
};

const TIE_BREAK_ORDER: LibraryKey[] = ["riverpod", "bloc", "provider", "getx", "mobx", "vanilla"];

export function recommend(answers: Record<string, string>): string {
  const scores: Record<LibraryKey, number> = {
    vanilla: 0,
    provider: 0,
    riverpod: 0,
    bloc: 0,
    getx: 0,
    mobx: 0,
  };

  for (const [questionId, value] of Object.entries(answers)) {
    const points = SCORING[questionId]?.[value];
    if (!points) continue;
    for (const [lib, score] of Object.entries(points) as [LibraryKey, number][]) {
      scores[lib] += score;
    }
  }

  const best = [...TIE_BREAK_ORDER].sort((a, b) => scores[b] - scores[a])[0];
  const { name, reason } = LIBRARIES[best];

  return `Com base nas suas respostas, recomendo o ${name}: ${reason}`;
}
