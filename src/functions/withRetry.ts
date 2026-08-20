/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HTTP_STATUS_RATE_LIMIT,
  RETRY_DEFAULT_ATTEMPTS,
  RETRY_DEFAULT_DELAY_MS,
} from "@/constants/ai";

export async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = RETRY_DEFAULT_ATTEMPTS,
  delayMs = RETRY_DEFAULT_DELAY_MS,
): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (err.status === HTTP_STATUS_RATE_LIMIT && attempts > 0) {
      await new Promise((r) => setTimeout(r, delayMs));
      return withRetry(fn, attempts - 1, delayMs * 2);
    }
    throw err;
  }
}
