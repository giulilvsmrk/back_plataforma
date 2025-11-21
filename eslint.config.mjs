// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginImport from 'eslint-plugin-import';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      import: eslintPluginImport,
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // ESTILO
      'camelcase': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',

      // CONVENCIONES DE NOMBRES
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeLike',
          format: ['PascalCase'],
          custom: {
            regex: '^[A-Z][a-zA-Z]*(Dto|Entity|Service|Controller|Module|Type|Interface|Util)?$',
            match: true,
          },
        },
        {
          selector: ['variable', 'function', 'parameter', 'objectLiteralProperty', 'classProperty'],
          format: ['camelCase', 'snake_case', 'PascalCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
          custom: {
            regex: '^(?:[a-z]+(?:[A-Z][a-zA-Z0-9]*)*|[a-z]+(?:_[a-z0-9]+)*|[A-Z][a-zA-Z0-9]*)$',
            match: true,
          },
        },
        {
          selector: 'variable',
          modifiers: ['const', 'global'],
          format: ['UPPER_CASE'],
          custom: {
            regex: '^[A-Z0-9_]+$',
            match: true,
          },
        },
      ],

      // MANTENIBILIDAD
      'complexity': ['error', 5],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],

      // SEGURIDAD / ESTRUCTURA
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

      // IMPORTACIONES
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
        },
      ],
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      // Desactivar reglas que no son críticas para los tests
      'max-lines-per-function': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
);