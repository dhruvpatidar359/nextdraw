const nextJest = require("next/jest");
/** @type {import('jest').Config} */
const config = {
  verbose: true,
};

module.exports = config;

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  preset: "ts-jest",
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
};

module.exports = createJestConfig(customJestConfig);
