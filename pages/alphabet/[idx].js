import { withRouter } from "next/router";
import React from "react";
import WaitForFetch from "../../components/WaitForFetch";

const AlphabetAtIdx = withRouter(({ router }) => {
  const renderFunc = useCallback((data) => <p>{data}</p>);
  return (
    <>
      <h1>{router.query.idx}</h1>
      <WaitForFetch url={`/api/alphabet/${router.query.idx - 1}`}>
        {renderFunc}
      </WaitForFetch>
    </>
  );
});
export default AlphabetAtIdx;
