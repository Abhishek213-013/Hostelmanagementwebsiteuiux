<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <main v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading rooms...</p>
      </div>
    </main>

    <!-- Error State -->
    <main v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md">
          <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
          <button @click="fetchRoomsData" class="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all">
            Try Again
          </button>
        </div>
      </div>
    </main>

    <!-- Main Content -->
    <main v-else>
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

        <!-- Room Cards -->
        <div v-if="filteredRooms.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
           <div v-for="room in paginatedRooms" :key="room.id" 
                class="group h-full"
               @mouseenter="hoveredRoom = room.id"
               @mouseleave="hoveredRoom = null">
            <div class="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
              <div class="relative h-72 overflow-hidden">
                <img :src="room.image || getRoomImage(room.room_type?.name)" :alt="'Room ' + room.room_number" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                
                <!-- Capacity Badge -->
                <div class="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                  <Users class="w-4 h-4 text-white" />
                  <span class="text-white font-bold text-sm">Up to {{ room.capacity || getCapacityFromType(room.room_type?.name) }}</span>
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
                  <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 capitalize">
                    {{ room.status || 'Available' }}
                  </span>
                </div>
                
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">{{ room.room_description || getDefaultDescription(room.room_type?.name) }}</p>
                
                <!-- Dynamic Features/Services Section -->
                <div v-if="getRoomServices(room).length > 0" class="space-y-3 mb-8 flex-grow">
                  <div v-for="(service, i) in getRoomServices(room).slice(0, 5)" :key="i" class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-700/30 flex items-center justify-center flex-shrink-0">
                      <component :is="getServiceIcon(service)" class="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <span class="text-gray-700 dark:text-gray-300 text-sm font-medium">{{ service.service_name }}</span>
                  </div>
                </div>
                
                <!-- Fallback to hardcoded features if no services available -->
                <div v-else class="space-y-3 mb-8 flex-grow">
                  <div v-for="(feature, i) in getRoomFeatures(room.room_type?.name).slice(0, 5)" :key="i" class="flex items-center gap-3">
                    <div class="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-700/30 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 class="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <span class="text-gray-700 dark:text-gray-300 text-sm font-medium">{{ feature }}</span>
                  </div>
                </div>
                
                <!-- Availability & Actions -->
                <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-3 mb-4">
                    <div v-if="room.status === 'checking'" class="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                    <div v-else :class="['w-3 h-3 rounded-full', room.status === 'available' ? 'bg-teal-500' : 'bg-red-500']"></div>
                    <span class="text-sm font-bold text-gray-700 dark:text-gray-300">
                      <span v-if="room.status === 'checking'">Checking availability...</span>
                      <span v-else-if="room.status === 'available'">Available</span>
                      <span v-else-if="room.status === 'booked'">Booked</span>
                      <span v-else>Unknown</span>
                    </span>
                    <span v-if="room.status === 'booked'" class="text-xs text-red-500 font-medium ml-1">No seat is available for Booked Room</span>
                  </div>
                  
                  <!-- Floor & Wing Info -->
                  <div class="flex gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Building: {{ room.building_id || 'N/A' }}</span>
                    <span>Floor: {{ room.floor_id || 'N/A' }}</span>
                    <span>Branch: {{ room.branch_id || 'N/A' }}</span>
                  </div>
                  
                  <div class="flex items-center gap-3">
                    <router-link :to="`/rooms/${room.id}`" 
                                 class="px-6 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl font-bold shadow hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 border-2 border-gray-200 dark:border-gray-700">
                      See Details
                      <ArrowRight class="w-4 h-4" />
                    </router-link>
                    <button 
                      @click="handleBookNow(room)"
                      :disabled="room.status !== 'available'"
                      :class="['px-5 py-2.5 text-white rounded-xl font-bold shadow hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2',
                        room.status !== 'available' 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-teal-600 hover:bg-teal-700']">
                      {{ room.status !== 'available' ? 'Booked' : 'Book Now' }}
                      <ArrowRight class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredRooms.length > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Show</span>
            <select v-model.number="perPage" class="px-3 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-teal-500 focus:outline-none transition-all font-semibold">
              <option v-for="opt in perPageOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
            <span>of {{ filteredRooms.length }} rooms</span>
          </div>

          <div class="flex items-center gap-2">
            <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1" class="px-4 py-2 rounded-xl font-bold transition-all text-sm border-2 border-gray-200 dark:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed" :class="currentPage === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow'">
              Prev
            </button>
            <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="['px-4 py-2 rounded-xl font-bold transition-all text-sm', page === currentPage ? 'text-white shadow' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow border-2 border-gray-200 dark:border-gray-600']" :style="page === currentPage ? { background: '#0d9488' } : {}">
              {{ page }}
            </button>
            <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages" class="px-4 py-2 rounded-xl font-bold transition-all text-sm border-2 border-gray-200 dark:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed" :class="currentPage === totalPages ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow'">
              Next
            </button>
          </div>
        </div>

        <!-- No Results -->
        <div v-else class="text-center py-20">
          <Building2 class="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 class="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No rooms found</h3>
          <p class="text-gray-500">Try adjusting your filters to find available rooms</p>
        </div>

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

        <!-- Fallback Amenities Section (if no services from API) -->
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
import { ref, computed, onMounted, watch } from 'vue'
import { useHead } from '@vueuse/head'
import { useRoute, useRouter } from 'vue-router'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { Building2, Star, CheckCircle2, Wifi, Wind, Utensils, Coffee, Dumbbell, Car, BookOpen, Shield, Users, Calendar, Bed, Maximize2, Sparkles, ArrowRight, ChevronRight, Info, Tv, Gamepad2, Refrigerator, WashingMachine, Music, Zap, Bath, Search } from 'lucide-vue-next'
import { useRooms } from '../composables/useRooms'
import { useRoomTypes } from '../composables/useRoomTypes'

