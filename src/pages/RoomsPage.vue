<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
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
        <p class="text-x text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">Choose from our range of thoughtfully designed rooms that cater to every need and budget</p>
      </div>

      <!-- Filter Buttons -->
      <div class="flex flex-wrap justify-center gap-3 mb-12">
        <button v-for="type in ['all', 'shared', 'semi-private', 'premium', 'deluxe']" :key="type"
                @click="selectedType = type"
                :class="['px-8 py-4 rounded-2xl font-bold transition-all duration-500 capitalize', 
                  selectedType === type 
                    ? 'text-white shadow-lg scale-105' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg border-2 border-gray-200 dark:border-gray-600']"
                :style="selectedType === type ? { background: '#0d9488' } : {}">
          {{ type === 'all' ? 'All Rooms' : type.replace('-', ' ') }}
        </button>
      </div>

      <!-- Room Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div v-for="room in filteredRooms" :key="room.id" 
             class="group"
             @mouseenter="hoveredRoom = room.id"
             @mouseleave="hoveredRoom = null">
          <div class="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
            <div class="relative h-72 overflow-hidden">
              <img :src="room.image" :alt="room.title" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
              <!-- Badges -->
              <div class="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                <Users class="w-4 h-4 text-white" />
                <span class="text-white font-bold text-sm">Up to {{ room.capacity }}</span>
              </div>
              <div class="absolute top-4 right-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                 <span class="text-gray-800 dark:text-white font-black text-sm">{{ room.size }}</span>
              </div>
              <!-- Price Overlay -->
              <div class="absolute top-4 left-4">
                <div class="px-4 py-2 text-white rounded-xl font-black shadow-lg bg-teal-600">
                  ৳{{ room.price.toLocaleString() }}<span class="text-xs font-normal">/mo</span>
                </div>
              </div>
            </div>
            <div class="p-8">
              <h3 class="text-2xl font-black mb-3 text-teal-600">{{ room.title }}</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">{{ room.description }}</p>
              <div class="space-y-3 mb-8">
                <div v-for="(feature, i) in room.features.slice(0, 5)" :key="i" class="flex items-center gap-3">
                  <div class="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 class="w-4 h-4 text-teal-600" />
                  </div>
                  <span class="text-gray-700 dark:text-gray-300 text-sm font-medium">{{ feature }}</span>
                </div>
              </div>
              <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-3 mb-4">
                  <div :class="['w-3 h-3 rounded-full', room.available > 0 ? 'bg-teal-500' : 'bg-red-500']"></div>
                  <span class="text-sm font-bold text-gray-700 dark:text-gray-300">
                    {{ room.available > 0 ? `${room.available} available` : 'Fully booked' }}
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <router-link :to="`/rooms/${room.id}`" 
                                class="px-6 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl font-bold shadow hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 border-2 border-gray-200 dark:border-gray-700">
                    See Details
                    <ArrowRight class="w-4 h-4" />
                  </router-link>
                  <button @click="handleBookNow"
                          class="px-5 py-2.5 text-white rounded-xl font-bold shadow hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 bg-teal-600 hover:bg-teal-700">
                    Book Now
                    <ArrowRight class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Amenities Section -->
      <div class="mb-12">
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Sparkles class="w-5 h-5 text-teal-600" />
            <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">Features</span>
          </div>
          <h2 class="text-2xl lg:text-3xl font-black mb-6 text-teal-600">Room Amenities</h2>
          <p class="text-l text-gray-600 dark:text-gray-400">Every room comes with essential amenities for comfortable living</p>
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
        <p class="text-l text-white/80 mb-10 max-w-xl mx-auto">Contact us for custom room arrangements or special requirements</p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/rooms" class="px-10 py-5 bg-white text-teal-600 rounded-xl font-black flex items-center gap-3">
            <Calendar class="w-5 h-5" />
            Book a Room
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { useRoute, useRouter } from 'vue-router'
import { Building2, Star, CheckCircle2, Wifi, Wind, Utensils, Coffee, Dumbbell, Car, BookOpen, Shield, Users, Calendar, Bed, Maximize2, Sparkles, ArrowRight, ChevronRight, Info } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const isLoggedIn = ref(false)

onMounted(() => {
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
const maxSeats = ref('')
const maxPrice = ref('')

const rooms = [
  {
    id: 1,
    title: 'Shared Room',
    type: 'shared',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    features: ['4 Bunk Beds', 'Shared Bathroom', 'Study Desk', 'Wardrobe', 'High-Speed WiFi', 'Fan', 'Common Lounge Access'],
    available: 8,
    description: 'Perfect for budget-conscious students who enjoy a social living environment.',
    size: '200 sq ft',
    capacity: 4,
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 2,
    title: 'Semi-Private Room',
    type: 'semi-private',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1771327811795-6197403af846?w=800',
    features: ['2 Single Beds', 'Attached Bath', 'Study Desks', 'Ceiling Fan', 'High-Speed WiFi', 'Balcony', 'Storage Space'],
    available: 4,
    popular: true,
    description: 'Ideal balance of privacy and affordability with modern amenities.',
    size: '300 sq ft',
    capacity: 2,
    gradient: 'from-sky-500 to-blue-600'
  },
  {
    id: 3,
    title: 'Premium Single Room',
    type: 'premium',
    price: 10500,
    image: 'https://images.unsplash.com/photo-1663811397091-9a13493eff11?w=800',
    features: ['Private Room', 'Attached Bath', 'Air Conditioning', 'Premium Furniture', 'Study Table', 'Mini Fridge', 'Wardrobe', 'Desk Lamp'],
    available: 2,
    description: 'Luxury accommodation with premium furnishings and maximum privacy.',
    size: '400 sq ft',
    capacity: 1,
    gradient: 'from-violet-500 to-purple-600'
  },
  {
    id: 4,
    title: 'Deluxe Suite',
    type: 'deluxe',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    features: ['King Size Bed', 'Premium Bath', 'Split AC', 'Work Station', 'Mini Kitchen', 'Smart TV', 'Private Balcony', 'Room Service'],
    available: 1,
    description: 'Ultimate luxury living experience with hotel-like amenities and services.',
    size: '550 sq ft',
    capacity: 2,
    gradient: 'from-amber-500 to-orange-600'
  }
]

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
  let result = rooms
  if (selectedType.value !== 'all') {
    result = result.filter(room => room.type === selectedType.value)
  }
  if (maxSeats.value) {
    result = result.filter(room => room.capacity <= parseInt(maxSeats.value))
  }
  if (maxPrice.value) {
    result = result.filter(room => room.price <= parseInt(maxPrice.value))
  }
  return result
})

// Initialize filters from URL params
if (route.query.type) selectedType.value = route.query.type
if (route.query.seats) maxSeats.value = route.query.seats
if (route.query.maxPrice) maxPrice.value = route.query.maxPrice
</script>
