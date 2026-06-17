// src/composables/useRooms.js
import { ref } from 'vue'
import { roomAPI } from '../services/api'
import { reviewsAPI } from '../services/api'

export function useRooms() {
  const rooms = ref([])
  const roomTypes = ref([])
  const seats = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentRoom = ref(null)

  // Cache for review data to avoid repeated API calls
  const reviewCache = new Map()
  const REVIEW_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  const fetchRoomReviews = async (roomId) => {
    // Check cache first
    const cacheKey = `room_${roomId}_reviews`
    if (reviewCache.has(cacheKey)) {
      const cached = reviewCache.get(cacheKey)
      if (Date.now() - cached.timestamp < REVIEW_CACHE_DURATION) {
        return cached.data
      }
    }

    try {
      const response = await reviewsAPI.getReviews({ room_id: roomId })
      
      let reviewsData = []
      if (response.data && response.data.data) {
        reviewsData = response.data.data
      } else if (Array.isArray(response.data)) {
        reviewsData = response.data
      }

      let averageRating = 0
      let reviewCount = 0
      
      if (reviewsData.length > 0) {
        const total = reviewsData.reduce((sum, r) => sum + (r.rating || 0), 0)
        averageRating = parseFloat((total / reviewsData.length).toFixed(1))
        reviewCount = reviewsData.length
      }

      const result = { averageRating, reviewCount }
      
      reviewCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      })

      return result
    } catch (err) {
      console.error(`Failed to fetch reviews for room ${roomId}:`, err)
      return { averageRating: 0, reviewCount: 0 }
    }
  }

  const fetchRooms = async (all = 1) => {
    loading.value = true
    error.value = null
    try {
      console.log('Fetching rooms from API...')
      const response = await roomAPI.getRooms(all)
      console.log('Rooms received:', response.data)
      
      let roomsData = []
      if (response.data && response.data.data) {
        roomsData = response.data.data
      } else if (Array.isArray(response.data)) {
        roomsData = response.data
      }
      
      // Set rooms immediately without availability (faster initial load)
      rooms.value = roomsData.map(room => ({ 
        ...room, 
        status: 'checking', 
        available_seats: 0,
        rating: 0,
        review_count: 0
      }))
      
      // Fetch availability and reviews in parallel
      const roomPromises = roomsData.map(async (room) => {
        // Fetch availability
        let status = 'unknown'
        let available_seats = 0
        
        try {
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout')), 10000)
          })
          
          const availabilityPromise = roomAPI.getRoomAvailability(room.id)
          const availability = await Promise.race([availabilityPromise, timeoutPromise])
          
          if (availability && availability.data) {
            let availData = availability.data
            if (availData.data) availData = availData.data
            
            status = availData.is_available && availData.available_count > 0 ? 'available' : 'booked'
            available_seats = availData.available_count || 0
          }
        } catch (err) {
          console.warn(`Failed to fetch availability for room ${room.id}:`, err.message)
        }

        // Fetch reviews for rating
        let rating = 0
        let reviewCount = 0
        try {
          const reviews = await fetchRoomReviews(room.id)
          rating = reviews.averageRating
          reviewCount = reviews.reviewCount
        } catch (err) {
          console.warn(`Failed to fetch reviews for room ${room.id}:`, err.message)
        }
        
        return { 
          roomId: room.id, 
          status, 
          available_seats,
          rating,
          reviewCount
        }
      })
      
      // Wait for all promises to complete
      const results = await Promise.allSettled(roomPromises)
      
      // Update rooms with availability and review data
      rooms.value = roomsData.map(room => {
        const result = results.find(r => r.value?.roomId === room.id)
        if (result && result.value) {
          return {
            ...room,
            status: result.value.status,
            available_seats: result.value.available_seats,
            rating: result.value.rating,
            review_count: result.value.reviewCount
          }
        }
        return { 
          ...room, 
          status: 'unknown', 
          available_seats: 0,
          rating: 0,
          review_count: 0
        }
      })
      
      console.log('Rooms with availability and ratings:', rooms.value)
      return response.data
    } catch (err) {
      console.error('Error fetching rooms:', err)
      error.value = err.message || 'Failed to fetch rooms'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Add this function - it was missing
  const fetchRoomTypes = async (all = 1) => {
    loading.value = true
    error.value = null
    try {
      console.log('Fetching room types from API...')
      const response = await roomAPI.getRoomTypes(all)
      console.log('Room types received:', response.data)
      
      if (response.data && response.data.data) {
        roomTypes.value = response.data.data
      } else if (Array.isArray(response.data)) {
        roomTypes.value = response.data
      } else {
        roomTypes.value = []
      }
      
      return response.data
    } catch (err) {
      console.error('Error fetching room types:', err)
      error.value = err.message || 'Failed to fetch room types'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchRoomDetails = async (id) => {
    if (!id) {
      error.value = 'Room ID is required'
      return null
    }
    
    loading.value = true
    error.value = null
    try {
      console.log(`Fetching room details for ID: ${id}`)
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 15000)
      })
      
      const roomPromise = roomAPI.getRoomDetails(id)
      const availabilityPromise = roomAPI.getRoomAvailability(id)
      
      const [roomResponse, availabilityResponse] = await Promise.race([
        Promise.all([roomPromise, availabilityPromise]),
        timeoutPromise.then(() => { throw new Error('Timeout') })
      ])
      
      console.log('Room details response:', roomResponse.data)
      console.log('Room availability response:', availabilityResponse.data)
      
      let roomData = null
      if (roomResponse.data && roomResponse.data.data) {
        roomData = roomResponse.data.data
      } else if (roomResponse.data) {
        roomData = roomResponse.data
      }
      
      // Add availability info to room data
      if (roomData && availabilityResponse.data) {
        let availData = availabilityResponse.data
        if (availData.data) availData = availData.data
        
        roomData.status = availData.is_available && availData.available_count > 0 ? 'available' : 'booked'
        roomData.available_seats = availData.available_count || 0
        roomData.available_seats_list = availData.available_seats || []
      }
      
      // Fetch reviews for this room
      if (roomData) {
        const reviews = await fetchRoomReviews(id)
        roomData.rating = reviews.averageRating
        roomData.review_count = reviews.reviewCount
      }
      
      currentRoom.value = roomData
      console.log('Room data with availability and rating:', currentRoom.value)
      return roomData
    } catch (err) {
      console.error('Error fetching room details:', err)
      if (err.message === 'Timeout' || err.message === 'Request timeout') {
        error.value = 'Request timed out. Please check your connection and try again.'
      } else {
        error.value = err.message || 'Failed to fetch room details'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  const checkRoomAvailability = async (roomId) => {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 10000)
      })
      
      const availabilityPromise = roomAPI.getRoomAvailability(roomId)
      const response = await Promise.race([availabilityPromise, timeoutPromise])
      return response.data
    } catch (err) {
      console.error('Error checking availability:', err)
      throw err
    }
  }

  const fetchSeats = async () => {
    loading.value = true
    error.value = null
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 10000)
      })
      
      const seatsPromise = roomAPI.getSeats()
      const response = await Promise.race([seatsPromise, timeoutPromise])
      
      if (response.data && response.data.data) {
        seats.value = response.data.data
      } else if (Array.isArray(response.data)) {
        seats.value = response.data
      } else {
        seats.value = []
      }
      return response.data
    } catch (err) {
      console.error('Error fetching seats:', err)
      error.value = err.message || 'Failed to fetch seats'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    rooms,
    roomTypes,
    seats,
    loading,
    error,
    currentRoom,
    fetchRooms,
    fetchRoomTypes, // Make sure this is included in the return
    fetchRoomDetails,
    fetchSeats,
    checkRoomAvailability
  }
}