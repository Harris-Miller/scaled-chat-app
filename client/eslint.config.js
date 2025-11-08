import { defineConfig } from 'eslint/config';
import harrisConfig from 'eslint-config-harris';
import globals from 'eslint-config-harris/globals';

const eslintConfig = defineConfig([
  ...harrisConfig,
  {
    ignores: ['node_modules/', 'src/database.types.ts', 'src/vite-env.d.ts'],
  },
  {
    files: ['src/**'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    rules: {
      'no-console': 'off',
      'prefer-arrow/prefer-arrow-functions': 'off',
    },
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      // remove once consume next eslint-config-harris
      '@typescript-eslint/switch-exhaustiveness-check': ['error', { requireDefaultForNonUnion: true }],
    },
  },
]);

export default eslintConfig;
