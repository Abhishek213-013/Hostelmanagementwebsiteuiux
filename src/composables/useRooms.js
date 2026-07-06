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
  
  const getBookedSeats = () => {
    try {
      const stored = sessionStorage.getItem('booked_seats')
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      console.error('Error reading booked seats:', e)
      return []
    }
  }

  const saveBookedSeats = (bookedSeats) => {
    try {
      sessionStorage.setItem('booked_seats', JSON.stringify(bookedSeats))
    } catch (e) {
      console.error('Error saving booked seats:', e)
    }
  }

  const addBookedSeat = (seatId, roomId, bookingId) => {
    try {
      const bookedSeats = getBookedSeats()
      const existingIndex = bookedSeats.findIndex(
        bs => bs.seat_id == seatId && bs.room_id == roomId
      )
      
      if (existingIndex >= 0) {
        bookedSeats[existingIndex] = {
          seat_id: seatId,
          room_id: roomId,
          booking_id: bookingId,
          booked_at: new Date().toISOString()
        }
      } else {
        bookedSeats.push({
          seat_id: seatId,
          room_id: roomId,
          booking_id: bookingId,
          booked_at: new Date().toISOString()
        })
      }
      
      saveBookedSeats(bookedSeats)
      updateRoomAvailabilityInList(roomId)
    } catch (e) {
      console.error('Failed to save booked seat:', e)
    }
  }

  const removeBookedSeat = (seatId, roomId) => {
    try {
      let bookedSeats = getBookedSeats()
      bookedSeats = bookedSeats.filter(
        bs => !(bs.seat_id == seatId && bs.room_id == roomId)
      )
      saveBookedSeats(bookedSeats)
      updateRoomAvailabilityInList(roomId)
    } catch (e) {
      console.error('Failed to remove booked seat:', e)
    }
  }

  const getBookedSeatIdsForRoom = (roomId) => {
    const bookedSeats = getBookedSeats()
    return bookedSeats
      .filter(bs => bs.room_id == roomId)
      .map(bs => bs.seat_id)
  }

  const fetchBookedSeatIds = async (roomId) => {
    try {
      const clientBooked = getBookedSeatIdsForRoom(roomId)
      
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

        const roomBookings = bookings.filter(b => 
          (b.room_id == roomId || b.room?.id == roomId) && 
          b.status !== 'cancelled' &&
          b.status !== 0
        )

        const apiBookedSeatIds = roomBookings
          .filter(b => b.seat_id)
          .map(b => parseInt(b.seat_id))

        const allBookedSeatIds = [...new Set([...clientBooked, ...apiBookedSeatIds])]

        return allBookedSeatIds
      } catch (apiErr) {
        return clientBooked
      }
    } catch (err) {
      return getBookedSeatIdsForRoom(roomId)
    }
  }

  /**
   * FIXED: Sync booked seats from API - REPLACE sessionStorage completely
   * instead of merging, to avoid stale/wrong data accumulation
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

      console.log('📋 ALL BOOKINGS from API:', bookings.map(b => ({
        id: b.id,
        room_id: b.room_id,
        room_obj_id: b.room?.id,
        seat_id: b.seat_id,
        status: b.status,
        party_name: b.party?.party_name || b.party?.name
      })))

      // Filter active bookings that have BOTH seat_id AND room_id
      const activeBookings = bookings.filter(b => 
        b.seat_id && 
        b.room_id && 
        b.status !== 'cancelled' && 
        b.status !== 0
      )

      console.log('📋 ACTIVE BOOKINGS:', activeBookings.map(b => ({
        id: b.id,
        room_id: b.room_id,
        seat_id: b.seat_id
      })))

      // COMPLETELY REPLACE sessionStorage with fresh API data
      const bookedSeats = activeBookings.map(b => ({
        seat_id: parseInt(b.seat_id),
        room_id: parseInt(b.room_id),
        booking_id: b.id,
        booked_at: b.created_at || new Date().toISOString()
      }))

      // Group by room for debugging
      const byRoom = {}
      bookedSeats.forEach(bs => {
        if (!byRoom[bs.room_id]) byRoom[bs.room_id] = []
        byRoom[bs.room_id].push(bs)
      })
      console.log('📊 Booked seats by room_id:', byRoom)

      // Replace entirely - don't merge with old data
      saveBookedSeats(bookedSeats)
      console.log(`🔄 Synced ${bookedSeats.length} booked seats from API (sessionStorage replaced)`)
      
      return bookedSeats
    } catch (err) {
      console.warn('⚠️ Failed to sync booked seats from API:', err.message)
      return getBookedSeats()
    }
  }

  const updateRoomAvailabilityInList = (roomId) => {
    const roomIndex = rooms.value.findIndex(r => r.id == roomId)
    if (roomIndex === -1) return

    const room = rooms.value[roomIndex]
    const bookedSeatIds = getBookedSeatIdsForRoom(roomId)
    const actualTotal = room.total_seats || 0
    const availableSeats = actualTotal > 0 ? Math.max(0, actualTotal - bookedSeatIds.length) : 0

    rooms.value[roomIndex] = {
      ...room,
      available_seats: availableSeats,
      status: actualTotal > 0 ? (availableSeats > 0 ? 'available' : 'booked') : 'booked'
    }
  }

  const refreshRoomAvailability = async (roomId) => {
    if (!roomId) return
    try {
      const roomData = await fetchRoomDetails(roomId)
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
  // HELPER: Parse seats from various API response formats
  // ============================================
  const parseSeatsFromResponse = (responseData) => {
    if (!responseData) return []
    
    let seatsArray = []
    
    if (responseData.seats && typeof responseData.seats === 'object' && !Array.isArray(responseData.seats)) {
      if (Array.isArray(responseData.seats.data)) {
        seatsArray = responseData.seats.data
      }
    } else if (responseData.data && responseData.data.seats && typeof responseData.data.seats === 'object' && !Array.isArray(responseData.data.seats)) {
      if (Array.isArray(responseData.data.seats.data)) {
        seatsArray = responseData.data.seats.data
      }
    } else if (responseData.seats && Array.isArray(responseData.seats)) {
      seatsArray = responseData.seats
    } else if (responseData.data && responseData.data.seats && Array.isArray(responseData.data.seats)) {
      seatsArray = responseData.data.seats
    } else if (responseData.data && Array.isArray(responseData.data)) {
      seatsArray = responseData.data
    } else if (Array.isArray(responseData)) {
      seatsArray = responseData
    }
    
    return seatsArray
  }

  // ============================================
  // ROOM FETCHING FUNCTIONS
  // ============================================

  const fetchRooms = async (all = 1) => {
    loading.value = true
    error.value = null
    try {
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
      
      try { await fetchSeats() } catch (err) { console.warn('Could not fetch seats:', err.message) }
      
      await syncBookedSeatsFromAPI()
      
      const [availResults, reviewResults] = await Promise.all([
        Promise.allSettled(roomsData.map(room => {
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
          return Promise.race([roomAPI.getRoomAvailability(room.id), timeoutPromise])
        })),
        Promise.allSettled(roomsData.map(room => fetchRoomReviews(room.id)))
      ])

      const bookedSeatsData = getBookedSeats()

      rooms.value = roomsData.map((room, i) => {
        const roomSeats = seats.value.filter(s => {
          const seatRoomId = s.room_id || s.room?.id || s.roomId
          return seatRoomId == room.id
        })
        const total_seats = roomSeats.length
        const bookedSeatIds = bookedSeatsData
          .filter(bs => bs.room_id == room.id)
          .map(bs => bs.seat_id)

        let status = 'unknown'
        let available_seats = 0
        let rating = 0
        let reviewCount = 0

        const availResult = availResults[i]
        if (availResult.status === 'fulfilled' && availResult.value?.data) {
          let availData = availResult.value.data
          if (availData.data) availData = availData.data
          
          const apiAvailableCount = availData.available_count || 0
          available_seats = total_seats > 0 
            ? Math.max(0, apiAvailableCount - bookedSeatIds.length)
            : 0
          status = total_seats > 0 
            ? (available_seats > 0 ? 'available' : 'booked')
            : 'booked'
        } else {
          if (total_seats > 0) {
            available_seats = Math.max(0, total_seats - bookedSeatIds.length)
            status = available_seats > 0 ? 'available' : 'booked'
          } else {
            available_seats = 0
            status = 'booked'
          }
        }

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

  const fetchRoomTypes = async (all = 1) => {
    try {
      const response = await roomAPI.getRoomTypes(all)
      if (response.data && response.data.data) {
        roomTypes.value = response.data.data
      } else if (Array.isArray(response.data)) {
        roomTypes.value = response.data
      } else {
        roomTypes.value = []
      }
      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to fetch room types'
      throw err
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
      
      const [roomResponse, availabilityResponse, bookedSeatIds, seatsResponse] = await Promise.allSettled([
        roomAPI.getRoomDetails(id),
        roomAPI.getRoomAvailability(id).catch(() => null),
        fetchBookedSeatIds(id),
        roomAPI.getSeats().catch(() => ({ data: { seats: { data: [] } } }))
      ])
      
      let roomData = null
      if (roomResponse.status === 'fulfilled' && roomResponse.value?.data) {
        roomData = roomResponse.value.data.data || roomResponse.value.data
      }
      
      if (roomData) {
        let roomSeats = []
        if (seatsResponse.status === 'fulfilled' && seatsResponse.value?.data) {
          const seatsArray = parseSeatsFromResponse(seatsResponse.value.data)
          if (seatsArray.length > 0) {
            roomSeats = seatsArray.filter(s => {
              const seatRoomId = s.room_id || s.room?.id || s.roomId
              return seatRoomId == id
            })
          }
        }
        
        roomData.total_seats = roomSeats.length
        const bookedIds = bookedSeatIds.status === 'fulfilled' ? bookedSeatIds.value : []
        
        console.log(`🪑 Room ${id}: seats=${roomSeats.length}, booked=${bookedIds.length}`)
        
        if (availabilityResponse.status === 'fulfilled' && availabilityResponse.value?.data) {
          let availData = availabilityResponse.value.data
          if (availData.data) availData = availData.data
          
          const apiAvailableSeats = Array.isArray(availData.available_seats) ? availData.available_seats : []
          
          if (roomSeats.length > 0) {
            const actuallyAvailable = apiAvailableSeats.filter(seat => {
              const seatId = seat.id || seat.seat_id || seat
              return !bookedIds.includes(parseInt(seatId))
            })
            roomData.available_seats = actuallyAvailable.length
            roomData.available_seats_list = actuallyAvailable
          } else {
            roomData.available_seats = 0
            roomData.available_seats_list = []
          }
          
          roomData.status = roomData.available_seats > 0 ? 'available' : 'booked'
        } else {
          if (roomSeats.length > 0) {
            roomData.available_seats = Math.max(0, roomSeats.length - bookedIds.length)
          } else {
            roomData.available_seats = 0
          }
          roomData.status = roomData.available_seats > 0 ? 'available' : 'booked'
        }
      }
      
      if (roomData) {
        const reviews = await fetchRoomReviews(id)
        roomData.rating = reviews.averageRating
        roomData.review_count = reviews.reviewCount
      }
      
      currentRoom.value = roomData
      return roomData
    } catch (err) {
      console.error('❌ Error fetching room details:', err)
      error.value = err.message || 'Failed to fetch room details'
      throw err
    } finally {
      loading.value = false
    }
  }

  const checkRoomAvailability = async (roomId) => {
    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
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
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
      const seatsPromise = roomAPI.getSeats()
      const response = await Promise.race([seatsPromise, timeoutPromise])
      
      const seatsData = parseSeatsFromResponse(response.data)
      
      console.log('📦 Processed seats count:', seatsData.length)
      
      if (seatsData.length > 0) {
        seats.value = seatsData
        
        // Group by room_id for debugging
        const byRoom = {}
        seatsData.forEach(s => {
          const rid = s.room_id || s.room?.id
          if (!byRoom[rid]) byRoom[rid] = []
          byRoom[rid].push(s)
        })
        console.log('🏠 Seats by room:', Object.entries(byRoom).map(([rid, seats]) => ({
          roomId: rid,
          count: seats.length,
          seatIds: seats.map(s => s.id)
        })))
        
        // Update rooms with correct total_seats
        if (rooms.value.length > 0) {
          rooms.value = rooms.value.map(room => {
            const roomSeats = seatsData.filter(s => {
              const seatRoomId = s.room_id || s.room?.id || s.roomId
              return seatRoomId == room.id
            })
            return { ...room, total_seats: roomSeats.length }
          })
        }
      } else {
        seats.value = []
      }
      
      return response.data
    } catch (err) {
      console.error('❌ Error fetching seats:', err)
      seats.value = []
      return { data: [] }
    }
  }

  // ============================================
  // LAZY LOADING
  // ============================================

  const fetchRoomsFast = async (all = 1) => {
    loading.value = true
    error.value = null
    try {
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

      const [seatsResult, syncResult] = await Promise.allSettled([
        fetchSeats(),
        syncBookedSeatsFromAPI()
      ])

      if (seatsResult.status === 'rejected') {
        console.warn('Could not fetch seats:', seatsResult.reason?.message)
      }
      if (syncResult.status === 'rejected') {
        console.warn('Could not sync bookings:', syncResult.reason?.message)
      }

      const bookedSeatsData = getBookedSeats()
      
      console.log('📊 Total booked seats in sessionStorage:', bookedSeatsData.length)
      
      rooms.value = roomsData.map(room => {
        const roomSeats = seats.value.filter(s => {
          const seatRoomId = s.room_id || s.room?.id || s.roomId
          return seatRoomId == room.id
        })
        
        const total_seats = roomSeats.length
        
        if (total_seats === 0) {
          return {
            ...room,
            status: 'booked',
            available_seats: 0,
            total_seats: 0,
            rating: 0,
            review_count: 0
          }
        }
        
        const bookedSeatIds = bookedSeatsData
          .filter(bs => bs.room_id == room.id)
          .map(bs => bs.seat_id)
        
        const available_seats = Math.max(0, total_seats - bookedSeatIds.length)
        const status = available_seats > 0 ? 'available' : 'booked'

        return {
          ...room,
          status,
          available_seats,
          total_seats,
          rating: 0,
          review_count: 0
        }
      })

      console.log('📋 Final rooms:', rooms.value.map(r => ({ 
        id: r.id, 
        number: r.room_number, 
        total: r.total_seats, 
        available: r.available_seats, 
        status: r.status 
      })))
      
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

  const loadRoomLazy = async (roomId) => {
    const index = rooms.value.findIndex(r => r.id == roomId)
    if (index === -1) return

    const room = rooms.value[index]
    if (room.review_count > 0) return

    try {
      const reviewResult = await fetchRoomReviews(roomId)
      let rating = 0
      let reviewCount = 0
      if (reviewResult) {
        rating = reviewResult.averageRating
        reviewCount = reviewResult.reviewCount
      }

      rooms.value[index] = {
        ...rooms.value[index],
        rating,
        review_count: reviewCount
      }
    } catch (err) {
      console.error(`❌ Failed lazy load reviews for room ${roomId}:`, err)
    }
  }

  // ============================================
  // RETURN ALL FUNCTIONS AND STATE
  // ============================================

  return {
    rooms,
    roomTypes,
    seats,
    loading,
    error,
    currentRoom,

    fetchRooms,
    fetchRoomsFast,
    fetchRoomTypes,
    fetchRoomDetails,
    fetchSeats,
    checkRoomAvailability,

    loadRoomLazy,

    addBookedSeat,
    removeBookedSeat,
    getBookedSeats,
    getBookedSeatIdsForRoom,
    refreshRoomAvailability,
    syncBookedSeatsFromAPI
  }
}