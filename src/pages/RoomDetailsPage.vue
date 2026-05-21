<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading room details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="fetchRoomData" class="px-6 py-2 bg-teal-600 text-white rounded-lg">Retry</button>
      </div>
    </div>

    <!-- Room Not Found -->
    <div v-else-if="!room" class="min-h-[60vh] flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-6xl font-black text-teal-600 mb-4">Room Not Found</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">The room you're looking for doesn't exist.</p>
        <router-link to="/rooms" class="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
          View All Rooms
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
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
                  <img :src="currentImage" :alt="room.name" class="w-full h-[400px] object-cover" />
                  <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>

                  <div class="absolute top-6 left-6">
                    <div class="px-5 py-3 bg-teal-600 text-white rounded-xl font-black shadow-lg text-lg">
                      {{ room.currency === 'BDT' ? '৳' : '$' }}{{ room.price.toLocaleString() }}<span class="text-sm font-normal">/mo</span>
                    </div>
                    <div v-if="room.discount" class="mt-2 px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-bold">
                      {{ room.discount.value }}% OFF
                    </div>
                    <div v-if="room.original_price && room.original_price !== room.price" class="mt-1 text-sm text-white/70 line-through">
                      {{ room.currency === 'BDT' ? '৳' : '$' }}{{ room.original_price.toLocaleString() }}
                    </div>
                  </div>

                  <div v-if="room.is_popular" class="absolute top-6 right-6 px-5 py-3 bg-amber-500 text-white rounded-xl font-bold shadow-lg flex items-center gap-2">
                    <Star class="w-5 h-5 fill-current" />
                    Most Popular
                  </div>

                  <div class="absolute bottom-6 left-6 flex items-center gap-3 px-5 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                    <Users class="w-5 h-5 text-white" />
                    <span class="text-white font-bold">Up to {{ room.capacity }} {{ room.capacity > 1 ? 'People' : 'Person' }}</span>
                  </div>

                  <div class="absolute bottom-6 right-6 px-5 py-3 bg-white dark:bg-gray-800 rounded-full shadow">
                    <span class="text-gray-800 dark:text-white font-black">{{ room.size_sqft }} sq ft</span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-4 gap-4">
                <div v-for="(img, i) in room.images" :key="i"
                     @click="currentImage = img"
                     :class="['rounded-xl overflow-hidden shadow hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2',
                       currentImage === img ? 'border-teal-500 shadow-lg scale-105' : 'border-transparent hover:border-gray-300']">
                  <img :src="img" :alt="`${room.name} ${i + 1}`" class="w-full h-24 object-cover" />
                </div>
              </div>
            </div>

            <!-- Right Side - Room Details -->
            <div class="flex flex-col justify-center space-y-6">
              <div class="flex flex-wrap gap-3">
                <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <Sparkles class="w-5 h-5 text-teal-600" />
                  <span class="text-sm font-bold tracking-wide text-teal-600 capitalize">{{ room.type.replace('-', ' ') }}</span>
                </div>
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <span class="text-xs font-bold text-gray-500 uppercase">{{ room.category }}</span>
                </div>
              </div>

              <h1 class="text-3xl lg:text-4xl font-black text-teal-600">{{ room.name }}</h1>

              <!-- Rating -->
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1">
                  <Star v-for="n in 5" :key="n" :class="['w-4 h-4', n <= Math.round(room.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600']" />
                </div>
                <span class="text-sm font-bold text-gray-700 dark:text-gray-300">{{ room.rating }}</span>
                <span class="text-sm text-gray-500">({{ room.review_count }} reviews)</span>
              </div>

              <div class="flex items-baseline gap-2">
                <span class="text-2xl font-black text-teal-600">{{ room.currency === 'BDT' ? '৳' : '$' }}{{ room.price.toLocaleString() }}</span>
                <span class="text-lg text-gray-500 dark:text-gray-400">/{{ room.price_unit }}</span>
              </div>

              <div class="flex items-center gap-3">
                <div :class="['w-4 h-4 rounded-full', room.is_available && room.available_seats > 0 ? 'bg-teal-500' : 'bg-red-500']"></div>
                <span class="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {{ room.is_available && room.available_seats > 0 ? `${room.available_seats} seat${room.available_seats > 1 ? 's' : ''} available` : 'Fully booked' }}
                </span>
              </div>

              <p class="text-base text-gray-600 dark:text-gray-400 leading-relaxed">{{ room.description }}</p>

              <div class="grid grid-cols-2 gap-4 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-3">
                  <Bed class="w-5 h-5 text-teal-600" />
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Bed Type</div>
                    <div class="font-bold text-gray-800 dark:text-gray-200">{{ room.bed_type }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <Maximize2 class="w-5 h-5 text-teal-600" />
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Room Size</div>
                    <div class="font-bold text-gray-800 dark:text-gray-200">{{ room.size_sqft }} sq ft ({{ room.size_sqm }} m²)</div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <Users class="w-5 h-5 text-teal-600" />
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Capacity</div>
                    <div class="font-bold text-gray-800 dark:text-gray-200">{{ room.capacity }} Person{{ room.capacity > 1 ? 's' : '' }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <Bath class="w-5 h-5 text-teal-600" />
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Bathroom</div>
                    <div class="font-bold text-gray-800 dark:text-gray-200">{{ room.bathroom_type }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <Building2 class="w-5 h-5 text-teal-600" />
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Location</div>
                    <div class="font-bold text-gray-800 dark:text-gray-200">Floor {{ room.floor }}, Wing {{ room.wing }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <MapPin class="w-5 h-5 text-teal-600" />
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Room No.</div>
                    <div class="font-bold text-gray-800 dark:text-gray-200">{{ room.room_number }}</div>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>Min Stay: {{ room.min_stay_months }} month{{ room.min_stay_months > 1 ? 's' : '' }}</span>
                <span class="text-gray-300">|</span>
                <span>Max Stay: {{ room.max_stay_months }} months</span>
              </div>

              <button 
                @click="handleBookNow" 
                :disabled="!room.is_available || room.available_seats === 0"
                :class="['group px-8 py-4 text-white rounded-xl font-black shadow transition-all flex items-center justify-center gap-3',
                  (!room.is_available || room.available_seats === 0) 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-teal-600 hover:bg-teal-700 hover:shadow-xl hover:scale-105']">
                {{ !room.is_available || room.available_seats === 0 ? 'Currently Unavailable' : 'Book Now' }}
                <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
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
                    <div class="text-4xl font-black text-teal-600">{{ roomReviewStats.average }}</div>
                    <div>
                      <div class="flex items-center gap-1">
                        <Star v-for="n in 5" :key="n" :class="['w-5 h-5', n <= Math.round(roomReviewStats.average) ? 'fill-amber-400 text-amber-400' : 'text-gray-300']" />
                      </div>
                      <p class="text-sm text-gray-500 mt-1">{{ roomReviews.length }} review{{ roomReviews.length !== 1 ? 's' : '' }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Rating Bars -->
                <div class="space-y-2">
                  <div v-for="count in 5" :key="count" class="flex items-center gap-3">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400 w-4">{{ 6 - count }}</span>
                    <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div class="bg-amber-400 h-2 rounded-full transition-all duration-500" 
                           :style="{ width: `${getRatingPercentage(6 - count)}%` }"></div>
                    </div>
                    <span class="text-xs text-gray-500 w-8">{{ getRatingCount(6 - count) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Review Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <div v-for="review in roomReviews" :key="review.id" 
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
                      <li v-for="pro in review.pros" :key="pro" class="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <CheckCircle2 class="w-3 h-3 text-teal-600 flex-shrink-0" />
                        {{ pro }}
                      </li>
                    </ul>
                  </div>
                  <div v-if="review.cons && review.cons.length > 0">
                    <h6 class="text-xs font-bold text-red-500 mb-2">Cons</h6>
                    <ul class="space-y-1">
                      <li v-for="con in review.cons" :key="con" class="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <X class="w-3 h-3 text-red-500 flex-shrink-0" />
                        {{ con }}
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Tags -->
                <div class="flex flex-wrap gap-1 mb-4">
                  <span v-for="tag in review.tags" :key="tag" 
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

          <!-- Amenities Section -->
          <div class="mt-16 mb-10">
            <h2 class="text-2xl lg:text-3xl font-black mb-12 text-center text-teal-600">Room Amenities</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div v-for="(amenity, i) in displayAmenities" :key="i" 
                   class="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700 hover:bg-teal-600 hover:text-white hover:shadow-lg hover:-translate-y-2 hover:border-teal-600 transition-all duration-500 flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-teal-600 group-hover:bg-white/20 transition-colors duration-500">
                  <component :is="getAmenityIcon(amenity)" class="w-6 h-6 text-white" />
                </div>
                <div class="flex-1">
                  <span class="text-gray-800 dark:text-gray-200 font-semibold group-hover:text-white transition-colors duration-500">{{ amenity }}</span>
                </div>
                <CheckCircle2 class="w-5 h-5 text-teal-500 flex-shrink-0 group-hover:text-white transition-colors duration-500" />
              </div>
            </div>
          </div>

          <!-- Features List -->
          <div class="mt-16 mb-10">
            <h2 class="text-3xl lg:text-3xl font-black mb-12 text-center text-teal-600">Room Features</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div v-for="(feature, i) in room.features" :key="i" class="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700 hover:bg-teal-600 hover:text-white hover:shadow-lg hover:-translate-y-2 hover:border-teal-600 transition-all duration-500 flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-teal-100 dark:bg-teal-900 group-hover:bg-white/20 transition-colors duration-500">
                  <CheckCircle2 class="w-6 h-6 text-teal-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <span class="text-gray-800 dark:text-gray-200 font-semibold group-hover:text-white transition-colors duration-500 capitalize">{{ feature }}</span>
              </div>
            </div>
          </div>

          <!-- What's Included Section -->
          <div v-if="room.whats_included && room.whats_included.length > 0" class="mt-16 mb-10">
            <h2 class="text-2xl lg:text-3xl font-black mb-12 text-center text-teal-600">What's Included</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div v-for="(item, i) in room.whats_included" :key="i" class="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700">
                <CheckCircle2 class="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span class="text-gray-700 dark:text-gray-300 font-medium">{{ item }}</span>
              </div>
            </div>
          </div>

          <!-- Cancellation Policy -->
          <div v-if="room.cancellation_policy" class="mt-16 mb-10">
            <h2 class="text-2xl lg:text-3xl font-black mb-12 text-center text-teal-600">Cancellation Policy</h2>
            <div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 shadow border border-gray-200 dark:border-gray-700 text-center">
              <Shield class="w-12 h-12 mx-auto mb-4 text-teal-600" />
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ room.cancellation_policy }}</p>
            </div>
          </div>

          <!-- Nearby Attractions -->
          <div v-if="room.nearby_attractions && room.nearby_attractions.length > 0" class="mt-16 mb-10">
            <h2 class="text-2xl lg:text-3xl font-black mb-12 text-center text-teal-600">Nearby Places</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div v-for="(place, i) in room.nearby_attractions" :key="i" class="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700">
                <MapPin class="w-5 h-5 text-teal-600 flex-shrink-0" />
                <span class="text-gray-700 dark:text-gray-300 text-sm">{{ place }}</span>
              </div>
            </div>
          </div>

          <!-- Maintenance Info -->
          <div v-if="room.last_maintenance" class="mt-8 mb-10 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Last maintained: {{ formatDate(room.last_maintenance) }} | Next maintenance: {{ formatDate(room.next_maintenance) }}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import axios from 'axios'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, Users, Maximize2, Bed, CheckCircle2, Wifi, Wind, Utensils, Coffee, 
  Dumbbell, Car, BookOpen, Shield, Star, Sparkles, Bath, MapPin, Building2, 
  ChevronRight, ArrowRight, X, ThumbsUp
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const currentImage = ref('')
const rooms = ref([])
const reviewsData = ref(null)
const loading = ref(true)
const error = ref('')

// Fetch room data and reviews from JSON
async function fetchRoomData() {
  loading.value = true
  error.value = ''
  try {
    const [roomsResponse, reviewsResponse] = await Promise.all([
      axios.get('https://raw.githubusercontent.com/Abhishek213-013/dummyJson/refs/heads/main/rooms.json'),
      axios.get('https://raw.githubusercontent.com/Abhishek213-013/dummyJson/refs/heads/main/reviews.json')
    ])
    
    rooms.value = roomsResponse.data
    reviewsData.value = reviewsResponse.data
    
    // Set initial image
    const foundRoom = rooms.value.find(r => r.id === parseInt(route.params.id))
    if (foundRoom) {
      currentImage.value = foundRoom.image
    }
  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = 'Failed to load room details. Please check your connection and try again.'
  } finally {
    loading.value = false
  }
}

// Current room based on route param
const room = computed(() => {
  const id = parseInt(route.params.id)
  return rooms.value.find(r => r.id === id) || null
})

// Reviews for current room
const roomReviews = computed(() => {
  if (!reviewsData.value || !room.value) return []
  return reviewsData.value.reviews.filter(r => r.room.id === room.value.id)
})

// Review statistics for current room
const roomReviewStats = computed(() => {
  const reviews = roomReviews.value
  if (reviews.length === 0) {
    return { average: 0, breakdown: {} }
  }
  
  const total = reviews.reduce((sum, r) => sum + r.rating, 0)
  const average = (total / reviews.length).toFixed(1)
  
  const breakdown = {}
  for (let i = 1; i <= 5; i++) {
    breakdown[i] = reviews.filter(r => r.rating === i).length
  }
  
  return { average: parseFloat(average), breakdown }
})

// Get rating percentage for progress bars
const getRatingPercentage = (rating) => {
  const reviews = roomReviews.value
  if (reviews.length === 0) return 0
  const count = reviews.filter(r => r.rating === rating).length
  return (count / reviews.length) * 100
}

// Get rating count
const getRatingCount = (rating) => {
  const reviews = roomReviews.value
  return reviews.filter(r => r.rating === rating).length
}

// Display amenities
const displayAmenities = computed(() => {
  if (!room.value) return []
  const amenities = []
  if (room.value.amenities) {
    room.value.amenities.forEach(a => amenities.push(a))
  }
  return amenities
})

// Get amenity icon
const getAmenityIcon = (amenity) => {
  const name = typeof amenity === 'string' ? amenity.toLowerCase() : amenity.toLowerCase()
  if (name.includes('wifi') || name.includes('internet')) return Wifi
  if (name.includes('ac') || name.includes('air') || name.includes('climate') || name.includes('fan')) return Wind
  if (name.includes('kitchen') || name.includes('food') || name.includes('meal') || name.includes('dining')) return Utensils
  if (name.includes('coffee') || name.includes('tea') || name.includes('lounge') || name.includes('common')) return Coffee
  if (name.includes('gym') || name.includes('fitness') || name.includes('exercise')) return Dumbbell
  if (name.includes('parking') || name.includes('car') || name.includes('vehicle')) return Car
  if (name.includes('study') || name.includes('desk') || name.includes('book') || name.includes('library')) return BookOpen
  if (name.includes('security') || name.includes('cctv') || name.includes('guard')) return Shield
  if (name.includes('bath') || name.includes('shower') || name.includes('toilet')) return Bath
  if (name.includes('tv') || name.includes('television') || name.includes('smart')) return Sparkles
  if (name.includes('bed') || name.includes('mattress') || name.includes('pillow')) return Bed
  return CheckCircle2
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const handleBookNow = () => {
  if (!localStorage.getItem('isAuthenticated')) {
    router.push({ path: '/login', query: { redirect: '/booking' } })
    return
  }
  router.push('/booking')
}

watch(() => route.params.id, () => {
  const foundRoom = rooms.value.find(r => r.id === parseInt(route.params.id))
  if (foundRoom) {
    currentImage.value = foundRoom.image
  }
})

onMounted(() => {
  fetchRoomData()
})
</script>