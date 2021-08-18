const core = require("@actions/core");
const fs = require("fs").promises;

const semverRegex = /([0-9]+)\.([0-9]+)\.([0-9]+)(-[^+]+)?(\+.*)?$/;
const versionTagRegex = new RegExp(
    /^(?:v(?:er(?:s(?:ion)?)?)?\s*\.?\s*\/?\s*)?/.source + semverRegex.source,
    "i"
)

async function enter() {
    const version = await getVersionString();
    core.info(`Determined build version: ${version}`);
    core.setOutput("version", version);
}

async function getVersionString() {
    const packageData = JSON.parse(await fs.readFile("package.json", "utf-8"));
    const baseVersion = packageData.version;

    core.info(`Found base version ${baseVersion}`);

    const versionMatch = semverRegex.exec(baseVersion);
    if (!versionMatch) {
        throw new Error(`Version number did not patch semver: ${baseVersion}`);
    }
    const [major, minor, patch, preRelease, meta] = versionMatch;
    const nextPatch = parseInt(patch, 10) + 1;

    const ref = process.env.GITHUB_REF;
    const refMatch = /refs\/([^\/]+)\/(.*)/.exec(ref);
    if (!refMatch) {
        throw new Error(`GITHUB_REF did not match expected pattern: ${ref}`);
    }
    const [, refType, refName];

    if (refType === 'tags') {
        const tagVersionMatch = versionTagRegex.exec(refName);
        if (tagVersionMatch) {
            const tagVersionString = buildVersionFromMatch(tagVersionMatch)
            if (tagVersionString !== baseVersion) {
                throw new Error(`Your tag "${refName}" does not match the version in package.json: "${baseVersion}"`)
            }
            core.info(`Using version from tag: ${refName}`);
            return tagVersionString;
        }
    }
    else if (refType === "heads" && refName === "master") {
        core.info("Building dev version string for master branch");
        return buildVersionFromMatch([
            major,
            minor,
            nextPatch,
            `${preRelease ? `${preRelease}.` : '-'}dev.${process.env.GITHUB_RUN_NUMBER}`,
            meta
        ])
    } else {
        core.info("Building bleeding-edge version string for non-master branch");
        const bloodType = refType === "heads" ? "branch" : refType;
        return buildVersionFromMatch([
            major,
            minor,
            nextPatch,
            `${preRelease ? `${preRelease}.` : '-'}blood.${bloodType}-${slug}.${process.env.GITHUB_RUN_NUMBER}`,
            meta
        ])
    } else {
    }
}

function buildVersionFromMatch(match) {
    const [, major, minor, patch, preRelease, meta] = versionMatch;
    return `${major}.${minor}.${patch}${preRelease}${meta}`;
}

async function main() {
    try {
        await enter();
    } catch (error) {
        core.setFailed(error.message);
    }
}

main();
