<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <main>
      <Header />
      <div class="max-w-7xl mx-auto px-6 pt-20 sm:pt-28 pb-16">
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

        <!-- Advanced Filters -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Search -->
            <div class="relative">
              <input v-model="searchQuery" type="text" placeholder="Search rooms..." class="w-full px-4 py-3 pl-10 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-teal-500 focus:outline-none transition-all" />
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            <!-- Status Filter -->
            <div class="flex gap-2">
              <button v-for="opt in statusOptions" :key="opt.value" @click="selectedStatus = opt.value" :class="['px-4 py-2 rounded-xl font-bold transition-all text-sm flex-1', selectedStatus === opt.value ? 'text-white shadow' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600']" :style="selectedStatus === opt.value ? { background: opt.color } : {}">{{ opt.label }}</button>
            </div>

            <!-- Price Range -->
            <div class="flex items-center gap-3">
              <span class="text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Price:</span>
              <input type="range" :min="0" :max="maxRoomPrice" v-model.number="priceRange[1]" class="w-full accent-teal-600" />
              <span class="text-sm font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap min-w-[80px] text-right">৳{{ priceRange[1].toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-if="error" class="text-center py-20">
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md mx-auto">
            <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
            <button @click="fetchRoomsData" class="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all">Try Again</button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else-if="loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400">Loading rooms...</p>
          </div>
        </div>

        <!-- Room Cards -->
        <template v-else>
          <div v-if="visibleRooms.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div v-for="room in visibleRooms" :key="room.id" 
                 :data-room-id="room.id"
                 class="group h-full"
                @mouseenter="hoveredRoom = room.id"
                @mouseleave="hoveredRoom = null">
              <div class="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                <div class="relative h-72 overflow-hidden">
                  <img :src="room.image || getRoomImage(room.room_type?.name)" :alt="'Room ' + room.room_number" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                  
                  <!-- Seats Badge -->
                  <div class="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                    <Users class="w-4 h-4 text-white" />
                    <span class="text-white font-bold text-sm">
                      {{ room.total_seats > 0 ? `${room.total_seats} ${room.total_seats === 1 ? 'Seat' : 'Seats'}` : 'No Seats' }}
                    </span>
                  </div>
                  
                  <!-- Size Badge -->
                  <div class="absolute top-4 right-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                    <span class="text-gray-800 dark:text-white font-black text-sm">{{ room.size_sqft || getDefaultSize() }} sq ft</span>
                  </div>
                  
                  <!-- Price Overlay -->
                  <div class="absolute top-4 left-4">
                    <div class="px-4 py-2 text-white rounded-xl font-black shadow-lg bg-teal-600">
                      ৳{{ (room.room_price || 0).toLocaleString() }}<span class="text-xs font-normal">/mo</span>
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
                
                <div class="p-8 flex flex-col flex-grow">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="text-2xl font-black text-teal-600">{{ room.room_number ? 'Room ' + room.room_number : 'Room ' + room.id }}</h3>
                    <div class="flex items-center gap-1">
                      <Star class="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span class="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {{ room.rating ? room.rating.toFixed(1) : 'N/A' }}
                      </span>
                      <span class="text-xs text-gray-500">({{ room.review_count || 0 }})</span>
                    </div>
                  </div>
                  
                  <!-- Room Info -->
                  <div class="flex flex-wrap gap-2 mb-4">
                    <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 capitalize">
                      {{ room.room_type?.room_type_title || room.room_type?.name || 'Standard' }}
                    </span>
                    <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300">
                      Floor {{ room.floor_id || 'N/A' }}
                    </span>
                    <span :class="[
                      'px-3 py-1 rounded-full text-xs font-semibold capitalize',
                      hasAvailableSeats(room) 
                        ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    ]">
                      {{ getStatusLabel(room) }}
                    </span>
                  </div>
                  
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">{{ room.room_description || getDefaultDescription(room.room_type?.name) }}</p>
                  
                  <!-- Dynamic Features/Services Section -->
                  <div v-if="getMemoizedServices(room).length > 0" class="space-y-3 mb-8 flex-grow">
                    <div v-for="(service, i) in getMemoizedServices(room).slice(0, 5)" :key="i" class="flex items-center gap-3">
                      <div class="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-700/30 flex items-center justify-center flex-shrink-0">
                        <component :is="getServiceIcon(service)" class="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      </div>
                      <span class="text-gray-700 dark:text-gray-300 text-sm font-medium">{{ service.service_name }}</span>
                    </div>
                  </div>
                  
                  <!-- Fallback to hardcoded features -->
                  <div v-else class="space-y-3 mb-8 flex-grow">
                    <div v-for="(feature, i) in getRoomFeatures(room.room_type?.name).slice(0, 5)" :key="i" class="flex items-center gap-3">
                      <div class="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-700/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 class="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      </div>
                      <span class="text-gray-700 dark:text-gray-300 text-sm font-medium">{{ feature }}</span>
                    </div>
                  </div>
                  
                  <!-- Availability & Actions -->
                  <div class="pt-6 border-t border-gray-200 dark:border-gray-700 mt-auto">
                    <!-- Status Indicator -->
                    <div class="flex items-center gap-3 mb-4">
                      <div v-if="room.status === 'checking'" class="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                      <div v-else :class="['w-3 h-3 rounded-full', hasAvailableSeats(room) ? 'bg-teal-500' : 'bg-red-500']"></div>
                      
                      <span v-if="room.status === 'checking'" class="text-sm font-bold inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg">
                        <svg class="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Checking availability...
                      </span>
                      <span v-else class="text-sm font-bold" :class="hasAvailableSeats(room) ? 'text-teal-600 dark:text-teal-400' : 'text-red-600 dark:text-red-400'">
                        <span v-if="hasAvailableSeats(room)">
                          ✓ {{ room.available_seats }} of {{ room.total_seats }} {{ room.total_seats === 1 ? 'seat' : 'seats' }} available
                        </span>
                        <span v-else>
                          ✗ {{ room.total_seats === 0 ? 'No seats configured' : 'Fully Booked' }}
                        </span>
                      </span>
                    </div>
                    
                    <!-- Floor & Wing Info -->
                    <div class="flex flex-wrap gap-3 mb-4 text-xs text-gray-500 dark:text-gray-400">
                      <span v-if="room.building_id" class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">🏢 Building: {{ room.building_id }}</span>
                      <span v-if="room.floor_id" class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">📍 Floor: {{ room.floor_id }}</span>
                      <span v-if="room.branch_id" class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">🏠 Branch: {{ room.branch_id }}</span>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="flex items-center gap-3">
                      <router-link 
                        :to="`/rooms/${room.id}`" 
                        class="flex-1 px-5 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl font-bold shadow hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 group">
                        <span>See Details</span>
                        <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </router-link>
                      
                      <button 
                        @click="handleBookNow(room)"
                        :disabled="!hasAvailableSeats(room)"
                        :class="[
                          'flex-1 px-5 py-3 rounded-xl font-bold shadow transition-all flex items-center justify-center gap-2',
                          hasAvailableSeats(room)
                            ? 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-lg hover:scale-105' 
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        ]"
                        :title="!hasAvailableSeats(room) ? 'No seats available for booking' : 'Book this room now'">
                        <span v-if="hasAvailableSeats(room)">Book Now</span>
                        <span v-else>Sold Out</span>
                        <ArrowRight v-if="hasAvailableSeats(room)" class="w-4 h-4" />
                        <XCircle v-else class="w-4 h-4" />
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

          <!-- Infinite Scroll Sentinel -->
          <div ref="sentinelRef" class="w-full">
            <div v-if="loadingMore" class="flex items-center justify-center py-8">
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                <span class="text-gray-600 dark:text-gray-400 text-sm font-medium">Loading more rooms...</span>
              </div>
            </div>

            <div v-else-if="!hasMore && filteredRooms.length > 0" class="text-center py-8">
              <p class="text-gray-500 text-sm">You've viewed all {{ filteredRooms.length }} rooms</p>
            </div>

            <div v-else-if="hasMore && !observerSupported" class="text-center py-8">
              <button @click="loadMore" class="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all">
                Load More Rooms
              </button>
            </div>
          </div>

          <div class="text-center text-sm text-gray-500 mb-8">
            Showing {{ visibleRooms.length }} of {{ filteredRooms.length }} rooms
          </div>
        </template>

        <!-- Amenities Section (Dynamic) -->
        <div v-if="allUniqueServices.length > 0" class="mb-12">
          <div class="text-center mb-12">
            <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Sparkles class="w-5 h-5 text-teal-600" />
              <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">Features</span>
            </div>
            <h2 class="text-2xl lg:text-3xl font-black mb-6 text-teal-600">Room Amenities</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">Every room comes with essential amenities for comfortable living</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div v-for="(service, i) in allUniqueServices" :key="i" 
                class="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-2 hover:bg-teal-600 hover:border-teal-600 transition-all duration-500">
              <div class="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow bg-teal-600 group-hover:bg-white transition-colors duration-500">
                <component :is="getServiceIcon(service)" class="w-8 h-8 text-white group-hover:text-teal-600 transition-colors duration-500" />
              </div>
              <h3 class="text-lg font-black mb-2 text-center text-teal-600 group-hover:text-white transition-colors duration-500">{{ service.service_name }}</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm text-center group-hover:text-white/90 transition-colors duration-500">{{ service.service_description || 'Available in our rooms' }}</p>
            </div>
          </div>
        </div>

        <!-- Fallback Amenities Section -->
        <div v-else class="mb-12">
          <div class="text-center mb-12">
            <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Sparkles class="w-5 h-5 text-teal-600" />
              <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">Features</span>
            </div>
            <h2 class="text-2xl lg:text-3xl font-black mb-6 text-teal-600">Room Amenities</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">Every room comes with essential amenities for comfortable living</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div v-for="(item, i) in defaultAmenities" :key="i" 
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
            <router-link to="/rooms" class="px-10 py-5 bg-white text-teal-600 rounded-xl font-black flex items-center gap-3 hover:shadow-xl transition-all">
              <Calendar class="w-5 h-5" />
              View All Rooms
              <ChevronRight class="w-5 h-5" />
            </router-link>
            <router-link to="/contact" class="px-10 py-5 bg-teal-700 text-white rounded-xl font-black border-2 border-teal-500 flex items-center gap-3 hover:bg-teal-800 transition-all">
              <Info class="w-5 h-5" />
              Contact Us
            </router-link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useHead } from '@vueuse/head'
