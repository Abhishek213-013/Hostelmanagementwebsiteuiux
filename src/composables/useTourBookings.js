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

  // Fetch user's own tour bookings using stored IDs
  const fetchUserTourBookings = async () => {
    loading.value = true
    error.value = null
    try {
      console.log('Fetching user tour bookings...')
      
      let bookingsData = []
      
      // Get stored tour IDs from localStorage
      const storedTourIds = localStorage.getItem('userTourIds')
      if (storedTourIds) {
        try {
          const tourIds = JSON.parse(storedTourIds)
          console.log('Found tour IDs:', tourIds)
          
          // Fetch each tour individually using the show endpoint (no admin middleware)
          for (const tourId of tourIds) {
            try {
              const response = await tourBookingsAPI.getTourBookingDetails(tourId)
              console.log(`Tour ${tourId} details:`, response.data)
              
              let tourData = null
              if (response.data && response.data.data) {
                tourData = response.data.data
              } else if (response.data) {
                tourData = response.data
              }
              
              if (tourData) {
                bookingsData.push(tourData)
              }
            } catch (err) {
              console.error(`Failed to fetch tour ${tourId}:`, err)
              // If a tour fails, remove it from storage
              const updatedIds = tourIds.filter(id => id !== tourId)
              localStorage.setItem('userTourIds', JSON.stringify(updatedIds))
            }
          }
        } catch (e) {
          console.error('Error parsing tour IDs:', e)
        }
      }
      
      // Also check if there are any stored tour bookings directly
      const storedTours = localStorage.getItem('userTourBookings')
      if (storedTours) {
        try {
          const tours = JSON.parse(storedTours)
          // Merge with fetched tours, avoid duplicates
          const existingIds = new Set(bookingsData.map(t => t.id))
          for (const tour of tours) {
            if (!existingIds.has(tour.id)) {
              bookingsData.push(tour)
            }
          }
        } catch (e) {
          console.error('Error parsing stored tours:', e)
        }
      }
      
      // Sort by created date (newest first)
      bookingsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      
      tourBookings.value = bookingsData
      console.log('Processed user tour bookings:', tourBookings.value.length, 'bookings found')
      return bookingsData
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch user tour bookings'
      console.error('Error fetching user tour bookings:', err)
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
      
      // Store the tour ID in localStorage
      if (booking && booking.id) {
        const storedTourIds = localStorage.getItem('userTourIds')
        let tourIds = []
        if (storedTourIds) {
          try {
            tourIds = JSON.parse(storedTourIds)
          } catch (e) {
            console.error('Error parsing tour IDs:', e)
          }
        }
        if (!tourIds.includes(booking.id)) {
          tourIds.push(booking.id)
          localStorage.setItem('userTourIds', JSON.stringify(tourIds))
        }
        
        // Also store the full booking data
        const storedTours = localStorage.getItem('userTourBookings')
        let tours = []
        if (storedTours) {
          try {
            tours = JSON.parse(storedTours)
          } catch (e) {
            console.error('Error parsing stored tours:', e)
          }
        }
        // Remove existing entry with same ID if any
        tours = tours.filter(t => t.id !== booking.id)
        tours.push(booking)
        localStorage.setItem('userTourBookings', JSON.stringify(tours))
        
        // Update the current list
        tourBookings.value = tours
      }
      
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
      
      if (updatedBooking) {
        const index = tourBookings.value.findIndex(b => b.id === id)
        if (index !== -1) {
          tourBookings.value[index] = updatedBooking
        }
        // Update localStorage
        const storedTours = localStorage.getItem('userTourBookings')
        if (storedTours) {
          try {
            let tours = JSON.parse(storedTours)
            const idx = tours.findIndex(t => t.id === id)
            if (idx !== -1) {
              tours[idx] = updatedBooking
              localStorage.setItem('userTourBookings', JSON.stringify(tours))
            }
          } catch (e) {
            console.error('Error updating stored tours:', e)
          }
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

  // Helper to manually add a tour ID (useful if user has existing tours)
  const addTourId = (tourId) => {
    const storedTourIds = localStorage.getItem('userTourIds')
    let tourIds = []
    if (storedTourIds) {
      try {
        tourIds = JSON.parse(storedTourIds)
      } catch (e) {
        console.error('Error parsing tour IDs:', e)
      }
    }
    if (!tourIds.includes(tourId)) {
      tourIds.push(tourId)
      localStorage.setItem('userTourIds', JSON.stringify(tourIds))
    }
  }

  return {
    tourBookings,
    currentTourBooking,
    loading,
    error,
    submitting,
    pagination,
    fetchTourBookings,
    fetchUserTourBookings,
    createTourBooking,
    getTourBookingDetails,
    updateTourBookingStatus,
    clearCurrentTourBooking,
    addTourId
  }
}