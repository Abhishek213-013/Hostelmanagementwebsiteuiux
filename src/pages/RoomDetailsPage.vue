<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
    <Header />
    <div class="relative">
      <!-- Back Button -->
      <div class="max-w-7xl mx-auto px-6 pt-8">
        <router-link to="/rooms" class="group flex items-center gap-2 text-emerald-700 dark:text-emerald-300 hover:text-emerald-500 transition-colors font-medium">
          <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Rooms
        </router-link>
      </div>

      <!-- Room Details Section -->
      <div class="max-w-7xl mx-auto px-6 py-12" v-if="room">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Left Side - Room Image -->
          <div class="space-y-6">
            <!-- Main Image -->
            <div class="relative">
              <div class="rounded-xl overflow-hidden shadow border border-gray-200 dark:border-slate-700">
                <img :src="currentImage" :alt="room.title" class="w-full h-[400px] object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>

                <!-- Price Badge on Image -->
                <div class="absolute top-6 left-6">
                  <div class="px-5 py-3 bg-teal-600 text-white rounded-xl font-black shadow-lg text-lg">
                    ৳{{ room.price.toLocaleString() }}<span class="text-sm font-normal">/mo</span>
                  </div>
                </div>

                <div v-if="room.popular" class="absolute top-6 right-6 px-5 py-3 bg-amber-500 text-white rounded-xl font-bold shadow-lg flex items-center gap-2">
                  <Star class="w-5 h-5 fill-current" />
                  Most Popular
                </div>

                <div class="absolute bottom-6 left-6 flex items-center gap-3 px-5 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                  <Users class="w-5 h-5 text-white" />
                  <span class="text-white font-bold">Up to {{ room.capacity }} {{ room.capacity > 1 ? 'People' : 'Person' }}</span>
                </div>

                <div class="absolute bottom-6 right-6 px-5 py-3 bg-white dark:bg-slate-800 rounded-full shadow">
                  <span class="text-foreground font-black">{{ room.size }}</span>
                </div>
              </div>
            </div>

            <!-- Gallery Thumbnails -->
            <div class="grid grid-cols-4 gap-4">
              <div v-for="(img, i) in room.gallery" :key="i"
                   @click="currentImage = img"
                   :class="['rounded-xl overflow-hidden shadow hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2',
                     currentImage === img ? 'border-teal-500 shadow-lg scale-105' : 'border-transparent hover:border-gray-300']">
                <img :src="img" :alt="`${room.title} ${i + 1}`" class="w-full h-24 object-cover" />
              </div>
            </div>
          </div>

          <!-- Right Side - Room Details -->
          <div class="flex flex-col justify-center space-y-6">
            <!-- Room Type Badge -->
            <div>
              <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                <Sparkles class="w-5 h-5 text-teal-600" />
                <span class="text-sm font-bold tracking-wide text-teal-600">{{ room.type.charAt(0).toUpperCase() + room.type.slice(1).replace('-', ' ') }}</span>
              </div>
            </div>

            <!-- Title -->
            <h1 class="text-3xl lg:text-4xl font-black text-teal-600">{{ room.title }}</h1>

            <!-- Price -->
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-black text-teal-600">৳{{ room.price.toLocaleString() }}</span>
              <span class="text-lg text-muted-foreground">/month</span>
            </div>

            <!-- Availability Status -->
            <div class="flex items-center gap-3">
              <div :class="['w-4 h-4 rounded-full', room.available > 0 ? 'bg-teal-500' : 'bg-red-500']"></div>
              <span class="text-lg font-bold text-foreground">
                {{ room.available > 0 ? `${room.available} rooms available` : 'Fully booked' }}
              </span>
            </div>

            <!-- Description -->
            <p class="text-base text-muted-foreground leading-relaxed">{{ room.description }}</p>

            <!-- Room Specifications - 2 Columns -->
            <div class="grid grid-cols-2 gap-4 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
              <div class="flex items-center gap-3">
                <Bed class="w-5 h-5 text-teal-600" />
                <div>
                  <div class="text-sm text-muted-foreground">Bed Type</div>
                  <div class="font-bold text-foreground">{{ room.bedType }}</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Maximize2 class="w-5 h-5 text-teal-600" />
                <div>
                  <div class="text-sm text-muted-foreground">Room Size</div>
                  <div class="font-bold text-foreground">{{ room.size }}</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Users class="w-5 h-5 text-teal-600" />
                <div>
                  <div class="text-sm text-muted-foreground">Capacity</div>
                  <div class="font-bold text-foreground">{{ room.capacity }} Person{{ room.capacity > 1 ? 's' : '' }}</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <CheckCircle2 class="w-5 h-5 text-teal-600" />
                <div>
                  <div class="text-sm text-muted-foreground">Bathroom</div>
                  <div class="font-bold text-foreground">{{ room.bathroom }}</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Building2 class="w-5 h-5 text-teal-600" />
                <div>
                  <div class="text-sm text-muted-foreground">Floor</div>
                  <div class="font-bold text-foreground">{{ room.floor }}</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Sparkles class="w-5 h-5 text-teal-600" />
                <div>
                  <div class="text-sm text-muted-foreground">View</div>
                  <div class="font-bold text-foreground">{{ room.view }}</div>
                </div>
              </div>
            </div>

            <!-- Book Now Button -->
            <router-link to="/booking" class="group px-10 py-5 bg-teal-600 text-white rounded-xl font-black shadow hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 text-lg">
              Book Now
              <ArrowRight class="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
            </router-link>
          </div>
        </div>

        <!-- Amenities Section -->
        <div class="mt-20 mb-12">
          <h2 class="text-2xl lg:text-3xl font-black mb-12 text-center text-teal-600">Room Amenities</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="(amenity, i) in room.amenities" :key="i" 
                 :class="['group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-slate-700 hover:bg-teal-600 hover:text-white hover:shadow-lg hover:-translate-y-2 hover:border-teal-600 transition-all duration-500 flex items-center gap-4',
                   !amenity.available ? 'opacity-50' : '']">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                   :class="amenity.available ? 'bg-teal-600 group-hover:bg-white/20' : 'bg-gray-100 dark:bg-slate-700'">
                <component :is="getIconComponent(amenity.icon)" 
                           :class="['w-6 h-6', amenity.available ? 'text-white group-hover:text-teal-600' : 'text-gray-400']" />
              </div>
              <div class="flex-1">
                <span class="text-foreground font-semibold group-hover:text-white transition-colors duration-500">{{ amenity.name }}</span>
                <div v-if="!amenity.available" class="text-xs text-gray-400 group-hover:text-white/70 transition-colors duration-500">(Not Available)</div>
              </div>
              <CheckCircle2 v-if="amenity.available" class="w-5 h-5 text-teal-500 flex-shrink-0 group-hover:text-white transition-colors duration-500" />
            </div>
          </div>
        </div>

        <!-- Room Policies Section -->
        <div class="mt-20 mb-12">
          <h2 class="text-2xl lg:text-3xl font-black mb-12 text-center text-teal-600">Room Policies</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div class="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-slate-700 hover:bg-teal-600 hover:text-white hover:shadow-lg hover:-translate-y-2 hover:border-teal-600 transition-all duration-500">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500">
                  <CheckCircle2 class="w-5 h-5 text-teal-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 class="text-lg font-bold text-foreground group-hover:text-white transition-colors duration-500">Main Gate Opens</h3>
              </div>
              <p class="text-foreground font-semibold text-sm group-hover:text-white transition-colors duration-500">{{ room.policies.checkIn }}</p>
            </div>

            <div class="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-slate-700 hover:bg-teal-600 hover:text-white hover:shadow-lg hover:-translate-y-2 hover:border-teal-600 transition-all duration-500">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500">
                  <CheckCircle2 class="w-5 h-5 text-teal-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 class="text-lg font-bold text-foreground group-hover:text-white transition-colors duration-500">Main Gate Closes</h3>
              </div>
              <p class="text-foreground font-semibold text-sm group-hover:text-white transition-colors duration-500">{{ room.policies.checkOut }}</p>
            </div>

            <div class="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-slate-700 hover:bg-teal-600 hover:text-white hover:shadow-lg hover:-translate-y-2 hover:border-teal-600 transition-all duration-500">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500">
                  <CheckCircle2 class="w-5 h-5 text-amber-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 class="text-lg font-bold text-foreground group-hover:text-white transition-colors duration-500">Meal Cancellation</h3>
              </div>
              <p class="text-amber-700 dark:text-amber-300 font-semibold text-sm group-hover:text-white transition-colors duration-500">{{ room.policies.cancellation }}</p>
            </div>

            <div class="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-slate-700 hover:bg-teal-600 hover:text-white hover:shadow-lg hover:-translate-y-2 hover:border-teal-600 transition-all duration-500">
              <div class="flex items-center gap-3 mb-4">
                <div :class="['w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500',
                          room.policies.smoking ? 'bg-teal-100 dark:bg-teal-900' : 'bg-red-100 dark:bg-red-900']">
                  <CheckCircle2 v-if="room.policies.smoking" class="w-5 h-5 text-teal-600 group-hover:text-white transition-colors duration-500" />
                  <X v-else class="w-5 h-5 text-red-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 class="text-lg font-bold text-foreground group-hover:text-white transition-colors duration-500">Smoking</h3>
              </div>
              <p class="text-foreground font-semibold text-sm group-hover:text-white transition-colors duration-500">{{ room.policies.smoking ? 'Allowed' : 'Not Allowed' }}</p>
            </div>

            <div class="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-slate-700 hover:bg-teal-600 hover:text-white hover:shadow-lg hover:-translate-y-2 hover:border-teal-600 transition-all duration-500">
              <div class="flex items-center gap-3 mb-4">
                <div :class="['w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors duration-500',
                          room.policies.pets ? 'bg-teal-100 dark:bg-teal-900' : 'bg-red-100 dark:bg-red-900']">
                  <CheckCircle2 v-if="room.policies.pets" class="w-5 h-5 text-teal-600 group-hover:text-white transition-colors duration-500" />
                  <X v-else class="w-5 h-5 text-red-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 class="text-lg font-bold text-foreground group-hover:text-white transition-colors duration-500">Pets</h3>
              </div>
              <p class="text-foreground font-semibold text-sm group-hover:text-white transition-colors duration-500">{{ room.policies.pets ? 'Allowed' : 'Not Allowed' }}</p>
            </div>
          </div>
        </div>

        <!-- Features List -->
        <div class="mt-20 mb-12">
          <h2 class="text-3xl lg:text-3xl font-black mb-12 text-center text-teal-600">Room Features</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="(feature, i) in room.features" :key="i" class="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-slate-700 hover:bg-teal-600 hover:text-white hover:shadow-lg hover:-translate-y-2 hover:border-teal-600 transition-all duration-500 flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-teal-100 dark:bg-teal-900 group-hover:bg-white/20 transition-colors duration-500">
                <CheckCircle2 class="w-6 h-6 text-teal-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <span class="text-foreground font-semibold group-hover:text-white transition-colors duration-500">{{ feature }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Room Not Found -->
      <div v-else class="min-h-[60vh] flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-6xl font-black text-teal-600 mb-4">Room Not Found</h1>
          <p class="text-xl text-muted-foreground mb-8">The room you're looking for doesn't exist.</p>
          <router-link to="/rooms" class="px-8 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
            View All Rooms
          </router-link>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Users, Maximize2, Bed, CheckCircle2, Wifi, Wind, Utensils, Coffee, Dumbbell, Car, BookOpen, Shield, Star, Sparkles, Zap, Mic, Camera, Sun, Trees, Bath, WashingMachine, Refrigerator, ChevronRight, ArrowRight, X, Building2 } from 'lucide-vue-next'

