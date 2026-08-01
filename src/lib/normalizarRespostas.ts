/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/normalizarRespostas.ts

// ===== DICIONÁRIOS DE TRADUÇÃO (PT/EN → valor único) =====

const MAPA_FUNCAO: Record<string, string> = {
  "desenvolvedor(a)": "Desenvolvedor(a)",
  developer: "Desenvolvedor(a)",
  // adicione outras opções do form se existirem (ex: Tech Lead, PM, etc.)
};

const MAPA_ANOS_EXPERIENCIA: Record<string, string> = {
  "1 a 2 anos": "1-2 anos",
  "1 to 2 years": "1-2 anos",
  "3 a 4 anos": "3-4 anos",
  "3 to four years": "3-4 anos", // atenção: resposta EN veio com typo ("four" em vez de "4") — mapeando mesmo assim
  "5 anos ou mais": "5+ anos",
  "5 years or more": "5+ anos",
  // confira se há "menos de 1 ano" / "less than 1 year" nas respostas
};

const MAPA_TAMANHO_EQUIPE: Record<string, string> = {
  "pequena (1–3 pessoas)": "pequena",
  "small (1–3 people)": "pequena",
  "média (4–8 pessoas)": "média",
  "medium (4–8 people)": "média",
  "grande (9+ pessoas)": "grande",
  "large (9+ people)": "grande",
};

const MAPA_EXPERIENCIA_EQUIPE: Record<string, string> = {
  júnior: "júnior",
  junior: "júnior",
  pleno: "pleno",
  "mid-level": "pleno",
  sênior: "sênior",
  senior: "sênior",
};

const MAPA_COMPLEXIDADE: Record<string, string> = {
  baixa: "baixa",
  low: "baixa",
  média: "média",
  medium: "média",
  alta: "alta",
  high: "alta",
};

const MAPA_PORTE_APP: Record<string, string> = {
  pequeno: "pequeno",
  small: "pequeno",
  médio: "médio",
  medium: "médio",
  grande: "grande",
  big: "grande",
};

const MAPA_TIPO_APP: Record<string, string> = {
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

const MAPA_SIM_NAO: Record<string, string> = {
  sim: "Sim",
  yes: "Sim",
  não: "Não",
  no: "Não",
};

const MAPA_PRESSAO_PRAZO: Record<string, string> = {
  baixa: "baixa",
  low: "baixa",
  média: "média",
  medium: "média",
  alta: "alta",
  high: "alta",
};

// ===== FUNÇÃO GENÉRICA DE TRADUÇÃO =====
function traduzir(valor: string, mapa: Record<string, string>): string {
  const chave = valor.trim().toLowerCase();
  const traduzido = mapa[chave];
  if (!traduzido) {
    console.warn(
      `⚠️ Valor não mapeado: "${valor}" — adicione no dicionário correspondente`,
    );
    return valor; // fallback: mantém original em vez de quebrar
  }
  return traduzido;
}

// ===== TIPO FINAL =====
export type RespostaNormalizada = {
  timestamp: string;
  funcaoPrincipal: string;
  anosExperienciaFlutter: string;
  tamanhoEquipe: string;
  experienciaMediaEquipe: string;
  complexidadeProjeto: string;
  porteApp: string;
  tipoApp: string;
  exigeEscalabilidade: string;
  pressaoPrazo: string;
  bibliotecaUtilizada: string;
  motivoEscolha: string; // texto livre, sem tradução
  facilidadeImplementacao: number;
  facilidadeManutencao: number;
  curvaAprendizado: number;
  escalabilidadeSolucao: number;
  impactoVelocidade: number;
  organizacaoCodigo: number;
  satisfacaoGeral: number;
  comentarioLivre: string;
  pais: string;
  idiomaOriginal: "pt" | "en";
};

const CAMPOS_ORDEM = [
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

export function normalizarLinha(
  linha: string[],
  idioma: "pt" | "en",
): RespostaNormalizada {
  const raw: any = { idiomaOriginal: idioma };
  CAMPOS_ORDEM.forEach((campo, i) => (raw[campo] = linha[i] ?? ""));

  return {
    idiomaOriginal: idioma,
    timestamp: raw.timestamp,
    funcaoPrincipal: traduzir(raw.funcaoPrincipal, MAPA_FUNCAO),
    anosExperienciaFlutter: traduzir(
      raw.anosExperienciaFlutter,
      MAPA_ANOS_EXPERIENCIA,
    ),
    tamanhoEquipe: traduzir(raw.tamanhoEquipe, MAPA_TAMANHO_EQUIPE),
    experienciaMediaEquipe: traduzir(
      raw.experienciaMediaEquipe,
      MAPA_EXPERIENCIA_EQUIPE,
    ),
    complexidadeProjeto: traduzir(raw.complexidadeProjeto, MAPA_COMPLEXIDADE),
    porteApp: traduzir(raw.porteApp, MAPA_PORTE_APP),
    tipoApp: traduzir(raw.tipoApp, MAPA_TIPO_APP),
    exigeEscalabilidade: traduzir(raw.exigeEscalabilidade, MAPA_SIM_NAO),
    pressaoPrazo: traduzir(raw.pressaoPrazo, MAPA_PRESSAO_PRAZO),
    bibliotecaUtilizada: raw.bibliotecaUtilizada.trim(), // já é técnico, não precisa traduzir
    motivoEscolha: raw.motivoEscolha,
    facilidadeImplementacao: Number(raw.facilidadeImplementacao),
    facilidadeManutencao: Number(raw.facilidadeManutencao),
    curvaAprendizado: Number(raw.curvaAprendizado),
    escalabilidadeSolucao: Number(raw.escalabilidadeSolucao),
    impactoVelocidade: Number(raw.impactoVelocidade),
    organizacaoCodigo: Number(raw.organizacaoCodigo),
    satisfacaoGeral: Number(raw.satisfacaoGeral),
    comentarioLivre: raw.comentarioLivre,
    pais: raw.pais,
  };
}
