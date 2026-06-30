// src/composables/useRooms.js
import { ref } from 'vue'
import { roomAPI, bookingAPI } from '../services/api'
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

  // ============================================
  // CLIENT-SIDE BOOKED SEATS TRACKING
  // ============================================
  
  /**
   * Get all booked seats from sessionStorage
   * Structure: [{ seat_id, room_id, booking_id, booked_at }]
   */
  const getBookedSeats = () => {
    try {
      const stored = sessionStorage.getItem('booked_seats')
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      console.error('Error reading booked seats:', e)
      return []
    }
  }

  /**
   * Save booked seats to sessionStorage
   */
  const saveBookedSeats = (bookedSeats) => {
    try {
      sessionStorage.setItem('booked_seats', JSON.stringify(bookedSeats))
    } catch (e) {
      console.error('Error saving booked seats:', e)
    }
  }

  /**
   * Add a newly booked seat to the tracking
   */
  const addBookedSeat = (seatId, roomId, bookingId) => {
    try {
      const bookedSeats = getBookedSeats()
      
      // Check if already tracked
      const existingIndex = bookedSeats.findIndex(
        bs => bs.seat_id == seatId && bs.room_id == roomId
      )
      
      if (existingIndex >= 0) {
        // Update existing entry
        bookedSeats[existingIndex] = {
          seat_id: seatId,
          room_id: roomId,
          booking_id: bookingId,
          booked_at: new Date().toISOString()
        }
      } else {
        // Add new entry
        bookedSeats.push({
          seat_id: seatId,
          room_id: roomId,
          booking_id: bookingId,
          booked_at: new Date().toISOString()
        })
      }
      
      saveBookedSeats(bookedSeats)
      console.log(`✅ Seat ${seatId} marked as booked for room ${roomId}`)
      
      // Immediately update rooms list if available
      updateRoomAvailabilityInList(roomId)
    } catch (e) {
      console.error('Failed to save booked seat:', e)
    }
  }

  /**
   * Remove a booked seat (e.g., when booking is cancelled)
   */
  const removeBookedSeat = (seatId, roomId) => {
    try {
      let bookedSeats = getBookedSeats()
      bookedSeats = bookedSeats.filter(
        bs => !(bs.seat_id == seatId && bs.room_id == roomId)
      )
      saveBookedSeats(bookedSeats)
      console.log(`🗑️ Seat ${seatId} removed from booked tracking for room ${roomId}`)
      
      // Update rooms list
      updateRoomAvailabilityInList(roomId)
    } catch (e) {
      console.error('Failed to remove booked seat:', e)
    }
  }

  /**
   * Get booked seat IDs for a specific room (combines client + API data)
   */
  const getBookedSeatIdsForRoom = (roomId) => {
    const bookedSeats = getBookedSeats()
    return bookedSeats
      .filter(bs => bs.room_id == roomId)
      .map(bs => bs.seat_id)
  }

  /**
   * Fetch booked seat IDs from both API bookings and client tracking
   */
  const fetchBookedSeatIds = async (roomId) => {
    try {
      // Get client-side tracked bookings
      const clientBooked = getBookedSeatIdsForRoom(roomId)
      
      // Also try to fetch from API
      try {
        const response = await bookingAPI.getAllBookings()
        let bookings = []
        
        if (response.data?.data) {
          bookings = Array.isArray(response.data.data) 
            ? response.data.data 
            : [response.data.data]
        } else if (Array.isArray(response.data)) {
          bookings = response.data
        }

        // Filter active bookings for this room
        const roomBookings = bookings.filter(b => 
          (b.room_id == roomId || b.room?.id == roomId) && 
          b.status !== 'cancelled' &&
          b.status !== 0 // Assuming 0 is cancelled
        )

        // Get seat IDs from API bookings
        const apiBookedSeatIds = roomBookings
          .filter(b => b.seat_id)
          .map(b => parseInt(b.seat_id))

        // Merge with client-side, remove duplicates
        const allBookedSeatIds = [...new Set([...clientBooked, ...apiBookedSeatIds])]
        
        console.log(`📊 Room ${roomId} booked seats:`, {
          clientTracked: clientBooked,
          apiBookings: apiBookedSeatIds,
          merged: allBookedSeatIds
        })

        return allBookedSeatIds
      } catch (apiErr) {
        console.warn('⚠️ Could not fetch bookings from API, using client-side only:', apiErr.message)
        return clientBooked
      }
    } catch (err) {
      console.error('❌ Error fetching booked seats:', err)
      return getBookedSeatIdsForRoom(roomId)
    }
  }

  /**
   * Sync booked seats from API bookings (useful on app init)
   */
  const syncBookedSeatsFromAPI = async () => {
    try {
      const response = await bookingAPI.getAllBookings()
      let bookings = []
      
      if (response.data?.data) {
        bookings = Array.isArray(response.data.data) 
          ? response.data.data 
          : [response.data.data]
      } else if (Array.isArray(response.data)) {
        bookings = response.data
      }

      // Filter active bookings with seats
      const activeBookings = bookings.filter(b => 
        b.seat_id && 
        b.room_id && 
        b.status !== 'cancelled' && 
        b.status !== 0
      )

      // Convert to booked seats format
      const bookedSeats = activeBookings.map(b => ({
        seat_id: parseInt(b.seat_id),
        room_id: parseInt(b.room_id),
        booking_id: b.id,
        booked_at: b.created_at || new Date().toISOString()
      }))

      // Also keep existing client-side bookings that might not be in API yet
      const existingBooked = getBookedSeats()
      const existingIds = new Set(bookedSeats.map(bs => `${bs.seat_id}_${bs.room_id}`))
      
      existingBooked.forEach(bs => {
        const key = `${bs.seat_id}_${bs.room_id}`
        if (!existingIds.has(key)) {
          bookedSeats.push(bs)
        }
      })

      saveBookedSeats(bookedSeats)
      console.log(`🔄 Synced ${bookedSeats.length} booked seats from API`)
      
      return bookedSeats
    } catch (err) {
      console.warn('⚠️ Failed to sync booked seats from API:', err.message)
      return getBookedSeats()
    }
  }

  /**
   * Update a specific room's availability in the rooms list
   */
  const updateRoomAvailabilityInList = (roomId) => {
    const roomIndex = rooms.value.findIndex(r => r.id == roomId)
    if (roomIndex === -1) return

    const room = rooms.value[roomIndex]
    const bookedSeatIds = getBookedSeatIdsForRoom(roomId)
    
    // Get total seats for this room
    const totalSeats = room.total_seats || room.seats_count || 0
    
    // If we don't know total seats, try to get from seats list
    let totalFromSeats = 0
    if (totalSeats === 0 && seats.value.length > 0) {
      totalFromSeats = seats.value.filter(s => s.room_id == roomId).length
    }

    const actualTotal = totalSeats || totalFromSeats || room.available_seats || 4
    const availableSeats = Math.max(0, actualTotal - bookedSeatIds.length)

    rooms.value[roomIndex] = {
      ...room,
      total_seats: actualTotal,
      available_seats: availableSeats,
      status: availableSeats > 0 ? 'available' : 'booked'
    }
  }

  /**
   * Refresh room availability after booking
   */
  const refreshRoomAvailability = async (roomId) => {
    if (!roomId) return
    
    try {
      // Re-fetch room details
      const roomData = await fetchRoomDetails(roomId)
      
      // Also update in rooms list
      if (roomData && rooms.value.length > 0) {
        const roomIndex = rooms.value.findIndex(r => r.id == roomId)
        if (roomIndex !== -1) {
          rooms.value[roomIndex] = {
            ...rooms.value[roomIndex],
            available_seats: roomData.available_seats,
            total_seats: roomData.total_seats,
            status: roomData.status,
            available_seats_list: roomData.available_seats_list || []
          }
        }
      }
      
      return roomData
    } catch (err) {
      console.error('Failed to refresh room availability:', err)
      return null
    }
  }

  // ============================================
  // REVIEW FUNCTIONS
  // ============================================

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

  // ============================================
  // ROOM FETCHING FUNCTIONS
  // ============================================

  const fetchRooms = async (all = 1) => {
    loading.value = true
    error.value = null
    try {
      console.log('🚀 Fetching rooms from API...')
      const response = await roomAPI.getRooms(all)
      console.log('📦 Rooms received:', response.data)
      
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
        total_seats: 0,
        rating: 0,
        review_count: 0
      }))
      
      // Fetch seats first (needed for total seat count)
      try {
        await fetchSeats()
      } catch (err) {
        console.warn('Could not fetch seats:', err.message)
      }
      
      // Sync booked seats from API
      await syncBookedSeatsFromAPI()
      
      // Batch availability and review API calls
      const [availResults, reviewResults] = await Promise.all([
        Promise.allSettled(
          roomsData.map(room => {
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Timeout')), 10000)
            })
            return Promise.race([
              roomAPI.getRoomAvailability(room.id),
              timeoutPromise
            ])
          })
        ),
        Promise.allSettled(
          roomsData.map(room => fetchRoomReviews(room.id))
        )
      ])

      // Process all rooms at once using batched results
      const bookedSeatsData = getBookedSeats()

      rooms.value = roomsData.map((room, i) => {
        const roomSeats = seats.value.filter(s => s.room_id == room.id)
        const total_seats = roomSeats.length || 4
        const bookedSeatIds = bookedSeatsData
          .filter(bs => bs.room_id == room.id)
          .map(bs => bs.seat_id)

        let status = 'unknown'
        let available_seats = 0
        let rating = 0
        let reviewCount = 0

        // Process availability from batched results
        const availResult = availResults[i]
        if (availResult.status === 'fulfilled' && availResult.value?.data) {
          let availData = availResult.value.data
          if (availData.data) availData = availData.data
          
          const apiAvailableCount = availData.available_count || 0
          available_seats = Math.max(0, apiAvailableCount - bookedSeatIds.length)
          status = available_seats > 0 ? 'available' : 'booked'
        } else {
          available_seats = Math.max(0, total_seats - bookedSeatIds.length)
          status = available_seats > 0 ? 'available' : 'booked'
        }

        // Process reviews from batched results
        const reviewResult = reviewResults[i]
        if (reviewResult.status === 'fulfilled' && reviewResult.value) {
          rating = reviewResult.value.averageRating
          reviewCount = reviewResult.value.reviewCount
        }

        return {
          ...room,
          status,
          available_seats,
          total_seats,
          rating,
          review_count: reviewCount
        }
      })
      
      console.log('✅ Rooms with accurate availability:', rooms.value.map(r => ({
        id: r.id,
        number: r.room_number,
        total: r.total_seats,
        available: r.available_seats,
        status: r.status
      })))
      
      return response.data
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('Rooms API not available (404), using empty state')
        rooms.value = []
        return []
      }
      console.error('❌ Error fetching rooms:', err)
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
      console.log(`🔍 Fetching room details for ID: ${id}`)
      
      // Fetch room data, availability, booked seats, and seats in parallel
      const [roomResponse, availabilityResponse, bookedSeatIds, seatsResponse] = await Promise.allSettled([
        roomAPI.getRoomDetails(id),
        roomAPI.getRoomAvailability(id).catch(() => null),
        fetchBookedSeatIds(id),
        roomAPI.getSeats().catch(() => ({ data: { data: [] } }))
      ])
      
      console.log('Room details response:', roomResponse.value?.data)
      
      let roomData = null
      if (roomResponse.status === 'fulfilled' && roomResponse.value?.data) {
        if (roomResponse.value.data.data) {
          roomData = roomResponse.value.data.data
        } else {
          roomData = roomResponse.value.data
        }
      }
      
      // Process seat availability
      if (roomData) {
        // Get total seats for this room
        let roomSeats = []
        if (seatsResponse.status === 'fulfilled' && seatsResponse.value?.data) {
          if (seatsResponse.value.data.data) {
            roomSeats = seatsResponse.value.data.data.filter(s => s.room_id == id)
          } else if (Array.isArray(seatsResponse.value.data)) {
            roomSeats = seatsResponse.value.data.filter(s => s.room_id == id)
          }
        }
        
        roomData.total_seats = roomSeats.length || 4
        
        // Get booked seat IDs
        const bookedIds = bookedSeatIds.status === 'fulfilled' ? bookedSeatIds.value : []
        
        // Process availability
        if (availabilityResponse.status === 'fulfilled' && availabilityResponse.value?.data) {
          let availData = availabilityResponse.value.data
          if (availData.data) availData = availData.data
          
          const apiAvailableSeats = availData.available_seats || []
          const apiAvailableCount = availData.available_count || apiAvailableSeats.length
          
          // Filter out booked seats
          const actuallyAvailable = apiAvailableSeats.filter(
            seat => {
              const seatId = seat.id || seat.seat_id || seat
              return !bookedIds.includes(parseInt(seatId))
            }
          )
          
          roomData.available_seats = actuallyAvailable.length
          roomData.available_seats_list = actuallyAvailable
          roomData.status = actuallyAvailable.length > 0 ? 'available' : 'booked'
        } else {
          // Calculate manually
          roomData.available_seats = Math.max(0, roomData.total_seats - bookedIds.length)
          roomData.available_seats_list = roomSeats.filter(s => !bookedIds.includes(s.id))
          roomData.status = roomData.available_seats > 0 ? 'available' : 'booked'
        }
        
        console.log(`📊 Room ${id} details:`, {
          total: roomData.total_seats,
          booked: bookedIds,
          available: roomData.available_seats,
          status: roomData.status
        })
      }
      
      // Fetch reviews for this room
      if (roomData) {
        const reviews = await fetchRoomReviews(id)
        roomData.rating = reviews.averageRating
        roomData.review_count = reviews.reviewCount
      }
      
      currentRoom.value = roomData
      return roomData
    } catch (err) {
      console.error('❌ Error fetching room details:', err)
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
      
      // Update total_seats for rooms in the list
      rooms.value = rooms.value.map(room => {
        const roomSeats = seats.value.filter(s => s.room_id == room.id)
        return {
          ...room,
          total_seats: roomSeats.length || room.total_seats || 4
        }
      })
      
      return response.data
    } catch (err) {
      console.error('Error fetching seats:', err)
      return { data: [] }
    }
  }

  // ============================================
  // LAZY LOADING - Fast initial fetch + lazy availability/reviews
  // ============================================

  /**
   * Fast initial fetch: loads rooms, seats, and syncs bookings
   * but skips batch availability/reviews. Rooms get 'checking' status.
   * Use loadRoomLazy(roomId) to lazily fetch availability per room.
   */
  const fetchRoomsFast = async (all = 1) => {
    loading.value = true
    error.value = null
    try {
      console.log('🚀 Fast-fetching rooms...')
      const response = await roomAPI.getRooms(all)

      let roomsData = []
      if (response.data && response.data.data) {
        roomsData = response.data.data
      } else if (Array.isArray(response.data)) {
        roomsData = response.data
      }

      rooms.value = roomsData.map(room => ({
        ...room,
        status: 'checking',
        available_seats: 0,
        total_seats: 0,
        rating: 0,
        review_count: 0
      }))

      try {
        await fetchSeats()
      } catch (err) {
        console.warn('Could not fetch seats:', err.message)
      }

      await syncBookedSeatsFromAPI()

      const bookedSeatsData = getBookedSeats()
      rooms.value = roomsData.map(room => {
        const roomSeats = seats.value.filter(s => s.room_id == room.id)
        const total_seats = roomSeats.length || 4
        const bookedSeatIds = bookedSeatsData
          .filter(bs => bs.room_id == room.id)
          .map(bs => bs.seat_id)
        const available_seats = Math.max(0, total_seats - bookedSeatIds.length)

        return {
          ...room,
          status: 'checking',
          available_seats,
          total_seats,
          rating: 0,
          review_count: 0
        }
      })

      console.log(`✅ Fast-loaded ${rooms.value.length} rooms (availability lazy)`)
      return response.data
    } catch (err) {
      if (err.response?.status === 404) {
        rooms.value = []
        return []
      }
      error.value = err.message || 'Failed to fetch rooms'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Lazy-load availability and reviews for a single room.
   * Updates the room in the rooms array reactively.
   */
  const loadRoomLazy = async (roomId) => {
    const index = rooms.value.findIndex(r => r.id == roomId)
    if (index === -1) return

    const room = rooms.value[index]
    if (room.status !== 'checking') return // already resolved

    console.log(`🔍 Lazy-loading availability for room ${roomId}...`)

    try {
      const [availResult, reviewResult] = await Promise.allSettled([
        roomAPI.getRoomAvailability(roomId),
        fetchRoomReviews(roomId)
      ])

      const bookedSeatsData = getBookedSeats()
      const bookedSeatIds = bookedSeatsData
        .filter(bs => bs.room_id == roomId)
        .map(bs => bs.seat_id)

      let status = 'unknown'
      let available_seats = 0

      if (availResult.status === 'fulfilled' && availResult.value?.data) {
        let availData = availResult.value.data
        if (availData.data) availData = availData.data
        const apiAvailableCount = availData.available_count || 0
        available_seats = Math.max(0, apiAvailableCount - bookedSeatIds.length)
        status = available_seats > 0 ? 'available' : 'booked'
      } else {
        available_seats = Math.max(0, room.total_seats - bookedSeatIds.length)
        status = available_seats > 0 ? 'available' : 'booked'
      }

      let rating = 0
      let reviewCount = 0
      if (reviewResult.status === 'fulfilled' && reviewResult.value) {
        rating = reviewResult.value.averageRating
        reviewCount = reviewResult.value.reviewCount
      }

      rooms.value[index] = {
        ...rooms.value[index],
        status,
        available_seats,
        rating,
        review_count: reviewCount
      }

      console.log(`✅ Room ${roomId} resolved: ${status} (${available_seats} seats)`)
    } catch (err) {
      console.error(`❌ Failed lazy load for room ${roomId}:`, err)
      rooms.value[index] = {
        ...rooms.value[index],
        status: 'unknown'
      }
    }
  }

  // ============================================
  // RETURN ALL FUNCTIONS AND STATE
  // ============================================

  return {
    // State
    rooms,
    roomTypes,
    seats,
    loading,
    error,
    currentRoom,

    // Room fetching
    fetchRooms,
    fetchRoomsFast,
    fetchRoomTypes,
    fetchRoomDetails,
    fetchSeats,
    checkRoomAvailability,

    // Lazy loading
    loadRoomLazy,

    // Seat tracking
    addBookedSeat,
    removeBookedSeat,
    getBookedSeats,
    getBookedSeatIdsForRoom,
    refreshRoomAvailability,
    syncBookedSeatsFromAPI
  }
}