import { describe, it, expect } from "vitest";
import {
  createInvalidDataError,
  createNotFoundError,
  createMissingDataError,
  createAuthenticationError,
  createUnauthorizedError,
  createConflictError,
  createForbiddenError,
  createEmailSendingError,
} from "./error";

describe("createInvalidDataError", () => {
  it("should create an InvalidDataError object with custom message", () => {
    const customMessage = "Email format is invalid";
    const error = createInvalidDataError(customMessage);

    expect(error).toEqual({
      type: "InvalidData",
      message: customMessage,
      httpStatus: 400,
    });
  });
});

describe("createNotFoundError", () => {
  it("should create a NotFoundError object with custom message", () => {
    const customMessage = "User not found";
    const error = createNotFoundError(customMessage);

    expect(error).toEqual({
      type: "Not Found",
      message: customMessage,
      httpStatus: 404,
    });
  });
});

describe("createMissingDataError", () => {
  it("should create a BadRequestError object with custom message", () => {
    const customMessage = "Required field is missing";
    const error = createMissingDataError(customMessage);

    expect(error).toEqual({
      type: "Bad Request",
      message: customMessage,
      httpStatus: 400,
    });
  });
});

describe("createAuthenticationError", () => {
  it("should create an AuthenticationError object with default message", () => {
    const error = createAuthenticationError();

    expect(error).toEqual({
      type: "Authentication Error",
      message: "Invalid credentials",
      httpStatus: 401,
    });
  });

  it("should create an AuthenticationError object with custom message", () => {
    const customMessage = "Password is incorrect";
    const error = createAuthenticationError(customMessage);

    expect(error).toEqual({
      type: "Authentication Error",
      message: customMessage,
      httpStatus: 401,
    });
  });
});

describe("createUnauthorizedError", () => {
  it("should create an UnauthorizedError object with custom message", () => {
    const customMessage = "Access token is invalid";
    const error = createUnauthorizedError(customMessage);

    expect(error).toEqual({
      type: "Unauthorized",
      message: customMessage,
      httpStatus: 401,
    });
  });
});

describe("createConflictError", () => {
  it("should create a ConflictError object with default message", () => {
    const error = createConflictError();

    expect(error).toEqual({
      type: "Conflict",
      message: "Resource already exists",
      httpStatus: 409,
    });
  });

  it("should create a ConflictError object with custom message", () => {
    const customMessage = "Email already registered";
    const error = createConflictError(customMessage);

    expect(error).toEqual({
      type: "Conflict",
      message: customMessage,
      httpStatus: 409,
    });
  });
});

describe("createForbiddenError", () => {
  it("should create a ForbiddenError object with default message", () => {
    const error = createForbiddenError();

    expect(error).toEqual({
      type: "Forbidden",
      message: "Access forbidden",
      httpStatus: 403,
    });
  });

  it("should create a ForbiddenError object with custom message", () => {
    const customMessage = "You do not have permission to access this resource";
    const error = createForbiddenError(customMessage);

    expect(error).toEqual({
      type: "Forbidden",
      message: customMessage,
      httpStatus: 403,
    });
  });
});

describe("createEmailSendingError", () => {
  it("should create an EmailSendingError object with default message", () => {
    const error = createEmailSendingError();

    expect(error).toEqual({
      type: "Email Sending Error",
      message: "Email sending failed",
      httpStatus: 500,
    });
  });

  it("should create an EmailSendingError object with custom message", () => {
    const customMessage = "SMTP server is not responding";
    const error = createEmailSendingError(customMessage);

    expect(error).toEqual({
      type: "Email Sending Error",
      message: customMessage,
      httpStatus: 500,
    });
  });
});
