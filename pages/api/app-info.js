import packageData from "../../package.json";

const handler = (req, res) => {
  res.status(200).json({
    name: packageData.name,
    version: packageData.version,
    buildInfo: packageData.buildInfo,
  });
};
export default handler;
