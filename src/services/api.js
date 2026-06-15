// src/services/api.js
import axios from 'axios'

const API_BASE_URL = '/api'

// TODO: Get this from your backend developer
// This is the TENANT API KEY - different from user token
const TENANT_API_KEY = 'hotelA123' // Ask backend for this

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-KEY': TENANT_API_KEY
  },
  timeout: 60000, // Increase to 60 seconds
  retry: 2, // Retry failed requests twice
  retryDelay: 1000 // Wait 1 second between retries
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add user token if logged in
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Always ensure X-API-KEY is present
    if (!config.headers['X-API-KEY']) {
      config.headers['X-API-KEY'] = TENANT_API_KEY
    }
    
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`)
    
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, message } = error
    const isTimeout = message.includes('timeout') || message.includes('exceeded')
    const isNetworkError = message === 'Network Error'
    
    if ((isTimeout || isNetworkError) && config && config.retryCount !== undefined) {
      config.retryCount = (config.retryCount || 0) + 1
      
      if (config.retryCount <= config.retry) {
        console.log(`Retrying request (${config.retryCount}/${config.retry})...`)
        await new Promise(resolve => setTimeout(resolve, config.retryDelay || 1000))
        return apiClient(config)
      }
    }
    
    console.error('❌ API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Authentication APIs
export const authAPI = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
  getUser: () => apiClient.get('/user')
}

// Location APIs - UPDATED: Changed POST to GET with query parameters
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

// Room APIs
export const roomAPI = {
  getRoomTypes: (all = 1) => apiClient.get('/room-types', { params: { all } }),
  getRooms: (all = 1) => apiClient.get('/rooms', { params: { all } }),
  getRoomDetails: (id) => apiClient.get(`/rooms/${id}`),
  getRoomAvailability: (id) => apiClient.get(`/rooms/${id}/availability`),
  createRoom: (roomData) => apiClient.post('/rooms', roomData),
  getSeats: () => apiClient.get('/seats')
}

// Booking APIs
export const bookingAPI = {
  createBooking: (bookingData) => apiClient.post('/bookings', bookingData),
  getAllBookings: () => apiClient.get('/bookings'),
  getBookingDetails: (id) => apiClient.get(`/bookings/${id}`),
  cancelBooking: (id) => apiClient.post(`/bookings/${id}/cancel`),
  updateBookingStatus: (id, status) => apiClient.put(`/bookings/${id}/status`, { status }) // PUT instead of POST
}
// Facilities API
export const facilitiesAPI = {
  getFacilities: (all = 1) => apiClient.get('/facilities', { params: { all } }),
  getFacilityDetails: (id) => apiClient.get(`/facilities/${id}`),
  createFacility: (facilityData) => apiClient.post('/facilities', facilityData),
}

// Gallery API
export const galleryAPI = {
  getGallery: (all = 1) => apiClient.get('/gallery', { params: { all } }),
  getGalleryItem: (id) => apiClient.get(`/gallery/${id}`),
  createGalleryItem: (formData) => apiClient.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateGalleryItem: (id, formData) => apiClient.post(`/gallery/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteGalleryItem: (id) => apiClient.delete(`/gallery/${id}`)
}

// src/services/api.js - Update Team API

// Team API
export const teamAPI = {
  // Team endpoints
  getTeams: (all = 1) => apiClient.get('/team', { params: { all } }),
  getTeamDetails: (id) => apiClient.get(`/team/${id}`),
  createTeam: (teamData) => apiClient.post('/team', teamData),
  updateTeam: (id, teamData) => apiClient.put(`/team/${id}`, teamData),
  deleteTeam: (id) => apiClient.delete(`/team/${id}`),
  
  // Team Members endpoints - Note: GET is not supported for members list, only for single member
  getMemberDetails: (teamId, memberId) => apiClient.get(`/team/${teamId}/members/${memberId}`),
  createMember: (teamId, formData) => apiClient.post(`/team/${teamId}/members`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateMember: (teamId, memberId, formData) => apiClient.post(`/team/${teamId}/members/${memberId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteMember: (teamId, memberId) => apiClient.delete(`/team/${teamId}/members/${memberId}`)
}

// Testimonials API
export const testimonialsAPI = {
  getTestimonials: (all = 1) => apiClient.get('/testimonials', { params: { all } }),
  getTestimonialDetails: (id) => apiClient.get(`/testimonials/${id}`),
  createTestimonial: (formData) => apiClient.post('/testimonials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateTestimonial: (id, formData) => apiClient.post(`/testimonials/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteTestimonial: (id) => apiClient.delete(`/testimonials/${id}`)
}
export default apiClient