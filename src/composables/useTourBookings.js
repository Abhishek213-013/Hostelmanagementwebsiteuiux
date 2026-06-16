// src/composables/useTourBookings.js
import { ref } from 'vue'
import { tourBookingsAPI } from '../services/api'

export function useTourBookings() {
  const tourBookings = ref([])
  const currentTourBooking = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const submitting = ref(false)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })

  const fetchTourBookings = async () => {
    loading.value = true
    error.value = null
    try {
      console.log('Fetching tour bookings from API...')
      const response = await tourBookingsAPI.getTourBookings()
      console.log('Tour bookings response:', response.data)
      
      let bookingsData = []
      if (response.data && response.data.data) {
        bookingsData = response.data.data
        pagination.value = {
          current_page: response.data.current_page || 1,
          last_page: response.data.last_page || 1,
          per_page: response.data.per_page || 15,
          total: response.data.total || 0
        }
      } else if (Array.isArray(response.data)) {
        bookingsData = response.data
      }
      
      tourBookings.value = bookingsData
      console.log('Processed tour bookings:', tourBookings.value.length, 'bookings found')
      return bookingsData
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch tour bookings'
      console.error('Error fetching tour bookings:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createTourBooking = async (bookingData) => {
    submitting.value = true
    error.value = null
    try {
      console.log('Creating tour booking with data:', bookingData)
      const response = await tourBookingsAPI.createTourBooking(bookingData)
      console.log('Create tour booking response:', response.data)
      
      let booking = null
      if (response.data && response.data.data) {
        booking = response.data.data
      } else if (response.data) {
        booking = response.data
      }
      
      currentTourBooking.value = booking
      return booking
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.errors || 'Failed to create tour booking'
      console.error('Error creating tour booking:', err)
      throw err
    } finally {
      submitting.value = false
    }
  }

  const getTourBookingDetails = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await tourBookingsAPI.getTourBookingDetails(id)
      
      let booking = null
      if (response.data && response.data.data) {
        booking = response.data.data
      } else if (response.data) {
        booking = response.data
      }
      
      currentTourBooking.value = booking
      return booking
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch tour booking details'
      console.error('Error fetching tour booking details:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTourBookingStatus = async (id, statusData) => {
    loading.value = true
    error.value = null
    try {
      const response = await tourBookingsAPI.updateTourBookingStatus(id, statusData)
      
      let updatedBooking = null
      if (response.data && response.data.data) {
        updatedBooking = response.data.data
      } else if (response.data) {
        updatedBooking = response.data
      }
      
      // Update in list if exists
      if (updatedBooking) {
        const index = tourBookings.value.findIndex(b => b.id === id)
        if (index !== -1) {
          tourBookings.value[index] = updatedBooking
        }
      }
      
      return updatedBooking
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update tour booking status'
      console.error('Error updating tour booking status:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearCurrentTourBooking = () => {
    currentTourBooking.value = null
  }

  return {
    tourBookings,
    currentTourBooking,
    loading,
    error,
    submitting,
    pagination,
    fetchTourBookings,
    createTourBooking,
    getTourBookingDetails,
    updateTourBookingStatus,
    clearCurrentTourBooking
  }
}