<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading rooms...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="fetchRoomsData" class="px-6 py-2 bg-teal-600 text-white rounded-lg">Retry</button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <Header />
      <div class="max-w-7xl mx-auto px-6 py-16">
        <!-- Header Section -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow border border-gray-200 dark:border-gray-700 mb-8">
            <div class="p-2 bg-teal-600 rounded-xl">
              <Building2 class="w-4 h-4 text-white" />
            </div>
            <span class="text-sm font-bold tracking-wider text-teal-600 uppercase">Our Rooms</span>
          </div>
          <h1 class="text-3xl lg:text-5xl font-black mb-6 leading-[1.1]">
            <span class="block text-teal-600">Find Your</span>
            <span class="text-gray-800 dark:text-white text-3xl lg:text-5xl">Perfect Space</span>
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">Choose from our range of thoughtfully designed rooms that cater to every need and budget</p>
        </div>

        <!-- Filter Buttons -->
        <div class="flex flex-wrap justify-center gap-3 mb-12">
          <button
            v-for="type in roomTypes"
            :key="type.value"
            @click="selectedType = type.value"
            :class="['px-8 py-4 rounded-2xl font-bold transition-all duration-500 capitalize', 
              selectedType === type.value 
                ? 'text-white shadow-lg scale-105' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg border-2 border-gray-200 dark:border-gray-600']"
            :style="selectedType === type.value ? { background: '#0d9488' } : {}">
            {{ type.label }}
          </button>
        </div>

        <!-- Room Cards -->
        <div v-if="filteredRooms.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div v-for="room in filteredRooms" :key="room.id" 
               class="group"
               @mouseenter="hoveredRoom = room.id"
               @mouseleave="hoveredRoom = null">
            <div class="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
              <div class="relative h-72 overflow-hidden">
                <img :src="room.image" :alt="room.name" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                
                <!-- Capacity Badge -->
                <div class="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                  <Users class="w-4 h-4 text-white" />
                  <span class="text-white font-bold text-sm">Up to {{ room.capacity }}</span>
                </div>
                
                <!-- Size Badge -->
                <div class="absolute top-4 right-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                  <span class="text-gray-800 dark:text-white font-black text-sm">{{ room.size_sqft }} sq ft</span>
                </div>
                
                <!-- Price Overlay -->
                <div class="absolute top-4 left-4">
                  <div class="px-4 py-2 text-white rounded-xl font-black shadow-lg bg-teal-600">
                    {{ room.currency === 'BDT' ? '৳' : '$' }}{{ room.price.toLocaleString() }}<span class="text-xs font-normal">/mo</span>
                  </div>
                  <!-- Discount Badge -->
                  <div v-if="room.discount" class="mt-2 px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-bold">
                    {{ room.discount.value }}% OFF
                  </div>
                </div>

                <!-- Popular Badge -->
                <div v-if="room.is_popular" class="absolute top-4 left-1/2 -translate-x-1/2">
                  <div class="px-4 py-2 bg-amber-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <Star class="w-3 h-3 fill-current" />
                    Most Popular
                  </div>
                </div>
              </div>
              
              <div class="p-8">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-2xl font-black text-teal-600">{{ room.name }}</h3>
                  <div class="flex items-center gap-1">
                    <Star class="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span class="text-sm font-bold text-gray-700 dark:text-gray-300">{{ room.rating }}</span>
                    <span class="text-xs text-gray-500">({{ room.review_count }})</span>
                  </div>
                </div>
                
                <!-- Room Info -->
                <div class="flex flex-wrap gap-2 mb-4">
                  <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {{ room.bed_type }}
                  </span>
                  <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {{ room.bathroom_type }}
                  </span>
                  <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 capitalize">
                    {{ room.category }}
                  </span>
                </div>
                
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">{{ room.short_description }}</p>
                
                <!-- Features -->
                <div class="space-y-3 mb-8">
                  <div v-for="(feature, i) in room.features.slice(0, 5)" :key="i" class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 class="w-4 h-4 text-teal-600" />
                    </div>
                    <span class="text-gray-700 dark:text-gray-300 text-sm font-medium">{{ feature }}</span>
                  </div>
                </div>
                
                <!-- Availability & Actions -->
                <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-3 mb-4">
                    <div :class="['w-3 h-3 rounded-full', room.is_available && room.available_seats > 0 ? 'bg-teal-500' : 'bg-red-500']"></div>
                    <span class="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {{ room.is_available && room.available_seats > 0 ? `${room.available_seats} seat${room.available_seats > 1 ? 's' : ''} available` : 'Fully booked' }}
                    </span>
                  </div>
                  
                  <!-- Floor & Wing Info -->
                  <div class="flex gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Floor: {{ room.floor }}</span>
                    <span>Wing: {{ room.wing }}</span>
                    <span>Room: {{ room.room_number }}</span>
                  </div>
                  
                  <div class="flex items-center gap-3">
                    <router-link :to="`/rooms/${room.id}`" 
                                 class="px-6 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl font-bold shadow hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 border-2 border-gray-200 dark:border-gray-700">
                      See Details
                      <ArrowRight class="w-4 h-4" />
                    </router-link>
                    <button 
                      @click="handleBookNow"
                      :disabled="!room.is_available || room.available_seats === 0"
                      :class="['px-5 py-2.5 text-white rounded-xl font-bold shadow hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2',
                        (!room.is_available || room.available_seats === 0) 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-teal-600 hover:bg-teal-700']">
                      {{ !room.is_available || room.available_seats === 0 ? 'Full' : 'Book Now' }}
                      <ArrowRight class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-else class="text-center py-20">
          <Building2 class="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 class="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No rooms found</h3>
          <p class="text-gray-500">Try adjusting your filters to find available rooms</p>
        </div>

        <!-- Amenities Section -->
        <div class="mb-12">
          <div class="text-center mb-12">
            <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Sparkles class="w-5 h-5 text-teal-600" />
              <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">Features</span>
            </div>
            <h2 class="text-2xl lg:text-3xl font-black mb-6 text-teal-600">Room Amenities</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">Every room comes with essential amenities for comfortable living</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div v-for="(item, i) in amenities" :key="i" 
                 class="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-2 hover:bg-teal-600 hover:border-teal-600 transition-all duration-500">
              <div class="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow bg-teal-600 group-hover:bg-white transition-colors duration-500">
                <component :is="item.icon" class="w-8 h-8 text-white group-hover:text-teal-600 transition-colors duration-500" />
              </div>
              <h3 class="text-lg font-black mb-2 text-center text-teal-600 group-hover:text-white transition-colors duration-500">{{ item.label }}</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm text-center group-hover:text-white/90 transition-colors duration-500">{{ item.desc }}</p>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="bg-teal-600 rounded-2xl p-12 md:p-20 text-white text-center">
          <h2 class="text-2xl lg:text-3xl font-black mb-6">Can't Find What You're Looking For?</h2>
          <p class="text-lg text-white/80 mb-10 max-w-xl mx-auto">Contact us for custom room arrangements or special requirements</p>
          <div class="flex flex-wrap justify-center gap-4">
            <router-link to="/rooms" class="px-10 py-5 bg-white text-teal-600 rounded-xl font-black flex items-center gap-3">
              <Calendar class="w-5 h-5" />
              View All Rooms
              <ChevronRight class="w-5 h-5" />
            </router-link>
            <router-link to="/contact" class="px-10 py-5 bg-teal-700 text-white rounded-xl font-black border-2 border-teal-500 flex items-center gap-3">
              <Info class="w-5 h-5" />
              Contact Us
            </router-link>
          </div>
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
import { useRoute, useRouter } from 'vue-router'
import { Building2, Star, CheckCircle2, Wifi, Wind, Utensils, Coffee, Dumbbell, Car, BookOpen, Shield, Users, Calendar, Bed, Maximize2, Sparkles, ArrowRight, ChevronRight, Info } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const isLoggedIn = ref(false)
const rooms = ref([])
const loading = ref(true)
const error = ref('')

