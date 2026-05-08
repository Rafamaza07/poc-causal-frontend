import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
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
      // Ignorar vars y args con nombre PascalCase/uppercase (componentes React, destructuring de props)
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^[A-Z_]',
        caughtErrorsIgnorePattern: '^[A-Z_]',
      }],
      // Patrón async loader (useEffect(() => { fetchData() }, [fetchData])) genera
      // falsos positivos porque el linter no traza setState dentro de funciones async.
      // Se mantiene como warn para visibilidad sin bloquear el build.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  // Service workers tienen globals propios (clients, self, caches…)
  {
    files: ['public/sw.js'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.serviceworker },
    },
  },
])
