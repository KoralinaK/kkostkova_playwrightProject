eslint.config.mjs;
// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import playwright from "eslint-plugin-playwright";

export default [
  // Obecná pravidla pro JS/TS
  ...tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strict,
    prettier
  ),

  // Specifická pravidla pro Playwright testy
  {
    ...playwright.configs["flat/recommended"],
    files: ["tests/**/*.ts", "tests/**/*.js"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      // Tady můžeš upravit nebo vypnout konkrétní pravidla, např.:
      // "playwright/no-wait-for-timeout": "off"
    },
  },
  {
    ignores: [
      "*/tests-examples/*",
      "*/playwright-report/*",
      "*/node_modules/*",
      "*/dist/*",
      "*/build/*",
      "*/coverage/*",
      "*/report/*",
      "*/.config.js",
      "*/.config.cjs",
      "*/.config.mjs",
      "*/.d.ts",
    ],
  },
];
