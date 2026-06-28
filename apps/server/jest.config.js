const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  transformIgnorePatterns: [
    "node_modules/(?!@octokit|universal-github-app-jwt|node-fetch|data-uri-to-buffer|fetch-blob|formdata-polyfill)"
  ]
};