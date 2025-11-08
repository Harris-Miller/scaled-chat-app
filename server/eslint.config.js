/* eslint-disable sort-keys-fix/sort-keys-fix */
import { defineConfig } from 'eslint/config';
import harrisConfigBase from 'eslint-config-harris/base';
import globals from 'eslint-config-harris/globals';

const eslintConfig = defineConfig([
  ...harrisConfigBase,
  {
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
        Bun: true,
      },
    },
  },
  {
    rules: {
      // general rules here
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
]);

export default eslintConfig;
