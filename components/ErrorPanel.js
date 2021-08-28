const ErrorPanel = ({ error }) => {
  if (process.env.NODE_ENV === "development") {
    const details =
      error.stack +
      "\n" +
      Object.entries(error)
        .map(([k, v]) => `  ${k}: ${JSON.stringify(v)}`)
        .join("\n");
    return (
      <>
        <p>Error</p>
        <pre>{details}</pre>
      </>
    );
  }
  return <p>Error: {error.message}</p>;
};

export default ErrorPanel;
