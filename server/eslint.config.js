/* eslint-disable sort-keys-fix/sort-keys-fix */
import harrisConfigBase from 'eslint-config-harris/base';
import globals from 'globals';

/** @type {import('./$node_modules/eslint/lib/types/index.js').Linter.Config[]} */
const eslintConfig = [
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
  {
    ignores: ['node_modules/'],
  },
];

export default eslintConfig;
