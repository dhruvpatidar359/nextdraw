const nextJest = require("next/jest");
/** @type {import('jest').Config} */
const config = {
  verbose: true,
};

module.exports = config;

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  preset: "ts-jest",
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
};

module.exports = createJestConfig(customJestConfig);
