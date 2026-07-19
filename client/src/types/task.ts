export const Priority = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
} as const
export type Priority = (typeof Priority)[keyof typeof Priority]

export const Status = {
  Todo: 'todo',
  InProgress: 'in_progress',
  Done: 'done',
} as const
export type Status = (typeof Status)[keyof typeof Status]

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  status: Status
  createdAt: number
}

// Форма создания/редактирования — без служебных полей id/createdAt
export type TaskDraft = Pick<Task, 'title' | 'description' | 'priority' | 'status'>

export const PRIORITY_LABELS: Record<Priority, string> = {
  [Priority.Low]: 'Низкий',
  [Priority.Medium]: 'Средний',
  [Priority.High]: 'Высокий',
}

export const STATUS_LABELS: Record<Status, string> = {
  [Status.Todo]: 'К выполнению',
  [Status.InProgress]: 'В работе',
  [Status.Done]: 'Готово',
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.Low]: 'success',
  [Priority.Medium]: 'warning',
  [Priority.High]: 'error',
}

export const STATUS_COLORS: Record<Status, string> = {
  [Status.Todo]: 'grey',
  [Status.InProgress]: 'blue',
  [Status.Done]: 'green',
}
