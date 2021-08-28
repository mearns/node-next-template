/**
 * Encapsulates the interface for performing an HTTP fetch, as well as adding retry logic supporting exponential backoff and jitter.
 */
import axios from "axios";
import StatusCodes from "http-status-codes";

export default async function fetch(
  url,
  options = {},
  maxTries = 5,
  initialBackoff = 100
) {
  const {
    method = "GET",
    baseURL = null,
    headers = {},
    data = null,
    params = {},
    auth = null,
  } = options;
  return axiosWithRetry(
    {
      url,
      baseURL,
      method,
      headers,
      data,
      params,
      auth,
    },
    maxTries,
    initialBackoff
  );
}

async function axiosWithRetry(
  axiosOptions,
  maxTries = 5,
  initialBackoff = 100
) {
  let backoff = initialBackoff;
  let totalBackoff = 0;
  let tries;
  const startTime = new Date();
  for (tries = 0; tries < maxTries; tries++) {
    let resp;
    try {
      resp = await axios(axiosOptions);
    } catch (error) {
      if (
        tries + 1 < maxTries &&
        isStatusCodeRetryable(error.response?.status)
      ) {
        const jitter = 1 + Math.random();
        const currentBackoff = backoff * jitter;
        totalBackoff += currentBackoff;
        await wait(currentBackoff);
        backoff += backoff;
        continue;
      }
      throw Object.assign(cleanAxiosError(axiosOptions, error), {
        totalTries: tries + 1,
        totalBackoff,
        totalTime: new Date() - startTime,
      });
    }
    if (resp.status === StatusCodes.NO_CONTENT) {
      return null;
    }
    return resp.data;
  }
  throw Object.assign(new Error("Should not have reached this point"), {
    tries,
    maxTries,
  });
}

function cleanAxiosError(axiosConfig, error) {
  if (error.isAxiosError) {
    const requestDetails = getRequestDetailsForError(
      augmentAxiosConfigFromError(axiosConfig, error)
    );
    const ce = new Error(
      `${error.message} (${requestDetails.method} ${requestDetails.url})`
    );
    ce.name = error.name;
    Error.captureStackTrace?.(ce, fetch);
    ce.errno = error.errno;
    ce.code = error.code;
    ce.syscall = error.syscall;
    ce.request = requestDetails;
    if (error.response) {
      ce.response = {
        status: error.response.status,
        body: error.response.data,
        headers: error.response.headers,
      };
    }
    return ce;
  }
  return error;
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isStatusCodeRetryable(status) {
  return (
    typeof status === "undefined" ||
    (status >= FIRST_SERVER_ERROR &&
      status <= LAST_SERVER_ERROR &&
      !NON_RETRYABLE_SERVER_ERRORS.has(status)) ||
    RETRYABLE_CLIENT_ERRORS.has(status)
  );
}

/**
 * Sometimes axios error objects have these nested details about the actual request that was made.
 * If tha's there, overwrite details from the initial config with the actual values from the request.
 */
function augmentAxiosConfigFromError(axiosConfig, error) {
  const augmented = { ...axiosConfig };
  const requestOptions = error?.request?._redirectable?._options;
  if (requestOptions) {
    const {
      protocol = "http:",
      hostname = "<unknown>",
      port,
      auth,
      path = "<unknown>",
      headers,
    } = requestOptions;
    const urlBase = `${protocol}//${hostname}:${
      port ?? { "http:": 80, "https:": 443 }[protocol] ?? 0
    }/`;
    const actualUrl = new URL(path, urlBase);
    if (auth) {
      const [actualUsername, ...passwordComponents] = auth.split(":");
      actualUrl.username = actualUsername;
      augmented.auth = {
        username: actualUsername,
      };
      if (passwordComponents.length) {
        actualUrl.password = augmented.auth.password =
          passwordComponents.join(":");
      }
    }
    augmented.baseURL = urlBase;
    augmented.url = actualUrl.toString();
    augmented.params = augmented.params ?? {};
    actualUrl.searchParams.forEach((value, name) => {
      augmented.params[name] = value;
    });
    augmented.headers = headers;
    return augmented;
  }
  return augmented;
}

function getRequestDetailsForError(augmentedAxiosConfig) {
  const requestedUrl = new URL(
    augmentedAxiosConfig.url,
    augmentedAxiosConfig.baseURL ?? window?.location
  );
  Object.entries(augmentedAxiosConfig.params ?? {}).forEach(([name, value]) => {
    requestedUrl.searchParams.set(name, value);
  });
  if (requestedUrl.password || augmentedAxiosConfig.auth?.password) {
    requestedUrl.password = "<redacted>";
  }
  if (augmentedAxiosConfig.auth?.username) {
    requestedUrl.username = augmentedAxiosConfig.auth.username;
  }
  const details = {
    url: requestedUrl.toString(),
    method: augmentedAxiosConfig.method,
    headers: canonicalHeaders(augmentedAxiosConfig.headers),
    query: [...requestedUrl.searchParams.entries()].reduce((all, [k, v]) => {
      all[k] = v;
      return all;
    }, {}),
  };
  if (details.headers.authorization) {
    details.headers.authorization = "<redcated>";
  }
  if (requestedUrl.username || requestedUrl.password) {
    details.auth = {};
    if (requestedUrl.username) {
      details.auth.username = decodeURIComponent(requestedUrl.username);
    }
    if (requestedUrl.password) {
      details.auth.password = decodeURIComponent(requestedUrl.password);
    }
  }
  return details;
}

function canonicalHeaders(headers) {
  return Object.entries(headers).reduce((all, [name, value]) => {
    all[name.toLowerCase()] = value;
    return all;
  }, {});
}

const FIRST_SERVER_ERROR = 500;
const LAST_SERVER_ERROR = 599;

// Uncommon response codes that http-status-codes isn't aware of.
const ENHANCE_YOUR_CALM = 420;
const RETRY_WITH = 449;
const LOOP_DETECTED = 508;

const NON_RETRYABLE_SERVER_ERRORS = new Set([
  StatusCodes.NOT_IMPLEMENTED,
  StatusCodes.HTTP_VERSION_NOT_SUPPORTED,
  LOOP_DETECTED,
  StatusCodes.NETWORK_AUTHENTICATION_REQUIRED,
]);

const RETRYABLE_CLIENT_ERRORS = new Set([
  StatusCodes.CONFLICT,
  StatusCodes.PRECONDITION_FAILED,
  StatusCodes.IM_A_TEAPOT, // sometimes teapots learn new tricks.
  StatusCodes.LOCKED,
  ENHANCE_YOUR_CALM,
  StatusCodes.REQUEST_TIMEOUT,
  StatusCodes.EXPECTATION_FAILED,
  StatusCodes.TOO_MANY_REQUESTS,
  StatusCodes.FAILED_DEPENDENCY,
  RETRY_WITH,
]);
