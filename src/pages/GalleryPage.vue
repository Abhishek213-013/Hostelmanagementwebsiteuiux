<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading gallery...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md">
          <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
          <button @click="fetchGalleryData" class="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all">
            Try Again
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <Header />
      <main class="flex-1 pt-20 sm:pt-28 pb-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
          <!-- Header -->
          <div class="text-center mb-12 sm:mb-16">
            <div class="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white dark:bg-gray-800 rounded-full shadow border border-gray-200 dark:border-gray-700 mb-6 sm:mb-8">
              <div class="p-2 bg-teal-600 rounded-xl">
                <Camera class="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span class="text-xs sm:text-sm font-bold tracking-wider text-teal-600 uppercase">Photo Gallery</span>
            </div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 leading-[1.1]">
              <span class="block text-teal-600">Explore Our</span>
              <span class="block text-gray-800 dark:text-white">Beautiful Space</span>
            </h1>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Take a visual tour of your new home</p>
          </div>

          <!-- Category Filters -->
          <div class="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            <button v-for="cat in categories" :key="cat.id"
                    @click="selectedCategory = cat.id"
                    :class="['px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold transition-all duration-500 text-xs sm:text-sm whitespace-nowrap',
                      selectedCategory === cat.id
                        ? 'text-white shadow-lg scale-105 bg-teal-600'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg border-2 border-gray-200 dark:border-gray-600']">
              {{ cat.label }}
              <span v-if="selectedCategory === cat.id" class="ml-2 text-white/70 text-xs">({{ getCategoryCount(cat.id) }})</span>
            </button>
          </div>

          <!-- Gallery Grid -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
            <div v-for="(image, index) in filteredImages" :key="image.id"
                 class="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer shadow hover:shadow-xl transition-all duration-500"
                 @click="openLightbox(index)"
                 @mouseenter="hoveredImage = image.id"
                 @mouseleave="hoveredImage = null">
              <img :src="image.thumbnail || image.src" :alt="image.alt_text" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <div :class="['absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent transition-opacity duration-500', hoveredImage === image.id ? 'opacity-100' : 'opacity-0']">
                <div class="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6">
                  <div class="inline-block px-2 sm:px-4 py-1 sm:py-2 rounded-xl text-white font-bold shadow-lg text-xs sm:text-sm bg-teal-600 mb-1 sm:mb-2 capitalize whitespace-nowrap">
                    {{ getCategoryLabel(image.category) }}
                  </div>
                  <h4 class="text-white font-bold text-sm sm:text-lg break-words">{{ image.title }}</h4>
                  <!-- Status Badge -->
                  <div v-if="image.status !== undefined" class="mt-1">
                    <span :class="['px-1.5 py-0.5 rounded text-xs', 
                      image.status == 1 ? 'bg-green-500/80' : 'bg-red-500/80']">
                      {{ image.status == 1 ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="absolute top-3 sm:top-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  <Camera class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredImages.length === 0" class="text-center py-16">
            <Camera class="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 class="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No images found</h3>
            <p class="text-gray-500">Try selecting a different category</p>
          </div>

          <!-- Visit Info Card -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-6 sm:p-10 md:p-16">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 items-center">
              <div>
                <h2 class="text-xl sm:text-2xl lg:text-3xl font-black mb-4 sm:mb-6 text-teal-600 break-words">Visit Us Today</h2>
                <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 leading-relaxed break-words">
                  Schedule a tour to see our beautiful facilities in person. We'd love to show you around!
                </p>
                <div class="space-y-4 sm:space-y-6">
                  <div v-for="item in visitInfo" :key="item.label" class="flex items-center gap-3 sm:gap-4 hover:translate-x-2 transition-transform duration-300">
                    <div class="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg bg-teal-600 flex-shrink-0">
                      <component :is="item.icon" class="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div class="min-w-0">
                      <p class="font-bold text-sm sm:text-base text-gray-800 dark:text-gray-200 break-words">{{ item.label }}</p>
                      <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">{{ item.value }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3 sm:gap-4">
                <div v-for="item in amenities" :key="item.label" class="group flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-gray-600">
                  <div class="p-1.5 sm:p-2 rounded-xl shadow-lg bg-teal-600 flex-shrink-0">
                    <component :is="item.icon" class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span class="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 break-words">{{ item.label }}</span>
                </div>
              </div>
            </div>
          </div>

          <p class="text-center text-gray-600 dark:text-gray-400 mt-8 sm:mt-12 font-medium text-sm sm:text-base break-words">
            {{ filteredImages.length }} photo{{ filteredImages.length !== 1 ? 's' : '' }} {{ selectedCategory !== 'all' ? 'in ' + getCategoryLabel(selectedCategory) : 'total' }}
            <span v-if="latestPhoto" class="block text-xs mt-1 text-gray-400">
              Latest photo added: {{ formatDate(latestPhoto.uploaded_at) }}
            </span>
          </p>
        </div>

        <!-- Lightbox Modal -->
        <div v-if="lightboxImage" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-xl" @click="closeLightbox">
          <button class="absolute top-4 sm:top-8 right-4 sm:right-8 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white group" @click="closeLightbox">
            <X class="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform" />
          </button>
          <button class="absolute left-4 sm:left-8 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white group hover:scale-110" @click.stop="prevImage">
            <ChevronLeft class="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <button class="absolute right-4 sm:right-8 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white group hover:scale-110" @click.stop="nextImage">
            <ChevronRight class="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <div class="max-w-5xl max-h-[80vh] mx-4 sm:mx-6" @click.stop>
            <img :src="lightboxImage.src" :alt="lightboxImage.alt_text" class="w-full h-full object-contain rounded-2xl shadow-2xl" />
            <div class="text-center mt-4 sm:mt-6">
              <div class="flex flex-wrap justify-center gap-2 mb-2">
                <span class="inline-block px-3 sm:px-4 py-1.5 sm:py-2 text-white rounded-xl font-bold shadow-xl text-sm sm:text-base bg-teal-600 capitalize">
                  {{ getCategoryLabel(lightboxImage.category) }}
                </span>
                <span v-if="lightboxImage.status !== undefined" :class="['px-2 py-1 rounded-lg text-xs', 
                  lightboxImage.status == 1 ? 'bg-green-500/80' : 'bg-red-500/80']">
                  {{ lightboxImage.status == 1 ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <p class="text-white text-center mt-3 sm:mt-4 font-bold text-base sm:text-xl break-words">{{ lightboxImage.title }}</p>
              <p class="text-white/70 text-center mt-2 text-sm max-w-lg mx-auto">{{ lightboxImage.description }}</p>
              <p class="text-white/50 text-xs mt-2">{{ currentLightboxIndex + 1 }} / {{ filteredImages.length }}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useHead } from '@vueuse/head'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { Camera, ChevronRight, ChevronLeft, Utensils, Dumbbell, Wifi, Car, BookOpen, X, MapPin, Phone, Mail, Wind, Coffee, Shield } from 'lucide-vue-next'
import { useGallery } from '../composables/useGallery'

useHead({
  title: 'Gallery - SylhetStay | Photo Tour of Student Accommodation',
  meta: [
    { name: 'description', content: 'Take a visual tour of SylhetStay premium student accommodation. Browse photos of rooms, common areas, dining facilities, and more in Sylhet, Bangladesh.' },
    { name: 'keywords', content: 'SylhetStay gallery, student accommodation photos, room images, facilities photos, Sylhet student housing tour' },
    { property: 'og:title', content: 'Gallery - SylhetStay | Photo Tour' },
    { property: 'og:description', content: 'Explore our beautiful student living spaces through our photo gallery. See what awaits you at SylhetStay.' },
    { property: 'og:type', content: 'website' },
  ]
})

const { galleryItems, loading, error, fetchGallery } = useGallery()

const selectedCategory = ref('all')
const hoveredImage = ref(null)
const currentLightboxIndex = ref(0)
const isLightboxOpen = ref(false)

// Dynamic categories from gallery data
const categories = computed(() => {
  const cats = new Map()
  cats.set('all', { id: 'all', label: 'All Photos' })
  
  galleryItems.value.forEach(img => {
    if (!cats.has(img.category)) {
      cats.set(img.category, {
        id: img.category,
        label: getCategoryLabel(img.category)
      })
    }
  })
  
  return Array.from(cats.values())
})

const getCategoryLabel = (categoryId) => {
  const labels = {
    'rooms': 'Rooms',
    'common': 'Common Areas',
    'dining': 'Dining',
    'facilities': 'Facilities',
  }
  return labels[categoryId] || categoryId?.charAt(0)?.toUpperCase() + categoryId?.slice(1)?.replace('-', ' ') || 'General'
}

const getCategoryCount = (categoryId) => {
  if (categoryId === 'all') return galleryItems.value.length
  return galleryItems.value.filter(img => img.category === categoryId).length
}

const filteredImages = computed(() => {
  if (selectedCategory.value === 'all') return galleryItems.value
  return galleryItems.value.filter(img => img.category === selectedCategory.value)
})

const lightboxImage = computed(() => {
  if (!isLightboxOpen.value || filteredImages.value.length === 0) return null
  return filteredImages.value[currentLightboxIndex.value] || null
})

const latestPhoto = computed(() => {
  if (galleryItems.value.length === 0) return null
  return [...galleryItems.value].sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at))[0]
})

