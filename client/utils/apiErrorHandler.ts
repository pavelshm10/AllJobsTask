import { logger } from "./logger";

export interface ApiErrorResponse {
  statusCode: number;
  errorCode?: string;
  message: string;
  details?: string;
  timestamp?: string;
  path?: string;
  validationErrors?: Record<string, string[]>;
}

export class ApiError extends Error {
  statusCode: number;
  errorCode?: string;
  validationErrors?: Record<string, string[]>;

  constructor(response: ApiErrorResponse) {
    super(response.message);
    this.name = "ApiError";
    this.statusCode = response.statusCode;
    this.errorCode = response.errorCode;
    this.validationErrors = response.validationErrors;
  }
}

export async function handleApiError(
  response: Response,
  endpoint: string
): Promise<never> {
  let errorResponse: ApiErrorResponse;

  try {
    errorResponse = await response.json();
  } catch {
    // If JSON parsing fails, create a generic error
    errorResponse = {
      statusCode: response.status,
      message: response.statusText || "An unknown error occurred",
    };
  }

  // Create ApiError instance
  const apiError = new ApiError(errorResponse);

  // Log the error
  logger.logApiError(endpoint, apiError);

  // Throw ApiError
  throw apiError;
}

export function getUserFriendlyMessage(error: Error): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

export function isNetworkError(error: Error): boolean {
  return (
    error instanceof TypeError &&
    (error.message.includes("fetch") || error.message.includes("network"))
  );
}

export function getErrorStatusCode(error: Error): number | undefined {
  if (error instanceof ApiError) {
    return error.statusCode;
  }
  return undefined;
}
