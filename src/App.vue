<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHomePage = computed(() => route.path === '/' || route.path === '')
</script>

<style>
#app {
  height: 100%;
}
</style>