const openLightbox = (index) => {
  currentLightboxIndex.value = index
  isLightboxOpen.value = true
}

const closeLightbox = () => {
  isLightboxOpen.value = false
}

const prevImage = () => {
  if (filteredImages.value.length === 0) return
  currentLightboxIndex.value = currentLightboxIndex.value > 0 
    ? currentLightboxIndex.value - 1 
    : filteredImages.value.length - 1
}

const nextImage = () => {
  if (filteredImages.value.length === 0) return
  currentLightboxIndex.value = currentLightboxIndex.value < filteredImages.value.length - 1 
    ? currentLightboxIndex.value + 1 
    : 0
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const visitInfo = [
  { icon: MapPin, label: 'Location', value: '123 Akhalia Road, Sylhet 3100, Bangladesh' },
  { icon: Phone, label: 'Phone', value: '+880 1711-123456' },
  { icon: Mail, label: 'Email', value: 'info@sylhetstay.com' }
]

const amenities = [
  { icon: Wifi, label: '1 Gbps WiFi' },
  { icon: Wind, label: 'AC Available' },
  { icon: Utensils, label: 'Meal Plans' },
  { icon: Coffee, label: 'Common Room' },
  { icon: BookOpen, label: 'Study Rooms' },
  { icon: Shield, label: '24/7 Security' },
  { icon: Car, label: 'Parking' },
  { icon: Dumbbell, label: 'Gym' }
]

const handleKeydown = (event) => {
  if (!isLightboxOpen.value) return
  
  switch (event.key) {
    case 'Escape':
      closeLightbox()
      break
    case 'ArrowLeft':
      prevImage()
      break
    case 'ArrowRight':
      nextImage()
      break
  }
}

async function fetchGalleryData() {
  try {
    await fetchGallery()
  } catch (err) {
    console.error('Error fetching gallery:', err)
  }
}

onMounted(() => {
  fetchGalleryData()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>