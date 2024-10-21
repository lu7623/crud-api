const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const globals = require('globals');

module.exports = [
  {
    ignores: ['dist/**/*'],
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    ignores: ['dist/**/*'],
    settings: {
      version: 'detect',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptParser,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      'comma-dangle': ['error', 'only-multiline'],
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-var-requires': 'off',
      'no-console': 'error',
    },
  },
];
