<template>
  <nav :class="['fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white dark:bg-slate-900 shadow-lg shadow-slate-900/5 dark:shadow-slate-900/20 border-b border-slate-200/50 dark:border-slate-700/50']">
    <div class="max-w-[1400px] mx-auto px-6 lg:px-12">
      <div class="flex justify-between items-center h-16 lg:h-20">
        <router-link to="/" class="flex items-center gap-4 group cursor-pointer">
          <img 
            src="@/assets/logo/logo.png" 
            alt="Logo" 
            class="h-16 lg:h-28 w-auto object-contain transition-all duration-300" 
          />
        </router-link>

        <div class="hidden lg:flex items-center gap-6">
          <router-link to="/" class="relative text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300 group">
            Home
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500 ease-out" :style="{ background: 'linear-gradient(to right, #1a1a1a, #525252)' }"></span>
          </router-link>
          <router-link to="/rooms" class="relative text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300 group">
            Rooms
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500 ease-out" :style="{ background: 'linear-gradient(to right, #1a1a1a, #525252)' }"></span>
          </router-link>
          <router-link to="/facilities" class="relative text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300 group">
            Facilities
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500 ease-out" :style="{ background: 'linear-gradient(to right, #1a1a1a, #525252)' }"></span>
          </router-link>
          <router-link to="/gallery" class="relative text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300 group">
            Gallery
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500 ease-out" :style="{ background: 'linear-gradient(to right, #1a1a1a, #525252)' }"></span>
          </router-link>
          <router-link to="/about" class="relative text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300 group">
            About
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500 ease-out" :style="{ background: 'linear-gradient(to right, #1a1a1a, #525252)' }"></span>
          </router-link>
          <router-link to="/contact" class="relative px-5 py-2 text-white rounded-2xl font-bold overflow-hidden group shadow-lg transition-all duration-300" :style="{ background: 'linear-gradient(to right, #1a1a1a, #525252, #1c1917)' }">
            <span class="relative z-10">Contact Us</span>
          </router-link>
          
          <!-- Authenticated User Dropdown -->
          <div v-if="isAuthenticated" class="relative" ref="profileDropdownRef">
            <button @click="profileOpen = !profileOpen" class="flex items-center gap-2 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div class="w-10 h-10 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                <img v-if="profileImage" :src="profileImage" alt="Profile" class="w-full h-full object-cover" />
                <span v-else>{{ userInitial }}</span>
              </div>
              <div class="hidden xl:block text-left">
                <p class="text-sm font-bold text-slate-800 dark:text-white leading-tight">{{ userName }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-tight truncate max-w-[120px]">{{ userEmail }}</p>
              </div>
            </button>
            
            <!-- Dropdown Menu -->
            <div v-if="profileOpen" class="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50">
              <!-- User Info Header -->
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    <img v-if="profileImage" :src="profileImage" alt="Profile" class="w-full h-full object-cover" />
                    <span v-else>{{ userInitial }}</span>
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-slate-800 dark:text-white text-sm truncate">{{ userName }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ userEmail }}</p>
                  </div>
                </div>
                <!-- User Badges -->
                <div v-if="userData.university" class="mt-2 flex flex-wrap gap-1">
                  <span class="px-2 py-0.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium truncate max-w-[200px]">
                    {{ userData.university }}
                  </span>
                </div>
              </div>
              
              <!-- Menu Items -->
              <router-link to="/my-rooms" @click="profileOpen = false" class="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <Building2 class="w-4 h-4 text-teal-600" />
                My Rooms
              </router-link>
              <router-link to="/my-payments" @click="profileOpen = false" class="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <CreditCard class="w-4 h-4 text-teal-600" />
                My Payments
              </router-link>
              <router-link to="/profile-management" @click="profileOpen = false" class="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <User class="w-4 h-4 text-teal-600" />
                Profile Management
              </router-link>
              
              <div class="border-t border-slate-200 dark:border-slate-700 mt-1 pt-1">
                <button @click="logout" class="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <LogOut class="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          <!-- Login Button (when not authenticated) -->
          <router-link v-else to="/login" class="px-6 py-2.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-2xl font-bold overflow-hidden group shadow-lg border-2 border-slate-200 dark:border-slate-700 transition-all duration-300">
            <span class="relative z-10">Login / Sign Up</span>
          </router-link>
          
          <!-- Theme Toggle -->
          <button @click="toggleTheme" class="p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300" aria-label="Toggle theme">
            <Sun v-if="isDark" class="w-6 h-6" />
            <Moon v-else class="w-6 h-6" />
          </button>
        </div>

        <!-- Mobile Menu Toggle -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300">
          <Menu v-if="!mobileMenuOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-slate-200/50 dark:border-slate-700/50">
      <div class="px-6 py-4 space-y-2">
        <router-link to="/" class="block py-2.5 text-slate-700 dark:text-slate-300 hover:text-teal-600 font-semibold transition-colors" @click="mobileMenuOpen = false">Home</router-link>
        <router-link to="/rooms" class="block py-2.5 text-slate-700 dark:text-slate-300 hover:text-teal-600 font-semibold transition-colors" @click="mobileMenuOpen = false">Rooms</router-link>
        <router-link to="/facilities" class="block py-2.5 text-slate-700 dark:text-slate-300 hover:text-teal-600 font-semibold transition-colors" @click="mobileMenuOpen = false">Facilities</router-link>
        <router-link to="/gallery" class="block py-2.5 text-slate-700 dark:text-slate-300 hover:text-teal-600 font-semibold transition-colors" @click="mobileMenuOpen = false">Gallery</router-link>
        <router-link to="/about" class="block py-2.5 text-slate-700 dark:text-slate-300 hover:text-teal-600 font-semibold transition-colors" @click="mobileMenuOpen = false">About</router-link>
        <router-link to="/contact" class="block py-2.5 text-slate-700 dark:text-slate-300 hover:text-teal-600 font-semibold transition-colors" @click="mobileMenuOpen = false">Contact</router-link>
        
        <!-- Theme Toggle Mobile -->
        <button @click="toggleThemeAndClose" class="flex items-center gap-3 py-2.5 text-slate-700 dark:text-slate-300 hover:text-teal-600 font-semibold transition-colors w-full">
          <Sun v-if="isDark" class="w-4 h-4" />
          <Moon v-else class="w-4 h-4" />
          {{ isDark ? 'Light Mode' : 'Dark Mode' }}
        </button>
        
        <!-- Authenticated Mobile Menu -->
        <div v-if="isAuthenticated" class="pt-3 border-t border-slate-200 dark:border-slate-700">
          <div class="flex items-center gap-3 py-2.5">
            <div class="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold">
              <img v-if="profileImage" :src="profileImage" alt="Profile" class="w-full h-full object-cover" />
              <span v-else>{{ userInitial }}</span>
            </div>
            <div>
              <p class="font-bold text-slate-800 dark:text-white">{{ userName }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ userEmail }}</p>
            </div>
          </div>
          <router-link to="/my-rooms" class="flex items-center gap-3 py-2.5 text-slate-700 dark:text-slate-300 hover:text-teal-600 font-semibold transition-colors" @click="mobileMenuOpen = false">
            <Building2 class="w-4 h-4" />
            My Rooms
          </router-link>
          <router-link to="/my-payments" class="flex items-center gap-3 py-2.5 text-slate-700 dark:text-slate-300 hover:text-teal-600 font-semibold transition-colors" @click="mobileMenuOpen = false">
            <CreditCard class="w-4 h-4" />
            My Payments
          </router-link>
          <router-link to="/profile-management" class="flex items-center gap-3 py-2.5 text-slate-700 dark:text-slate-300 hover:text-teal-600 font-semibold transition-colors" @click="mobileMenuOpen = false">
            <User class="w-4 h-4" />
            Profile Management
          </router-link>
          <button @click="logout" class="flex items-center gap-3 py-2.5 text-red-600 font-semibold transition-colors w-full">
            <LogOut class="w-4 h-4" />
            Logout
          </button>
        </div>
        
        <!-- Login Button Mobile -->
        <router-link v-else to="/login" class="block py-2.5 px-6 mt-2 text-center bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl font-bold border-2 border-slate-200 dark:border-slate-700 hover:border-teal-500 transition-colors" @click="mobileMenuOpen = false">Login / Sign Up</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, X, Sun, Moon, User, LogOut, CreditCard, Building2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const mobileMenuOpen = ref(false)
