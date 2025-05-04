// src/utils/errorHandler.ts

type ErrorSource = unknown;

export const handleApiError = (
  error: ErrorSource,
  fallbackMessage = "Something went wrong.",
  context?: string
): string => {
  let message = fallbackMessage;

  if (typeof error === "string") {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    (error as any).response?.data?.message
  ) {
    message = (error as any).response.data.message;
  }

  // Optional: log to console or external service
  console.error(`[ERROR] ${context ?? "Unknown"}:`, message, error);

  return message;
};