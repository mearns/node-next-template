/**
 * In dev mode, the nextjs router query sometimes comes back empty at first, we need to wait for it
 * to actually be populated before we can continue.
 */
import ErrorPanel from "./ErrorPanel";
import Loading from "./Loading";
import useRenderer from "../lib/use-renderer";

const WaitForReady = ({
  ready,
  error = null,
  data,
  quiet = false,
  loading = <Loading />,
  errorDisplay = (error) => <ErrorPanel error={error} />,
  children,
}) => {
  const render = useRenderer(children);

  const renderErrorDisplay = useRenderer(errorDisplay);
  const renderLoading = useRenderer(loading);

  if (error && !quiet) {
    return renderErrorDisplay(error);
  } else if (ready) {
    return render(data);
  } else if (!quiet) {
    return renderLoading();
  } else {
    return null;
  }
};

export default WaitForReady;