import { useRoute, useRouter } from 'vue-router'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { Building2, Star, CheckCircle2, Wifi, Wind, Utensils, Coffee, Dumbbell, Car, BookOpen, Shield, Users, Calendar, Bed, Maximize2, Sparkles, ArrowRight, ChevronRight, Info, Tv, Gamepad2, Refrigerator, WashingMachine, Music, Zap, Bath, Search, XCircle } from 'lucide-vue-next'
import { useRooms } from '../composables/useRooms'
import { useRoomTypes } from '../composables/useRoomTypes'
import { useLazyLoader } from '../composables/useLazyLoader'

useHead({
  title: 'Rooms - City Hostel | Student Accommodation in Sylhet',
  meta: [
    { name: 'description', content: 'Browse our range of premium student rooms in Sylhet. Choose from shared, semi-private, premium, and standard rooms with modern amenities. Find your perfect space today!' },
    { name: 'keywords', content: 'student rooms Sylhet, accommodation rooms, shared rooms, private rooms, premium student rooms, City Hostel rooms' },
    { property: 'og:title', content: 'Rooms - City Hostel | Student Accommodation' },
    { property: 'og:description', content: 'Explore our range of thoughtfully designed student rooms in Sylhet with modern amenities and flexible options.' },
    { property: 'og:type', content: 'website' },
  ]
})

