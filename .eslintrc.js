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
  overrides: [
    {
      plugins: ["react", "@typescript-eslint"],
      files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",

      rules: {
        "react/no-direct-mutation-state": [
          "error",
          {
            ignoreCallbacks: true,
            mutators: ["this.setState"],
          },
        ],
        "react/no-unescaped-entities": "off",
        "@next/next/no-page-custom-font": "off",
      },
    },
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
};
