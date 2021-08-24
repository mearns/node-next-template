import Header from "../components/Header";
import React from "react";
import axios from "axios";

const About = () => {
  const [appInfo, setAppInfoResp] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get("/api/app-info");
        setAppInfoResp({ data: resp.data });
      } catch (error) {
        console.error("Error fetching app-info:", error);
        setAppInfoResp({ error });
      }
    })();
  });
  return (
    <div>
      <Header />
      <p>
        {appInfo ? (
          appInfo.error ? (
            <p>An Error occurred fetching app-info</p>
          ) : (
            <pre>{JSON.stringify(appInfo.data, null, 4)}</pre>
          )
        ) : (
          "Loading..."
        )}
      </p>
    </div>
  );
};
export default About;
