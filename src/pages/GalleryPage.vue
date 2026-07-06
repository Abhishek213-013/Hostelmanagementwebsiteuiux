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
              
              <img 
                :src="getFullImageUrl(image.src)" 
                :alt="image.alt_text || image.title" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                loading="lazy"
                @error="handleImageError($event, image)"
              />
              
              <div :class="['absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent transition-opacity duration-500', hoveredImage === image.id ? 'opacity-100' : 'opacity-0']">
                <div class="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6">
                  <div class="inline-block px-2 sm:px-4 py-1 sm:py-2 rounded-xl text-white font-bold shadow-lg text-xs sm:text-sm bg-teal-600 mb-1 sm:mb-2 capitalize whitespace-nowrap">
                    {{ getCategoryLabel(image.category) }}
                  </div>
                  <h4 class="text-white font-bold text-sm sm:text-lg break-words">{{ image.title }}</h4>
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

          <p class="text-center text-gray-600 dark:text-gray-400 mt-8 sm:mt-12 font-medium text-sm sm:text-base break-words">
            {{ filteredImages.length }} photo{{ filteredImages.length !== 1 ? 's' : '' }} {{ selectedCategory !== 'all' ? 'in ' + getCategoryLabel(selectedCategory) : 'total' }}
            <span v-if="latestPhoto" class="block text-xs mt-1 text-gray-400">
              Latest photo added: {{ formatDate(latestPhoto.uploaded_at) }}
            </span>
          </p>
        </div>

        <!-- Zoomable Lightbox Modal -->
        <Teleport to="body">
          <Transition name="lightbox-fade">
            <div v-if="isLightboxOpen" class="lightbox-overlay" @click.self="closeLightbox">
              <!-- Top Controls -->
              <div class="lightbox-controls-top">
                <button class="lightbox-close" @click="closeLightbox" aria-label="Close lightbox">
                  <X class="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <!-- Navigation Arrows -->
              <button 
                class="lightbox-nav left-4 sm:left-8" 
                @click.stop="prevImage"
                aria-label="Previous image">
                <ChevronLeft class="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              <button 
                class="lightbox-nav right-4 sm:right-8" 
                @click.stop="nextImage"
                aria-label="Next image">
                <ChevronRight class="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              <!-- Bottom Controls -->
              <div class="lightbox-controls-bottom">
                <button @click="zoomOut" :disabled="zoomLevel <= 0.5" class="lightbox-zoom-btn" aria-label="Zoom out">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </button>
                
                <button @click="resetZoom" class="lightbox-zoom-btn" aria-label="Reset zoom">
                  <span class="zoom-percentage">{{ Math.round(zoomLevel * 100) }}%</span>
                </button>
                
                <button @click="zoomIn" :disabled="zoomLevel >= 3" class="lightbox-zoom-btn" aria-label="Zoom in">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </button>
              </div>

              <!-- Image Container -->
              <div 
                class="lightbox-content"
                @wheel.prevent="handleWheel"
                @mousedown.prevent="startDrag"
                @mousemove.prevent="onDrag"
                @mouseup.prevent="endDrag"
                @mouseleave="handleLightboxMouseLeave"
                @mouseenter="lightboxHovered = true"
              >
                <div 
                  class="lightbox-image-wrapper"
                  :style="imageTransformStyle"
                >
                  <img 
                    :src="getFullImageUrl(lightboxImage.src)" 
                    :alt="lightboxImage.alt_text || lightboxImage.title" 
                    class="lightbox-image"
                    :class="{ 'is-dragging': isDragging }"
                    :style="imageTransformStyle"
                    draggable="false"
                    @error="handleLightboxImageError"
                  />
                </div>
              </div>

              <!-- Image Info -->
              <div :class="['lightbox-info transition-opacity duration-500', lightboxHovered ? 'opacity-100' : 'opacity-0']">
                <p class="text-white text-center font-bold text-base sm:text-xl break-words">{{ lightboxImage.title }}</p>
                <p class="text-white/70 text-center text-sm max-w-lg mx-auto">{{ lightboxImage.description }}</p>
                <p class="text-white/50 text-xs mt-2">{{ currentLightboxIndex + 1 }} / {{ filteredImages.length }}</p>
              </div>

              <!-- Instructions -->
              <div class="lightbox-instructions" v-if="zoomLevel > 1">
                <span>Drag to pan • Scroll to zoom</span>
              </div>
            </div>
          </Transition>
        </Teleport>
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
import { Camera, ChevronRight, ChevronLeft, X } from 'lucide-vue-next'
import { useGallery } from '../composables/useGallery'

