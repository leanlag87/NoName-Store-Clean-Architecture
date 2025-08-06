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

export interface CredentialsError extends AppError {
  type: "CredentialsError";
  message: string;
  httpStatus: 401;
}

export interface UnauthorizedError extends AppError {
  type: "Unauthorized";
  message: string;
  httpStatus: 401;
}

export interface AlreadyRegisteredError extends AppError {
  type: "AlreadyRegistered";
  message: string;
  httpStatus: 409;
}

export const createCredentialsError = (): CredentialsError => ({
  type: "CredentialsError",
  message: "Invalid credentials",
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

export const createAlreadyRegisteredError = (
  _message: string
): AlreadyRegisteredError => ({
  type: "AlreadyRegistered",
  message: _message,
  httpStatus: 409,
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
