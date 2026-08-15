export type NormalizedAnswer = {
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
  originalLanguage: "pt" | "en";
};
