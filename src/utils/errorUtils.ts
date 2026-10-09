import { AxiosError } from "axios";

type ApiErrorResponse = {
  detail?: string;
  message?: string;
  error?: string;
  status?: number;
  errors?: Record<string, string | string[]>;
};

export function getErrorMessage(
  error: unknown,
  fallbackMessage = "Something went wrong"
): string {
  if (isAxiosError(error)) {
    const response = error.response;

    if (response?.data) {
      const data = response.data as ApiErrorResponse;

      const status = response.status;
      const isClientError = status === 400 || status === 409;

      if (isClientError) {
        // Handle validation errors object
        if (data.errors) {
          const firstError = Object.values(data.errors)[0];

          if (Array.isArray(firstError)) {
            return firstError[0];
          }

          if (typeof firstError === "string") {
            return firstError;
          }
        }

        if (data.detail) return data.detail;
        if (data.message) return data.message;
        if (data.error) return data.error;
      }

      return fallbackMessage;
    }

    return error.message || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  if (typeof error === "string") return error;

  if (typeof error === "object" && error !== null) {
    return JSON.stringify(error);
  }

  return fallbackMessage;
}

function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as AxiosError).isAxiosError === true
  );
}
