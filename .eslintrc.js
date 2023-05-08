module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "quote-props": "off",
    "linebreak-style": "off",
    quotes: ["error", "double"],
    "max-len": "off",
    "no-trailing-spaces": "off",
    camelcase: "off",
    "object-curly-spacing": "off",
    "eol-last": "warn",
    indent: "off",
    semi: "off",
    "import/no-unresolved": 0,
  },
}
