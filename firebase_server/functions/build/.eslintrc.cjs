"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [],
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  rules: {
    // "quotes": ["error", "double"],
    'import/no-unresolved': 0,
    // "indent": ["error", 2],
    'indent': [2, 'tab'],
    'no-tabs': 0,
    'linebreak-style': 0,
    'no-trailing-spaces': 0,
    'require-jsdoc': 0,
  },
};
