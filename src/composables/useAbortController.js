// src/composables/useAbortController.js
import { ref, onUnmounted } from 'vue'

export function useAbortController() {
  const controllers = ref([])

  const createAbortController = () => {
    const controller = new AbortController()
    controllers.value.push(controller)
    return controller
  }

  const abortAll = () => {
    controllers.value.forEach(controller => controller.abort())
    controllers.value = []
  }

  const removeController = (controller) => {
    const index = controllers.value.indexOf(controller)
    if (index > -1) {
      controllers.value.splice(index, 1)
    }
  }

  onUnmounted(() => {
    abortAll()
  })

  return {
    createAbortController,
    abortAll,
    removeController
  }
}