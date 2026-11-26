export const GEMINI_MODEL = "gemini-3.5-flash";
export const HTTP_STATUS_RATE_LIMIT = 429;
export const RETRY_DEFAULT_ATTEMPTS = 2;
export const RETRY_DEFAULT_DELAY_MS = 3000;
export const HTTP_STATUS_SERVICE_UNAVAILABLE = 503;
// Status transitórios que valem uma nova tentativa (rate limit + erros temporários do servidor)
export const RETRYABLE_HTTP_STATUSES = [429, 500, 502, 503, 504];
// Modelos usados em ordem quando o principal falha com erro transitório (após esgotar os retries)
export const GEMINI_FALLBACK_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
];
export const FALLBACK_RETRY_ATTEMPTS = 1;
