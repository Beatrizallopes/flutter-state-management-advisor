export const PERGUNTAS = [
  {
    campo: "tamanhoEquipe",
    pergunta: "Qual é o tamanho da equipe Flutter do projeto?",
    opcoes: ["pequena", "média", "grande"],
    ajuda: "pequena (1-3 pessoas), média (4-8), grande (9+)",
  },
  {
    campo: "experienciaMediaEquipe",
    pergunta:
      "Qual é o nível médio de experiência da equipe com Flutter no início do projeto?",
    opcoes: ["júnior", "pleno", "sênior"],
    ajuda: "júnior, pleno ou sênior",
  },
  {
    campo: "complexidadeProjeto",
    pergunta: "Como você classifica a complexidade do projeto?",
    opcoes: ["baixa", "média", "alta"],
    ajuda: undefined,
  },
  {
    campo: "porteApp",
    pergunta: "Qual é o porte do aplicativo?",
    opcoes: ["pequeno", "médio", "grande"],
    ajuda: undefined,
  },
  {
    campo: "tipoApp",
    pergunta:
      "Qual o tipo de aplicação? (ex: E-commerce, App corporativo/interno, Finanças/Banking, Saúde, Educação, ERP, Mídia/Conteúdo...)",
    opcoes: null,
    ajuda: undefined,
  },
  {
    campo: "exigeEscalabilidade",
    pergunta:
      "O projeto possui requisitos elevados de escalabilidade e manutenção a longo prazo?",
    opcoes: ["Sim", "Não"],
    ajuda: undefined,
  },
  {
    campo: "pressaoPrazo",
    pergunta: "Qual é a pressão de prazo do projeto?",
    opcoes: ["baixa", "média", "alta"],
    ajuda: undefined,
  },
] as const;

export type CampoWizard = (typeof PERGUNTAS)[number]["campo"];

export type EstadoWizard = {
  respostas: Partial<Record<CampoWizard, string>>;
  indiceAtual: number;
  finalizado: boolean;
};

export const ESTADO_INICIAL: EstadoWizard = {
  respostas: {},
  indiceAtual: 0,
  finalizado: false,
};
