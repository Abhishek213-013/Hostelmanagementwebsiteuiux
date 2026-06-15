// src/composables/useRooms.js
import { ref } from 'vue'
import { roomAPI } from '../services/api'

export function useRooms() {
  const rooms = ref([])
  const roomTypes = ref([])
  const seats = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentRoom = ref(null)

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
      rooms.value = roomsData.map(room => ({ ...room, status: 'checking', available_seats: 0 }))
      
      // Then fetch availability in parallel with individual timeout
      const availabilityPromises = roomsData.map(async (room) => {
        try {
          // Create a promise with timeout for each room
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout')), 10000) // 10 second timeout per room
          })
          
          const availabilityPromise = roomAPI.getRoomAvailability(room.id)
          const availability = await Promise.race([availabilityPromise, timeoutPromise])
          
          let status = 'unknown'
          let available_seats = 0
          
          if (availability && availability.data) {
            let availData = availability.data
            if (availData.data) availData = availData.data
            
            status = availData.is_available && availData.available_count > 0 ? 'available' : 'booked'
            available_seats = availData.available_count || 0
          }
          
          return { roomId: room.id, status, available_seats }
        } catch (err) {
          console.warn(`Failed to fetch availability for room ${room.id}:`, err.message)
          return { roomId: room.id, status: 'unknown', available_seats: 0 }
        }
      })
      
      // Wait for all availability checks to complete (or timeout)
      const availabilityResults = await Promise.allSettled(availabilityPromises)
      
      // Update rooms with availability data
      rooms.value = roomsData.map(room => {
        const result = availabilityResults.find(r => r.value?.roomId === room.id)
        if (result && result.value) {
          return {
            ...room,
            status: result.value.status,
            available_seats: result.value.available_seats
          }
        }
        return { ...room, status: 'unknown', available_seats: 0 }
      })
      
      console.log('Rooms with availability:', rooms.value)
      return response.data
    } catch (err) {
      console.error('Error fetching rooms:', err)
      error.value = err.message || 'Failed to fetch rooms'
      throw err
    } finally {
      loading.value = false
    }
  }

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
      
      // Fetch room details and availability in parallel with timeout
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
      
      // Handle different response structures
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
      
      currentRoom.value = roomData
      console.log('Room data with availability:', currentRoom.value)
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
    fetchRoomTypes,
    fetchRoomDetails,
    fetchSeats,
    checkRoomAvailability
  }
}