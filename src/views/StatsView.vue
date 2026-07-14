<script setup lang="ts">
import { useTaskStore } from '@/stores/tasks'
import { Priority, PRIORITY_LABELS, PRIORITY_COLORS } from '@/types/task'

const store = useTaskStore()

const priorityOrder = [Priority.High, Priority.Medium, Priority.Low]
</script>

<template>
  <div>
    <h1 class="text-h5 mb-4">Статистика</h1>

    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card variant="tonal" color="primary">
          <v-card-text class="text-center">
            <div class="text-h4">{{ store.total }}</div>
            <div class="text-caption">Всего задач</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card variant="tonal" color="grey">
          <v-card-text class="text-center">
            <div class="text-h4">{{ store.todoCount }}</div>
            <div class="text-caption">К выполнению</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card variant="tonal" color="blue">
          <v-card-text class="text-center">
            <div class="text-h4">{{ store.inProgressCount }}</div>
            <div class="text-caption">В работе</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card variant="tonal" color="green">
          <v-card-text class="text-center">
            <div class="text-h4">{{ store.doneCount }}</div>
            <div class="text-caption">Готово</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mt-6">
      <v-card-title>Прогресс выполнения</v-card-title>
      <v-card-text>
        <v-progress-linear
          :model-value="store.completionRate"
          height="24"
          color="green"
          rounded
        >
          <template #default>
            <strong>{{ store.completionRate }}%</strong>
          </template>
        </v-progress-linear>
      </v-card-text>
    </v-card>

    <v-card class="mt-6">
      <v-card-title>По приоритету</v-card-title>
      <v-card-text>
        <div
          v-for="priority in priorityOrder"
          :key="priority"
          class="d-flex align-center mb-3"
        >
          <v-chip :color="PRIORITY_COLORS[priority]" size="small" variant="flat" class="mr-3" style="width: 100px">
            {{ PRIORITY_LABELS[priority] }}
          </v-chip>
          <v-progress-linear
            :model-value="store.total ? (store.countByPriority[priority] / store.total) * 100 : 0"
            :color="PRIORITY_COLORS[priority]"
            height="12"
            rounded
            class="flex-grow-1 mr-3"
          />
          <span class="text-body-2" style="min-width: 24px">{{ store.countByPriority[priority] }}</span>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
