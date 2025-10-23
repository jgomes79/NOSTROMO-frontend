/* eslint-disable @typescript-eslint/no-var-requires */
const imports = require("./config/eslint/imports.cjs");
const react = require("./config/eslint/react-ts.cjs");
const typescript = require("./config/eslint/typescript.cjs");

module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
    ...imports.env,
    ...typescript.env,
    ...react.env,
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@tanstack/eslint-plugin-query/recommended",
  ],
  ignorePatterns: ["dist"],
  plugins: [...typescript.plugins, ...react.plugins, "react-refresh"],
  rules: {
    ...typescript.rules,
    ...react.rules,
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/naming-convention": "off",
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
  },
  settings: {
    ...react.settings,
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
    },
  },
  overrides: [...typescript.overrides],
};
