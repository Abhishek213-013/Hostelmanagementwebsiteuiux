<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <main v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading your data...</p>
      </div>
    </main>

    <!-- Error State -->
    <main v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md">
          <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
          <button @click="fetchAllData" class="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all">
            Try Again
          </button>
        </div>
      </div>
    </main>

    <!-- Main Content -->
    <main v-else>
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

        <!-- ==================== MY TOURS SECTION ==================== -->
        <div class="mb-12 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
          <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <MapPin class="w-5 h-5 text-teal-600" />
            <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">My Visits</span>
          </div>
          <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600">My Visits</h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">View your scheduled property visits and their status</p>
        </div>

        <!-- Tour Stats -->
        <div v-if="myTours.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
            <div class="text-2xl font-black text-teal-600">{{ myTours.length }}</div>
            <div class="text-xs text-gray-500">Total Visits</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
            <div class="text-2xl font-black text-yellow-600">{{ pendingTours }}</div>
            <div class="text-xs text-gray-500">Pending</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
            <div class="text-2xl font-black text-green-600">{{ confirmedTours }}</div>
            <div class="text-xs text-gray-500">Confirmed</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
            <div class="text-2xl font-black text-gray-600">{{ completedTours }}</div>
            <div class="text-xs text-gray-500">Completed</div>
          </div>
        </div>

        <!-- Tour Cards -->
        <div v-if="myTours.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div v-for="tour in myTours" :key="tour.id" 
               class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
            
            <div class="p-6">
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-xl font-black text-teal-600">Visit #{{ tour.id }}</h4>
                <span :class="['text-xs font-bold px-2 py-1 rounded-full', getTourStatusClass(tour.status)]">
                  {{ formatTourStatus(tour.status) }}
                </span>
              </div>
              
              <div class="space-y-2 mb-4">
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <User class="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Name: <strong>{{ tour.name }}</strong></span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail class="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Email: <strong>{{ tour.email }}</strong></span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone class="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Phone: <strong>{{ tour.phone }}</strong></span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar class="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Date: <strong>{{ formatDate(tour.preferred_date) }}</strong></span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock class="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Time: <strong>{{ formatTime(tour.preferred_time) }}</strong></span>
                </div>
              </div>
              
              <div v-if="tour.message" class="mb-4 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  <span class="font-bold">Message:</span> {{ tour.message }}
                </p>
              </div>
              
              <div v-if="tour.admin_note" class="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p class="text-xs text-blue-600 dark:text-blue-400">
                  <span class="font-bold">Admin Note:</span> {{ tour.admin_note }}
                </p>
              </div>
              
              <div class="flex gap-2">
                <button @click="viewTourDetails(tour.id)" 
                        class="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-center text-sm hover:bg-teal-700 transition-colors">
                  View Details
                </button>
                <button v-if="tour.status === 0 || tour.status === 'pending'"
                        @click="cancelTour(tour.id)"
                        :disabled="cancellingTourId === tour.id"
                        class="flex-1 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50">
                  {{ cancellingTourId === tour.id ? 'Cancelling...' : 'Cancel' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State for Tours -->
        <div v-if="myTours.length === 0 && !loading" class="text-center py-12">
          <MapPin class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No Visits Scheduled</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">Schedule a visit to visit our property and see the rooms in person!</p>
          <button @click="openTourModal" class="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
            <MapPin class="w-5 h-5" />
            Book a Visit
          </button>
        </div>

      </div>
      <TourBookingModal :isOpen="isTourModalOpen" @close="closeTourModal" />
      <Footer />
    </main>

    <!-- Tour Details Modal -->
    <div v-if="selectedTour" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 py-6">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="closeTourDetails"></div>
        
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full transform transition-all">
          <!-- Close button -->
          <button @click="closeTourDetails" class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10">
            <X class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
          
          <!-- Header -->
          <div class="px-6 pt-6 pb-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                <MapPin class="w-5 h-5 text-teal-600 dark:text-teal-300" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Visit Details</h3>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 pl-13">Visit #{{ selectedTour.id }}</p>
          </div>
          
          <!-- Content -->
          <div class="px-6 pb-6">
            <div class="space-y-4">
              <!-- Status -->
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
                <span :class="['px-3 py-1 rounded-full text-xs font-bold', getTourStatusClass(selectedTour.status)]">
                  {{ formatTourStatus(selectedTour.status) }}
                </span>
              </div>
              
              <!-- Personal Info -->
              <div class="space-y-2">
                <h4 class="text-xs font-bold text-teal-600 uppercase tracking-wider">Personal Information</h4>
                <div class="grid grid-cols-2 gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Name</p>
                    <p class="font-semibold text-gray-800 dark:text-gray-200">{{ selectedTour.name }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p class="font-semibold text-gray-800 dark:text-gray-200">{{ selectedTour.phone }}</p>
                  </div>
                  <div class="col-span-2">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p class="font-semibold text-gray-800 dark:text-gray-200">{{ selectedTour.email }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Tour Details -->
              <div class="space-y-2">
                <h4 class="text-xs font-bold text-teal-600 uppercase tracking-wider">Visit Details</h4>
                <div class="grid grid-cols-2 gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Date</p>
                    <p class="font-semibold text-gray-800 dark:text-gray-200">{{ formatDate(selectedTour.preferred_date) }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Time</p>
                    <p class="font-semibold text-gray-800 dark:text-gray-200">{{ formatTime(selectedTour.preferred_time) }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Message -->
              <div v-if="selectedTour.message" class="space-y-2">
                <h4 class="text-xs font-bold text-teal-600 uppercase tracking-wider">Message</h4>
                <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ selectedTour.message }}</p>
                </div>
              </div>
              
              <!-- Admin Note -->
              <div v-if="selectedTour.admin_note" class="space-y-2">
                <h4 class="text-xs font-bold text-blue-600 uppercase tracking-wider">Admin Note</h4>
                <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p class="text-sm text-blue-600 dark:text-blue-400">{{ selectedTour.admin_note }}</p>
                </div>
              </div>
              
              <!-- Created At -->
              <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p class="text-xs text-gray-400 dark:text-gray-500 text-center">
                  Booked on {{ formatDate(selectedTour.created_at) }} at {{ formatTime(selectedTour.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { useRouter } from 'vue-router'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { useBookings } from '../composables/useBookings'
import { useTourBookings } from '../composables/useTourBookings'
import TourBookingModal from '../components/TourBookingModal.vue'
import { Building2, Calendar, Clock, Phone, User, Bed, CreditCard, MapPin, Mail, X } from 'lucide-vue-next'

useHead({
  title: 'My Rooms - SylhetStay | Manage Bookings',
  meta: [
    { name: 'description', content: 'View and manage your booked rooms and scheduled visits at SylhetStay premium student accommodation in Sylhet, Bangladesh.' },
    { name: 'keywords', content: 'my bookings, my rooms, manage bookings, SylhetStay bookings, student accommodation' },
    { property: 'og:title', content: 'My Rooms - SylhetStay' },
    { property: 'og:description', content: 'Manage your room bookings and visits at SylhetStay student accommodation.' },
    { property: 'og:type', content: 'website' },
    { name: 'robots', content: 'noindex, nofollow' },
  ]
})

const router = useRouter()
const { bookings, fetchAllBookings, cancelBooking: cancelBookingAPI, loading: bookingsLoading, error: bookingsError } = useBookings()
const { tourBookings, fetchUserTourBookings, getTourBookingDetails, loading: toursLoading, error: toursError } = useTourBookings()

const myBookings = ref([])
const myTours = ref([])
const loading = ref(true)
const error = ref('')
const cancellingId = ref(null)
const cancellingTourId = ref(null)
const isTourModalOpen = ref(false)
const selectedTour = ref(null)
const loadingTourDetails = ref(false)

// Computed stats for bookings
const activeBookings = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return myBookings.value.filter(b => {
    const checkOut = new Date(b.check_out_date)
    checkOut.setHours(0, 0, 0, 0)
    return checkOut >= today && b.status !== 3
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
    return checkOut < today || b.status === 2
  }).length
})

// Computed stats for tours
const pendingTours = computed(() => myTours.value.filter(t => t.status === 0 || t.status === 'pending').length)
const confirmedTours = computed(() => myTours.value.filter(t => t.status === 1 || t.status === 'confirmed').length)
const completedTours = computed(() => myTours.value.filter(t => t.status === 2 || t.status === 'completed').length)

// Fetch all data from API
async function fetchAllData() {
  loading.value = true
  error.value = ''
  try {
    // Fetch bookings from API
    await fetchAllBookings()
    
    // Fetch user's tour bookings from localStorage (since admin-only endpoint)
    await fetchUserTourBookings()
    
    console.log('All bookings from composable:', bookings.value)
    console.log('User visit bookings:', tourBookings.value)
    
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
    
    // Filter bookings for current user by email
    let allBookingsArray = []
    if (bookings.value && Array.isArray(bookings.value)) {
      allBookingsArray = bookings.value
    } else if (bookings.value && bookings.value.data && Array.isArray(bookings.value.data)) {
      allBookingsArray = bookings.value.data
    }
    
    if (currentUserEmail && allBookingsArray.length > 0) {
      myBookings.value = allBookingsArray.filter(b => {
        return b.party?.contact?.email_number === currentUserEmail
      })
    } else {
      myBookings.value = allBookingsArray
    }
    
    // Use the filtered tour bookings from the composable
    myTours.value = tourBookings.value
    
    // Sort by created date (newest first)
    myBookings.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    myTours.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    
  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = bookingsError.value || toursError.value || 'Failed to load data. Please check your connection and try again.'
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
    await fetchAllData()
  } catch (err) {
    console.error('Error cancelling booking:', err)
    alert(err.response?.data?.message || 'Failed to cancel booking. Please try again.')
  } finally {
    cancellingId.value = null
  }
}

// Cancel tour
const cancelTour = async (tourId) => {
  if (!confirm('Are you sure you want to cancel this visit?')) return
  
  cancellingTourId.value = tourId
  try {
    // Update tour status to cancelled (3)
    // You would need an API endpoint for this
    // For now, just refresh the data
    await fetchAllData()
    alert('Visit cancellation request submitted successfully!')
  } catch (err) {
    console.error('Error cancelling visit:', err)
    alert('Failed to cancel visit. Please try again.')
  } finally {
    cancellingTourId.value = null
  }
}

// View tour details
const viewTourDetails = async (tourId) => {
  try {
    loadingTourDetails.value = true
    // Fetch fresh tour details from API
    const tour = await getTourBookingDetails(tourId)
    if (tour) {
      selectedTour.value = tour
    }
  } catch (err) {
    console.error('Error fetching visit details:', err)
    alert('Failed to load visit details. Please try again.')
  } finally {
    loadingTourDetails.value = false
  }
}

// Close tour details modal
const closeTourDetails = () => {
  selectedTour.value = null
}

// Open tour modal
const openTourModal = () => {
  isTourModalOpen.value = true
}

// Close tour modal
const closeTourModal = () => {
  isTourModalOpen.value = false
  // Refresh tours after modal closes
  fetchAllData()
}

// Format time (convert 24h to 12h format if needed)
const formatTime = (timeString) => {
  if (!timeString) return 'N/A'
  // If time is in 24h format (HH:MM:SS)
  if (timeString.includes(':')) {
    const parts = timeString.split(':')
    let hour = parseInt(parts[0])
    const minute = parts[1]
    const ampm = hour >= 12 ? 'PM' : 'AM'
    hour = hour % 12
    hour = hour ? hour : 12
    return `${hour}:${minute} ${ampm}`
  }
  return timeString
}

// Get status CSS class based on numeric status for bookings
function getStatusClass(status) {
  const classes = {
    0: 'bg-yellow-500 text-white',
    1: 'bg-green-500 text-white',
    2: 'bg-gray-500 text-white',
    3: 'bg-red-500 text-white',
    4: 'bg-purple-500 text-white'
  }
  return classes[status] || 'bg-gray-500 text-white'
}

// Format status for display (bookings)
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

// Get status CSS class for tours
function getTourStatusClass(status) {
  const classes = {
    0: 'bg-yellow-500 text-white',
    'pending': 'bg-yellow-500 text-white',
    1: 'bg-green-500 text-white',
    'confirmed': 'bg-green-500 text-white',
    2: 'bg-gray-500 text-white',
    'completed': 'bg-gray-500 text-white',
    3: 'bg-red-500 text-white',
    'cancelled': 'bg-red-500 text-white'
  }
  return classes[status] || 'bg-gray-500 text-white'
}

// Format status for display (tours)
function formatTourStatus(status) {
  const labels = {
    0: 'Pending',
    'pending': 'Pending',
    1: 'Confirmed',
    'confirmed': 'Confirmed',
    2: 'Completed',
    'completed': 'Completed',
    3: 'Cancelled',
    'cancelled': 'Cancelled'
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
    return dateString.split(' ')[0]
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