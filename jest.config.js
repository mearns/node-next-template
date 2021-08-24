module.exports = {
  roots: ["test/unit"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  collectCoverageFrom: [
    "lib/**/*.js",
    "lib/**/*.ts",
    "components/**/*.js",
    "components/**/*.ts",
    "pages/**/*.js",
    "pages/**/*.ts",
    "test/test-utils/**/*.js",
    "test/test-utils/**/*.ts",
  ],
  coverageDirectory: "reports/coverage/",
  coverageReporters: ["json", "lcov", "text", "clover", "cobertura"],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "reports",
        outputName: "xunit.xml",
      },
    ],
    [
      "jest-stare",
      {
        resultDir: "reports/unit-tests/",
        resultHtml: "index.html",
        resultJson: "data.json",
        report: true,
        reportSummary: true,
        coverageLink: "../coverage/lcov-report/index.html",
      },
    ],
  ],
};
