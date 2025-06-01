//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    ignores: [
      'src/shared/api/schema/generated.ts',
      'eslint.config.js',
      'prettier.config.js',
      'vite.config.js',
    ],
  },
  {
    files: ['./src/*.ts', './src/*.tsx'],
  },
]
