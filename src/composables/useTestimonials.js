// src/composables/useTestimonials.js
import { ref } from 'vue'
import { testimonialsAPI } from '../services/api'
import apiClient from '../services/api'

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
      console.log('Fetching ALL testimonials from API...')
      
      const response = await testimonialsAPI.getTestimonials(1)
      console.log('Testimonials raw response:', response.data)
      
      let testimonialsData = []
      
      if (response.data && response.data.data) {
        testimonialsData = Array.isArray(response.data.data) ? response.data.data : []
      } else if (Array.isArray(response.data)) {
        testimonialsData = response.data
      } else if (response.data && typeof response.data === 'object') {
        testimonialsData = response.data.data || []
      }
      
      console.log('Extracted testimonials data:', testimonialsData.length, 'items')
      
      // Transform data - preserve original user data
      testimonials.value = testimonialsData.map(item => ({
        id: item.id,
        rating: item.rating || 5,
        content: item.message || item.content || '',
        message: item.message || item.content || '',
        // IMPORTANT: Check for original user data first
        name: item.user_name || item.original_name || item.border_user?.name || item.name || 'Anonymous',
        email: item.user_email || item.original_email || item.border_user?.email || item.email || '',
        designation: item.designation || item.user_designation || '',
        department: item.department || item.user_department || '',
        status: item.status !== undefined ? item.status : 0,
        is_featured: item.status == 1,
        stay_duration: item.stay_duration || item.user_stay_duration || '',
        room_name: item.room_name || '',
        avatar: item.avatar || item.avatar_url || item.user_avatar || item.border_user?.avatar || '',
        university: item.university || item.user_university || '',
        tags: item.tags || [],
        created_at: item.created_at,
        // Keep original user data separate
        user: {
          name: item.user_name || item.original_name || item.border_user?.name || item.name || 'Anonymous',
          email: item.user_email || item.original_email || item.border_user?.email || item.email || '',
          avatar: item.user_avatar || item.border_user?.avatar || item.avatar || item.avatar_url || '',
          university: item.university || item.user_university || '',
          department: item.department || item.user_department || ''
        },
        // Admin who approved (if available)
        approved_by: item.approved_by || item.admin_name || null
      }))
      
      console.log('Processed testimonials (all):', testimonials.value.length, 'found')
      console.log('Sample testimonial:', testimonials.value[0])
      
      return testimonialsData
    } catch (err) {
      console.error('Error fetching testimonials:', err)
      testimonials.value = []
      error.value = err.response?.data?.message || 'Failed to fetch testimonials'
      return []
    } finally {
      loading.value = false
    }
  }
  // src/composables/useTestimonials.js
  const updateTestimonialStatus = async (id, status) => {
    loading.value = true
    error.value = null
    try {
      const testimonial = testimonials.value.find(t => t.id === id)
      if (!testimonial) throw new Error('Testimonial not found')
      
      console.log(`Updating testimonial ${id} status to ${status}`)
      
      let originalName = testimonial.user?.name || testimonial.name || 'Anonymous'
      try {
        const saved = localStorage.getItem('testimonialOriginalNames')
        if (saved) {
          const names = JSON.parse(saved)
          if (names[id]) originalName = names[id]
        }
      } catch (e) {}
      
      const formData = new FormData()
      // DON'T send _method=PUT - just use POST directly
      formData.append('name', originalName)
      formData.append('message', testimonial.message || testimonial.content || '')
      formData.append('rating', testimonial.rating || 5)
      formData.append('designation', testimonial.designation || testimonial.department || '')
      formData.append('status', status)
      
      if (testimonial.user?.email || testimonial.email) {
        formData.append('email', testimonial.user?.email || testimonial.email)
      }
      if (testimonial.stay_duration) {
        formData.append('stay_duration', testimonial.stay_duration)
      }
      
      const token = localStorage.getItem('auth_token')
      
      // POST to /testimonials/{id} - the route supports POST
      const url = `https://dev.hostel.accounting.itlab.solutions/api/testimonials/${id}`
      console.log('POST to:', url)
      console.log('Form data:', Object.fromEntries(formData.entries()))
      
      const fetchResponse = await fetch(url, {
        method: 'POST',  // Use POST directly
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'X-API-KEY': 'hotelA123'
        },
        body: formData
      })
      
      if (!fetchResponse.ok) {
        const errorData = await fetchResponse.json().catch(() => ({}))
        console.error('Error response:', errorData)
        throw new Error(errorData.message || `HTTP ${fetchResponse.status}`)
      }
      
      const responseData = await fetchResponse.json()
      console.log('Update success:', responseData)
      
      testimonial.status = status
      testimonial.is_featured = status == 1
      
      return responseData
    } catch (err) {
      console.error('Status update error:', err)
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
      testimonials.value = testimonials.value.filter(t => t.id !== id)
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
    updateTestimonialStatus,
    deleteTestimonial
  }
}