useHead({
  title: 'Rooms - SylhetStay | Student Accommodation in Sylhet',
  meta: [
    { name: 'description', content: 'Browse our range of premium student rooms in Sylhet. Choose from shared, semi-private, premium, and standard rooms with modern amenities. Find your perfect space today!' },
    { name: 'keywords', content: 'student rooms Sylhet, accommodation rooms, shared rooms, private rooms, premium student rooms, SylhetStay rooms' },
    { property: 'og:title', content: 'Rooms - SylhetStay | Student Accommodation' },
    { property: 'og:description', content: 'Explore our range of thoughtfully designed student rooms in Sylhet with modern amenities and flexible options.' },
    { property: 'og:type', content: 'website' },
  ]
})

const route = useRoute()
const router = useRouter()
const isLoggedIn = ref(false)

// Use composables
const { rooms, loading: roomsLoading, error: roomsError, fetchRooms } = useRooms()
const { roomTypes: apiRoomTypes, loading: roomTypesLoading, fetchRoomTypes } = useRoomTypes()

const selectedType = ref('all')
const selectedStatus = ref('all')
const searchQuery = ref('')
const priceRange = ref([0, 100000])
const hoveredRoom = ref(null)
const currentPage = ref(1)
const perPage = ref(9)
const perPageOptions = [6, 9, 12, 18, 24]

const totalPages = computed(() => Math.ceil(filteredRooms.value.length / perPage.value))

const paginatedRooms = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredRooms.value.slice(start, start + perPage.value)
})

watch(perPage, () => { currentPage.value = 1 })
watch([selectedType, selectedStatus, searchQuery, priceRange], () => { currentPage.value = 1 }, { deep: true })

const statusOptions = [
  { value: 'all', label: 'All', color: '#0d9488' },
  { value: 'available', label: 'Available', color: '#10b981' },
  { value: 'booked', label: 'Booked', color: '#ef4444' }
]

// Combined loading state
const loading = ref(true)
const error = ref('')

// Helper functions for UI display
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

const getDefaultSize = () => {
  return 250
}

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

// Get services from room_type and room
const getRoomServices = (room) => {
  const services = []
  
  // Get services from room_type (service_on_room_type)
  if (room?.room_type?.service_on_room_type) {
    room.room_type.service_on_room_type.forEach(item => {
      if (item.service) {
        services.push({
          ...item.service,
          source: 'room_type'
        })
      }
    })
  }
  
  // Get services directly from room (service_on_room)
  if (room?.service_on_room) {
    room.service_on_room.forEach(item => {
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
}

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

// Dynamic room types from API
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

// Fallback default amenities (used when no services from API)
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

// Get unique services from all rooms (for the global amenities section)
const allUniqueServices = computed(() => {
  const servicesMap = new Map()
  
  rooms.value.forEach(room => {
    const roomServices = getRoomServices(room)
    roomServices.forEach(service => {
      // Use service ID as key to ensure uniqueness
      if (service.id && !servicesMap.has(service.id)) {
        servicesMap.set(service.id, service)
      }
    })
  })
  
  // Convert Map to array and limit to 8 services for display
  return Array.from(servicesMap.values()).slice(0, 8)
})

// Remove the old hardcoded amenities constant (it's now replaced by defaultAmenities and allUniqueServices)
// const amenities = [...] // DELETE THIS

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
  
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
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

// Progressive fetch - Load critical content first
async function fetchRoomsData() {
  loading.value = true
  error.value = ''
  
  try {
    console.log('🚀 Starting progressive loading for Rooms page...')
    
    await fetchRoomTypes()
    console.log('✅ Room types loaded:', apiRoomTypes.value)
    
    await fetchRooms()
    console.log('✅ Rooms loaded:', rooms.value.length)
    
    if (maxRoomPrice.value > priceRange.value[1]) {
      priceRange.value = [0, maxRoomPrice.value]
    }
    
    // Log services summary
    console.log('✅ Unique services across all rooms:', allUniqueServices.value.length)
    console.log('Services:', allUniqueServices.value.map(s => s.service_name))
    
    console.log('✅ All content loaded!')
    
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

onMounted(async () => {
  await fetchRoomsData()
  isLoggedIn.value = !!localStorage.getItem('isAuthenticated')
})
</script>