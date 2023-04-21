export default function log(tag, details) {
  const date = new Date();
  const forHumans =
    process.env.NODE_ENV === "local" || process.env.NODE_ENV === "development";
  if (forHumans) {
    humanLog(date, tag, formatForTag(tag, true, details));
  } else {
    machineLog(date, tag, formatForTag(tag, false, details));
  }
}

const TAG_FORMATTERS = {
  "response-sent": formatResponseSent,
  "server-error": formatServerError,
};

function formatForTag(tag, forHumans, details) {
  const formatter =
    TAG_FORMATTERS[tag] ?? (() => (forHumans ? [details] : details));
  return formatter(forHumans, details);
}

function machineLog(date, tag, formatted) {
  console.log(
    JSON.stringify({
      date,
      tag,
      details: makeSerializable(formatted),
    })
  );
}

function humanLog(date, tag, formatted) {
  const logArgs = [date, tag, ...formatted];
  console.log(...logArgs);
}

function makeSerializable(details) {
  if (details instanceof Error) {
    return makeSerializable({
      name: details.name,
      message: details.message,
      stack: details.stack?.split("\n"),
      ...details,
    });
  } else if (Array.isArray(details)) {
    return details.map(makeSerializable);
  } else if (typeof details === "object" && details) {
    return Object.fromEntries(
      Object.entries(details).map(([k, v]) => [k, makeSerializable(v)])
    );
  }
  return details;
}
function formatResponseSent(forHumans, { resp, errorId }) {
  if (forHumans) {
    const format = [
      resp.statusCode,
      `"${resp.statusMessage}"`,
      resp.req?.method,
      resp.req?.url,
    ];
    if (errorId !== null) {
      format.push(errorId);
    }
    return format;
  } else {
    return {
      statusCode: resp.statusCode,
      statusMessage: resp.statusMessage,
      method: resp.req?.method,
      url: resp.req?.url,
      ...(errorId && { errorId }),
    };
  }
}

function formatServerError(forHumans, { errorId, error, statusCode, details }) {
  if (forHumans) {
    return [statusCode, errorId, error, details];
  } else {
    return { statusCode, errorId, error, details };
  }
}
