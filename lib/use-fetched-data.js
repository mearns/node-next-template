import useSWR from "swr";
import httpFetch from "./http-client";

import { useState, useCallback } from "react";

const useFetchedData = (url, { onLoad, fetch = httpFetch } = {}) => {
  const [status, setStatus] = useState("loading");
  const doFetch = useCallback(
    async (...args) => {
      try {
        const data = await fetch(...args);
        setStatus("ready");
        onLoad?.(data);
        return data;
      } catch (error) {
        setStatus("failed");
        throw error;
      }
    },
    [setStatus, onLoad, fetch]
  );

  const { error, data } = useSWR(url, doFetch);

  return { status, ready: status === "ready", data, error };
};

export default useFetchedData;
