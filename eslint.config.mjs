// eslint.config.mjs
import { next } from '@next/eslint-plugin-next';
import prettier from 'eslint-plugin-prettier';
import eslintRecommended from '@eslint/js';
import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import nextPlugin from '@next/eslint-plugin-next';

export default eslintConfig = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      ...eslintRecommended.configs.recommended.rules,
      ...next.configs.recommended.rules,
      ...js.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'react/react-in-jsx-scope': 'off', // Not needed for Next.js
    },
  },
];
