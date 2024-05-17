module.exports = {
  root: true,
  ignorePatterns: ["node_modules/**", "dist/**"],
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "next",
    "prettier",
  ],
  overrides : [
  { plugins: ["react", "@typescript-eslint"],
  files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
  parser: "@typescript-eslint/parser",

 
  rules: {
    "react/no-direct-mutation-state": [
      "error", // Keep the default as error
      {
        ignoreCallbacks: true, // Allow mutation within callbacks (optional)
        mutators: ["this.setState"], // Allow mutation using this.setState (optional)
      },
    ],
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off",
  },}],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
};
// eslint-disable-next-line no-undef