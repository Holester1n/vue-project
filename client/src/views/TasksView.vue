<script setup lang="ts">
import { ref } from 'vue'
import { useTaskStore } from '@/stores/tasks'
import {
  Priority,
  Status,
  PRIORITY_LABELS,
  STATUS_LABELS,
  PRIORITY_COLORS,
  STATUS_COLORS,
  type Task,
  type TaskDraft,
} from '@/types/task'
import TaskFormDialog from '@/components/TaskFormDialog.vue'

const store = useTaskStore()

const statusFilterOptions = [
  { value: 'all', title: 'Все статусы' },
  ...Object.values(Status).map((value) => ({ value, title: STATUS_LABELS[value] })),
]

const priorityFilterOptions = [
  { value: 'all', title: 'Все приоритеты' },
  ...Object.values(Priority).map((value) => ({ value, title: PRIORITY_LABELS[value] })),
]

const headers = [
  { title: 'Задача', key: 'title' },
  { title: 'Приоритет', key: 'priority', width: 140 },
  { title: 'Статус', key: 'status', width: 160 },
  { title: '', key: 'actions', width: 120, sortable: false },
] as const

const dialogOpen = ref(false)
const editingTask = ref<Task | null>(null)
const snackbar = ref({ show: false, text: '' })

function openCreateDialog() {
  editingTask.value = null
  dialogOpen.value = true
}

function openEditDialog(task: Task) {
  editingTask.value = task
  dialogOpen.value = true
}

function handleSave(draft: TaskDraft) {
  if (editingTask.value) {
    store.updateTask(editingTask.value.id, draft)
    snackbar.value = { show: true, text: 'Задача обновлена' }
  } else {
    store.addTask(draft)
    snackbar.value = { show: true, text: 'Задача создана' }
  }
}

function handleRemove(task: Task) {
  store.removeTask(task.id)
  snackbar.value = { show: true, text: 'Задача удалена' }
}
</script>

<template>
  <div>
    <div class="d-flex flex-wrap align-center justify-space-between mb-4 ga-2">
      <h1 class="text-h5">Мои задачи</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
        Новая задача
      </v-btn>
    </div>

    <v-row class="mb-2" dense>
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="store.searchQuery"
          label="Поиск по названию"
          prepend-inner-icon="mdi-magnify"
          clearable
          density="comfortable"
          hide-details
        />
      </v-col>
      <v-col cols="6" sm="4">
        <v-select
          v-model="store.statusFilter"
          :items="statusFilterOptions"
          label="Статус"
          density="comfortable"
          hide-details
        />
      </v-col>
      <v-col cols="6" sm="4">
        <v-select
          v-model="store.priorityFilter"
          :items="priorityFilterOptions"
          label="Приоритет"
          density="comfortable"
          hide-details
        />
      </v-col>
    </v-row>

    <v-data-table
      :headers="[...headers]"
      :items="store.filteredTasks"
      item-value="id"
      no-data-text="Задач не найдено"
    >
      <template v-slot:[`item.title`]="{ item }">
        <div>
          <div :class="{ 'text-decoration-line-through text-medium-emphasis': item.status === 'done' }">
            {{ item.title }}
          </div>
          <div class="text-caption text-medium-emphasis">{{ item.description }}</div>
        </div>
      </template>

      <template v-slot:[`item.priority`]="{ item }">
        <v-chip :color="PRIORITY_COLORS[item.priority]" size="small" variant="flat">
          {{ PRIORITY_LABELS[item.priority] }}
        </v-chip>
      </template>

      <template v-slot:[`item.status`]="{ item }">
        <v-chip :color="STATUS_COLORS[item.status]" size="small" variant="tonal">
          {{ STATUS_LABELS[item.status] }}
        </v-chip>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          :icon="item.status === 'done' ? 'mdi-undo' : 'mdi-check'"
          variant="text"
          size="small"
          :title="item.status === 'done' ? 'Вернуть в работу' : 'Отметить готовой'"
          @click="store.toggleDone(item.id)"
        />
        <v-btn
          icon="mdi-pencil"
          variant="text"
          size="small"
          title="Редактировать"
          @click="openEditDialog(item)"
        />
        <v-btn
          icon="mdi-delete"
          variant="text"
          size="small"
          title="Удалить"
          @click="handleRemove(item)"
        />
      </template>
    </v-data-table>

    <TaskFormDialog v-model="dialogOpen" :editing-task="editingTask" @save="handleSave" />

    <v-snackbar v-model="snackbar.show" timeout="2000">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>
