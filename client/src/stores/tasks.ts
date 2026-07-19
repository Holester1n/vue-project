import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { Priority, Status, type Task, type TaskDraft } from '@/types/task'

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

export const useTaskStore = defineStore(
  'tasks',
  () => {
    const tasks = ref<Task[]>(seedTasks())

    // --- фильтры (в persist не попадают, см. options ниже) ---
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

    // --- статистика (используется на StatsView) ---
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

    // Кол-во задач, созданных в каждый из последних 7 дней — для v-sparkline
    const last7DaysTrend = computed(() => {
      const days: number[] = []
      const dayMs = 24 * 60 * 60 * 1000
      const startOfToday = new Date().setHours(0, 0, 0, 0)

      for (let i = 6; i >= 0; i--) {
        const dayStart = startOfToday - i * dayMs
        const dayEnd = dayStart + dayMs
        const count = tasks.value.filter(
          (t) => t.createdAt >= dayStart && t.createdAt < dayEnd,
        ).length
        days.push(count)
      }
      return days
    })

    // --- CRUD ---
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
      last7DaysTrend,
      addTask,
      updateTask,
      removeTask,
      toggleDone,
    }
  },
  {
    // pinia-plugin-persistedstate: сохраняем только задачи,
    // фильтры/поиск сбрасываются при перезагрузке — так и должно быть
    persist: {
      key: 'task-tracker:tasks',
      pick: ['tasks'],
    },
  },
)
