import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import astroEslintPlugin from 'eslint-plugin-astro'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astroEslintPlugin.configs.recommended,
  {
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // General rules
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',

      // Whitespace and formatting rules
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'eol-last': 'error',
      'semi': ['error', 'never'],
    },
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.astro/**',
      'public/**',
      '.vercel/**',
    ],
  },
]
