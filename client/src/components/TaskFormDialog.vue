<script setup lang="ts">
import { reactive, watch } from 'vue'
import {
  Priority,
  Status,
  PRIORITY_LABELS,
  STATUS_LABELS,
  type Task,
  type TaskDraft,
} from '@/types/task'

const props = defineProps<{
  modelValue: boolean
  editingTask: Task | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [draft: TaskDraft]
}>()

const priorityOptions = Object.values(Priority).map((value) => ({
  value,
  title: PRIORITY_LABELS[value],
}))

const statusOptions = Object.values(Status).map((value) => ({
  value,
  title: STATUS_LABELS[value],
}))

function emptyDraft(): TaskDraft {
  return {
    title: '',
    description: '',
    priority: Priority.Medium,
    status: Status.Todo,
  }
}

const form = reactive<TaskDraft>(emptyDraft())
const titleRules = [(v: string) => !!v.trim() || 'Название обязательно']

// При открытии диалога — подставляем данные редактируемой задачи либо сбрасываем форму
watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) return
    const source = props.editingTask ?? emptyDraft()
    form.title = source.title
    form.description = source.description
    form.priority = source.priority
    form.status = source.status
  },
)

function close() {
  emit('update:modelValue', false)
}

function handleSave() {
  if (!form.title.trim()) return
  emit('save', { ...form, title: form.title.trim() })
  close()
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="520"
    @update:model-value="(v) => emit('update:modelValue', v)"
  >
    <v-card :title="editingTask ? 'Редактировать задачу' : 'Новая задача'">
      <v-card-text>
        <v-form @submit.prevent="handleSave">
          <v-text-field
            v-model="form.title"
            label="Название"
            :rules="titleRules"
            autofocus
            class="mb-2"
          />
          <v-textarea
            v-model="form.description"
            label="Описание"
            rows="3"
            auto-grow
            class="mb-2"
          />
          <v-select
            v-model="form.priority"
            :items="priorityOptions"
            label="Приоритет"
            class="mb-2"
          />
          <v-select v-model="form.status" :items="statusOptions" label="Статус" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="close">Отмена</v-btn>
        <v-btn color="primary" variant="flat" @click="handleSave">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
