/* eslint-disable @typescript-eslint/no-explicit-any */
export async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 2,
  delayMs = 3000,
): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (err.status === 429 && attempts > 0) {
      await new Promise((r) => setTimeout(r, delayMs));
      return withRetry(fn, attempts - 1, delayMs * 2);
    }
    throw err;
  }
}
