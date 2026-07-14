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
- **GitHub Actions** - CI: lint → type-check → build на каждый push/PR в `main`

## Запуск

```bash
npm install
npm run dev          # dev-сервер
npm run lint         # ESLint
npm run type-check   # проверка типов (vue-tsc)
npm run build        # прод-сборка
```

## Структура

```
src/
  types/task.ts         # доменные типы (Task, Priority, Status)
  stores/tasks.ts        # Pinia store: CRUD, фильтры, localStorage
  components/
    TaskFormDialog.vue   # диалог создания/редактирования задачи
  views/
    TasksView.vue        # список задач + фильтры + таблица
    StatsView.vue         # агрегированная статистика
  router/index.ts        # маршруты
  plugins/vuetify.ts      # инициализация Vuetify
.github/workflows/ci.yml  # CI pipeline
```
