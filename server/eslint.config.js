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
      'no-console': 'off',
      // 'func-names': ['error', 'as-needed'], // I think this is weird with generators, need to double check
      // '@typescript-eslint/explicit-module-boundary-types': 'off',
      // '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    ignores: ['node_modules/'],
  },
];

export default eslintConfig;
