export const fatalErrorCodes = [
  "CONFIG_NOT_FOUND",
  "CONFIG_INVALID",
  "CONTRACT_NOT_FOUND",
  "CONTRACT_INVALID",
  "TSCONFIG_INVALID",
] as const;

export type FatalErrorCode = (typeof fatalErrorCodes)[number];

export type FatalError = {
  code: FatalErrorCode;
  message: string;
};

export class FatalLoadError extends Error {
  readonly code: FatalErrorCode;

  constructor(code: FatalErrorCode, message: string) {
    super(message);
    this.name = "FatalLoadError";
    this.code = code;
  }
}

export function fatalError(
  code: FatalErrorCode,
  message: string,
): FatalLoadError {
  return new FatalLoadError(code, message);
}

export function isErrnoException(
  error: unknown,
): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
