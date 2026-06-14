// src/composables/useRoomTypes.js
import { ref } from 'vue'
import { roomAPI } from '../services/api'

export function useRoomTypes() {
  const roomTypes = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: null,
    to: null
  })

  const fetchRoomTypes = async (all = 1) => {
    loading.value = true
    error.value = null
    try {
      console.log('Fetching room types from API...')
      const response = await roomAPI.getRoomTypes(all)
      console.log('Room types response:', response.data)
      
      // Handle paginated response structure
      if (response.data && response.data.data) {
        // Response has pagination wrapper
        roomTypes.value = response.data.data
        pagination.value = {
          current_page: response.data.current_page || 1,
          last_page: response.data.last_page || 1,
          per_page: response.data.per_page || 15,
          total: response.data.total || 0,
          from: response.data.from || null,
          to: response.data.to || null
        }
        console.log(`✅ Loaded ${roomTypes.value.length} room types (Page ${pagination.value.current_page} of ${pagination.value.last_page})`)
      } else if (Array.isArray(response.data)) {
        // Response is direct array
        roomTypes.value = response.data
        console.log(`✅ Loaded ${roomTypes.value.length} room types`)
      } else {
        roomTypes.value = []
        console.warn('Unexpected response structure:', response.data)
      }
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch room types'
      console.error('Error fetching room types:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Optional: Fetch a single room type by ID
  const fetchRoomTypeById = async (id) => {
    loading.value = true
    error.value = null
    try {
      // If your API has a single room type endpoint
      const response = await roomAPI.getRoomType(id) // You may need to add this to your API
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch room type'
      console.error('Error fetching room type:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Optional: Clear room types
  const clearRoomTypes = () => {
    roomTypes.value = []
    pagination.value = {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: null,
      to: null
    }
  }

  return {
    roomTypes,
    loading,
    error,
    pagination,
    fetchRoomTypes,
    fetchRoomTypeById,
    clearRoomTypes
  }
}