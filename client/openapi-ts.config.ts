import { defineConfig } from '@hey-api/openapi-ts'

// Источник схемы — локальный openapi.json из ./server (см. server/README.md).
// Чтобы обновить схему после изменений в бэкенде:
//   1. запустите сервер: uvicorn main:app --port 8000 (из папки server/)
//   2. curl http://localhost:8000/openapi.json -o server/openapi.json
//   3. npm run api:generate
export default defineConfig({
  input: '../server/openapi.json',
  output: 'src/api/generated',
  plugins: ['@hey-api/client-axios', '@hey-api/typescript', '@hey-api/sdk'],
})
