<script setup lang="ts">
import { useTaskStore } from '@/stores/tasks'
import { Priority, PRIORITY_LABELS, PRIORITY_COLORS } from '@/types/task'
import PriorityDoughnutChart from '@/components/PriorityDoughnutChart.vue'

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

    <!-- v-sparkline: лёгкий вариант, без сторонних библиотек -->
    <v-card class="mt-6">
      <v-card-title>Новые задачи за 7 дней</v-card-title>
      <v-card-text>
        <v-sparkline
          :model-value="store.last7DaysTrend"
          color="primary"
          line-width="2"
          padding="12"
          smooth
          auto-draw
        >
          <template #label="{ value }">{{ value }}</template>
        </v-sparkline>
      </v-card-text>
    </v-card>

    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <!-- Chart.js: больше возможностей, чем у sparkline (легенда, тултипы, типы графиков) -->
        <v-card>
          <v-card-title>Приоритеты (Chart.js)</v-card-title>
          <v-card-text>
            <PriorityDoughnutChart :counts="store.countByPriority" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Приоритеты (список)</v-card-title>
          <v-card-text>
            <div
              v-for="priority in priorityOrder"
              :key="priority"
              class="d-flex align-center mb-3"
            >
              <v-chip
                :color="PRIORITY_COLORS[priority]"
                size="small"
                variant="flat"
                class="mr-3"
                style="width: 100px"
              >
                {{ PRIORITY_LABELS[priority] }}
              </v-chip>
              <v-progress-linear
                :model-value="store.total ? (store.countByPriority[priority] / store.total) * 100 : 0"
                :color="PRIORITY_COLORS[priority]"
                height="12"
                rounded
                class="flex-grow-1 mr-3"
              />
              <span class="text-body-2" style="min-width: 24px">{{
                store.countByPriority[priority]
              }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
