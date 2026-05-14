<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
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
        <p class="text-l text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Everything you need for <span class="text-teal-600 font-bold">success</span>, all under one roof
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        <div v-for="stat in stats" :key="stat.label" class="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg hover:-translate-y-2 transition-all duration-500 hover:bg-teal-600">
          <div class="w-15 h-15 mx-auto mb-6 rounded-2xl bg-teal-600 flex items-center justify-center shadow group-hover:bg-white transition-all duration-500">
            <component :is="stat.icon" class="w-10 h-10 text-white group-hover:text-teal-600" />
          </div>
          <div class="text-2xl font-black mb-2 text-teal-600 group-hover:text-white transition-all duration-500">{{ stat.number }}</div>
          <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-gray-200 transition-all duration-500">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Categories -->
      <div v-for="category in facilityCategories" :key="category.title" class="mb-16">
        <div class="flex items-center gap-6 mb-12">
          <div class="w-15 h-15 rounded-2xl bg-teal-600 flex items-center justify-center shadow">
            <component :is="category.icon" class="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 class="text-xl lg:text-2xl font-black mb-2 text-teal-600">{{ category.title }}</h2>
            <p class="text-gray-600 dark:text-gray-400 text-m">Everything you need for comfortable living</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="facility in category.facilities" :key="facility.name" class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-2 transition-all duration-500">
            <div class="relative h-56 overflow-hidden">
              <img :src="facility.image" :alt="facility.name" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
            </div>
            <div class="p-6">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center shadow">
                  <component :is="facility.icon" class="w-6 h-6 text-white" />
                </div>
                <h3 class="text-lg font-black text-teal-600">{{ facility.name }}</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ facility.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-teal-600 rounded-2xl p-12 md:p-20 text-white text-center">
        <h2 class="text-2xl lg:text-3xl font-black mb-6">Want to Experience Our Facilities?</h2>
        <p class="text-l text-white/90 mb-10 max-w-2xl mx-auto">Book your room today and enjoy all these premium amenities from day one</p>
        <div class="flex flex-wrap justify-center gap-4">
            <router-link to="/rooms" class="px-10 py-5 bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-300 rounded-xl font-bold flex items-center gap-3 hover:shadow-lg hover:scale-105 transition-all">
            <CheckCircle2 class="w-5 h-5" />
            Book Your Room
            <ArrowRight class="w-5 h-5" />
          </router-link>
          <router-link to="/rooms" class="px-10 py-5 bg-teal-700 text-white rounded-xl font-bold border-2 border-teal-500 flex items-center gap-3 hover:bg-teal-800 transition-colors">
            <Sparkles class="w-5 h-5" />
            View Rooms
          </router-link>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { Sparkles, Wifi, Wind, Utensils, Coffee, Dumbbell, Car, BookOpen, Shield, Users, Home, Tv, Gamepad2, Droplets, ShoppingBag, Clock, Phone, MapPin, Star, CheckCircle2, Zap, Mic, Camera, Sun, Trees, Bed, Bath, WashingMachine, Refrigerator, ChevronRight, ArrowRight } from 'lucide-vue-next'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'

const facilityCategories = [
  {
    title: 'Living & Comfort',
    icon: Home,
    facilities: [
      { icon: Wind, name: 'Air Conditioning', desc: 'Climate control in all rooms', image: 'https://images.unsplash.com/photo-1620332372374-f108c53d2e03?w=600' },
      { icon: Wifi, name: 'High-Speed WiFi', desc: 'Fiber optic internet throughout', image: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=600' },
      { icon: Sun, name: 'Natural Lighting', desc: 'Large windows in every room', image: 'https://images.unsplash.com/photo-1721299417031-de890ff33b26?w=600' },
      { icon: Bed, name: 'Premium Bedding', desc: 'Comfortable mattresses provided', image: 'https://images.unsplash.com/photo-1753505888770-46be3b748b41?w=600' }
    ]
  },
  {
    title: 'Dining & Kitchen',
    icon: Utensils,
    facilities: [
      { icon: Utensils, name: 'Dining Hall', desc: 'Spacious dining area with 3 meals', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600' },
      { icon: Coffee, name: 'Common Kitchen', desc: 'Fully equipped shared kitchen', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600' },
      { icon: Refrigerator, name: 'Fridge Access', desc: 'Personal fridge in premium rooms', image: 'https://images.unsplash.com/photo-1753505889211-9cfbac527474?w=600' },
      { icon: ShoppingBag, name: 'Vending Machines', desc: '24/7 snacks and drinks', image: 'https://images.unsplash.com/photo-1620799140408-edc7fdaa47c9?w=600' }
    ]
  },
  {
    title: 'Recreation & Fitness',
    icon: Dumbbell,
    facilities: [
      { icon: Dumbbell, name: 'Fitness Center', desc: 'Modern gym equipment', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600' },
      { icon: Tv, name: 'Entertainment Room', desc: 'Smart TV & gaming consoles', image: 'https://images.unsplash.com/photo-1489599746744-5bace50f4768?w=600' },
      { icon: Gamepad2, name: 'Game Zone', desc: 'Indoor games & recreation', image: 'https://images.unsplash.com/photo-1511512578048-dfb367046420?w=600' },
      { icon: Trees, name: 'Garden Area', desc: 'Peaceful outdoor space', image: 'https://images.unsplash.com/photo-1585320806297-4c64695cc6952?w=600' }
    ]
  },
  {
    title: 'Study & Work',
    icon: BookOpen,
    facilities: [
      { icon: BookOpen, name: 'Study Lounge', desc: 'Quiet study environment', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600' },
      { icon: Mic, name: 'Meeting Rooms', desc: 'For group discussions', image: 'https://images.unsplash.com/photo-1497366216548-c64695cc6952?w=600' },
      { icon: Zap, name: 'Power Backup', desc: '24/7 uninterrupted power', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600' },
      { icon: Camera, name: 'Print Station', desc: 'Printing & scanning facilities', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600' }
    ]
  },
  {
    title: 'Services & Security',
    icon: Shield,
    facilities: [
      { icon: Shield, name: '24/7 Security', desc: 'CCTV & security personnel', image: 'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=600' },
      { icon: Car, name: 'Parking Space', desc: 'Secure parking for residents', image: 'https://images.unsplash.com/photo-1626668890516-8dca865627ef?w=600' },
      { icon: WashingMachine, name: 'Laundry Service', desc: 'Washing machines available', image: 'https://images.unsplash.com/photo-1545173168-9f1c6e193c3b?w=600' },
      { icon: Droplets, name: 'Housekeeping', desc: 'Regular cleaning service', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600' }
    ]
  }
]

const stats = [
  { icon: Wifi, number: '1 Gbps', label: 'Internet Speed' },
  { icon: Shield, number: '24/7', label: 'Security' },
  { icon: Droplets, number: 'Daily', label: 'Housekeeping' },
  { icon: Clock, number: '24hrs', label: 'Power Backup' }
]
</script>
