import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(public readonly status: 400 | 404, message: string) {
    super(message);
  }
}

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  if (error instanceof ApiError) {
    response.status(error.status).json({ error: { message: error.message } });
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      error: {
        message: "Invalid input",
        details: error.issues.map(({ path, message }) => ({ path, message })),
      },
    });
    return;
  }

  // Express and its JSON parser mark malformed requests with a 4xx status.
  if (
    error instanceof Error &&
    "status" in error &&
    typeof error.status === "number" &&
    error.status >= 400 &&
    error.status < 500
  ) {
    response.status(400).json({ error: { message: "Invalid request" } });
    return;
  }

  console.error(error);
  response.status(500).json({ error: { message: "Internal server error" } });
};
