<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listTasks, createTask, updateTask, deleteTask } from '@/api/generated/sdk.gen'
import type { Task, TaskCreate } from '@/api/generated/types.gen'

// Демо страница напрямую дергает бэкенд через axios (обёрнутый hey-api),
// в отличие от TasksView, который работает с локальным Pinia-стором.
// Это две разные модели данных для демонстрации разных подходов.

const tasks = ref<Task[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const newTask = ref<TaskCreate>({
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
})

async function loadTasks() {
  loading.value = true
  error.value = null
  try {
    const { data } = await listTasks()
    tasks.value = data ?? []
  } catch {
    error.value =
      'Не удалось получить задачи. Бэкенд запущен? (cd server && uvicorn main:app --port 8000)'
  } finally {
    loading.value = false
  }
}

async function handleCreate() {
  if (!newTask.value.title.trim()) return
  try {
    await createTask({ body: newTask.value })
    newTask.value = { title: '', description: '', priority: 'medium', status: 'todo' }
    await loadTasks()
  } catch {
    error.value = 'Не удалось создать задачу'
  }
}

async function handleToggleStatus(task: Task) {
  const nextStatus = task.status === 'done' ? 'todo' : 'done'
  try {
    await updateTask({
      path: { task_id: task.id },
      body: {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: nextStatus,
      },
    })
    await loadTasks()
  } catch {
    error.value = 'Не удалось обновить задачу'
  }
}

async function handleDelete(task: Task) {
  try {
    await deleteTask({ path: { task_id: task.id } })
    await loadTasks()
  } catch {
    error.value = 'Не удалось удалить задачу'
  }
}

onMounted(loadTasks)
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="text-h5">Backend Demo (axios + hey-api)</h1>
      <v-btn variant="tonal" prepend-icon="mdi-refresh" :loading="loading" @click="loadTasks">
        Обновить
      </v-btn>
    </div>

    <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable @click:close="error = null">
      {{ error }}
    </v-alert>

    <v-card class="mb-6">
      <v-card-title>Новая задача (POST /tasks)</v-card-title>
      <v-card-text>
        <v-form class="d-flex flex-wrap ga-3 align-center" @submit.prevent="handleCreate">
          <v-text-field
            v-model="newTask.title"
            label="Название"
            density="comfortable"
            hide-details
            style="min-width: 220px"
          />
          <v-select
            v-model="newTask.priority"
            :items="[
              { value: 'low', title: 'Низкий' },
              { value: 'medium', title: 'Средний' },
              { value: 'high', title: 'Высокий' },
            ]"
            label="Приоритет"
            density="comfortable"
            hide-details
            style="min-width: 160px"
          />
          <v-btn color="primary" type="submit">Создать</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <v-list lines="two">
      <v-list-item v-for="task in tasks" :key="task.id">
        <template #prepend>
          <v-checkbox-btn
            :model-value="task.status === 'done'"
            @update:model-value="handleToggleStatus(task)"
          />
        </template>

        <v-list-item-title :class="{ 'text-decoration-line-through': task.status === 'done' }">
          {{ task.title }}
        </v-list-item-title>
        <v-list-item-subtitle>{{ task.description || '—' }}</v-list-item-subtitle>

        <template #append>
          <v-chip size="small" class="mr-2">{{ task.priority }}</v-chip>
          <v-btn icon="mdi-delete" variant="text" size="small" @click="handleDelete(task)" />
        </template>
      </v-list-item>

      <v-list-item v-if="!loading && tasks.length === 0">
        <v-list-item-title class="text-medium-emphasis">Задач пока нет</v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>
