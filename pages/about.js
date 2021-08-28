import React from "react";
import WaitForFetch from "../components/WaitForFetch";

const About = () => {
  return (
    <WaitForFetch url="/api/app-info">
      {(data) => <pre>{JSON.stringify(data, null, 4)}</pre>}
    </WaitForFetch>
  );
};
export default About;
