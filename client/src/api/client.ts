import { client } from '@/api/generated/client.gen'

// Настраиваем базовый URL сгенерированного axios-клиента.
// В генерируемые файлы (client.gen.ts и т.д.) руками лезть не нужно —
// hey-api перезапишет их при следующей генерации.
client.setConfig({
  baseURL: 'http://localhost:8000',
})

export { client }