function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

const route = useRoute()
const router = useRouter()
const isLoggedIn = ref(false)

const { rooms, loading: roomsLoading, error: roomsError, fetchRoomsFast, loadRoomLazy } = useRooms()
const { roomTypes: apiRoomTypes, loading: roomTypesLoading, fetchRoomTypes } = useRoomTypes()
const lazyLoader = useLazyLoader()

const selectedType = ref('all')
const selectedStatus = ref('all')
const searchQuery = ref('')
const debouncedSearchQuery = ref('')
const priceRange = ref([0, 100000])
const hoveredRoom = ref(null)

const BATCH_SIZE = 9
const visibleCount = ref(BATCH_SIZE)
const sentinelRef = ref(null)
const observerSupported = ref(false)
let observer = null

const loading = ref(true)
const loadingMore = ref(false)
const error = ref('')

const hasMore = computed(() => {
  return visibleCount.value < filteredRooms.value.length
})

const visibleRooms = computed(() => {
  return filteredRooms.value.slice(0, visibleCount.value)
})

function loadMore() {
  if (!hasMore.value || loadingMore.value) return
  loadingMore.value = true
  visibleCount.value += BATCH_SIZE
  loadingMore.value = false
  nextTick(() => setupLazyRoomLoading())
}

function setupIntersectionObserver() {
  if (!('IntersectionObserver' in window)) {
    observerSupported.value = false
    return
  }
  observerSupported.value = true

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && hasMore.value && !loadingMore.value) {
        loadMore()
      }
    })
  }, { rootMargin: '200px' })

  nextTick(() => {
    if (sentinelRef.value) {
      observer.observe(sentinelRef.value)
    }
  })
}

