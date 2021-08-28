/**
 * In dev mode, the nextjs router query sometimes comes back empty at first, we need to wait for it
 * to actually be populated before we can continue.
 */
import ErrorPanel from "./ErrorPanel";
import Loading from "./Loading";
import httpFetch from "../lib/http-client";
import useFetchedData from "../lib/use-fetched-data";
import WaitForReady from "./WaitForReady";

const WaitForFetch = ({
  url,
  fetch = httpFetch,
  quiet = false,
  loading = <Loading />,
  errorDisplay = (error) => <ErrorPanel error={error} />,
  children,
}) => {
  const { ready, data, error } = useFetchedData(url, { fetch });
  return (
    <WaitForReady
      ready={ready}
      error={error}
      data={data}
      quiet={quiet}
      loading={loading}
      errorDisplay={errorDisplay}
    >
      {children}
    </WaitForReady>
  );
};

export default WaitForFetch;
