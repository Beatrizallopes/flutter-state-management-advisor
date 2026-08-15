/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/normalizarRespostas.ts

import {
  MAPA_FUNCAO,
  MAPA_ANOS_EXPERIENCIA,
  MAPA_TAMANHO_EQUIPE,
  MAPA_EXPERIENCIA_EQUIPE,
  MAPA_COMPLEXIDADE,
  MAPA_PORTE_APP,
  MAPA_TIPO_APP,
  MAPA_SIM_NAO,
  MAPA_PRESSAO_PRAZO,
  CAMPOS_ORDEM,
} from "@/constants/answerMappings";
import type { NormalizedAnswer } from "@/types/answers";

// ===== FUNÇÃO GENÉRICA DE TRADUÇÃO =====
function translate(valor: string, mapa: Record<string, string>): string {
  const key = valor.trim().toLowerCase();
  const translated = mapa[key];
  if (!translated) {
    console.warn(
      `⚠️ Valor não mapeado: "${valor}" — adicione no dicionário correspondente`,
    );
    return valor; // fallback: mantém original em vez de quebrar
  }
  return translated;
}

export function normalizedLine(
  line: string[],
  language: "pt" | "en",
): NormalizedAnswer {
  const raw: any = { originalLanguage: language };
  CAMPOS_ORDEM.forEach((field, i) => (raw[field] = line[i] ?? ""));

  return {
    originalLanguage: language,
    timestamp: raw.timestamp,
    funcaoPrincipal: translate(raw.funcaoPrincipal, MAPA_FUNCAO),
    anosExperienciaFlutter: translate(
      raw.anosExperienciaFlutter,
      MAPA_ANOS_EXPERIENCIA,
    ),
    tamanhoEquipe: translate(raw.tamanhoEquipe, MAPA_TAMANHO_EQUIPE),
    experienciaMediaEquipe: translate(
      raw.experienciaMediaEquipe,
      MAPA_EXPERIENCIA_EQUIPE,
    ),
    complexidadeProjeto: translate(raw.complexidadeProjeto, MAPA_COMPLEXIDADE),
    porteApp: translate(raw.porteApp, MAPA_PORTE_APP),
    tipoApp: translate(raw.tipoApp, MAPA_TIPO_APP),
    exigeEscalabilidade: translate(raw.exigeEscalabilidade, MAPA_SIM_NAO),
    pressaoPrazo: translate(raw.pressaoPrazo, MAPA_PRESSAO_PRAZO),
    bibliotecaUtilizada: raw.bibliotecaUtilizada.trim(), // já é técnico, não precisa translate
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
