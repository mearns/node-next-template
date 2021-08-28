import { withRouter } from "next/router";
import React from "react";
import WaitForFetch from "../../components/WaitForFetch";

const AlphabetAtIdx = withRouter(({ router }) => {
  return (
    <>
      <h1>{router.query.idx}</h1>
      <WaitForFetch url={`/api/alphabet/${router.query.idx - 1}`}>
        {(data) => <p>{data}</p>}
      </WaitForFetch>
    </>
  );
});
export default AlphabetAtIdx;
