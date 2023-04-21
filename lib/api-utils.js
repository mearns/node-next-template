import { StatusCodes } from "http-status-codes";
import { v4 as uuid } from "uuid";
import log from "./log";

const DELAY_FOR_DEMO_MS = 500;

export class HttpErrorResponse extends Error {
  constructor(statusCode, userMessage, details = {}, internalDetails = {}) {
    super(`HTTP ${statusCode} - ${userMessage}`);
    Error.captureStackTrace?.(this, this.constructor);
    this.statusCode = statusCode;
    this.details = details;
    this.internalDetails = internalDetails;
  }
}

function getStatusCodeForError(error) {
  if (error instanceof HttpErrorResponse) {
    return error.statusCode;
  }
  return StatusCodes.INTERNAL_SERVER_ERROR;
}

function getUserErrorMessage(error) {
  if (error instanceof HttpErrorResponse) {
    return error.message;
  }
  return "Internal server error";
}

function getUserDetailsForError(error) {
  if (error instanceof HttpErrorResponse) {
    return error.details;
  }
  return undefined;
}

function getInternalDetailsForError(error) {
  if (error instanceof HttpErrorResponse) {
    return error.internalDetails;
  }
  return { ...error };
}

export function handler(func) {
  return async (req, resp) => {
    let errorId = null;
    await delayForDemoPurposes();
    try {
      await func(req, resp);
    } catch (error) {
      errorId = uuid();
      const statusCode = getStatusCodeForError(error);
      const userMessage = getUserErrorMessage(error);
      const userDetails = getUserDetailsForError(error);
      const internalDetails = getInternalDetailsForError(error);

      log("server-error", {
        errorId,
        error,
        statusCode,
        details: { ...(userDetails ?? {}), ...internalDetails },
      });
      const body = {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: userMessage,
        errorId,
        details: userDetails,
      };
      if (
        process.env.NODE_ENV === "local" ||
        process.env.NODE_ENV === "development"
      ) {
        body.error = {
          name: error.name,
          message: error.message,
          ...error,
          stack: error.stack?.split("\n") ?? [],
        };
      }
      resp.status(statusCode).json(body);
    }
    log("response-sent", { resp, errorId });
  };
}

async function delayForDemoPurposes() {
  await new Promise((resolve) => setTimeout(resolve, DELAY_FOR_DEMO_MS));
}
