/* eslint-disable sort-keys-fix/sort-keys-fix */
import { defineConfig, globalIgnores } from 'eslint/config';
import harrisConfigBase from 'eslint-config-harris/base';
import globals from 'globals';

const eslintConfig = defineConfig([
  ...harrisConfigBase,
  globalIgnores(['dist']),
  {
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
      },
    },
  },
  {
    rules: {
      'func-names': 'off',
      'no-console': 'off',
      'no-param-reassign': 'off',
      'prefer-arrow/prefer-arrow-functions': 'off',
      // 'func-names': ['error', 'as-needed'], // I think this is weird with generators, need to double check
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // remove once consume next eslint-config-harris
      '@typescript-eslint/switch-exhaustiveness-check': ['error', { requireDefaultForNonUnion: true }],
    },
  },
]);

export default eslintConfig;
