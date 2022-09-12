import React from "react";
import WaitForFetch from "../../components/WaitForFetch";

const Alphabet = () => {
  const renderFunc = useCallback((data) => <p>data</p>);
  return <WaitForFetch url="/api/alphabet">{renderFunc}</WaitForFetch>;
};
export default Alphabet;