const scrolled = ref(false)
const isDark = ref(false)
const isAuthenticated = ref(false)
const profileOpen = ref(false)
const userData = ref({
  name: '',
  email: '',
  avatar: '',
  university: '',
  department: '',
  role: '',
  is_verified: false
})
const profileImage = ref('')
const profileDropdownRef = ref(null)

let scrollHandler = null

// Computed properties
const userName = computed(() => userData.value.name || 'User')
const userEmail = computed(() => userData.value.email || '')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

// Check authentication and load user data from localStorage
const checkAuth = () => {
  const authStatus = localStorage.getItem('isAuthenticated') === 'true'
  isAuthenticated.value = authStatus
  
  if (authStatus) {
    loadUserData()
  } else {
    userData.value = { name: '', email: '', avatar: '', university: '', department: '', role: '', is_verified: false }
    profileImage.value = ''
  }
}

// Load user data from localStorage
const loadUserData = () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser)
      userData.value = {
        name: parsed.name || '',
        email: parsed.email || '',
        avatar: parsed.avatar || '',
        university: parsed.university || '',
        department: parsed.department || '',
        role: parsed.role || '',
        is_verified: parsed.is_verified || false
      }
    } catch (e) {
      console.error('Error parsing user data:', e)
      userData.value = { name: '', email: '', avatar: '', university: '', department: '', role: '', is_verified: false }
    }
  }
  
  // Load profile image separately
  loadProfileImage()
}

