export const questions = [
  {
    field: "tamanhoEquipe",
    question: "Qual é o tamanho da equipe Flutter do projeto?",
    options: ["pequena", "média", "grande"],
    help: "pequena (1-3 pessoas), média (4-8), grande (9+)",
  },
  {
    field: "experienciaMediaEquipe",
    question:
      "Qual é o nível médio de experiência da equipe com Flutter no início do projeto?",
    options: ["júnior", "pleno", "sênior"],
    help: "júnior, pleno ou sênior",
  },
  {
    field: "complexidadeProjeto",
    question: "Como você classifica a complexidade do projeto?",
    options: ["baixa", "média", "alta"],
    help: undefined,
  },
  {
    field: "porteApp",
    question: "Qual é o porte do aplicativo?",
    options: ["pequeno", "médio", "grande"],
    help: undefined,
  },
  {
    field: "tipoApp",
    question: "Qual o tipo de aplicação?",
    options: null,
    help: "ex: E-commerce, App corporativo/interno, Finanças/Banking, Saúde, Educação, ERP, Mídia/Conteúdo...",
  },
  {
    field: "exigeEscalabilidade",
    question:
      "O projeto possui requisitos elevados de escalabilidade e manutenção a longo prazo?",
    options: ["Sim", "Não"],
    help: undefined,
  },
  {
    field: "pressaoPrazo",
    question: "Qual é a pressão de prazo do projeto?",
    options: ["baixa", "média", "alta"],
    help: undefined,
  },
] as const;
