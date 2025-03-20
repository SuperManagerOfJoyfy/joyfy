import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      prettier: require("eslint-plugin-prettier"), // Плагин для Prettier
    },
    rules: {
      "prettier/prettier": "error", // Ошибки при нарушении правил Prettier
      "quotes": ["error", "single"], // Использовать одинарные кавычки
      "indent": ["error", 2], // Отступы в 2 пробела
    },
    languageOptions: {
      sourceType: "module", // Использовать модули (import/export)
      ecmaVersion: "latest", // Использовать последнюю версию ECMAScript
    },
  },

];