const loadProfileImage = () => {
  const storedImage = localStorage.getItem('profileImage')
  if (storedImage && storedImage !== 'null' && storedImage !== 'undefined') {
    profileImage.value = storedImage
    return
  }
  
  // Then check user object for avatar/img
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser)
      const imgPath = parsed.img || parsed.avatar
      if (imgPath) {
        // Construct full URL if needed
        const fullUrl = getImageUrl(imgPath)
        if (fullUrl) {
          profileImage.value = fullUrl
          localStorage.setItem('profileImage', fullUrl)
          return
        }
      }
    } catch (e) {
      console.error('Error parsing user for image:', e)
    }
  }
  
  profileImage.value = ''
}

// Add this helper function to Header.vue
const getImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:image')) {
    return path
  }
  if (path.startsWith('/storage')) {
    return `http://localhost:8000${path}`
  }
  if (path.startsWith('border-users/')) {
    return `http://localhost:8000/storage/${path}`
  }
  if (!path.includes('/')) {
    return `http://localhost:8000/storage/border-users/${path}`
  }
  return path
}

// Toggle theme
const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const toggleThemeAndClose = () => {
  toggleTheme()
  mobileMenuOpen.value = false
}

// Logout
const logout = () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('user')
  localStorage.removeItem('currentUserId')
  localStorage.removeItem('profileImage')
  isAuthenticated.value = false
  userData.value = { name: '', email: '', avatar: '', university: '', department: '', role: '', is_verified: false }
  profileImage.value = ''
  profileOpen.value = false
  mobileMenuOpen.value = false
  router.push('/')
}

// Handle click outside dropdown
const handleClickOutside = (event) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target)) {
    profileOpen.value = false
  }
}

// Listen for storage changes (for cross-tab sync)
const handleStorageChange = (event) => {
  if (event.key === 'user' || event.key === 'isAuthenticated' || event.key === 'profileImage') {
    checkAuth()
  }
}

onMounted(() => {
  checkAuth()
  
  // Theme initialization
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }

  // Scroll handler
  scrollHandler = () => {
    scrolled.value = window.scrollY > 50
  }
  window.addEventListener('scroll', scrollHandler)

  // Click outside handler
  document.addEventListener('click', handleClickOutside)
  
  // Storage change listener for cross-tab sync
  window.addEventListener('storage', handleStorageChange)
  
  // Custom event listener for profile updates within same tab
  window.addEventListener('profileUpdated', checkAuth)
})

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('profileUpdated', checkAuth)
})
</script>