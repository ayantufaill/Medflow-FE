import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import medflowDates from './eslint-rules/no-host-dates.js'

export default defineConfig([
  globalIgnores(['dist', '.claude/worktrees']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Clinic datetimes are pseudo-instants (UTC wall-clock == clinic
      // wall-clock), so formatting them in the host's local zone makes a
      // clinic's schedule shift by a day depending on where it is viewed.
      // `warn` while the codebase is migrated; flipped to `error` in Phase 3.
      'medflow-dates/no-host-dates': 'warn',
    },
    plugins: {
      'medflow-dates': medflowDates,
    },
  },
  // Test files run under Jest (see jest.config.cjs), so describe/it/expect/jest
  // are globals and the files are CommonJS-transformed — without this every
  // assertion reads as `no-undef`.
  {
    files: [
      '**/*.test.{js,jsx}',
      '**/*.spec.{js,jsx}',
      '**/__tests__/**/*.{js,jsx}',
    ],
    languageOptions: {
      globals: { ...globals.jest, ...globals.node },
    },
    rules: {
      // A test file exporting fixtures alongside a render helper is fine; fast
      // refresh never sees them.
      'react-refresh/only-export-components': 'off',
    },
  },
])
