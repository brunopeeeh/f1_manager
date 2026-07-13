import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'Math',
          property: 'random',
          message: 'Use o RNG com seed injetável de src/engine/rng.ts.',
        },
      ],
    },
  },
  {
    files: ['src/engine/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'A engine é TypeScript puro: proibido importar React.' },
            { name: 'react-dom', message: 'A engine é TypeScript puro: proibido importar React.' },
            { name: 'zustand', message: 'A engine é TypeScript puro: proibido importar Zustand.' },
          ],
          patterns: [
            {
              group: ['react*', 'zustand*', '**/ui/*', '../ui/*'],
              message: 'A engine não pode depender de UI ou de bibliotecas de estado.',
            },
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'window', message: 'A engine é TypeScript puro: proibido acessar window.' },
        { name: 'document', message: 'A engine é TypeScript puro: proibido acessar o DOM.' },
        {
          name: 'localStorage',
          message: 'Persistência vive na UI (src/ui/store.ts): proibido localStorage na engine.',
        },
        {
          name: 'sessionStorage',
          message: 'Persistência vive na UI (src/ui/store.ts): proibido sessionStorage na engine.',
        },
      ],
    },
  },
  prettier,
);
