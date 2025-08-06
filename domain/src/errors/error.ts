interface AppError {
  type: string;
  message: string;
  httpStatus?: number;
}

export interface InvalidDataError extends AppError {
  type: "InvalidData";
  message: string;
  httpStatus: 400;
}

export interface NotFoundError extends AppError {
  type: "Not Found";
  message: string;
  httpStatus: 404;
}

export interface BadRequestError extends AppError {
  type: "Bad Request";
  message: string;
  httpStatus: 400;
}

export interface AuthenticationError extends AppError {
  type: "Authentication Error";
  message: string;
  httpStatus: 401;
}

export interface UnauthorizedError extends AppError {
  type: "Unauthorized";
  message: string;
  httpStatus: 401;
}

export interface ConflictError extends AppError {
  type: "Conflict";
  message: string;
  httpStatus: 409;
}

export interface ForbiddenError extends AppError {
  type: "Forbidden";
  message: string;
  httpStatus: 403;
}

export interface InternalServerError extends AppError {
  type: "Internal Server Error";
  message: string;
  httpStatus: 500;
}

export interface EmailSendingError extends AppError {
  type: "Email Sending Error";
  message: string;
  httpStatus: 500;
}

export const createEmailSendingError = (
  _message: string = "Email sending failed"
): EmailSendingError => ({
  type: "Email Sending Error",
  message: _message,
  httpStatus: 500,
});

export const createConflictError = (
  _message: string = "Resource already exists"
): ConflictError => ({
  type: "Conflict",
  message: _message,
  httpStatus: 409,
});

export const createForbiddenError = (
  _message: string = "Access forbidden"
): ForbiddenError => ({
  type: "Forbidden",
  message: _message,
  httpStatus: 403,
});

export const createAuthenticationError = (
  _message: string = "Invalid credentials"
): AuthenticationError => ({
  type: "Authentication Error",
  message: _message,
  httpStatus: 401,
});

export const createInvalidDataError = (_message: string): InvalidDataError => ({
  type: "InvalidData",
  message: _message,
  httpStatus: 400,
});

export const createNotFoundError = (_message: string): NotFoundError => ({
  type: "Not Found",
  message: _message,
  httpStatus: 404,
});

export const createMissingDataError = (_message: string): BadRequestError => ({
  type: "Bad Request",
  message: _message,
  httpStatus: 400,
});

export const createUnauthorizedError = (
  _message: string
): UnauthorizedError => ({
  type: "Unauthorized",
  message: _message,
  httpStatus: 401,
});

export const createInternalServerError = (
  _message: string = "An unexpected internal server error occurred"
): InternalServerError => ({
  type: "Internal Server Error",
  message: _message,
  httpStatus: 500,
});
