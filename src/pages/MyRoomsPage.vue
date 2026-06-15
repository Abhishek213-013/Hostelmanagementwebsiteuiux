<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading your data...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md">
          <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
          <button @click="fetchAllData" class="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all">
            Try Again
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <Header />
      <div class="max-w-[1400px] mx-auto px-6 lg:px-12 py-32">
        
        <!-- ==================== MY ROOMS SECTION ==================== -->
        <div class="mb-12">
          <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Building2 class="w-5 h-5 text-teal-600" />
            <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">My Rooms</span>
          </div>
          <h1 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600">My Rooms</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">View and manage your booked rooms and reservations</p>
        </div>

        <!-- Booking Stats -->
        <div v-if="myBookings.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
            <div class="text-2xl font-black text-teal-600">{{ myBookings.length }}</div>
            <div class="text-xs text-gray-500">Total Bookings</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
            <div class="text-2xl font-black text-green-600">{{ activeBookings }}</div>
            <div class="text-xs text-gray-500">Active</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
            <div class="text-2xl font-black text-blue-600">{{ upcomingBookings }}</div>
            <div class="text-xs text-gray-500">Upcoming</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
            <div class="text-2xl font-black text-gray-600">{{ pastBookings }}</div>
            <div class="text-xs text-gray-500">Past</div>
          </div>
        </div>

        <!-- Booking Cards -->
        <div v-if="myBookings.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div v-for="booking in myBookings" :key="booking.id" 
               class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
            
            <div class="p-6">
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-xl font-black text-teal-600">Booking #{{ booking.id }}</h4>
                <span :class="['text-xs font-bold px-2 py-1 rounded-full', getStatusClass(booking.status)]">
                  {{ formatStatus(booking.status) }}
                </span>
              </div>
              
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Room: {{ booking.room?.room_number || 'N/A' }} • {{ booking.room?.room_type?.room_type_title || 'Standard' }}
              </p>
              
              <div class="space-y-2 mb-4">
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar class="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Check-in: <strong>{{ formatDate(booking.check_in_date) }}</strong></span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar class="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Check-out: <strong>{{ formatDate(booking.check_out_date) }}</strong></span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <User class="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Guest: {{ booking.party?.party_name || 'N/A' }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone class="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>{{ booking.party?.contact?.mobile_number || 'N/A' }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Bed class="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Seat: {{ booking.seat?.seat_description || 'N/A' }}</span>
                </div>
              </div>
              
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 mb-4">
                <div class="flex justify-between text-base font-black text-teal-600">
                  <span>Total Amount</span>
                  <span>৳{{ (booking.billing_amount || 0).toLocaleString() }}</span>
                </div>
              </div>
              
              <div v-if="booking.border_note" class="mb-4 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  <span class="font-bold">Note:</span> {{ booking.border_note }}
                </p>
              </div>
              
              <div class="flex gap-2">
                <router-link :to="`/rooms/${booking.room_id}`" 
                             class="flex-1 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-center border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm">
                  View Room
                </router-link>
                <button v-if="booking.status === 0 || booking.status === 1"
                        @click="cancelBooking(booking.id)"
                        :disabled="cancellingId === booking.id"
                        class="flex-1 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50">
                  {{ cancellingId === booking.id ? 'Cancelling...' : 'Cancel' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State for Bookings -->
        <div v-if="myBookings.length === 0 && !loading" class="text-center py-12 mb-16">
          <Building2 class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No Bookings Found</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">You don't have any bookings yet. Explore our available rooms and book your stay!</p>
          <router-link to="/rooms" class="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
            <Building2 class="w-5 h-5" />
            Browse Rooms
          </router-link>
        </div>

      </div>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { useBookings } from '../composables/useBookings'
import { Building2, Calendar, Clock, Phone, User, Bed, CreditCard, MapPin } from 'lucide-vue-next'

const router = useRouter()
const { bookings, fetchAllBookings, cancelBooking: cancelBookingAPI, loading: bookingsLoading, error: bookingsError } = useBookings()

const myBookings = ref([])
const loading = ref(true)
const error = ref('')
const cancellingId = ref(null)

// Computed stats for bookings
const activeBookings = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return myBookings.value.filter(b => {
    const checkOut = new Date(b.check_out_date)
    checkOut.setHours(0, 0, 0, 0)
    return checkOut >= today && b.status !== 3 // status 3 = cancelled
  }).length
})

const upcomingBookings = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return myBookings.value.filter(b => {
    const checkIn = new Date(b.check_in_date)
    checkIn.setHours(0, 0, 0, 0)
    return checkIn > today && b.status !== 3
  }).length
})

