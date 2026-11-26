/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FALLBACK_RETRY_ATTEMPTS,
  GEMINI_FALLBACK_MODELS,
  GEMINI_MODEL,
  RETRY_DEFAULT_ATTEMPTS,
  RETRYABLE_HTTP_STATUSES,
} from "@/constants/ai";
import { withRetry } from "./withRetry";

/**
 * Executa `fn` com o modelo principal (com retry). Se falhar com erro
 * transitório (429/5xx), tenta os modelos de fallback em ordem (com menos retries).
 * Erros não transitórios (ex.: 400) são lançados imediatamente.
 */
export async function withModelFallback<T>(
  fn: (model: string) => Promise<T>,
  models: string[] = [GEMINI_MODEL, ...GEMINI_FALLBACK_MODELS],
): Promise<T> {
  let lastError: any;

  for (const [index, model] of models.entries()) {
    // Modelo principal usa o retry padrão; fallbacks tentam menos para trocar logo de modelo
    const attempts =
      index === 0 ? RETRY_DEFAULT_ATTEMPTS : FALLBACK_RETRY_ATTEMPTS;
    try {
      return await withRetry(() => fn(model), attempts);
    } catch (err: any) {
      lastError = err;
      if (!RETRYABLE_HTTP_STATUSES.includes(err?.status)) {
        throw err;
      }
      console.warn(
        `Modelo ${model} indisponível (status ${err.status}), tentando o próximo...`,
      );
    }
  }

  throw lastError;
}