useHead({
  title: 'Gallery - City Hostel | Photo Tour of Student Accommodation',
  meta: [
    { name: 'description', content: 'Take a visual tour of City Hostel premium student accommodation. Browse photos of rooms, common areas, dining facilities, and more in Sylhet, Bangladesh.' },
    { name: 'keywords', content: 'City Hostel gallery, student accommodation photos, room images, facilities photos, Sylhet student housing tour' },
    { property: 'og:title', content: 'Gallery - City Hostel | Photo Tour' },
    { property: 'og:description', content: 'Explore our beautiful student living spaces through our photo gallery. See what awaits you at City Hostel.' },
    { property: 'og:type', content: 'website' },
  ]
})

const { galleryItems, loading, error, fetchGallery } = useGallery()

const selectedCategory = ref('all')
const hoveredImage = ref(null)
const lightboxHovered = ref(false)
const currentLightboxIndex = ref(0)
const isLightboxOpen = ref(false)

// Zoom and pan state
const zoomLevel = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)

// Base URL for API
const API_BASE_URL = 'https://dev.hostel.accounting.itlab.solutions'

// Computed transform style
const imageTransformStyle = computed(() => ({
  transform: `translate(${panX.value}px, ${panY.value}px) scale(${zoomLevel.value})`,
  transition: isDragging.value ? 'none' : 'transform 0.3s ease',
}))

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
  resetZoom()
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  isLightboxOpen.value = false
  document.body.style.overflow = ''
  resetZoom()
}

const resetZoom = () => {
  zoomLevel.value = 1
  panX.value = 0
  panY.value = 0
}

const zoomIn = () => {
  if (zoomLevel.value < 3) {
    zoomLevel.value = Math.min(3, zoomLevel.value + 0.25)
  }
}

const zoomOut = () => {
  if (zoomLevel.value > 0.5) {
    zoomLevel.value = Math.max(0.5, zoomLevel.value - 0.25)
    if (zoomLevel.value <= 1) {
      panX.value = 0
      panY.value = 0
    }
  }
}

const handleWheel = (e) => {
  const delta = e.deltaY > 0 ? -0.25 : 0.25
  const newZoom = Math.max(0.5, Math.min(3, zoomLevel.value + delta))
  
  if (newZoom !== zoomLevel.value) {
    zoomLevel.value = newZoom
    if (newZoom <= 1) {
      panX.value = 0
      panY.value = 0
    }
  }
}

const startDrag = (e) => {
  if (zoomLevel.value > 1) {
    isDragging.value = true
    dragStartX.value = e.clientX - panX.value
    dragStartY.value = e.clientY - panY.value
  }
}

const onDrag = (e) => {
  if (isDragging.value && zoomLevel.value > 1) {
    panX.value = e.clientX - dragStartX.value
    panY.value = e.clientY - dragStartY.value
  }
}

const endDrag = () => {
  isDragging.value = false
}

const handleLightboxMouseLeave = () => {
  endDrag()
  lightboxHovered.value = false
}

const prevImage = () => {
  if (filteredImages.value.length === 0) return
  currentLightboxIndex.value = currentLightboxIndex.value > 0 
    ? currentLightboxIndex.value - 1 
    : filteredImages.value.length - 1
  resetZoom()
}

