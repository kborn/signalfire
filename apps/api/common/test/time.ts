export function freezeTime(now: string | Date) {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(now));
}

export function resetTime() {
  jest.useRealTimers();
}

export async function withFrozenTime<T>(now: string | Date, run: () => Promise<T> | T): Promise<T> {
  freezeTime(now);

  try {
    return await run();
  } finally {
    resetTime();
  }
}
