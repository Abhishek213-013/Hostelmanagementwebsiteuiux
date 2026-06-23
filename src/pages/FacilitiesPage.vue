<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <main v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading facilities...</p>
      </div>
    </main>

    <!-- Error State -->
    <main v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md">
          <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
          <button @click="fetchFacilitiesData" class="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all">
            Try Again
          </button>
        </div>
      </div>
    </main>

    <!-- Main Content -->
    <main v-else>
      <Header />
      <div class="max-w-[1400px] mx-auto px-6 lg:px-12 pt-20 sm:pt-28 pb-16">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Sparkles class="w-5 h-5 text-amber-500" />
            <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">Premium Amenities</span>
          </div>
          <h1 class="text-3xl lg:text-5xl font-black leading-[1.1] tracking-tight mb-6">
            <span class="block text-teal-600">World-Class</span>
            <span class="block text-gray-800 dark:text-white">Facilities</span>
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Everything you need for <span class="text-teal-600 font-bold">success</span>, all under one roof
          </p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div v-for="stat in stats" :key="stat.label" class="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg hover:-translate-y-2 transition-all duration-500 hover:bg-teal-600">
            <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-teal-600 flex items-center justify-center shadow group-hover:bg-white transition-all duration-500">
              <component :is="stat.icon" class="w-10 h-10 text-white group-hover:text-teal-600" />
            </div>
            <div class="text-2xl font-black mb-2 text-teal-600 group-hover:text-white transition-all duration-500">{{ stat.number }}</div>
            <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-gray-200 transition-all duration-500">{{ stat.label }}</div>
          </div>
        </div>

        <!-- Facilities Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div v-for="facility in facilities" :key="facility.id" 
               class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-2 transition-all duration-500 group cursor-pointer"
               @click="toggleFacilityDetail(facility.id)">
            <div class="p-6">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-14 h-14 rounded-xl bg-teal-600 flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-500">
                  <component :is="getIconFromRemix(facility.icon)" class="w-7 h-7 text-white" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xl font-black text-teal-600">{{ facility.title }}</h3>
                    <!-- Status Badge -->
                    <span :class="['px-2 py-1 rounded-full text-xs font-bold shadow', 
                      facility.status == 1 ? 'bg-teal-600 text-white' : 'bg-red-500 text-white']">
                      {{ facility.status == 1 ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                </div>
              </div>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-sm mb-4">{{ facility.short_description }}</p>
              
              <!-- Expand Button -->
              <button class="text-teal-600 text-sm font-semibold hover:text-teal-700 transition-colors flex items-center gap-1">
                {{ expandedFacility === facility.id ? 'Show Less' : 'More Details' }}
                <ChevronDown :class="['w-4 h-4 transition-transform', expandedFacility === facility.id ? 'rotate-180' : '']" />
              </button>
            </div>
            
            <!-- Expanded Details -->
            <div v-if="expandedFacility === facility.id" 
                 class="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
              <!-- Full Description -->
              <div v-if="facility.description" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 class="text-xs font-bold text-teal-600 mb-2">Description</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ facility.description }}</p>
              </div>
              
              <!-- Sort Order Info -->
              <!-- <div v-if="facility.sort_order" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div class="flex justify-between text-xs">
                  <span class="text-gray-500">Sort Order</span>
                  <span class="text-gray-700 dark:text-gray-300 font-semibold">{{ facility.sort_order }}</span>
                </div>
              </div> -->
              
              <!-- Timestamps -->
              <!-- <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span class="text-gray-500">Created:</span>
                    <span class="text-gray-700 dark:text-gray-300 ml-2">{{ formatDate(facility.created_at) }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Updated:</span>
                    <span class="text-gray-700 dark:text-gray-300 ml-2">{{ formatDate(facility.updated_at) }}</span>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </div>

        <!-- No Facilities Message -->
        <div v-if="facilities.length === 0" class="text-center py-20">
          <Building2 class="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 class="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No facilities found</h3>
          <p class="text-gray-500">Check back later for updated amenities</p>
        </div>

        <!-- CTA Section -->
        <div class="bg-teal-600 rounded-2xl p-12 md:p-20 text-white text-center">
          <h2 class="text-2xl lg:text-3xl font-black mb-6">Want to Experience Our Facilities?</h2>
          <p class="text-lg text-white/90 mb-10 max-w-2xl mx-auto">Book your room today and enjoy all these premium amenities from day one</p>
          <div class="flex flex-wrap justify-center gap-4">
            <router-link to="/rooms" class="px-10 py-5 bg-white text-teal-600 rounded-xl font-bold flex items-center gap-3 hover:shadow-lg hover:scale-105 transition-all">
              <CheckCircle2 class="w-5 h-5" />
              Book Your Room
              <ArrowRight class="w-5 h-5" />
            </router-link>
            <router-link to="/contact" class="px-10 py-5 bg-teal-700 text-white rounded-xl font-bold border-2 border-teal-500 flex items-center gap-3 hover:bg-teal-800 transition-colors">
              <Sparkles class="w-5 h-5" />
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
import { ref, computed, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { 
  Sparkles, Wifi, Wind, Utensils, Coffee, Dumbbell, Car, BookOpen, Shield, 
  Users, Home, Tv, Gamepad2, Droplets, ShoppingBag, Clock, Phone, MapPin, Star, 
  CheckCircle2, Zap, Mic, Camera, Sun, Trees, Bed, Bath, WashingMachine, 
  Refrigerator, ChevronDown, ArrowRight, Building2
} from 'lucide-vue-next'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { useFacilities } from '../composables/useFacilities'

useHead({
  title: 'Facilities - SylhetStay | Premium Student Amenities',
  meta: [
    { name: 'description', content: 'Explore world-class facilities at SylhetStay - high-speed WiFi, gym, dining hall, study lounge, 24/7 security, and more. Premium student amenities in Sylhet.' },
    { name: 'keywords', content: 'student facilities Sylhet, amenities, WiFi, gym, dining hall, study lounge, security, SylhetStay facilities' },
    { property: 'og:title', content: 'Facilities - SylhetStay | Premium Student Amenities' },
    { property: 'og:description', content: 'Everything you need for success - world-class student facilities all under one roof at SylhetStay.' },
    { property: 'og:type', content: 'website' },
  ]
})

// Use facilities composable
const { facilities, loading, error, fetchFacilities } = useFacilities()

// State
const expandedFacility = ref(null)

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

// Convert Remix Icon names to Lucide icons
const getIconFromRemix = (remixIconName) => {
  if (!remixIconName) return Sparkles
  
  const iconMap = {
    'ri-wifi-line': Wifi,
    'ri-wifi-fill': Wifi,
    'ri-dumbbell-line': Dumbbell,
    'ri-dumbbell-fill': Dumbbell,
    'ri-restaurant-line': Utensils,
    'ri-restaurant-fill': Utensils,
    'ri-cup-line': Coffee,
    'ri-cup-fill': Coffee,
    'ri-car-line': Car,
    'ri-car-fill': Car,
    'ri-book-open-line': BookOpen,
    'ri-book-open-fill': BookOpen,
    'ri-shield-line': Shield,
    'ri-shield-fill': Shield,
    'ri-user-line': Users,
    'ri-user-fill': Users,
    'ri-home-line': Home,
    'ri-home-fill': Home,
    'ri-tv-line': Tv,
    'ri-tv-fill': Tv,
    'ri-gamepad-line': Gamepad2,
    'ri-gamepad-fill': Gamepad2,
    'ri-drop-line': Droplets,
    'ri-drop-fill': Droplets,
    'ri-shopping-bag-line': ShoppingBag,
    'ri-shopping-bag-fill': ShoppingBag,
    'ri-time-line': Clock,
    'ri-time-fill': Clock,
    'ri-phone-line': Phone,
    'ri-phone-fill': Phone,
    'ri-map-pin-line': MapPin,
    'ri-map-pin-fill': MapPin,
    'ri-star-line': Star,
    'ri-star-fill': Star,
    'ri-flashlight-line': Zap,
    'ri-flashlight-fill': Zap,
    'ri-mic-line': Mic,
    'ri-mic-fill': Mic,
    'ri-camera-line': Camera,
    'ri-camera-fill': Camera,
    'ri-sun-line': Sun,
    'ri-sun-fill': Sun,
    'ri-tree-line': Trees,
    'ri-tree-fill': Trees,
    'ri-bed-line': Bed,
    'ri-bed-fill': Bed,
    'ri-shower-line': Bath,
    'ri-shower-fill': Bath,
    'ri-fridge-line': Refrigerator,
    'ri-fridge-fill': Refrigerator,
  }
  
  return iconMap[remixIconName] || Sparkles
}

// Stats computed from facilities data
const stats = computed(() => {
  const totalFacilities = facilities.value.length
  const activeFacilities = facilities.value.filter(f => f.status == 1).length
  
  return [
    { icon: Wifi, number: 'High Speed', label: 'Internet Speed' },
    { icon: Shield, number: '24/7', label: 'Security' },
    { icon: Droplets, number: 'Daily', label: 'Housekeeping' },
    { icon: Clock, number: totalFacilities.toString(), label: 'Total Facilities' }
  ]
})

// Toggle facility detail expansion
const toggleFacilityDetail = (facilityId) => {
  expandedFacility.value = expandedFacility.value === facilityId ? null : facilityId
}

// Fetch facilities data from API
async function fetchFacilitiesData() {
  try {
    await fetchFacilities()
    console.log('Loaded facilities:', facilities.value)
  } catch (err) {
    console.error('Error fetching facilities:', err)
  }
}

onMounted(() => {
  fetchFacilitiesData()
})
</script>