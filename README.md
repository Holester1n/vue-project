# Task Tracker

Небольшое демонстрационное приложение - трекер задач. Проект показывает связку:

- **Vue 3** (`<script setup>`, Composition API)
- **TypeScript** (строгая типизация, `as const` вместо enum для erasable-синтаксиса)
- **Pinia** - стор задач: CRUD, фильтры, персист в `localStorage`
- **Vuetify 3** - data-table, диалоги, форма с валидацией, тема (свет/тьма)
- **vue-router** - две вьюхи: список задач и статистика
- **ESLint** (flat config, `eslint-plugin-vue` + `typescript-eslint`)
- **vue-tsc** - проверка типов
- **Vite** - сборка и dev-сервер
- **GitHub Actions** - CI: lint → type-check → build на каждый push/PR в `main`; CD - деплой на GitHub Pages при пуше в `main`
- **axios + hey-api** - типизированный клиент, сгенерированный из OpenAPI-схемы своего FastAPI-бэкенда (`server/`)
- **pinia-plugin-persistedstate** - автосохранение стора задач в `localStorage`
- **Chart.js / v-sparkline** - два способа визуализации статистики

## Запуск

```bash
npm install
npm run dev          # dev-сервер
npm run lint         # ESLint
npm run type-check   # проверка типов (vue-tsc)
npm run build        # прод-сборка
npm run api:generate # перегенерировать типы из server/openapi.json
```

Для страницы **Backend Demo** дополнительно нужен запущенный бэкенд -
см. `server/README.md`.

## Структура
```
vue-project/
  client/                    # фронтенд (см. шаги выше)
    src/
      types/task.ts            # доменные типы (Task, Priority, Status)
      stores/tasks.ts           # Pinia store: CRUD, фильтры, persist-плагин
      api/
        generated/               # сгенерировано hey-api, не редактировать руками
        client.ts                # настройка baseURL сгенерированного клиента
      components/
        TaskFormDialog.vue       # диалог создания/редактирования задачи
        PriorityDoughnutChart.vue  # график Chart.js
      views/
        TasksView.vue            # список задач + фильтры + таблица (локальный стор)
        StatsView.vue             # агрегированная статистика + графики
        BackendDemoView.vue        # CRUD напрямую через axios/hey-api к своему бэкенду
      router/index.ts            # маршруты
      plugins/vuetify.ts          # инициализация Vuetify
    openapi-ts.config.ts       # конфиг генерации типов из OpenAPI (../server/openapi.json)
    package.json
    vite.config.ts

  server/                    # FastAPI-бэкенд для Backend Demo (см. server/README.md)
    main.py
    openapi.json
    requirements.txt

  .github/workflows/ci.yml  # CI/CD pipeline
  ```