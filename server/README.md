# Task Tracker - backend

Минимальный демо-бэкенд на FastAPI. Данные хранятся в памяти процесса
(перезапуск сервера = сброс к начальным трём задачам).

Нужен для демонстрации связки **axios + hey-api**: hey-api смотрит
на `/openapi.json`, который FastAPI генерирует автоматически, и строит
по нему типизированный клиент для фронтенда.

## Запуск

```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

- Swagger UI: http://localhost:8000/docs
- OpenAPI JSON: http://localhost:8000/openapi.json

Убедись, что фронтенд (`npm run dev`) поднят на порту 5173 — именно
он разрешён в CORS (`main.py`, `allow_origins`).

## Обновление типов на фронтенде после изменений в бэкенде

1. Запустите сервер (см. выше)
2. Из корня фронтенда:
   ```bash
   curl http://localhost:8000/openapi.json -o server/openapi.json
   npm run api:generate
   ```
3. Готово — `src/api/generated/*` пересоздан под актуальную схему

## Эндпоинты

| Метод  | Путь              | Описание           |
|--------|-------------------|---------------------|
| GET    | /tasks            | список задач        |
| GET    | /tasks/{id}       | одна задача         |
| POST   | /tasks            | создать задачу      |
| PUT    | /tasks/{id}       | обновить задачу     |
| DELETE | /tasks/{id}       | удалить задачу      |
| GET    | /health           | проверка живости    |
