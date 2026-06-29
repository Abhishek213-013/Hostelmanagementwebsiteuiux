// src/composables/useGallery.js
import { ref } from 'vue'
import { galleryAPI } from '../services/api'

export function useGallery() {
  const galleryItems = ref([])
  const currentItem = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })

  const fetchGallery = async (all = 1) => {
    loading.value = true
    error.value = null
    try {
      console.log('Fetching gallery from API with all=', all)
      const response = await galleryAPI.getGallery(all)
      console.log('Gallery response:', response.data)
      
      let galleryData = []
      if (response.data && response.data.data) {
        galleryData = response.data.data
        pagination.value = {
          current_page: response.data.current_page || 1,
          last_page: response.data.last_page || 1,
          per_page: response.data.per_page || 15,
          total: response.data.total || 0
        }
      } else if (Array.isArray(response.data)) {
        galleryData = response.data
      } else {
        galleryData = []
      }
      
      // Transform data to match frontend expected structure
      galleryItems.value = galleryData.map(item => ({
        id: item.id,
        src: item.image_url || item.image_path || `/storage/${item.image}`,
        thumbnail: item.thumbnail_url || item.image_url || `/storage/${item.image}`,
        title: item.title,
        alt_text: item.caption || item.title,
        description: item.caption || '',
        category: item.category || getCategoryFromTitle(item.title),
        tags: item.tags || [],
        uploaded_at: item.created_at,
        sort_order: item.sort_order,
        status: item.status
      }))
      
      console.log('Processed gallery:', galleryItems.value.length, 'items found')
      return galleryData
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('Gallery API not available (404), using empty state')
        galleryItems.value = []
        return []
      }
      error.value = err.response?.data?.message || 'Failed to fetch gallery'
      console.error('Error fetching gallery:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Helper to determine category from title
  const getCategoryFromTitle = (title) => {
    const titleLower = title?.toLowerCase() || ''
    if (titleLower.includes('room')) return 'rooms'
    if (titleLower.includes('dining') || titleLower.includes('meal')) return 'dining'
    if (titleLower.includes('gym') || titleLower.includes('fitness')) return 'facilities'
    return 'common'
  }

  const fetchGalleryItem = async (id) => {
    if (!id) {
      error.value = 'Gallery ID is required'
      return null
    }
    
    loading.value = true
    error.value = null
    try {
      console.log(`Fetching gallery item for ID: ${id}`)
      const response = await galleryAPI.getGalleryItem(id)
      console.log('Gallery item response:', response.data)
      
      let itemData = null
      if (response.data && response.data.data) {
        itemData = response.data.data
      } else if (response.data) {
        itemData = response.data
      }
      
      currentItem.value = itemData
      return itemData
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch gallery item'
      console.error('Error fetching gallery item:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    galleryItems,
    currentItem,
    loading,
    error,
    pagination,
    fetchGallery,
    fetchGalleryItem
  }
}