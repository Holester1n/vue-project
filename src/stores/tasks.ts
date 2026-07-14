import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { Priority, Status, type Task, type TaskDraft } from '@/types/task'

const STORAGE_KEY = 'task-tracker:tasks'

function loadFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedTasks()
    const parsed = JSON.parse(raw) as Task[]
    return Array.isArray(parsed) ? parsed : seedTasks()
  } catch {
    return seedTasks()
  }
}

function seedTasks(): Task[] {
  const now = Date.now()
  return [
    {
      id: crypto.randomUUID(),
      title: 'Настроить окружение проекта',
      description: 'Vite + Vue 3 + TS + Vuetify + Pinia',
      priority: Priority.High,
      status: Status.Done,
      createdAt: now - 3 * 24 * 60 * 60 * 1000,
    },
    {
      id: crypto.randomUUID(),
      title: 'Сверстать список задач',
      description: 'Таблица с фильтрами по статусу и приоритету',
      priority: Priority.Medium,
      status: Status.InProgress,
      createdAt: now - 1 * 24 * 60 * 60 * 1000,
    },
    {
      id: crypto.randomUUID(),
      title: 'Написать CI-пайплайн',
      description: 'Lint, type-check и build в GitHub Actions',
      priority: Priority.Low,
      status: Status.Todo,
      createdAt: now,
    },
  ]
}

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>(loadFromStorage())

  watch(
    tasks,
    (value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true },
  )

  const statusFilter = ref<Status | 'all'>('all')
  const priorityFilter = ref<Priority | 'all'>('all')
  const searchQuery = ref('')

  const filteredTasks = computed(() => {
    return tasks.value
      .filter((t) => statusFilter.value === 'all' || t.status === statusFilter.value)
      .filter((t) => priorityFilter.value === 'all' || t.priority === priorityFilter.value)
      .filter((t) =>
        searchQuery.value.trim()
          ? t.title.toLowerCase().includes(searchQuery.value.trim().toLowerCase())
          : true,
      )
      .sort((a, b) => b.createdAt - a.createdAt)
  })

  const total = computed(() => tasks.value.length)
  const doneCount = computed(() => tasks.value.filter((t) => t.status === Status.Done).length)
  const inProgressCount = computed(
    () => tasks.value.filter((t) => t.status === Status.InProgress).length,
  )
  const todoCount = computed(() => tasks.value.filter((t) => t.status === Status.Todo).length)
  const completionRate = computed(() =>
    total.value === 0 ? 0 : Math.round((doneCount.value / total.value) * 100),
  )
  const countByPriority = computed(() => ({
    [Priority.High]: tasks.value.filter((t) => t.priority === Priority.High).length,
    [Priority.Medium]: tasks.value.filter((t) => t.priority === Priority.Medium).length,
    [Priority.Low]: tasks.value.filter((t) => t.priority === Priority.Low).length,
  }))

  function addTask(draft: TaskDraft) {
    tasks.value.push({
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ...draft,
    })
  }

  function updateTask(id: string, draft: TaskDraft) {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return
    Object.assign(task, draft)
  }

  function removeTask(id: string) {
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  function toggleDone(id: string) {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return
    task.status = task.status === Status.Done ? Status.Todo : Status.Done
  }

  return {
    tasks,
    filteredTasks,
    statusFilter,
    priorityFilter,
    searchQuery,
    total,
    doneCount,
    inProgressCount,
    todoCount,
    completionRate,
    countByPriority,
    addTask,
    updateTask,
    removeTask,
    toggleDone,
  }
})