const route = useRoute()
const currentImage = ref('')

const rooms = [
  {
    id: 1,
    title: 'Shared Room',
    type: 'shared',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600',
      'https://images.unsplash.com/photo-1522771733994-3190f5a43c5e?w=600'
    ],
    features: ['4 Bunk Beds', 'Shared Bathroom', 'Study Desk', 'Wardrobe', 'High-Speed WiFi', 'Fan', 'Common Lounge Access'],
    amenities: [
      { icon: 'Wifi', name: 'High-Speed WiFi', available: true },
      { icon: 'Wind', name: 'Ceiling Fan', available: true },
      { icon: 'Coffee', name: 'Common Kitchenette', available: true },
      { icon: 'BookOpen', name: 'Study Lounge', available: true },
      { icon: 'Dumbbell', name: 'Fitness Center', available: true },
      { icon: 'Car', name: 'Parking', available: true },
      { icon: 'Shield', name: '24/7 Security', available: true },
      { icon: 'Utensils', name: 'Meal Service', available: false }
    ],
    available: 8,
    description: 'Perfect for budget-conscious students who enjoy a social living environment. This shared room offers a vibrant community atmosphere with all essential amenities for comfortable student living.',
    size: '200 sq ft',
    capacity: 4,
    bedType: '4 Bunk Beds',
    bathroom: 'Shared (2 per floor)',
    floor: 'Ground - 2nd Floor',
    view: 'Garden View',
    policies: {
      smoking: false,
      pets: false,
      checkIn: '07:00 AM',
      checkOut: '09:00 PM',
      cancellation: '12/24 hours before'
    }
  },
  {
    id: 2,
    title: 'Semi-Private Room',
    type: 'semi-private',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1771327811795-6197403af846?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1771327811795-6197403af846?w=600',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
      'https://images.unsplash.com/photo-1522771733994-3190f5a43c5e?w=600',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600'
    ],
    features: ['2 Single Beds', 'Attached Bath', 'Study Desks', 'Ceiling Fan', 'High-Speed WiFi', 'Balcony', 'Storage Space'],
    amenities: [
      { icon: 'Wifi', name: 'High-Speed WiFi', available: true },
      { icon: 'Wind', name: 'Ceiling Fan', available: true },
      { icon: 'Coffee', name: 'Mini Kitchenette', available: true },
      { icon: 'BookOpen', name: 'Study Desk', available: true },
      { icon: 'Dumbbell', name: 'Fitness Center', available: true },
      { icon: 'Car', name: 'Parking', available: true },
      { icon: 'Shield', name: '24/7 Security', available: true },
      { icon: 'Utensils', name: 'Meal Service', available: true }
    ],
    available: 4,
    popular: true,
    description: 'Ideal balance of privacy and affordability with modern amenities. Perfect for students who want personal space while staying within budget.',
    size: '300 sq ft',
    capacity: 2,
    bedType: '2 Single Beds',
    bathroom: 'Attached Private',
    floor: '1st - 3rd Floor',
    view: 'City View',
    policies: {
      smoking: false,
      pets: false,
      checkIn: '2:00 PM',
      checkOut: '11:00 AM',
      cancellation: '48 hours before check-in'
    }
  },
  {
    id: 3,
    title: 'Premium Single Room',
    type: 'premium',
    price: 10500,
    image: 'https://images.unsplash.com/photo-1663811397091-9a13493eff11?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1663811397091-9a13493eff11?w=600',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
      'https://images.unsplash.com/photo-1522771733994-3190f5a43c5e?w=600',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600'
    ],
    features: ['Private Room', 'Attached Bath', 'Air Conditioning', 'Premium Furniture', 'Study Table', 'Mini Fridge', 'Wardrobe', 'Desk Lamp'],
    amenities: [
      { icon: 'Wifi', name: 'High-Speed WiFi', available: true },
      { icon: 'Wind', name: 'Split Air Conditioning', available: true },
      { icon: 'Coffee', name: 'Mini Fridge', available: true },
      { icon: 'BookOpen', name: 'Ergonomic Study Desk', available: true },
      { icon: 'Dumbbell', name: 'Fitness Center', available: true },
      { icon: 'Car', name: 'Priority Parking', available: true },
      { icon: 'Shield', name: '24/7 Security', available: true },
      { icon: 'Utensils', name: 'Meal Service', available: true }
    ],
    available: 2,
    description: 'Luxury accommodation with premium furnishings and maximum privacy. Designed for students who demand the best in comfort and convenience.',
    size: '400 sq ft',
    capacity: 1,
    bedType: '1 Queen Size Bed',
    bathroom: 'Attached Premium',
    floor: '2nd - 4th Floor',
    view: 'Garden & Pool View',
    policies: {
      smoking: false,
      pets: false,
      checkIn: '1:00 PM',
      checkOut: '12:00 PM',
      cancellation: '72 hours before check-in'
    }
  },
  {
    id: 4,
    title: 'Deluxe Suite',
    type: 'deluxe',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
      'https://images.unsplash.com/photo-1522771733994-3190f5a43c5e?w=600',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600'
    ],
    features: ['King Size Bed', 'Premium Bath', 'Split AC', 'Work Station', 'Mini Kitchen', 'Smart TV', 'Private Balcony', 'Room Service'],
    amenities: [
      { icon: 'Wifi', name: 'Ultra High-Speed WiFi', available: true },
      { icon: 'Wind', name: 'Climate Control AC', available: true },
      { icon: 'Coffee', name: 'Full Kitchenette', available: true },
      { icon: 'BookOpen', name: 'Executive Work Station', available: true },
      { icon: 'Dumbbell', name: 'Premium Fitness Access', available: true },
      { icon: 'Car', name: 'Valet Parking', available: true },
      { icon: 'Shield', name: 'VIP Security', available: true },
      { icon: 'Utensils', name: 'Room Service', available: true }
    ],
    available: 1,
    description: 'Ultimate luxury living experience with hotel-like amenities and services. The perfect choice for those who want the very best in student accommodation.',
    size: '550 sq ft',
    capacity: 2,
    bedType: '1 King Size Bed',
    bathroom: 'Luxury En-suite',
    floor: 'Top Floor (Penthouse)',
    view: 'Panoramic City View',
    policies: {
      smoking: false,
      pets: false,
      checkIn: '12:00 PM',
      checkOut: '1:00 PM',
      cancellation: '7 days before check-in'
    }
  }
]

const room = computed(() => {
  const id = parseInt(route.params.id)
  return rooms.find(r => r.id === id)
})

// Set current image when room changes
if (room.value) {
  currentImage.value = room.value.image
}

const getIconComponent = (iconName) => {
  const icons = {
    Wifi,
    Wind,
    Coffee,
    BookOpen,
    Dumbbell,
    Car,
    Shield,
    Utensils
  }
  return icons[iconName] || Wifi
}
</script>
