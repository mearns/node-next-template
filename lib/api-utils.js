import { StatusCodes } from "http-status-codes";
import { v4 as uuid } from "uuid";
import log from "./log";

const DELAY_FOR_DEMO_MS = 500;

export function handler(func) {
  return async (req, resp) => {
    let errorId = null;
    await delayForDemoPurposes();
    try {
      await func(req, resp);
    } catch (error) {
      errorId = uuid();
      log("server-error", { errorId, error });
      const body = {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
        errorId,
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
      resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json(body);
    }
    log("response-sent", { resp, errorId });
  };
}

async function delayForDemoPurposes() {
  await new Promise((resolve) => setTimeout(resolve, DELAY_FOR_DEMO_MS));
}
