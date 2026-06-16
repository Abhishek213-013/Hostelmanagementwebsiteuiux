// src/composables/useNewsletter.js
import { ref } from 'vue'
import { newsletterAPI } from '../services/api'

export function useNewsletter() {
  const subscribers = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const subscribing = ref(false)
  const unsubscribing = ref(false)

  const getSubscribers = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await newsletterAPI.getSubscribers()
      let data = []
      if (response.data && response.data.data) {
        data = response.data.data
      } else if (Array.isArray(response.data)) {
        data = response.data
      }
      subscribers.value = data
      return data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch subscribers'
      console.error('Error fetching subscribers:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const subscribe = async (email, name = '') => {
   subscribing.value = true
   error.value = null
   success.value = false
   try {
    const response = await newsletterAPI.subscribe({ email, name })
    success.value = true
    return response.data
   } catch (err) {
    error.value = err.response?.data?.message || 'Failed to subscribe'
    success.value = false
    throw err
   } finally {
    subscribing.value = false
   }
  }

  const unsubscribe = async (email) => {
    unsubscribing.value = true
    error.value = null
    success.value = false
    try {
      const response = await newsletterAPI.unsubscribe({ email })
      success.value = true
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to unsubscribe'
      console.error('Error unsubscribing:', err)
      throw err
    } finally {
      unsubscribing.value = false
    }
  }

  const resetNewsletter = () => {
    error.value = null
    success.value = false
  }

  return {
    subscribers,
    loading,
    error,
    success,
    subscribing,
    unsubscribing,
    getSubscribers,
    subscribe,
    unsubscribe,
    resetNewsletter
  }
}