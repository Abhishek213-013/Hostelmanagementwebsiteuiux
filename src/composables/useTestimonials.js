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
      console.log('Fetching ALL testimonials from API (including pending)...')
      
      // Make sure we're sending all=1 to get all testimonials including pending
      const response = await testimonialsAPI.getTestimonials(1)
      console.log('Testimonials raw response:', response.data)
      
      let testimonialsData = []
      
      if (response.data && Array.isArray(response.data.data)) {
        testimonialsData = response.data.data
        console.log('Found testimonials in response.data.data:', testimonialsData.length)
      } else if (Array.isArray(response.data)) {
        testimonialsData = response.data
      }
      
      console.log('Extracted testimonials data:', testimonialsData.length, 'items')
      console.log('Statuses from API:', testimonialsData.map(t => ({ id: t.id, status: t.status })))
      
      // Transform data - DON'T filter by status, show all
      testimonials.value = testimonialsData.map(item => ({
        id: item.id,
        rating: item.rating || 5,
        content: item.message || item.content,
        tags: item.tags || [],
        user: {
          name: item.border_user?.name || item.name,
          avatar: item.avatar_url || item.avatar_path || (item.avatar ? `/storage/${item.avatar}` : 'https://ui-avatars.com/api/?background=0d9488&color=fff&name=' + encodeURIComponent(item.border_user?.name || item.name || 'User')),
          email: item.border_user?.email || item.email
        },
        name: item.border_user?.name || item.name,
        email: item.border_user?.email || item.email,
        message: item.message || item.content,
        university: item.designation || item.university || 'Student',
        department: item.department || '',
        status: item.status !== undefined ? item.status : 0, // Keep original status
        is_featured: item.status == 1,
        stay_duration: item.stay_duration || '',
        room_name: item.room_name || '',
        created_at: item.created_at
      }))
      
      console.log('Processed testimonials (all):', testimonials.value.length, 'found')
      
      return testimonialsData
    } catch (err) {
      console.error('Error fetching testimonials:', err)
      testimonials.value = []
      return []
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

  const submitTestimonial = async (formData) => {
    loading.value = true
    error.value = null
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        content: formData.message,
        rating: formData.rating || 5,
        status: 0  // Create as pending (inactive) - requires admin approval
      }
      
      if (formData.stay_duration) payload.stay_duration = formData.stay_duration
      if (formData.department) payload.department = formData.department
      if (formData.designation) payload.designation = formData.designation

      console.log('Submitting testimonial (pending):', payload)
      
      const response = await testimonialsAPI.createTestimonial(payload)
      console.log('Testimonial submit response:', response.data)
      
      return response.data
    } catch (err) {
      console.error('Testimonial submit error:', err.response?.data || err)
      error.value = err.response?.data?.message || 'Failed to submit testimonial'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTestimonialStatus = async (id, status) => {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('_method', 'PUT')
      formData.append('status', status)
      const response = await testimonialsAPI.updateTestimonial(id, formData)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update testimonial status'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTestimonial = async (id) => {
    loading.value = true
    error.value = null
    try {
      await testimonialsAPI.deleteTestimonial(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete testimonial'
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
    fetchTestimonialDetails,
    submitTestimonial,
    updateTestimonialStatus,
    deleteTestimonial
  }
}