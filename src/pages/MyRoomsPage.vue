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
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="fetchAllData" class="px-6 py-2 bg-teal-600 text-white rounded-lg">Retry</button>
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
            <div class="text-2xl font-black text-blue-600">{{ confirmedBookings }}</div>
            <div class="text-xs text-gray-500">Upcoming</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
            <div class="text-2xl font-black text-gray-600">{{ completedBookings }}</div>
            <div class="text-xs text-gray-500">Completed</div>
          </div>
        </div>

        <!-- Booking Cards -->
        <div v-if="myBookings.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div v-for="booking in myBookings" :key="booking.id" 
               class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
            <!-- Room Image -->
            <div class="relative h-48 overflow-hidden">
              <img :src="booking.room.image" :alt="booking.room.name" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
              
              <!-- Status Badge -->
              <div class="absolute top-4 right-4">
                <span :class="['px-3 py-1 rounded-full text-xs font-bold shadow', getStatusClass(booking.status)]">
                  {{ formatStatus(booking.status) }}
                </span>
              </div>
              
              <!-- Booking Reference -->
              <div class="absolute bottom-4 left-4">
                <span class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/30">
                  {{ booking.booking_reference }}
                </span>
              </div>
            </div>
            
            <div class="p-6">
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-xl font-black text-teal-600">{{ booking.room.name }}</h4>
                <span :class="['text-xs font-bold px-2 py-1 rounded-full', getPaymentStatusClass(booking.payment_status)]">
                  {{ formatPaymentStatus(booking.payment_status) }}
                </span>
              </div>
              
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Room {{ booking.room.room_number }} • Floor {{ booking.room.floor }} • {{ booking.guests }} guest{{ booking.guests > 1 ? 's' : '' }}
              </p>
              
              <div v-if="booking.occupants && booking.occupants.length > 0" class="mb-3">
                <div class="flex flex-wrap gap-1">
                  <span v-for="(occupant, i) in booking.occupants" :key="i" 
                        class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                    {{ occupant }}
                  </span>
                </div>
              </div>
              
              <div v-if="booking.special_requests" class="mb-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p class="text-xs text-amber-700 dark:text-amber-300">
                  <span class="font-bold">Note:</span> {{ booking.special_requests }}
                </p>
              </div>
              
              <div class="space-y-2 mb-4">
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar class="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Check-in: <strong>{{ formatDate(booking.check_in) }}</strong></span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar class="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>Check-out: <strong>{{ formatDate(booking.check_out) }}</strong></span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock class="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>{{ booking.nights }} night{{ booking.nights > 1 ? 's' : '' }}</span>
                </div>
              </div>
              
              <div v-if="booking.addons && booking.addons.length > 0" class="mb-4">
                <h5 class="text-xs font-bold text-teal-600 mb-2 uppercase">Add-ons</h5>
                <div class="space-y-1">
                  <div v-for="(addon, i) in booking.addons" :key="i" class="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>{{ addon.name }} (x{{ addon.quantity }})</span>
                    <span>৳{{ (addon.price * addon.quantity).toLocaleString() }}</span>
                  </div>
                </div>
              </div>
              
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 mb-4">
                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>৳{{ booking.subtotal.toLocaleString() }}</span>
                </div>
                <div v-if="booking.discount > 0" class="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-৳{{ booking.discount.toLocaleString() }}</span>
                </div>
                <div v-if="booking.addons_total > 0" class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Add-ons</span>
                  <span>৳{{ booking.addons_total.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between text-base font-black text-teal-600">
                  <span>Total</span>
                  <span>৳{{ booking.grand_total.toLocaleString() }}</span>
                </div>
              </div>
              
              <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                <CreditCard class="w-3 h-3" />
                <span>{{ booking.payment_method }}</span>
                <span v-if="booking.source" class="text-gray-300">•</span>
                <span v-if="booking.source" class="capitalize">{{ booking.source.replace('_', ' ') }}</span>
              </div>
              
              <div v-if="booking.status === 'cancelled'" class="mb-4 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p class="text-xs text-red-600 dark:text-red-400">
                  <strong>Cancelled:</strong> {{ booking.cancellation_reason }}
                </p>
                <p v-if="booking.refund_amount" class="text-xs text-red-500 mt-1">
                  Refund: ৳{{ booking.refund_amount.toLocaleString() }}
                </p>
              </div>
              
              <div class="flex gap-2">
                <router-link :to="`/rooms/${booking.room.id}`" 
                             class="flex-1 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-center border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm">
                  View Room
                </router-link>
                <button v-if="booking.status === 'pending' || booking.status === 'confirmed'"
                        class="flex-1 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                  Cancel
                </button>
                <button v-if="booking.status === 'completed' && !booking.review_left"
                        class="flex-1 py-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-xl font-bold text-sm hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
                  Leave Review
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State for Bookings -->
        <div v-if="myBookings.length === 0" class="text-center py-12 mb-16">
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
            <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">My Tours</span>
          </div>
          <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600">My Tours</h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">View your scheduled property tours and their status</p>
        </div>

        <!-- Tour Stats -->
        <div v-if="myTours.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
            <div class="text-2xl font-black text-teal-600">{{ myTours.length }}</div>
            <div class="text-xs text-gray-500">Total Tours</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
            <div class="text-2xl font-black text-blue-600">{{ pendingTours }}</div>
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
            <!-- Tour Header -->
            <div :class="['relative h-40 overflow-hidden', getTourBgClass(tour.status)]">
              <div class="absolute inset-0 flex items-center justify-center">
                <MapPin class="w-16 h-16 text-white/30" />
              </div>
              
              <!-- Status Badge -->
              <div class="absolute top-4 right-4">
                <span :class="['px-3 py-1 rounded-full text-xs font-bold shadow', getStatusClass(tour.status)]">
                  {{ formatStatus(tour.status) }}
                </span>
              </div>
              
              <!-- Tour Reference -->
              <div class="absolute bottom-4 left-4">
                <span class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/30">
                  {{ tour.reference }}
                </span>
              </div>
            </div>
            
            <div class="p-6">
              <!-- Tour Type -->
              <div class="flex items-center gap-2 mb-2">
                <span :class="['px-2 py-0.5 rounded-full text-xs font-bold', tour.tour_type === 'virtual' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300']">
                  {{ tour.tour_type === 'virtual' ? '🖥 Virtual' : '🚶 In Person' }}
                </span>
                <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400 capitalize">
                  {{ tour.preferred_room_type?.replace('-', ' ') }}
                </span>
              </div>
              
              <!-- Guests -->
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {{ tour.number_of_guests }} guest{{ tour.number_of_guests > 1 ? 's' : '' }}
              </p>
              
              <!-- Tour Message -->
              <div v-if="tour.message" class="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{{ tour.message }}</p>
              </div>
              
              <!-- Preferred Date & Time -->
              <div class="space-y-2 mb-3">
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar class="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span><strong>{{ formatDate(tour.preferred_date) }}</strong> at {{ tour.preferred_time }}</span>
                </div>
                <div v-if="tour.alternate_date" class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar class="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>Alt: {{ formatDate(tour.alternate_date) }} at {{ tour.alternate_time }}</span>
                </div>
              </div>
              
              <!-- Virtual Tour Link -->
              <div v-if="tour.tour_link" class="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <a :href="tour.tour_link" target="_blank" class="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  <Video class="w-3 h-3" />
                  Join Virtual Tour
                </a>
              </div>
              
              <!-- Cancellation Reason -->
              <div v-if="tour.status === 'cancelled' && tour.cancellation_reason" class="mb-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p class="text-xs text-red-600 dark:text-red-400">
                  <strong>Reason:</strong> {{ tour.cancellation_reason }}
                </p>
              </div>
              
              <!-- Feedback -->
              <div v-if="tour.feedback" class="mb-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p class="text-xs text-green-700 dark:text-green-300">
                  <strong>Feedback:</strong> {{ tour.feedback }}
                </p>
              </div>
              
              <!-- Heard About Us -->
              <div class="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <span>Heard via:</span>
                <span class="font-semibold capitalize">{{ tour.hear_about_us?.replace('_', ' ') }}</span>
              </div>
              
              <!-- Actions -->
              <div class="flex gap-2">
                <button v-if="tour.tour_link" 
                        @click="window.open(tour.tour_link, '_blank')"
                        class="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-colors">
                  Join Tour
                </button>
                <button v-if="tour.status === 'pending' || tour.status === 'confirmed'"
                        class="flex-1 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                  Cancel Tour
                </button>
                <button v-if="tour.status === 'completed'"
                        class="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State for Tours -->
        <div v-if="myTours.length === 0" class="text-center py-12">
          <MapPin class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No Tours Scheduled</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">Schedule a tour to visit our property and see the rooms in person!</p>
          <router-link to="/contact" class="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
            <MapPin class="w-5 h-5" />
            Book a Tour
          </router-link>
        </div>

      </div>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { Building2, Calendar, Clock, CreditCard, MapPin, Video } from 'lucide-vue-next'

const allBookings = ref([])
const allTours = ref([])
const myBookings = ref([])
const myTours = ref([])
const loading = ref(true)
const error = ref('')

// Computed stats for bookings
const activeBookings = computed(() => myBookings.value.filter(b => b.status === 'active').length)
const confirmedBookings = computed(() => myBookings.value.filter(b => b.status === 'confirmed' || b.status === 'pending').length)
const completedBookings = computed(() => myBookings.value.filter(b => b.status === 'completed').length)

// Computed stats for tours
const pendingTours = computed(() => myTours.value.filter(t => t.status === 'pending').length)
const confirmedTours = computed(() => myTours.value.filter(t => t.status === 'confirmed').length)
const completedTours = computed(() => myTours.value.filter(t => t.status === 'completed').length)

// Fetch all data
async function fetchAllData() {
  loading.value = true
  error.value = ''
  try {
    const [bookingsResponse, toursResponse] = await Promise.all([
      axios.get('https://raw.githubusercontent.com/Abhishek213-013/dummyJson/refs/heads/main/bookings.json'),
      axios.get('https://raw.githubusercontent.com/Abhishek213-013/dummyJson/refs/heads/main/tour_bookings.json')
    ])
    
    allBookings.value = bookingsResponse.data
    allTours.value = toursResponse.data
    
    // Get current user
    const currentUserId = localStorage.getItem('currentUserId')
    const storedUser = localStorage.getItem('user')
    let userEmail = ''
    
    if (storedUser) {
      const user = JSON.parse(storedUser)
      userEmail = user.email
    }
    
    // Filter bookings for current user
    if (currentUserId) {
      myBookings.value = allBookings.value.filter(b => b.user_id === parseInt(currentUserId))
    } else if (userEmail) {
      myBookings.value = allBookings.value.filter(b => b.customer.email === userEmail)
    }
    
    // Filter tours for current user
    if (userEmail) {
      myTours.value = allTours.value.filter(t => t.email === userEmail)
    }
    
    // Sort by created date (newest first)
    myBookings.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    myTours.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    
  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = 'Failed to load data. Please check your connection and try again.'
  } finally {
    loading.value = false
  }
}

// Get status CSS class
function getStatusClass(status) {
  const classes = {
    'active': 'bg-green-500 text-white',
    'confirmed': 'bg-blue-500 text-white',
    'pending': 'bg-yellow-500 text-white',
    'completed': 'bg-gray-500 text-white',
    'cancelled': 'bg-red-500 text-white',
  }
  return classes[status] || 'bg-gray-500 text-white'
}

// Get tour header background class
function getTourBgClass(status) {
  const classes = {
    'pending': 'bg-yellow-500',
    'confirmed': 'bg-blue-600',
    'completed': 'bg-teal-600',
    'cancelled': 'bg-red-500',
  }
  return classes[status] || 'bg-teal-600'
}

// Format status for display
function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

// Get payment status CSS class
function getPaymentStatusClass(status) {
  const classes = {
    'paid': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    'partial': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    'unpaid': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    'refunded': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

// Format payment status for display
function formatPaymentStatus(status) {
  const labels = {
    'paid': 'Paid',
    'partial': 'Partial',
    'unpaid': 'Unpaid',
    'refunded': 'Refunded',
  }
  return labels[status] || status
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(() => {
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