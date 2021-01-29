// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "simple-import-sort"],
  rules: {
    // Make sure that all ts-ignore comments are given a description.
    "@typescript-eslint/ban-ts-comment": [
      "warn",
      {
        "ts-ignore": "allow-with-description",
      },
    ],
    // Make sure imports are organized
    "sort-imports": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    // React stuff
    "react/jsx-boolean-value": "error",
    "react/no-array-index-key": "error"
  },
};
