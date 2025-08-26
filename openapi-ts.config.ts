import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: 'http://localhost:5000/openapi/v1.json',
  output: {
    format: 'prettier',
    lint: 'eslint',
    path: './src/api',
  },

  parser: {
    transforms: {
      enums: {
        enabled: true,
        mode: 'root',
        case: 'camelCase',
      },
    },
  },
  plugins: [
    {
      name: '@hey-api/client-axios',
      runtimeConfigPath: './src/lib/request.ts',
      throwOnError: true,
    },
  ],

})