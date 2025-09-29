import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier'
import eslintConfigNext from 'eslint-config-next'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintConfigNext, // Добавляем конфиг Next.js
  {
    plugins: {
      prettier: prettierPlugin, // Плагин для Prettier
    },
    rules: {
      'prettier/prettier': 'error', // Ошибки при нарушении правил Prettier
      quotes: ['error', 'single'], // Одинарные кавычки
      indent: ['error', 2], // Отступы в 2 пробела
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off', // Отключаем правило для апострофов и кавычек
    },
    languageOptions: {
      sourceType: 'module', // Использовать модули (import/export)
      ecmaVersion: 'latest', // Последняя версия ECMAScript
    },
    settings: {
      react: {
        version: 'detect', // Автоматическое определение версии React
      },
    },
  },
]
