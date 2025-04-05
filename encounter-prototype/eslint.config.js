/* eslint-disable sort-keys-fix/sort-keys-fix */
import harrisConfig from 'eslint-config-harris';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...harrisConfig,
  {
    ignores: ['src/database.types.ts', 'src/vite-env.d.ts'],
  },
  {
    rules: {
      'no-console': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    files: ['src/**'],
    languageOptions: {
      globals: globals.browser,
    },
  },
];

export default eslintConfig;
