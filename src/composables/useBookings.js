// src/composables/useBookings.js
import { ref } from 'vue'
import { bookingAPI } from '../services/api'

export function useBookings() {
  const bookings = ref([])
  const currentBooking = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })

  const fetchAllBookings = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await bookingAPI.getAllBookings()
      console.log('All bookings response:', response.data)
      
      // Handle paginated response
      if (response.data && response.data.data) {
        bookings.value = response.data.data
        pagination.value = {
          current_page: response.data.current_page || 1,
          last_page: response.data.last_page || 1,
          per_page: response.data.per_page || 15,
          total: response.data.total || 0
        }
      } else if (Array.isArray(response.data)) {
        bookings.value = response.data
      } else {
        bookings.value = []
      }
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch bookings'
      console.error('Error fetching bookings:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createBooking = async (bookingData) => {
    loading.value = true
    error.value = null
    try {
      console.log('Creating booking with data:', bookingData)
      const response = await bookingAPI.createBooking(bookingData)
      console.log('Create booking response:', response.data)
      
      // Handle response structure
      let booking = null
      if (response.data && response.data.data) {
        booking = response.data.data
      } else if (response.data) {
        booking = response.data
      }
      
      currentBooking.value = booking
      return booking
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.errors || 'Failed to create booking'
      console.error('Error creating booking:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getBookingDetails = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await bookingAPI.getBookingDetails(id)
      console.log(`Booking details for ID ${id}:`, response.data)
      
      let booking = null
      if (response.data && response.data.data) {
        booking = response.data.data
      } else if (response.data) {
        booking = response.data
      }
      
      currentBooking.value = booking
      return booking
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch booking details'
      console.error('Error fetching booking details:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const cancelBooking = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await bookingAPI.cancelBooking(id)
      console.log(`Cancel booking response for ID ${id}:`, response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to cancel booking'
      console.error('Error cancelling booking:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateBookingStatus = async (id, status) => {
    loading.value = true
    error.value = null
    try {
      const response = await bookingAPI.updateBookingStatus(id, status)
      console.log(`Update booking status response for ID ${id}:`, response.data)
      
      // Update current booking if it matches
      if (currentBooking.value && currentBooking.value.id === id) {
        if (response.data && response.data.data) {
          currentBooking.value = response.data.data
        } else if (response.data) {
          currentBooking.value = response.data
        }
      }
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update booking status'
      console.error('Error updating booking status:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearCurrentBooking = () => {
    currentBooking.value = null
  }

  return {
    bookings,
    currentBooking,
    loading,
    error,
    pagination,
    fetchAllBookings,
    createBooking,
    getBookingDetails,
    cancelBooking,
    updateBookingStatus,
    clearCurrentBooking
  }
}