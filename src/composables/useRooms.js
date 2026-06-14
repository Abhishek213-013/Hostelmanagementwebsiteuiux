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
  const availabilityCache = ref(new Map()) // Cache availability data

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
      
      // Fetch availability for each room
      const roomsWithAvailability = await Promise.all(
        roomsData.map(async (room) => {
          try {
            const availability = await roomAPI.getRoomAvailability(room.id)
            console.log(`Room ${room.id} availability:`, availability.data)
            
            // Determine status based on availability
            let status = 'unknown'
            if (availability.data && availability.data.data) {
              const availData = availability.data.data
              status = availData.is_available && availData.available_count > 0 ? 'available' : 'booked'
            } else if (availability.data) {
              status = availability.data.is_available && availability.data.available_count > 0 ? 'available' : 'booked'
            }
            
            return {
              ...room,
              status: status,
              available_seats: availability.data?.data?.available_count || availability.data?.available_count || 0,
              availability_data: availability.data
            }
          } catch (err) {
            console.error(`Failed to fetch availability for room ${room.id}:`, err)
            return { ...room, status: 'unknown', available_seats: 0 }
          }
        })
      )
      
      rooms.value = roomsWithAvailability
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
      const [roomResponse, availabilityResponse] = await Promise.all([
        roomAPI.getRoomDetails(id),
        roomAPI.getRoomAvailability(id)
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
      error.value = err.message || 'Failed to fetch room details'
      throw err
    } finally {
      loading.value = false
    }
  }

  const checkRoomAvailability = async (roomId) => {
    try {
      const response = await roomAPI.getRoomAvailability(roomId)
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
      const response = await roomAPI.getSeats()
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