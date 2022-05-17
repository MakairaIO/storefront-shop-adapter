module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier",
  ],
  plugins: ["@typescript-eslint", "jest"],
  parser: "@typescript-eslint/parser",
  settings: {
    version: ">17",
  },
  env: {
    node: true,
    browser: true,
    es6: true,
    jest: true,
  },
};