function teardownIntersectionObserver() {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

function resetVisibleCount() {
  visibleCount.value = BATCH_SIZE
  nextTick(() => {
    teardownIntersectionObserver()
    setupIntersectionObserver()
    lazyLoader.cleanup()
    setupLazyRoomLoading()
  })
}

const statusOptions = [
  { value: 'all', label: 'All', color: '#0d9488' },
  { value: 'available', label: 'Available', color: '#10b981' },
  { value: 'booked', label: 'Booked', color: '#ef4444' }
]

const getRoomImage = (roomTypeName) => {
  const images = {
    'shared': 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    'semi-private': 'https://images.unsplash.com/photo-1771327811795-6197403af846?w=800',
    'premium': 'https://images.unsplash.com/photo-1663811397091-9a13493eff11?w=800',
    'standard': 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800'
  }
  return images[roomTypeName?.toLowerCase()] || images.standard
}

const getCapacityFromType = (roomTypeName) => {
  const capacities = {
    'shared': 4,
    'semi-private': 2,
    'premium': 1,
    'standard': 2
  }
  return capacities[roomTypeName?.toLowerCase()] || 2
}

const hasAvailableSeats = (room) => {
  // If status is 'checking', not yet determined
  if (room.status === 'checking') return false
  
  // If room has total_seats > 0, use seat-based logic
  if (room.total_seats && room.total_seats > 0) {
    return room.status === 'available' && room.available_seats > 0
  }
  
  // No seats configured - unavailable
  return false
}

const getStatusLabel = (room) => {
  if (room.status === 'checking') return 'Checking...'
  if (hasAvailableSeats(room)) return 'Available'
  if (room.total_seats === 0) return 'No Seats'
  return 'Booked'
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

const getRoomServices = (room) => {
  const services = []
  
  if (room?.room_type?.service_on_room_type) {
    room.room_type.service_on_room_type.forEach(item => {
      if (item.service) {
        services.push({ ...item.service, source: 'room_type' })
      }
    })
  }
  
  if (room?.service_on_room) {
    room.service_on_room.forEach(item => {
      if (item.service) {
        const exists = services.some(s => s.id === item.service.id)
        if (!exists) {
          services.push({ ...item.service, source: 'room' })
        }
      }
    })
  }
  
  return services
}

const servicesCache = new WeakMap()
const getMemoizedServices = (room) => {
  if (!servicesCache.has(room)) {
    servicesCache.set(room, getRoomServices(room))
  }
  return servicesCache.get(room)
}

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

const roomTypes = computed(() => {
  const types = [{ value: 'all', label: 'All Rooms' }]
  
  if (apiRoomTypes.value && apiRoomTypes.value.length > 0) {
    apiRoomTypes.value.forEach(type => {
      const typeName = type.room_type_title || type.name || type.title || type.type || 'Unknown'
      types.push({
        value: type.id.toString(),
        label: typeName
      })
    })
  }
  
  return types
})

const defaultAmenities = [
  { icon: Wifi, label: 'High-Speed WiFi', desc: 'Fiber optic internet' },
  { icon: Wind, label: 'Climate Control', desc: 'AC & Fan in all rooms' },
  { icon: Shield, label: '24/7 Security', desc: 'CCTV & Security guards' },
  { icon: Car, label: 'Parking Space', desc: 'Secure parking area' },
  { icon: Utensils, label: 'Dining Hall', desc: '3 meals included' },
  { icon: BookOpen, label: 'Study Lounge', desc: 'Quiet study areas' },
  { icon: Dumbbell, label: 'Fitness Center', desc: 'Gym & equipment' },
  { icon: Coffee, label: 'Common Room', desc: 'Recreation space' }
]

const allUniqueServices = computed(() => {
  const servicesMap = new Map()
  
  rooms.value.forEach(room => {
    const roomServices = getMemoizedServices(room)
    roomServices.forEach(service => {
      if (service.id && !servicesMap.has(service.id)) {
        servicesMap.set(service.id, service)
      }
    })
  })
  
  return Array.from(servicesMap.values()).slice(0, 8)
})

const maxRoomPrice = computed(() => {
  if (rooms.value.length === 0) return 100000
  const max = Math.max(...rooms.value.map(r => r.room_price || 0))
  return max || 100000
})

const filteredRooms = computed(() => {
  let result = rooms.value
  
  if (selectedType.value !== 'all') {
    result = result.filter(room => {
      return room.room_type_id?.toString() === selectedType.value || 
             room.room_type?.id?.toString() === selectedType.value
    })
  }
  
  if (selectedStatus.value !== 'all') {
    result = result.filter(room => room.status === selectedStatus.value)
  }
  
  if (debouncedSearchQuery.value.trim()) {
    const q = debouncedSearchQuery.value.trim().toLowerCase()
    result = result.filter(room =>
      room.room_number?.toLowerCase().includes(q) ||
      room.room_type?.room_type_title?.toLowerCase().includes(q) ||
      room.room_type?.name?.toLowerCase().includes(q)
    )
  }
  
  result = result.filter(room => {
    const price = room.room_price || 0
    return price >= priceRange.value[0] && price <= priceRange.value[1]
  })
  
  const statusOrder = { available: 0, checking: 1, unknown: 2, booked: 3 }
  result = [...result].sort((a, b) => {
    const orderA = statusOrder[a.status] ?? 99
    const orderB = statusOrder[b.status] ?? 99
    return orderA - orderB
  })
  
  return result
})

function setupLazyRoomLoading() {
  nextTick(() => {
    const cards = document.querySelectorAll('[data-room-id]')
    cards.forEach(el => {
      const roomId = parseInt(el.dataset.roomId)
      if (roomId) {
        lazyLoader.observe(el, `room-${roomId}`, () => loadRoomLazy(roomId))
      }
    })
  })
}

async function fetchRoomsData() {
  loading.value = true
  error.value = ''
  
  try {
    console.log('🚀 Starting fast progressive loading for Rooms page...')
    
    await Promise.all([fetchRoomTypes(), fetchRoomsFast()])
    console.log('✅ Room types loaded:', apiRoomTypes.value)
    console.log('✅ Rooms loaded (fast):', rooms.value.length)
    
    if (maxRoomPrice.value > priceRange.value[1]) {
      priceRange.value = [0, maxRoomPrice.value]
    }
    
    console.log('✅ Initial load complete. Lazy-loading availability for visible rooms...')
    
    await nextTick()
    setupIntersectionObserver()
    setupLazyRoomLoading()
    
  } catch (err) {
    console.error('Error fetching rooms data:', err)
    error.value = err.message || 'Failed to load rooms'
  } finally {
    loading.value = false
  }
}

const handleBookNow = (room) => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  
  sessionStorage.setItem('selectedRoom', JSON.stringify({
    id: room.id,
    room_number: room.room_number,
    room_price: room.room_price,
    room_type: room.room_type,
    branch_id: room.branch_id,
    building_id: room.building_id,
    floor_id: room.floor_id
  }))
  
  router.push(`/booking?roomId=${room.id}`)
}

watch(() => route.query.type, (newType) => {
  if (newType) selectedType.value = newType
}, { immediate: true })

watch([selectedType, selectedStatus, debouncedSearchQuery, priceRange], () => {
  resetVisibleCount()
  lazyLoader.cleanup()
  setupLazyRoomLoading()
}, { deep: true })

watch(searchQuery, debounce((val) => {
  debouncedSearchQuery.value = val
}, 300))

onMounted(async () => {
  await fetchRoomsData()
  isLoggedIn.value = !!localStorage.getItem('isAuthenticated')
})

onUnmounted(() => {
  teardownIntersectionObserver()
  lazyLoader.cleanup()
})
</script>