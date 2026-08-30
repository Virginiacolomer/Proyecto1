// utils/error.util.ts
export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export const getErrorStack = (error: unknown): string | undefined =>
  error instanceof Error ? error.stack : undefined;