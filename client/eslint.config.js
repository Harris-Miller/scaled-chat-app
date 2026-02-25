import { defineConfig } from 'eslint/config';
import harrisConfig from 'eslint-config-harris';
import globals from 'eslint-config-harris/globals';

const eslintConfig = defineConfig([
  ...harrisConfig,
  {
    ignores: ['node_modules/', 'src/database.types.ts', 'src/vite-env.d.ts'],
  },
  {
    files: ['*.js', '*.ts'],
    languageOptions: {
      globals: globals.nodeBuiltin,
    },
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
    files: ['**/*.ts', '**/*.mts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.app.json', 'tsconfig.node.json'],
      },
    },
  },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    rules: {
      // too strict for a front-end project
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
]);

export default eslintConfig;
