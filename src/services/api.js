// src/services/api.js
import axios from 'axios'

const API_BASE_URL = 'https://dev.hostel.accounting.itlab.solutions/api'
const TENANT_API_KEY = 'hotelA123'

// Create a cache for GET requests
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Create axios instance with optimized settings
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-KEY': TENANT_API_KEY
  },
  timeout: 15000, // Reduced from 60s to 15s
  maxRedirects: 3,
  maxContentLength: 10 * 1024 * 1024, // 10MB limit
})

// Request interceptor - Optimized
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add timestamp to prevent caching issues
    if (config.method === 'get' && !config.params?.noCache) {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    // Log only in development
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`)
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor with caching
apiClient.interceptors.response.use(
  (response) => {
    // Cache GET requests
    if (response.config.method === 'get' && !response.config.params?.noCache) {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params)}`
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      })
    }
    
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.url}`, response.status)
    }
    return response
  },
  async (error) => {
    // Handle network errors better
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.warn('Request timeout:', error.config?.url)
      return Promise.reject(new Error('Request timed out. Please try again.'))
    }
    
    if (!error.response) {
      console.warn('Network error:', error.message)
      return Promise.reject(new Error('Network error. Please check your connection.'))
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('auth_token')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    
    console.error('❌ API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Cache helper functions
export const clearCache = () => cache.clear()

export const clearCacheForUrl = (url) => {
  for (const [key, value] of cache.entries()) {
    if (key.includes(url)) {
      cache.delete(key)
    }
  }
}

/**
 * Clear all caches related to bookings and room availability
 * Call this after creating/cancelling a booking
 */
export const clearBookingRelatedCaches = (roomId = null) => {
  // Clear booking caches
  clearCacheForUrl('/bookings')
  clearCacheForUrl('/borders')
  
  // Clear room caches
  clearCacheForUrl('/rooms')
  clearCacheForUrl('/room-types')
  clearCacheForUrl('/seats')
  
  // Clear specific room availability cache
  if (roomId) {
    clearCacheForUrl(`/rooms/${roomId}/availability`)
    // Also clear session storage for this room
    try {
      sessionStorage.removeItem(`room_availability_${roomId}`)
    } catch (e) {
      // Ignore session storage errors
    }
  } else {
    // Clear all availability caches
    clearCacheForUrl('/availability')
    // Clear all session storage availability
    try {
      const keys = Object.keys(sessionStorage)
      keys.forEach(key => {
        if (key.startsWith('room_availability_')) {
          sessionStorage.removeItem(key)
        }
      })
    } catch (e) {
      // Ignore session storage errors
    }
  }
  
  console.log('🧹 Cleared booking-related caches' + (roomId ? ` for room ${roomId}` : ' for all rooms'))
}

// Authentication APIs - Optimized
export const authAPI = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
  getUser: () => apiClient.get('/border_user'),
  updateProfile: (userData) => apiClient.put('/border_user', userData),
  updateAvatar: (formData) => apiClient.post('/border_user/updte_img', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  resetPassword: (data) => apiClient.post('/auth/reset-password', data),
  refresh: () => apiClient.post('/auth/refresh')
}

// Location APIs - With caching
export const locationAPI = {
  getDivisions: () => apiClient.get('/search/divisions'),
  getDistricts: (divisionId) => apiClient.get('/search/districts', { params: { division_id: divisionId } }),
  getUpazilas: (districtId) => apiClient.get('/search/upazilas', { params: { district_id: districtId } }),
  getUnions: (upazilaId) => apiClient.get('/search/unions', { params: { upazila_id: upazilaId } })
}

// Branch & Building APIs
export const branchAPI = {
  getBranches: () => apiClient.get('/search/branches'),
  getBuildings: (all = 1) => apiClient.get('/buildings', { params: { all } }),
  getFloors: (buildingId) => apiClient.post('/search/floors', { building_id: buildingId })
}

// Room APIs - Optimized with concurrent requests
export const roomAPI = {
  getRoomTypes: (all = 1) => apiClient.get('/room-types', { params: { all } }),
  getRooms: (all = 1) => apiClient.get('/rooms', { params: { all } }),
  getRoomDetails: (id) => apiClient.get(`/rooms/${id}`),
  getRoomAvailability: (id) => {
    // Add noCache param to always get fresh availability
    return apiClient.get(`/rooms/${id}/availability`, { 
      params: { 
        _t: Date.now(),
        noCache: true // Skip caching for availability
      } 
    })
  },
  createRoom: (roomData) => {
    clearBookingRelatedCaches()
    return apiClient.post('/rooms', roomData)
  },
  updateRoom: (id, roomData) => {
    clearCacheForUrl(`/rooms/${id}`)
    return apiClient.put(`/rooms/${id}`, roomData)
  },
  deleteRoom: (id) => {
    clearBookingRelatedCaches(id)
    return apiClient.delete(`/rooms/${id}`)
  },
  getSeats: () => apiClient.get('/seats'),
  
  // Batch availability check - Optimized
  getMultipleRoomAvailability: async (roomIds) => {
    if (!roomIds || roomIds.length === 0) return []
    
    // Limit concurrent requests
    const batchSize = 5
    const results = []
    
    for (let i = 0; i < roomIds.length; i += batchSize) {
      const batch = roomIds.slice(i, i + batchSize)
      const promises = batch.map(id => 
        roomAPI.getRoomAvailability(id).catch(err => ({
          error: true,
          id,
          message: err.message
        }))
      )
      const batchResults = await Promise.all(promises)
      results.push(...batchResults)
    }
    
    return results
  }
}

// Booking APIs - Updated with comprehensive cache clearing
export const bookingAPI = {
  createBooking: (bookingData) => {
    // Clear all related caches
    clearBookingRelatedCaches(bookingData.room_id)
    return apiClient.post('/bookings', bookingData)
  },
  getAllBookings: () => apiClient.get('/bookings'),
  getBookingDetails: (id) => apiClient.get(`/bookings/${id}`),
  cancelBooking: (id) => {
    // First get the booking to know the room_id (if possible)
    // Then clear caches
    clearBookingRelatedCaches()
    return apiClient.put(`/bookings/${id}/cancel`)
  },
  updateBookingStatus: (id, status) => {
    clearBookingRelatedCaches()
    return apiClient.put(`/bookings/${id}/status`, { status })
  },
  // Get bookings by room (useful for checking seat availability)
  getBookingsByRoom: (roomId) => apiClient.get('/bookings', { 
    params: { room_id: roomId }
  })
}

// Facilities API
export const facilitiesAPI = {
  getFacilities: (all = 1) => apiClient.get('/facilities', { params: { all } }),
  getFacilityDetails: (id) => apiClient.get(`/facilities/${id}`),
  createFacility: (facilityData) => {
    clearCacheForUrl('/facilities')
    return apiClient.post('/facilities', facilityData)
  },
}

// Gallery API
export const galleryAPI = {
  getGallery: (all = 1) => apiClient.get('/gallery', { params: { all } }),
  getGalleryItem: (id) => apiClient.get(`/gallery/${id}`),
  createGalleryItem: (formData) => {
    clearCacheForUrl('/gallery')
    return apiClient.post('/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  updateGalleryItem: (id, formData) => {
    clearCacheForUrl('/gallery')
    return apiClient.post(`/gallery/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteGalleryItem: (id) => {
    clearCacheForUrl('/gallery')
    return apiClient.delete(`/gallery/${id}`)
  }
}

