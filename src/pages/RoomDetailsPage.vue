<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
    <!-- Loading State -->
    <main v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading room details...</p>
      </div>
    </main>

    <!-- Error State -->
    <main v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md">
          <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
          <button @click="fetchRoomData" class="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all">
            Try Again
          </button>
        </div>
      </div>
    </main>

    <!-- Room Not Found -->
    <main v-else-if="!room" class="min-h-[60vh] flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-6xl font-black text-teal-600 mb-4">Room Not Found</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">The room you're looking for doesn't exist.</p>
        <router-link to="/rooms" class="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
          View All Rooms
        </router-link>
      </div>
    </main>

    <!-- Main Content -->
    <main v-else>
      <Header />
      <div class="relative">
        <!-- Back Button -->
        <div class="max-w-7xl mx-auto px-6 pt-8">
          <router-link to="/rooms" class="group flex items-center gap-2 text-teal-600 hover:text-teal-500 transition-colors font-medium">
            <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Rooms
          </router-link>
        </div>

        <!-- Room Details Section -->
        <div class="max-w-7xl mx-auto px-6 py-10">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Left Side - Room Image -->
            <div class="space-y-6">
              <div class="relative">
                <div class="rounded-xl overflow-hidden shadow border border-gray-200 dark:border-gray-700">
                  <img :src="currentImage" :alt="room.room_number || 'Room Image'" class="w-full h-[400px] object-cover" />
                  <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>

                  <div class="absolute top-6 left-6">
                    <div class="px-5 py-3 bg-teal-600 text-white rounded-xl font-black shadow-lg text-lg">
                      ৳{{ (room.room_price || 0).toLocaleString() }}<span class="text-sm font-normal">/mo</span>
                    </div>
                  </div>

                  <div class="absolute bottom-6 left-6 flex items-center gap-3 px-5 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                    <Users class="w-5 h-5 text-white" />
                    <span class="text-white font-bold">Up to {{ availabilityData?.capacity || getCapacityFromType(room.room_type?.name) }} People</span>
                  </div>

                  <div class="absolute bottom-6 right-6 px-5 py-3 bg-white dark:bg-gray-800 rounded-full shadow">
                    <span class="text-gray-800 dark:text-white font-black">{{ getDefaultSize() }} sq ft</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Side - Room Details -->
            <div class="flex flex-col space-y-6">
              <div class="flex flex-wrap gap-3">
                <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <Sparkles class="w-5 h-5 text-teal-600" />
                  <span class="text-sm font-bold tracking-wide text-teal-600 capitalize">{{ room.room_type?.room_type_title || room.room_type?.name || 'Standard' }}</span>
                </div>
              </div>

              <h1 class="text-3xl lg:text-4xl font-black text-teal-600">{{ room.room_number || 'Room ' + room.id }}</h1>

              <!-- Availability Status based on API data -->
              <div class="flex items-center gap-3">
                <div :class="['w-4 h-4 rounded-full', isRoomAvailable ? 'bg-teal-500' : 'bg-red-500']"></div>
                <span class="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {{ isRoomAvailable ? 'Available for booking' : 'Currently Booked' }}
                </span>
              </div>

              <!-- Available seats info -->
              <div v-if="availabilityData?.available_seats?.length > 0" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div class="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <CheckCircle2 class="w-5 h-5" />
                  <span class="font-medium">{{ availabilityData.available_seats.length }} seat(s) available</span>
                </div>
              </div>

              <div v-if="availabilityData?.available_seats?.length === 0 && availabilityData?.is_available === false" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div class="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <X class="w-5 h-5" />
                  <span class="font-medium">No seats available for selected dates</span>
                </div>
              </div>

              <p class="text-base text-gray-600 dark:text-gray-400 leading-relaxed">{{ room.room_description || getDefaultDescription(room.room_type?.name) }}</p>

              <div class="grid grid-cols-2 gap-4 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-3">
                  <Bed class="w-5 h-5 text-teal-600" />
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Room Number</div>
                    <div class="font-bold text-gray-800 dark:text-gray-200">{{ room.room_number || 'N/A' }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <Building2 class="w-5 h-5 text-teal-600" />
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Floor</div>
                    <div class="font-bold text-gray-800 dark:text-gray-200">{{ room.floor_id || 'N/A' }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <Building2 class="w-5 h-5 text-teal-600" />
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Building</div>
                    <div class="font-bold text-gray-800 dark:text-gray-200">{{ room.building_id || 'N/A' }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <Building2 class="w-5 h-5 text-teal-600" />
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Branch</div>
                    <div class="font-bold text-gray-800 dark:text-gray-200">{{ room.branch_id || 'N/A' }}</div>
                  </div>
                </div>
              </div>

              <button 
                @click="handleBookNow" 
                :disabled="!isRoomAvailable"
                :class="['group px-8 py-4 text-white rounded-xl font-black shadow transition-all flex items-center justify-center gap-3',
                  !isRoomAvailable 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-teal-600 hover:bg-teal-700 hover:shadow-xl hover:scale-105']">
                {{ !isRoomAvailable ? 'Currently Unavailable' : 'Book Now' }}
                <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <!-- Room Services/Amenities Section - From API -->
          <div v-if="displayServices.length > 0" class="mt-16 mb-10">
            <h2 class="text-2xl lg:text-3xl font-black mb-12 text-center text-teal-600">Room Services & Amenities</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div v-for="(service, i) in displayServices" :key="i" 
                   class="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700 hover:bg-teal-600 hover:text-white hover:shadow-lg hover:-translate-y-2 hover:border-teal-600 transition-all duration-500 flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-teal-600 group-hover:bg-white/20 transition-colors duration-500">
                  <component :is="getServiceIcon(service)" class="w-6 h-6 text-white" />
                </div>
                <div class="flex-1">
                  <span class="text-gray-800 dark:text-gray-200 font-semibold group-hover:text-white transition-colors duration-500">{{ service.service_name }}</span>
                  <p v-if="service.service_description" class="text-xs text-gray-500 dark:text-gray-400 group-hover:text-white/80 transition-colors duration-500 mt-1">{{ service.service_description }}</p>
                </div>
                <CheckCircle2 class="w-5 h-5 text-teal-500 flex-shrink-0 group-hover:text-white transition-colors duration-500" />
              </div>
            </div>
          </div>

          <!-- Reviews Section -->
          <div v-if="roomReviews.length > 0" class="mt-16 mb-10">
            <h2 class="text-2xl lg:text-3xl font-black mb-4 text-center text-teal-600">Guest Reviews</h2>
            
            <!-- Review Summary -->
            <div class="max-w-3xl mx-auto mb-8">
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-4">
                    <div class="text-4xl font-black text-teal-600">{{ reviewStats.average_rating }}</div>
                    <div>
                      <div class="flex items-center gap-1">
                        <Star v-for="n in 5" :key="n" :class="['w-5 h-5', n <= Math.round(reviewStats.average_rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300']" />
                      </div>
                      <p class="text-sm text-gray-500 mt-1">{{ reviewStats.total_reviews }} review{{ reviewStats.total_reviews !== 1 ? 's' : '' }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Rating Bars -->
                <div class="space-y-2">
                  <div v-for="rating in [5,4,3,2,1]" :key="rating" class="flex items-center gap-3">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400 w-4">{{ rating }}</span>
                    <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div class="bg-amber-400 h-2 rounded-full transition-all duration-500" 
                           :style="{ width: `${getRatingPercentage(rating)}%` }"></div>
                    </div>
                    <span class="text-xs text-gray-500 w-8">{{ getRatingCount(rating) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Review Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <div v-for="review in roomReviews.slice(0, 4)" :key="review.id" 
                   class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700">
                <!-- Review Header -->
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <img :src="review.user.avatar" :alt="review.user.name" 
                         class="w-10 h-10 rounded-full object-cover border-2 border-teal-600" />
                    <div>
                      <h4 class="font-bold text-gray-800 dark:text-gray-200">{{ review.user.name }}</h4>
                      <div class="flex items-center gap-1">
                        <Star v-for="n in 5" :key="n" :class="['w-3 h-3', n <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300']" />
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span v-if="review.verified" class="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium">
                      ✓ Verified
                    </span>
                    <span class="text-xs text-gray-400">{{ formatDate(review.created_at) }}</span>
                  </div>
                </div>

                <!-- Review Title -->
                <h5 class="font-bold text-gray-800 dark:text-gray-200 mb-2">{{ review.title }}</h5>
                
                <!-- Review Comment -->
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">{{ review.comment }}</p>

                <!-- Pros & Cons -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div v-if="review.pros && review.pros.length > 0">
                    <h6 class="text-xs font-bold text-teal-600 mb-2">Pros</h6>
                    <ul class="space-y-1">
                      <li v-for="pro in review.pros.slice(0, 3)" :key="pro" class="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <CheckCircle2 class="w-3 h-3 text-teal-600 flex-shrink-0" />
                        {{ pro }}
                      </li>
                    </ul>
                  </div>
                  <div v-if="review.cons && review.cons.length > 0">
                    <h6 class="text-xs font-bold text-red-500 mb-2">Cons</h6>
                    <ul class="space-y-1">
                      <li v-for="con in review.cons.slice(0, 3)" :key="con" class="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <X class="w-3 h-3 text-red-500 flex-shrink-0" />
                        {{ con }}
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Tags -->
                <div class="flex flex-wrap gap-1 mb-4">
                  <span v-for="tag in review.tags?.slice(0, 3)" :key="tag" 
                        class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                    #{{ tag }}
                  </span>
                </div>

                <!-- Stay Info -->
                <div class="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span>{{ review.stay_duration }}</span>
                  <span>{{ review.stay_period }}</span>
                </div>

                <!-- Management Response -->
                <div v-if="review.response" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <Shield class="w-4 h-4 text-teal-600" />
                    <span class="text-xs font-bold text-teal-600">{{ review.response.from }}</span>
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ review.response.message }}</p>
                </div>

                <!-- Helpful Count -->
                <div v-if="review.helpful_count > 0" class="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <ThumbsUp class="w-4 h-4 text-gray-400" />
                  <span class="text-xs text-gray-500">{{ review.helpful_count }} found this helpful</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Add this for when there are no reviews -->
          <div v-else-if="!loading && room" class="mt-16 mb-10 text-center">
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
              <Star class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 class="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No Reviews Yet</h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm">Be the first to review this room!</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useHead } from '@vueuse/head'
import { useRoute, useRouter } from 'vue-router'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { useRooms } from '../composables/useRooms'
import { useReviews } from '../composables/useReviews'
import { roomAPI } from '../services/api'
import { 
  ArrowLeft, Users, Bed, CheckCircle2, Wifi, Wind, Utensils, Coffee, 
  Dumbbell, Car, BookOpen, Shield, Sparkles, Building2, ArrowRight, X,
  Star, ThumbsUp, Clock, MapPin, Bath, Maximize2, Tv, Gamepad2, Refrigerator,
  WashingMachine, Music, Zap, Mic, Camera, Sun, Trees, Droplets, ShoppingBag,
  Phone, Mail, MapPin as MapPinIcon, Home, Award
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { fetchRoomDetails, loading: roomsLoading, error: roomsError, currentRoom } = useRooms()

useHead({
  title: () => currentRoom.value ? `Room ${currentRoom.value.room_number || currentRoom.value.id} - SylhetStay` : 'Room Details - SylhetStay',
  meta: () => currentRoom.value ? [
    { name: 'description', content: `Book ${currentRoom.value.room_number || 'this room'} at SylhetStay. ${currentRoom.value.room_description || 'Premium student accommodation in Sylhet, Bangladesh.'} ৳${(currentRoom.value.room_price || 0).toLocaleString()}/month.` },
    { name: 'keywords', content: `room ${currentRoom.value.room_number}, student room Sylhet, accommodation, ${currentRoom.value.room_type?.room_type_title || 'student housing'}` },
    { property: 'og:title', content: `Room ${currentRoom.value.room_number || currentRoom.value.id} - SylhetStay` },
    { property: 'og:description', content: `${currentRoom.value.room_description || 'Premium student accommodation in Sylhet.'} Starting at ৳${(currentRoom.value.room_price || 0).toLocaleString()}/month.` },
    { property: 'og:type', content: 'website' },
  ] : []
})
const { 
  reviews: roomReviews, 
  stats: reviewStats, 
  fetchReviews, 
  getRatingPercentage, 
  getRatingCount,
  clearReviews,
  loading: reviewsLoading
} = useReviews()

const currentImage = ref('')
const availabilityData = ref(null)
const checkInDate = ref('')
const checkOutDate = ref('')
const checkingAvailability = ref(false)

// Combined loading state
const loading = ref(true)
const error = ref('')

// Current room from API
const room = computed(() => currentRoom.value)

// Check if room is available based on availability API
const isRoomAvailable = computed(() => {
  if (!availabilityData.value) return false
  return availabilityData.value.is_available === true && 
         availabilityData.value.available_seats?.length > 0
})

// Get services from room_type and room
const displayServices = computed(() => {
  const services = []
  
  // Get services from room_type (service_on_room_type)
  if (room.value?.room_type?.service_on_room_type) {
    room.value.room_type.service_on_room_type.forEach(item => {
      if (item.service) {
        services.push({
          ...item.service,
          source: 'room_type'
        })
      }
    })
  }
  
  // Get services directly from room (service_on_room)
  if (room.value?.service_on_room) {
    room.value.service_on_room.forEach(item => {
      if (item.service) {
        // Check if service already exists (avoid duplicates)
        const exists = services.some(s => s.id === item.service.id)
        if (!exists) {
          services.push({
            ...item.service,
            source: 'room'
          })
        }
      }
    })
  }
  
  return services
})

// Map service names to icons
const getServiceIcon = (service) => {
  const name = service.service_name?.toLowerCase() || ''
  
  if (name.includes('wifi') || name.includes('internet')) return Wifi
  if (name.includes('ac') || name.includes('air') || name.includes('conditioning')) return Wind
  if (name.includes('kitchen') || name.includes('food') || name.includes('meal')) return Utensils
  if (name.includes('coffee') || name.includes('tea')) return Coffee
  if (name.includes('gym') || name.includes('fitness') || name.includes('exercise')) return Dumbbell
  if (name.includes('parking') || name.includes('car') || name.includes('vehicle')) return Car
  if (name.includes('study') || name.includes('desk') || name.includes('book') || name.includes('library')) return BookOpen
  if (name.includes('security') || name.includes('cctv') || name.includes('guard') || name.includes('safety')) return Shield
  if (name.includes('tv') || name.includes('television') || name.includes('entertainment')) return Tv
  if (name.includes('game') || name.includes('play') || name.includes('console')) return Gamepad2
  if (name.includes('fridge') || name.includes('refrigerator') || name.includes('cooler')) return Refrigerator
  if (name.includes('wash') || name.includes('laundry') || name.includes('cleaning')) return WashingMachine
  if (name.includes('music') || name.includes('audio') || name.includes('sound')) return Music
  if (name.includes('power') || name.includes('electricity') || name.includes('backup')) return Zap
  if (name.includes('bath') || name.includes('shower') || name.includes('toilet') || name.includes('bathroom')) return Bath
  if (name.includes('bed') || name.includes('mattress') || name.includes('pillow')) return Bed
  
  return CheckCircle2
}

// Helper functions for UI display
const getCapacityFromType = (roomTypeName) => {
  const capacities = {
    'shared': 4,
    'semi-private': 2,
    'premium': 1,
    'standard': 2
  }
  return capacities[roomTypeName?.toLowerCase()] || 2
}

const getDefaultSize = () => 250

const getDefaultDescription = (roomTypeName) => {
  const descriptions = {
    'shared': 'Comfortable shared accommodation with modern amenities perfect for students and professionals.',
    'semi-private': 'Semi-private room offering privacy with shared common areas. Ideal for two occupants.',
    'premium': 'Premium single room with attached bathroom and premium furnishings for ultimate comfort.',
    'standard': 'Well-appointed standard room with essential amenities for a comfortable stay.'
  }
  return descriptions[roomTypeName?.toLowerCase()] || 'Comfortable room with modern amenities for a pleasant stay.'
}

const getRoomFeatures = (roomTypeName) => {
  const features = {
    'shared': ['4 Bunk Beds', 'Shared Bathroom', 'Study Desk', 'Wardrobe', 'High-Speed WiFi', 'Ceiling Fan'],
    'semi-private': ['2 Single Beds', 'Attached Bathroom', 'Study Desks', 'Wardrobe', 'High-Speed WiFi', 'Ceiling Fan'],
    'premium': ['Private Room', 'Attached Bathroom', 'Air Conditioning', 'Premium Furniture', 'High-Speed WiFi', 'Mini Fridge'],
    'standard': ['Comfortable Bed', 'Attached Bathroom', 'Study Desk', 'Wardrobe', 'High-Speed WiFi', 'Ceiling Fan']
  }
  return features[roomTypeName?.toLowerCase()] || features.standard
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const checkAvailability = async () => {
  if (!room.value?.id || !checkInDate.value || !checkOutDate.value) return
  
  checkingAvailability.value = true
  try {
    const response = await roomAPI.getRoomAvailability(room.value.id)
    console.log('Availability response:', response.data)
    
    availabilityData.value = response.data?.data || response.data
    console.log('Availability data:', availabilityData.value)
  } catch (err) {
    console.error('Error checking availability:', err)
  } finally {
    checkingAvailability.value = false
  }
}

// Progressive fetch - Load critical content first
const fetchRoomData = async () => {
  const roomId = route.params.id
  console.log('Fetching room with ID:', roomId)
  
  if (!roomId) {
    loading.value = false
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    console.log('🚀 Starting progressive loading for Room Details...')
    
    // STEP 1: Load room details (critical)
    const roomData = await fetchRoomDetails(roomId)
    console.log('✅ Room details loaded:', roomData)
    
    if (!roomData) {
      error.value = 'Room not found'
      loading.value = false
      return
    }
    
    // Set initial image
    currentImage.value = roomData.image || getRoomImage(roomData.room_type?.name)
    
    // Set default dates (today and tomorrow)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    checkInDate.value = today.toISOString().split('T')[0]
    checkOutDate.value = tomorrow.toISOString().split('T')[0]
    
    // STEP 2: Check availability (important for booking)
    await checkAvailability()
    console.log('✅ Availability checked')
    
    // STEP 3: Load reviews (optional, can load in background)
    await fetchReviews(roomId)
    console.log('✅ Reviews loaded:', roomReviews.value.length)
    
    console.log('✅ All content loaded!')
    
  } catch (err) {
    console.error('Error fetching room data:', err)
    error.value = err.message || 'Failed to load room details'
  } finally {
    loading.value = false
  }
}

const getRoomImage = (roomTypeName) => {
  const images = {
    'shared': 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    'semi-private': 'https://images.unsplash.com/photo-1771327811795-6197403af846?w=800',
    'premium': 'https://images.unsplash.com/photo-1663811397091-9a13493eff11?w=800',
    'standard': 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800'
  }
  return images[roomTypeName?.toLowerCase()] || images.standard
}

const handleBookNow = () => {
  if (!localStorage.getItem('isAuthenticated')) {
    router.push({ path: '/login', query: { redirect: `/rooms/${route.params.id}` } })
    return
  }
  
  if (room.value && availabilityData.value) {
    sessionStorage.setItem('selectedRoom', JSON.stringify({
      id: room.value.id,
      room_number: room.value.room_number,
      room_price: room.value.room_price,
      room_type: room.value.room_type,
      branch_id: room.value.branch_id,
      building_id: room.value.building_id,
      floor_id: room.value.floor_id,
      check_in_date: checkInDate.value,
      check_out_date: checkOutDate.value,
      available_seats: availabilityData.value.available_seats
    }))
  }
  
  router.push(`/booking?roomId=${route.params.id}`)
}

// Watch for room ID changes
watch(() => route.params.id, (newId) => {
  if (newId) {
    clearReviews()
    fetchRoomData()
  }
})

onMounted(() => {
  fetchRoomData()
})
</script>