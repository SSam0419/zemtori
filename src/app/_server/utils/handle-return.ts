import { AuthenticationError, DatabaseError, ValidationError } from "./errors";

export interface SuccessResponse<T> {
  success: true;
  payload: T;
}

export interface ErrorResponse {
  success: false;
  error: {
    name: string;
    message: string;
  };
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Handle success responses
export function handleSuccessReturn<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    payload: data,
  };
}

// Handle failure responses
export function handleFailureReturn(
  error: ValidationError | DatabaseError | AuthenticationError | Error | unknown,
): ErrorResponse {
  console.error(error);
  let errorName = "UnknownError";
  let errorMessage = "An unknown error occurred";

  // Check the type of error and map it to a structured response
  if (error instanceof ValidationError) {
    errorName = "ValidationError";
    errorMessage = error.message;
  } else if (error instanceof DatabaseError) {
    errorName = "DatabaseError";
    errorMessage = error.message;
  } else if (error instanceof AuthenticationError) {
    errorName = "AuthenticationError";
    errorMessage = error.message;
  } else if (error instanceof Error) {
    errorName = error.name;
    errorMessage = error.message;
  }

  return {
    success: false,
    error: {
      name: errorName,
      message: errorMessage,
    },
  };
}
