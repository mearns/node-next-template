import React, { useCallback } from "react";
import WaitForFetch from "../components/WaitForFetch";

const About = () => {
  const renderFunc = useCallback((data) => (
    <pre>{data && JSON.stringify(data, null, 4)}</pre>
  ));
  return <WaitForFetch url="/api/app-info">{renderFunc}</WaitForFetch>;
};
export default About;
