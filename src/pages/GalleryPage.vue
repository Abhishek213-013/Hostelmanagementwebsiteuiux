<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pt-28 pb-20">
    <Header />
    <div class="max-w-7xl mx-auto px-6">
      <!-- Header -->
      <div class="text-center mb-16">
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow border border-gray-200 mb-8">
          <div class="p-2 bg-teal-600 rounded-xl">
            <Camera class="w-4 h-4 text-white" />
          </div>
          <span class="text-sm font-bold tracking-wider text-teal-600 uppercase">Photo Gallery</span>
        </div>
        <h1 class="text-3xl lg:text-5xl font-black mb-6 leading-[1.1]">
          <span class="block text-teal-600">Explore Our</span>
          <span class="block text-gray-800">Beautiful Space</span>
        </h1>
          <p class="text-l text-gray-600">Take a visual tour of your new home</p>
      </div>

      <!-- Category Filters -->
      <div class="flex flex-wrap justify-center gap-3 mb-12">
        <button v-for="cat in categories" :key="cat.id"
                @click="selectedCategory = cat.id"
                 :class="['px-6 py-3 rounded-full font-bold transition-all duration-500',
                   selectedCategory === cat.id
                     ? 'text-white shadow-lg scale-105 bg-teal-600'
                     : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg border-2 border-gray-200']">
          {{ cat.label }}
          <ChevronRight v-if="selectedCategory === cat.id" class="w-4 h-4 inline ml-2" />
        </button>
      </div>

      <!-- Gallery Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
        <div v-for="(image, index) in filteredImages" :key="image.id"
             class="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer shadow hover:shadow-xl transition-all duration-500"
             @click="selectedImage = image"
             @mouseenter="hoveredImage = image.id"
             @mouseleave="hoveredImage = null">
          <img :src="image.src" :alt="image.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div :class="['absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent transition-opacity duration-500', hoveredImage === image.id ? 'opacity-100' : 'opacity-0']">
            <div class="absolute bottom-6 left-6 right-6">
              <div class="inline-block px-4 py-2 rounded-xl text-white font-bold shadow-lg bg-teal-600 mb-2">
                {{ image.category }}
              </div>
              <h4 class="text-white font-bold text-lg">{{ image.title }}</h4>
            </div>
          </div>
          <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
              <Camera class="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Visit Info Card -->
        <div class="bg-white rounded-2xl shadow border border-gray-200 p-10 md:p-16">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 class="text-xl lg:text-2xl font-black mb-6 text-teal-600">Visit Us Today</h2>
              <p class="text-md text-gray-600 mb-10 leading-relaxed">
              Schedule a tour to see our beautiful facilities in person. We'd love to show you around!
            </p>
            <div class="space-y-6">
              <div v-for="item in visitInfo" :key="item.label" class="flex items-center gap-4 hover:translate-x-2 transition-transform duration-300">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg bg-teal-600">
                  <component :is="item.icon" class="w-7 h-7 text-white" />
                </div>
                <div>
                  <p class="font-bold text-gray-800">{{ item.label }}</p>
                  <p class="text-gray-600">{{ item.value }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="item in amenities" :key="item.label" class="group flex items-center gap-3 p-4 bg-gray-50 rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200">
              <div class="p-2 rounded-xl shadow-lg bg-teal-600">
                <component :is="item.icon" class="w-5 h-5 text-white" />
              </div>
              <span class="text-sm font-semibold text-gray-700">{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>

        <p class="text-center text-gray-600 mt-12 font-medium">
        {{ filteredImages.length }} photos {{ selectedCategory !== 'all' ? 'in ' + getCategoryLabel() : '' }}
      </p>
    </div>

    <!-- Lightbox Modal -->
    <div v-if="selectedImage" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-xl" @click="selectedImage = null">
      <button class="absolute top-8 right-8 p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white group" @click="selectedImage = null">
        <X class="w-6 h-6 group-hover:rotate-90 transition-transform" />
      </button>
      <button class="absolute left-8 p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white group hover:scale-110" @click.stop="prevImage">
        <ChevronLeft class="w-8 h-8" />
      </button>
      <button class="absolute right-8 p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white group hover:scale-110" @click.stop="nextImage">
        <ChevronRight class="w-8 h-8" />
      </button>
      <div class="max-w-5xl max-h-[80vh] mx-6" @click.stop>
        <img :src="selectedImage.src" :alt="selectedImage.title" class="w-full h-full object-contain rounded-2xl shadow-2xl" />
        <div class="text-center mt-6">
          <span class="inline-block px-4 py-2 text-white rounded-xl font-bold shadow-xl bg-teal-600">
            {{ selectedImage.category }}
          </span>
          <p class="text-white text-center mt-4 font-bold text-xl">{{ selectedImage.title }}</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { Camera, ChevronRight, ChevronLeft, ChevronRight as ArrowRight, Utensils, Dumbbell, Wifi, Car, BookOpen, X, ChevronLeft as PrevIcon, MapPin, Phone, Mail, Wind, Coffee, Shield } from 'lucide-vue-next'

const selectedCategory = ref('all')
const selectedImage = ref(null)
const hoveredImage = ref(null)

const galleryImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1620332372374-f108c53d2e03?w=1200', category: 'rooms', title: 'Modern Bedroom' },
  { id: 2, src: 'https://images.unsplash.com/photo-1721299417031-de890ff33b26?w=1200', category: 'rooms', title: 'Premium Suite' },
  { id: 3, src: 'https://images.unsplash.com/photo-1753505888770-46be3b748b41?w=1200', category: 'rooms', title: 'Living Area' },
  { id: 4, src: 'https://images.unsplash.com/photo-1753505889211-9cfbac527474?w=1200', category: 'rooms', title: 'Study Room' },
  { id: 5, src: 'https://images.unsplash.com/photo-1723259457560-b76d597f709b?w=1200', category: 'common', title: 'Lounge Area' },
  { id: 6, src: 'https://images.unsplash.com/photo-1635321349359-333da6bb6da9?w=1200', category: 'common', title: 'Reception' },
  { id: 7, src: 'https://images.unsplash.com/photo-1772944780860-e99bd902d59a?w=1200', category: 'common', title: 'Corridor' },
  { id: 8, src: 'https://images.unsplash.com/photo-1630694144867-37acec97af5c?w=1200', category: 'dining', title: 'Dining Hall' },
  { id: 9, src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200', category: 'dining', title: 'Kitchen' },
  { id: 10, src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200', category: 'facilities', title: 'Gym' },
  { id: 11, src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200', category: 'facilities', title: 'Study Lounge' },
  { id: 12, src: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200', category: 'facilities', title: 'Outdoor Area' }
]

const categories = [
  { id: 'all', label: 'All Photos' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'common', label: 'Common Areas' },
  { id: 'dining', label: 'Dining' },
  { id: 'facilities', label: 'Facilities' }
]

const visitInfo = [
  { icon: MapPin, label: 'Location', value: '123 Akhalia Road, Sylhet 3100, Bangladesh' },
  { icon: Phone, label: 'Phone', value: '+880 1711-123456' },
  { icon: Mail, label: 'Email', value: 'info@sylhetstay.com' }
]

const amenities = [
  { icon: Wifi, label: '100 Mbps WiFi' },
  { icon: Wind, label: 'AC Available' },
  { icon: Utensils, label: 'Meal Plans' },
  { icon: Coffee, label: 'Common Room' },
  { icon: BookOpen, label: 'Study Rooms' },
  { icon: Shield, label: '24/7 Security' },
  { icon: Car, label: 'Parking' },
  { icon: Dumbbell, label: 'Gym' }
]

const filteredImages = computed(() => {
  if (selectedCategory.value === 'all') return galleryImages
  return galleryImages.filter(img => img.category === selectedCategory.value)
})

const prevImage = () => {
  if (!selectedImage.value) return
  const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.value.id)
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : galleryImages.length - 1
  selectedImage.value = galleryImages[prevIndex]
}

const nextImage = () => {
  if (!selectedImage.value) return
  const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.value.id)
  const nextIndex = currentIndex < galleryImages.length - 1 ? currentIndex + 1 : 0
  selectedImage.value = galleryImages[nextIndex]
}

const getCategoryLabel = () => {
  const category = categories.find(c => c.id === selectedCategory.value)
  return category ? category.label : ''
}
</script>