// Fetch rooms data from JSON
async function fetchRoomsData() {
  loading.value = true
  error.value = ''
  try {
    const response = await axios.get('https://raw.githubusercontent.com/Abhishek213-013/dummyJson/refs/heads/main/rooms.json')
    rooms.value = response.data
  } catch (err) {
    console.error('Error fetching rooms data:', err)
    error.value = 'Failed to load rooms. Please check your connection and try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRoomsData()
  isLoggedIn.value = !!localStorage.getItem('isAuthenticated')
})

const handleBookNow = () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  router.push('/booking')
}

const selectedType = ref('all')
const hoveredRoom = ref(null)

// Dynamic room types from JSON data
const roomTypes = computed(() => {
  const types = new Map()
  types.set('all', { value: 'all', label: 'All Rooms' })
  
  rooms.value.forEach(room => {
    const typeValue = room.type
    if (!types.has(typeValue)) {
      types.set(typeValue, {
        value: typeValue,
        label: typeValue.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
      })
    }
  })
  
  return Array.from(types.values())
})

const amenities = [
  { icon: Wifi, label: 'High-Speed WiFi', desc: 'Fiber optic internet' },
  { icon: Wind, label: 'Climate Control', desc: 'AC & Fan in all rooms' },
  { icon: Shield, label: '24/7 Security', desc: 'CCTV & Security guards' },
  { icon: Car, label: 'Parking Space', desc: 'Secure parking area' },
  { icon: Utensils, label: 'Dining Hall', desc: '3 meals included' },
  { icon: BookOpen, label: 'Study Lounge', desc: 'Quiet study areas' },
  { icon: Dumbbell, label: 'Fitness Center', desc: 'Gym & equipment' },
  { icon: Coffee, label: 'Common Room', desc: 'Recreation space' }
]

const filteredRooms = computed(() => {
  let result = rooms.value
  
  if (selectedType.value !== 'all') {
    result = result.filter(room => room.type === selectedType.value)
  }
  
  return result
})

// Initialize filters from URL params
if (route.query.type) selectedType.value = route.query.type
</script>