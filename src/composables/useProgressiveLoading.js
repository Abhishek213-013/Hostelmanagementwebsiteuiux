// src/composables/useProgressiveLoading.js
import { ref } from 'vue'

export function useProgressiveLoading() {
  const loading = ref(true)
  const criticalLoaded = ref(false)
  const allLoaded = ref(false)
  const error = ref(null)

  const loadCritical = async (callback) => {
    try {
      await callback()
      criticalLoaded.value = true
      loading.value = false
    } catch (err) {
      error.value = err.message
      loading.value = false
    }
  }

  const loadAll = async (callbacks) => {
    try {
      await Promise.all(callbacks.map(cb => cb()))
      allLoaded.value = true
    } catch (err) {
      console.error('Error loading content:', err)
    }
  }

  return {
    loading,
    criticalLoaded,
    allLoaded,
    error,
    loadCritical,
    loadAll
  }
}