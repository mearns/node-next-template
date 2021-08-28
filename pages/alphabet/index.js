import React from "react";
import WaitForFetch from "../../components/WaitForFetch";

const Alphabet = () => {
  return (
    <WaitForFetch url="/api/alphabet">{(data) => <p>{data}</p>}</WaitForFetch>
  );
};
export default Alphabet;
