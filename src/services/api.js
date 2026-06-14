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
    'X-API-KEY': TENANT_API_KEY // Add tenant API key to every request
  },
  timeout: 30000
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
  (response) => {
    console.log(`✅ ${response.config.url}`, response.status)
    return response
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message)
    
    // Handle missing tenant key
    if (error.response?.data?.message?.includes('tenant API key')) {
      console.error('🔑 Missing Tenant API Key! Please add X-API-KEY header')
    }
    
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
  updateBookingStatus: (id, status) => apiClient.post(`/bookings/${id}/status`, { status })
}

export default apiClient