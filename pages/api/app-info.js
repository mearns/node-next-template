import packageData from "../../package.json";

export default (req, res) => {
    res.status(200).json({
        name: packageData.name,
        version: packageData.version,
        buildInfo: packageData.buildInfo
    });
};