// Team API
export const teamAPI = {
  getTeams: (all = 1) => apiClient.get('/team', { params: { all } }),
  getTeamDetails: (id) => apiClient.get(`/team/${id}`),
  createTeam: (teamData) => {
    clearCacheForUrl('/team')
    return apiClient.post('/team', teamData)
  },
  updateTeam: (id, teamData) => {
    clearCacheForUrl('/team')
    return apiClient.put(`/team/${id}`, teamData)
  },
  deleteTeam: (id) => {
    clearCacheForUrl('/team')
    return apiClient.delete(`/team/${id}`)
  },
  getMemberDetails: (teamId, memberId) => apiClient.get(`/team/${teamId}/members/${memberId}`),
  createMember: (teamId, formData) => {
    clearCacheForUrl(`/team/${teamId}/members`)
    return apiClient.post(`/team/${teamId}/members`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  updateMember: (teamId, memberId, formData) => {
    clearCacheForUrl(`/team/${teamId}/members`)
    return apiClient.post(`/team/${teamId}/members/${memberId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteMember: (teamId, memberId) => {
    clearCacheForUrl(`/team/${teamId}/members`)
    return apiClient.delete(`/team/${teamId}/members/${memberId}`)
  }
}

// Testimonials API
export const testimonialsAPI = {
  getTestimonials: (all = 1) => apiClient.get('/testimonials', { params: { all } }),
  getTestimonialDetails: (id) => apiClient.get(`/testimonials/${id}`),
  createTestimonial: (formData) => {
    clearCacheForUrl('/testimonials')
    return apiClient.post('/testimonials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  updateTestimonial: (id, formData) => {
    clearCacheForUrl('/testimonials')
    return apiClient.post(`/testimonials/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteTestimonial: (id) => {
    clearCacheForUrl('/testimonials')
    return apiClient.delete(`/testimonials/${id}`)
  }
}

// Reviews API
export const reviewsAPI = {
  getReviews: (params = {}) => apiClient.get('/reviews', { params }),
  getReviewDetails: (id) => apiClient.get(`/reviews/${id}`),
  createReview: (reviewData) => {
    clearCacheForUrl('/reviews')
    return apiClient.post('/reviews', reviewData)
  },
  updateReview: (id, reviewData) => {
    clearCacheForUrl('/reviews')
    return apiClient.put(`/reviews/${id}`, reviewData)
  },
  deleteReview: (id) => {
    clearCacheForUrl('/reviews')
    return apiClient.delete(`/reviews/${id}`)
  }
}

// Contact API
export const contactAPI = {
  sendEnquiry: (enquiryData) => apiClient.post('/contact', enquiryData),
  getContactInfo: () => apiClient.get('/contact/info'),
}

// Tour Bookings API
export const tourBookingsAPI = {
  getTourBookings: (params = {}) => apiClient.get('/tour-bookings', { params }),
  getTourBookingDetails: (id) => apiClient.get(`/tour-bookings/${id}`),
  getTourBookingsByEmail: (email) => apiClient.get('/tour-bookings', { 
    params: { email: email }
  }),
  createTourBooking: (bookingData) => {
    clearCacheForUrl('/tour-bookings')
    return apiClient.post('/tour-bookings', bookingData)
  },
  updateTourBookingStatus: (id, statusData) => {
    clearCacheForUrl('/tour-bookings')
    return apiClient.put(`/tour-bookings/${id}/status`, statusData)
  }
}

// Newsletter API
export const newsletterAPI = {
  getSubscribers: () => apiClient.get('/newsletter'),
  subscribe: (data) => {
    clearCacheForUrl('/newsletter')
    return apiClient.post('/newsletter/subscribe', data)
  },
  unsubscribe: (data) => {
    clearCacheForUrl('/newsletter')
    return apiClient.post('/newsletter/unsubscribe', data)
  }
}

// Pages API
export const pagesAPI = {
  getPages: () => apiClient.get('/pages'),
  getPageDetails: (id) => apiClient.get(`/pages/${id}`),
  createPage: (pageData) => {
    clearCacheForUrl('/pages')
    return apiClient.post('/pages', pageData)
  },
  updatePage: (id, pageData) => {
    clearCacheForUrl('/pages')
    return apiClient.put(`/pages/${id}`, pageData)
  },
  updatePageStatus: (id, status) => {
    clearCacheForUrl('/pages')
    return apiClient.put(`/pages/update-status/${id}`, { status })
  }
}

// Page Sections API
export const pageSectionsAPI = {
  getSections: () => apiClient.get('/page-sections'),
  getSectionDetails: (id) => apiClient.get(`/page-sections/${id}`),
  createSection: (sectionData) => {
    clearCacheForUrl('/page-sections')
    return apiClient.post('/page-sections', sectionData)
  },
  updateSection: (id, sectionData) => {
    clearCacheForUrl('/page-sections')
    return apiClient.put(`/page-sections/${id}`, sectionData)
  },
  updateSectionStatus: (id, status) => {
    clearCacheForUrl('/page-sections')
    return apiClient.put(`/page-sections/update-status/${id}`, { status })
  }
}

// Page Section Items API
export const sectionItemsAPI = {
  getItems: () => apiClient.get('/page-section-items'),
  getItemDetails: (id) => apiClient.get(`/page-section-items/${id}`),
  createItem: (itemData) => {
    clearCacheForUrl('/page-section-items')
    return apiClient.post('/page-section-items', itemData)
  },
  updateItem: (id, itemData) => {
    clearCacheForUrl('/page-section-items')
    // Always use PUT for updates
    return apiClient.put(`/page-section-items/${id}`, itemData)
  },
  updateItemStatus: (id, status) => {
    clearCacheForUrl('/page-section-items')
    return apiClient.put(`/page-section-items/update-status/${id}`, { status })
  }
}

// Border APIs
export const borderAPI = {
  // Get current border profile
  getCurrentBorder: () => apiClient.get('/border_user'),
  
  // Get all borders (admin)
  getAllBorders: (params = {}) => apiClient.get('/borders', { params }),
  
  // Get border by ID
  getBorderById: (id) => apiClient.get(`/borders/${id}`),
  
  // Create border profile
  createBorder: (borderData) => {
    clearCacheForUrl('/borders')
    return apiClient.post('/borders', borderData)
  },
  
  // Get borders by room
  getBordersByRoom: (roomId) => apiClient.get('/borders', { 
    params: { room_id: roomId } 
  }),
  
  // Get border booking history
  getBorderBookings: (borderId) => apiClient.get(`/borders/${borderId}/bookings`),
  
  // Get border reviews
  getBorderReviews: (borderId) => apiClient.get(`/borders/${borderId}/reviews`),
}

// Image Upload API
export const uploadAPI = {
  uploadImage: (formData) => apiClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export default apiClient