<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { Chart, ArcElement, DoughnutController, Tooltip, Legend, type ChartData } from 'chart.js'
import { Priority, PRIORITY_LABELS } from '@/types/task'

// Регистрируем только те части Chart.js, которые реально используем —
// tree-shaking даёт заметно меньший бандл, чем import 'chart.js/auto'
Chart.register(ArcElement, DoughnutController, Tooltip, Legend)

const props = defineProps<{
  counts: Record<Priority, number>
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart<'doughnut'> | null = null

const priorityColors: Record<Priority, string> = {
  [Priority.High]: '#e53935',
  [Priority.Medium]: '#fb8c00',
  [Priority.Low]: '#43a047',
}

function buildData(): ChartData<'doughnut'> {
  const priorities = Object.values(Priority)
  return {
    labels: priorities.map((p) => PRIORITY_LABELS[p]),
    datasets: [
      {
        data: priorities.map((p) => props.counts[p]),
        backgroundColor: priorities.map((p) => priorityColors[p]),
        borderWidth: 0,
      },
    ],
  }
}

onMounted(() => {
  if (!canvasRef.value) return
  chart = new Chart<'doughnut'>(canvasRef.value, {
    type: 'doughnut',
    data: buildData(),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
      },
    },
  })
})

onUnmounted(() => {
  chart?.destroy()
})

// Перерисовываем датасет при изменении задач, без пересоздания графика
watch(
  () => props.counts,
  () => {
    if (!chart) return
    chart.data = buildData()
    chart.update()
  },
  { deep: true },
)
</script>

<template>
  <div style="height: 240px">
    <canvas ref="canvasRef" />
  </div>
</template>
