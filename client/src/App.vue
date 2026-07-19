<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const isDark = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  theme.global.name.value = isDark.value ? 'dark' : 'light'
}
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable">
      <v-app-bar-title>
        <v-icon icon="mdi-checkbox-marked-circle-outline" class="mr-2" />
        Task Tracker
      </v-app-bar-title>

      <v-btn to="/" variant="text">Задачи</v-btn>
      <v-btn to="/stats" variant="text">Статистика</v-btn>
      <v-btn to="/backend-demo" variant="text">Backend Demo</v-btn>

      <v-spacer />

      <v-switch
        v-model="isDark"
        hide-details
        inset
        density="compact"
        class="mr-4"
        :prepend-icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
        @update:model-value="toggleTheme"
      />
    </v-app-bar>

    <v-main>
      <v-container class="py-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