const nextImage = () => {
  if (filteredImages.value.length === 0) return
  currentLightboxIndex.value = currentLightboxIndex.value < filteredImages.value.length - 1 
    ? currentLightboxIndex.value + 1 
    : 0
  resetZoom()
}

const handleImageError = (event, image) => {
  console.warn('Image failed to load:', event.target.src, 'for item:', image.title)
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="%23e2e8f0"%3E%3Crect width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="20"%3ENo Image%3C/text%3E%3C/svg%3E'
  event.target.onerror = null
}

const handleLightboxImageError = (event) => {
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="%23e2e8f0"%3E%3Crect width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="20"%3ENo Image%3C/text%3E%3C/svg%3E'
  event.target.onerror = null
}

const getFullImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${API_BASE_URL}/storage/${cleanPath}`
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

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
    case '+':
    case '=':
      zoomIn()
      break
    case '-':
      zoomOut()
      break
    case '0':
      resetZoom()
      break
  }
}

async function fetchGalleryData() {
  try {
    await fetchGallery()
    console.log('=== GALLERY DATA LOADED ===')
    console.log('Total items:', galleryItems.value?.length)
    if (galleryItems.value?.length > 0) {
      console.log('First item example:', galleryItems.value[0])
      const cats = [...new Set(galleryItems.value.map(item => item.category))]
      console.log('Available categories:', cats)
    }
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
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* ========== Lightbox Styles ========== */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
  box-sizing: border-box;
}

.lightbox-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
}

.lightbox-image {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  user-select: none;
  pointer-events: none;
}

.lightbox-image.is-dragging {
  cursor: grabbing;
}

/* Top Controls */
.lightbox-controls-top {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 10000;
  display: flex;
  gap: 0.75rem;
}

.lightbox-close {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
  padding: 0;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: scale(1.05);
}

/* Navigation Arrows */
.lightbox-nav {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10000;
  padding: 0.75rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-50%) scale(1.05);
}

/* Bottom Controls */
.lightbox-controls-bottom {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  display: flex;
  gap: 0.75rem;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 0.5rem 0.75rem;
}

.lightbox-zoom-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
  padding: 0;
}

.lightbox-zoom-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: scale(1.05);
}

.lightbox-zoom-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.lightbox-zoom-btn svg {
  width: 18px;
  height: 18px;
}

.zoom-percentage {
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  min-width: 40px;
  text-align: center;
}

/* Image Info */
.lightbox-info {
  position: fixed;
  bottom: 7rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  text-align: center;
  pointer-events: none;
}

/* Instructions */
.lightbox-instructions {
  position: fixed;
  bottom: 8.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  pointer-events: none;
  animation: fadeInOut 3s forwards;
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  10% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}

/* Lightbox Transition */
.lightbox-fade-enter-active {
  transition: opacity 0.3s ease;
}
.lightbox-fade-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

.lightbox-fade-enter-active .lightbox-image {
  transition: transform 0.3s ease;
}
.lightbox-fade-enter-from .lightbox-image {
  transform: scale(0.9);
}

/* ========== Responsive ========== */
@media (max-width: 768px) {
  .lightbox-overlay {
    padding: 1rem;
  }
  
  .lightbox-controls-top {
    top: 1rem;
    right: 1rem;
  }
  
  .lightbox-close {
    width: 40px;
    height: 40px;
  }
  
  .lightbox-nav {
    padding: 0.5rem;
  }
  
  .lightbox-controls-bottom {
    bottom: 1.5rem;
    padding: 0.4rem 0.6rem;
    gap: 0.5rem;
  }
  
  .lightbox-zoom-btn {
    width: 36px;
    height: 36px;
  }
  
  .lightbox-zoom-btn svg {
    width: 16px;
    height: 16px;
  }
  
  .lightbox-info {
    bottom: 5.5rem;
  }
  
  .lightbox-instructions {
    bottom: 7rem;
    font-size: 0.7rem;
  }
}
</style>