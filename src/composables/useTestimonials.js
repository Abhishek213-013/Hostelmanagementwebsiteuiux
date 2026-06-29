// src/composables/useTestimonials.js
import { ref } from 'vue'
import { testimonialsAPI } from '../services/api'

export function useTestimonials() {
  const testimonials = ref([])
  const currentTestimonial = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })

  const fetchTestimonials = async (all = 1) => {
    loading.value = true
    error.value = null
    try {
      console.log('Fetching testimonials from API...')
      const response = await testimonialsAPI.getTestimonials(all)
      console.log('Testimonials response:', response.data)
      
      let testimonialsData = []
      if (response.data && response.data.data) {
        testimonialsData = response.data.data
        pagination.value = {
          current_page: response.data.current_page || 1,
          last_page: response.data.last_page || 1,
          per_page: response.data.per_page || 15,
          total: response.data.total || 0
        }
      } else if (Array.isArray(response.data)) {
        testimonialsData = response.data
      }
      
      // Transform data to match frontend expected structure
      testimonials.value = testimonialsData.map(item => ({
        id: item.id,
        rating: item.rating || 5,
        content: item.message,
        tags: item.tags || [],
        user: {
          name: item.name,
          avatar: item.avatar_url || item.image_path || (item.avatar ? `/storage/${item.avatar}` : 'https://ui-avatars.com/api/?background=0d9488&color=fff&name=' + encodeURIComponent(item.name)),
          email: item.email
        },
        university: item.designation || item.university || 'Student',
        department: item.department || '',
        is_featured: item.status == 1,
        stay_duration: item.stay_duration || '',
        room_name: item.room_name || '',
        created_at: item.created_at
      }))
      
      // Sort: featured first, then by rating, then by date
      testimonials.value.sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1
        if (!a.is_featured && b.is_featured) return 1
        if (a.rating !== b.rating) return b.rating - a.rating
        return new Date(b.created_at) - new Date(a.created_at)
      })
      
      console.log('Processed testimonials:', testimonials.value.length, 'testimonials found')
      return testimonialsData
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('Testimonials API not available (404), using empty state')
        testimonials.value = []
        return []
      }
      error.value = err.response?.data?.message || 'Failed to fetch testimonials'
      console.error('Error fetching testimonials:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchTestimonialDetails = async (id) => {
    if (!id) {
      error.value = 'Testimonial ID is required'
      return null
    }
    
    loading.value = true
    error.value = null
    try {
      const response = await testimonialsAPI.getTestimonialDetails(id)
      
      let testimonialData = null
      if (response.data && response.data.data) {
        testimonialData = response.data.data
      } else if (response.data) {
        testimonialData = response.data
      }
      
      currentTestimonial.value = testimonialData
      return testimonialData
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch testimonial details'
      console.error('Error fetching testimonial details:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    testimonials,
    currentTestimonial,
    loading,
    error,
    pagination,
    fetchTestimonials,
    fetchTestimonialDetails
  }
}