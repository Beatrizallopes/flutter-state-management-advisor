// ===== DICIONÁRIOS DE TRADUÇÃO (PT/EN → valor único) =====

export const MAPA_FUNCAO: Record<string, string> = {
  "desenvolvedor(a)": "Desenvolvedor(a)",
  developer: "Desenvolvedor(a)",
  // adicione outras opções do form se existirem (ex: Tech Lead, PM, etc.)
};

export const MAPA_ANOS_EXPERIENCIA: Record<string, string> = {
  "1 a 2 anos": "1-2 anos",
  "1 to 2 years": "1-2 anos",
  "3 a 4 anos": "3-4 anos",
  "3 to four years": "3-4 anos", // atenção: resposta EN veio com typo ("four" em vez de "4") — mapeando mesmo assim
  "5 anos ou mais": "5+ anos",
  "5 years or more": "5+ anos",
};

export const MAPA_TAMANHO_EQUIPE: Record<string, string> = {
  "pequena (1–3 pessoas)": "pequena",
  "small (1–3 people)": "pequena",
  "média (4–8 pessoas)": "média",
  "medium (4–8 people)": "média",
  "grande (9+ pessoas)": "grande",
  "large (9+ people)": "grande",
};

export const MAPA_EXPERIENCIA_EQUIPE: Record<string, string> = {
  júnior: "júnior",
  junior: "júnior",
  pleno: "pleno",
  "mid-level": "pleno",
  sênior: "sênior",
  senior: "sênior",
};

export const MAPA_COMPLEXIDADE: Record<string, string> = {
  baixa: "baixa",
  low: "baixa",
  média: "média",
  medium: "média",
  alta: "alta",
  high: "alta",
};

export const MAPA_PORTE_APP: Record<string, string> = {
  pequeno: "pequeno",
  small: "pequeno",
  médio: "médio",
  medium: "médio",
  grande: "grande",
  big: "grande",
};

export const MAPA_TIPO_APP: Record<string, string> = {
  saúde: "Saúde",
  health: "Saúde",
  "app corporativo / interno": "Corporativo / Interno",
  "corporate / internal app": "Corporativo / Interno",
  erp: "ERP",
  educação: "Educação",
  education: "Educação",
  "finanças / banking": "Finanças / Banking",
  "finances / banking": "Finanças / Banking",
  "mídia / conteúdo": "Mídia / Conteúdo",
  "media / content": "Mídia / Conteúdo",
  "e-commerce": "E-commerce",
  // vá completando conforme aparecerem novas categorias nas 42 respostas
};

export const MAPA_SIM_NAO: Record<string, string> = {
  sim: "Sim",
  yes: "Sim",
  não: "Não",
  no: "Não",
};

export const MAPA_PRESSAO_PRAZO: Record<string, string> = {
  baixa: "baixa",
  low: "baixa",
  média: "média",
  medium: "média",
  alta: "alta",
  high: "alta",
};

export const CAMPOS_ORDEM = [
  "timestamp",
  "funcaoPrincipal",
  "anosExperienciaFlutter",
  "tamanhoEquipe",
  "experienciaMediaEquipe",
  "complexidadeProjeto",
  "porteApp",
  "tipoApp",
  "exigeEscalabilidade",
  "pressaoPrazo",
  "bibliotecaUtilizada",
  "motivoEscolha",
  "facilidadeImplementacao",
  "facilidadeManutencao",
  "curvaAprendizado",
  "escalabilidadeSolucao",
  "impactoVelocidade",
  "organizacaoCodigo",
  "satisfacaoGeral",
  "comentarioLivre",
  "pais",
] as const;
