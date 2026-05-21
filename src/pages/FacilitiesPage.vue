<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading facilities...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="fetchFacilitiesData" class="px-6 py-2 bg-teal-600 text-white rounded-lg">Retry</button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <Header />
      <div class="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
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

        <!-- Categories -->
        <div v-for="(facilities, category) in groupedFacilities" :key="category" class="mb-16">
          <div class="flex items-center gap-6 mb-12">
            <div class="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center shadow">
              <component :is="getCategoryIcon(category)" class="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 class="text-xl lg:text-2xl font-black mb-2 text-teal-600">{{ category }}</h2>
              <p class="text-gray-600 dark:text-gray-400 text-base">{{ getCategoryDescription(category) }}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="facility in facilities" :key="facility.id" 
                 class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-2 transition-all duration-500 group cursor-pointer"
                 @click="toggleFacilityDetail(facility.id)">
              <div class="relative h-56 overflow-hidden">
                <img :src="facility.image" :alt="facility.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                <!-- Status Badge -->
                <div class="absolute top-4 right-4">
                  <span :class="['px-3 py-1 rounded-full text-xs font-bold shadow', 
                    facility.is_active ? 'bg-teal-600 text-white' : 'bg-red-500 text-white']">
                    {{ facility.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <!-- Operating Hours Badge -->
                <div v-if="facility.operating_hours" class="absolute bottom-4 left-4">
                  <span class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/30">
                    {{ typeof facility.operating_hours === 'string' ? facility.operating_hours : 'See details' }}
                  </span>
                </div>
              </div>
              <div class="p-6">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-500">
                    <component :is="getIconComponent(facility.icon)" class="w-6 h-6 text-white" />
                  </div>
                  <h3 class="text-lg font-black text-teal-600">{{ facility.name }}</h3>
                </div>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-sm mb-3">{{ facility.description }}</p>
                
                <!-- Available In Badges -->
                <div class="flex flex-wrap gap-1 mb-3">
                  <span v-for="roomType in facility.available_in" :key="roomType" 
                        class="px-2 py-0.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium capitalize">
                    {{ roomType.replace('-', ' ') }}
                  </span>
                </div>
                
                <!-- Expand Button -->
                <button class="text-teal-600 text-sm font-semibold hover:text-teal-700 transition-colors flex items-center gap-1">
                  {{ expandedFacility === facility.id ? 'Show Less' : 'More Details' }}
                  <ChevronDown :class="['w-4 h-4 transition-transform', expandedFacility === facility.id ? 'rotate-180' : '']" />
                </button>
              </div>
              
              <!-- Expanded Details -->
              <div v-if="expandedFacility === facility.id" 
                   class="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <!-- Long Description -->
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ facility.long_description }}</p>
                
                <!-- Operating Hours Details -->
                <div v-if="facility.operating_hours && typeof facility.operating_hours === 'object'" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <h4 class="text-xs font-bold text-teal-600 mb-2">Operating Hours</h4>
                  <div v-for="(time, meal) in facility.operating_hours" :key="meal" class="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span class="capitalize">{{ meal }}</span>
                    <span>{{ time }}</span>
                  </div>
                </div>
                <div v-else-if="facility.operating_hours && typeof facility.operating_hours === 'string'" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <h4 class="text-xs font-bold text-teal-600 mb-1">Operating Hours</h4>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ facility.operating_hours }}</p>
                </div>
                
                <!-- Equipment / Features -->
                <div v-if="facility.equipment || facility.features" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <h4 class="text-xs font-bold text-teal-600 mb-2">{{ facility.equipment ? 'Equipment' : 'Features' }}</h4>
                  <ul class="space-y-1">
                    <li v-for="(item, i) in (facility.equipment || facility.features)" :key="i" 
                        class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <CheckCircle2 class="w-3 h-3 text-teal-600 flex-shrink-0" />
                      {{ item }}
                    </li>
                  </ul>
                </div>
                
                <!-- Specs -->
                <div v-if="facility.specs" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <h4 class="text-xs font-bold text-teal-600 mb-2">Specifications</h4>
                  <div class="grid grid-cols-2 gap-2">
                    <div v-for="(value, key) in facility.specs" :key="key" class="text-xs">
                      <span class="text-gray-500 capitalize">{{ key.replace(/_/g, ' ') }}:</span>
                      <span class="text-gray-700 dark:text-gray-300 font-semibold">{{ value }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Schedule -->
                <div v-if="facility.schedule" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <h4 class="text-xs font-bold text-teal-600 mb-2">Schedule</h4>
                  <div v-for="(value, key) in facility.schedule" :key="key" class="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span class="capitalize">{{ key.replace(/_/g, ' ') }}</span>
                    <span>{{ value }}</span>
                  </div>
                </div>
                
                <!-- Meal Plans -->
                <div v-if="facility.meal_plan_options" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <h4 class="text-xs font-bold text-teal-600 mb-2">Meal Plans</h4>
                  <div v-for="plan in facility.meal_plan_options" :key="plan.name" class="mb-2 last:mb-0">
                    <div class="flex justify-between text-xs">
                      <span class="font-semibold text-gray-700 dark:text-gray-300">{{ plan.name }}</span>
                      <span class="text-teal-600 font-bold">৳{{ plan.price_per_month?.toLocaleString() }}/mo</span>
                    </div>
                    <div class="flex gap-1 mt-1">
                      <span v-for="meal in plan.includes" :key="meal" class="px-1.5 py-0.5 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 rounded text-xs">
                        {{ meal }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { 
  Sparkles, Wifi, Wind, Utensils, Coffee, Dumbbell, Car, BookOpen, Shield, 
  Users, Home, Tv, Gamepad2, Droplets, ShoppingBag, Clock, Phone, MapPin, Star, 
  CheckCircle2, Zap, Mic, Camera, Sun, Trees, Bed, Bath, WashingMachine, 
  Refrigerator, ChevronRight, ArrowRight, ChevronDown, Sunrise 
} from 'lucide-vue-next'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'

// State
const facilities = ref([])
const loading = ref(true)
const error = ref('')
const expandedFacility = ref(null)

// Fetch facilities data from JSON
async function fetchFacilitiesData() {
  loading.value = true
  error.value = ''
  try {
    const response = await axios.get('https://raw.githubusercontent.com/Abhishek213-013/dummyJson/refs/heads/main/facilities.json')
    facilities.value = response.data
  } catch (err) {
    console.error('Error fetching facilities data:', err)
    error.value = 'Failed to load facilities. Please check your connection and try again.'
  } finally {
    loading.value = false
  }
}

// Group facilities by category
const groupedFacilities = computed(() => {
  const grouped = {}
  facilities.value.forEach(facility => {
    if (!grouped[facility.category]) {
      grouped[facility.category] = []
    }
    grouped[facility.category].push(facility)
  })
  return grouped
})

// Get icon component from string name
const getIconComponent = (iconName) => {
  const icons = {
    'wifi': Wifi,
    'wind': Wind,
    'utensils': Utensils,
    'coffee': Coffee,
    'dumbbell': Dumbbell,
    'car': Car,
    'book-open': BookOpen,
    'shield': Shield,
    'users': Users,
    'home': Home,
    'tv': Tv,
    'gamepad-2': Gamepad2,
    'droplets': Droplets,
    'shopping-bag': ShoppingBag,
    'clock': Clock,
    'phone': Phone,
    'map-pin': MapPin,
    'star': Star,
    'zap': Zap,
    'mic': Mic,
    'camera': Camera,
    'sun': Sun,
    'trees': Trees,
    'bed': Bed,
    'bath': Bath,
    'washing-machine': WashingMachine,
    'refrigerator': Refrigerator,
    'parking-circle': Car,
    'mosque': Home,
    'spray-can': Droplets,
    'sunrise': Sunrise,
    'check-circle-2': CheckCircle2,
  }
  return icons[iconName] || Sparkles
}

// Get category icon
const getCategoryIcon = (category) => {
  const icons = {
    'Living & Comfort': Home,
    'Dining & Kitchen': Utensils,
    'Recreation & Fitness': Dumbbell,
    'Study & Work': BookOpen,
    'Services & Security': Shield,
  }
  return icons[category] || Sparkles
}

// Get category description
const getCategoryDescription = (category) => {
  const descriptions = {
    'Living & Comfort': 'Everything you need for comfortable living',
    'Dining & Kitchen': 'Delicious meals and cooking facilities',
    'Recreation & Fitness': 'Stay active and entertained',
    'Study & Work': 'Productive spaces for academic success',
    'Services & Security': 'Essential services for peace of mind',
  }
  return descriptions[category] || 'Premium facilities for our residents'
}

// Toggle facility detail expansion
const toggleFacilityDetail = (facilityId) => {
  expandedFacility.value = expandedFacility.value === facilityId ? null : facilityId
}

// Stats computed from facilities data
const stats = computed(() => {
  const wifiFacility = facilities.value.find(f => f.icon === 'wifi')
  const securityFacility = facilities.value.find(f => f.icon === 'shield')
  const housekeepingFacility = facilities.value.find(f => f.name === 'Housekeeping')
  const powerFacility = facilities.value.find(f => f.icon === 'zap')
  
  return [
    { 
      icon: Wifi, 
      number: wifiFacility?.specs?.speed || '1 Gbps', 
      label: 'Internet Speed' 
    },
    { 
      icon: Shield, 
      number: '24/7', 
      label: 'Security' 
    },
    { 
      icon: Droplets, 
      number: housekeepingFacility?.schedule?.common_areas || 'Daily', 
      label: 'Housekeeping' 
    },
    { 
      icon: Clock, 
      number: powerFacility?.specs?.fuel_backup_hours ? `${powerFacility.specs.fuel_backup_hours}hrs` : '24hrs', 
      label: 'Power Backup' 
    }
  ]
})

onMounted(() => {
  fetchFacilitiesData()
})
</script>