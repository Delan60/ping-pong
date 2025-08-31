// Flat ESLint config
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  { ignores: ['dist', 'build', 'coverage', 'node_modules'] },
  // Plain JS config file should not use type-aware TS rules
  {
    files: ['eslint.config.js'],
    languageOptions: { parser: null },
    rules: {
      '@typescript-eslint/await-thenable': 'off'
    }
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2023,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y
    },
    rules: {
      'no-unused-vars': 'off', // handled by TS
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    },
    settings: { react: { version: 'detect' } }
  },
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'jsx-a11y/no-static-element-interactions': 'off', // iterative prototyping
      'jsx-a11y/click-events-have-key-events': 'off'
    }
  }
];