const pastBookings = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return myBookings.value.filter(b => {
    const checkOut = new Date(b.check_out_date)
    checkOut.setHours(0, 0, 0, 0)
    return checkOut < today || b.status === 2 // status 2 = completed
  }).length
})

// Fetch all data from API
async function fetchAllData() {
  loading.value = true
  error.value = ''
  try {
    // Fetch all bookings from API
    await fetchAllBookings()
    
    console.log('All bookings from composable:', bookings.value)
    
    // Get current user email from localStorage
    const storedUser = localStorage.getItem('user')
    let currentUserEmail = ''
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        currentUserEmail = user.email
        console.log('Current user email:', currentUserEmail)
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
    
    // Get the actual bookings array from the response
    let allBookingsArray = []
    if (bookings.value && Array.isArray(bookings.value)) {
      allBookingsArray = bookings.value
    } else if (bookings.value && bookings.value.data && Array.isArray(bookings.value.data)) {
      allBookingsArray = bookings.value.data
    }
    
    console.log('All bookings array:', allBookingsArray)
    
    // Filter bookings for current user by email
    if (currentUserEmail && allBookingsArray.length > 0) {
      myBookings.value = allBookingsArray.filter(b => {
        return b.party?.contact?.email_number === currentUserEmail
      })
      console.log('Filtered bookings for user:', myBookings.value)
    } else {
      // If no user match, show all bookings for testing
      myBookings.value = allBookingsArray
      console.log('Showing all bookings:', myBookings.value)
    }
    
    // Sort by created date (newest first)
    myBookings.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    
  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = bookingsError.value || 'Failed to load data. Please check your connection and try again.'
  } finally {
    loading.value = false
  }
}

// Cancel booking
const cancelBooking = async (bookingId) => {
  if (!confirm('Are you sure you want to cancel this booking?')) return
  
  cancellingId.value = bookingId
  try {
    await cancelBookingAPI(bookingId)
    // Refresh the bookings list
    await fetchAllData()
  } catch (err) {
    console.error('Error cancelling booking:', err)
    alert(err.response?.data?.message || 'Failed to cancel booking. Please try again.')
  } finally {
    cancellingId.value = null
  }
}

// Get status CSS class based on numeric status
function getStatusClass(status) {
  const classes = {
    0: 'bg-yellow-500 text-white',      // Pending
    1: 'bg-green-500 text-white',       // Confirmed/Active
    2: 'bg-gray-500 text-white',        // Completed
    3: 'bg-red-500 text-white',         // Cancelled
    4: 'bg-purple-500 text-white'       // Refunded
  }
  return classes[status] || 'bg-gray-500 text-white'
}

// Format status for display
function formatStatus(status) {
  const labels = {
    0: 'Pending',
    1: 'Confirmed',
    2: 'Completed',
    3: 'Cancelled',
    4: 'Refunded'
  }
  return labels[status] || 'Unknown'
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch (e) {
    return dateString.split(' ')[0] // Handle "2026-06-15 00:00:00" format
  }
}

onMounted(() => {
  // Check if user is authenticated
  if (!localStorage.getItem('isAuthenticated')) {
    router.push('/login')
    return
  }
  fetchAllData()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>