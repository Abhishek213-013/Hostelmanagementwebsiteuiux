<template>
  <nav :class="['fixed top-0 left-0 right-0 z-50 transition-all duration-500',
    scrolled ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl shadow-lg shadow-slate-900/5 dark:shadow-slate-900/20 border-b border-slate-200/50 dark:border-slate-700/50' : 'bg-transparent']">
    <div class="max-w-[1400px] mx-auto px-6 lg:px-12">
      <div class="flex justify-between items-center h-24">
        <router-link to="/" class="flex items-center gap-4 group cursor-pointer">
          <img src="@/assets/logo/logo.png" alt="Logo" class="h-36 w-auto object-contain" />
        </router-link>

        <div class="hidden lg:flex items-center gap-10">
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
          <router-link to="/contact" class="relative px-8 py-3.5 text-white rounded-2xl font-bold overflow-hidden group shadow-lg transition-all duration-300" :style="{ background: 'linear-gradient(to right, #1a1a1a, #525252, #1c1917)' }">
            <span class="relative z-10">Contact Us</span>
          </router-link>
          <div v-if="isAuthenticated" class="relative" ref="profileDropdownRef">
            <button @click="profileOpen = !profileOpen" class="flex items-center gap-2 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div class="w-10 h-10 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                <img v-if="profileImage" :src="profileImage" alt="Profile" class="w-full h-full object-cover" />
                <span v-else>{{ userInitial }}</span>
              </div>
            </button>
            <div v-if="profileOpen" class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <p class="font-bold text-slate-800 dark:text-white">{{ userName }}</p>
                <p class="text-sm text-slate-500">{{ userEmail }}</p>
              </div>
              <router-link to="/my-rooms" @click="profileOpen = false" class="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">My Rooms</router-link>
               <router-link to="/my-payments" @click="profileOpen = false" class="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">My Payments</router-link>
               <router-link to="/profile-management" @click="profileOpen = false" class="block px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Profile Management</router-link>
               <button @click="logout" class="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Logout</button>
            </div>
          </div>
          <router-link v-else to="/login" class="px-8 py-3.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-2xl font-bold overflow-hidden group shadow-lg border-2 border-slate-200 dark:border-slate-700 transition-all duration-300">
            <span class="relative z-10">Login / Sign Up</span>
          </router-link>
          <button @click="toggleTheme" class="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300" aria-label="Toggle theme">
            <Sun v-if="isDark" class="w-6 h-6" />
            <Moon v-else class="w-6 h-6" />
          </button>
        </div>

        <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300">
          <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <div v-if="mobileMenuOpen" class="lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-slate-200/50 dark:border-slate-700/50">
      <div class="px-6 py-6 space-y-4">
        <router-link to="/rooms" class="block py-3 text-slate-700 dark:text-slate-300 hover:text-sky-600 font-semibold transition-colors" @click="mobileMenuOpen = false">Rooms</router-link>
        <router-link to="/facilities" class="block py-3 text-slate-700 dark:text-slate-300 hover:text-sky-600 font-semibold transition-colors" @click="mobileMenuOpen = false">Facilities</router-link>
        <router-link to="/gallery" class="block py-3 text-slate-700 dark:text-slate-300 hover:text-sky-600 font-semibold transition-colors" @click="mobileMenuOpen = false">Gallery</router-link>
        <router-link to="/about" class="block py-3 text-slate-700 dark:text-slate-300 hover:text-sky-600 font-semibold transition-colors" @click="mobileMenuOpen = false">About</router-link>
        <router-link to="/contact" class="block py-3 text-slate-700 dark:text-slate-300 hover:text-sky-600 font-semibold transition-colors" @click="mobileMenuOpen = false">Contact</router-link>
        <button @click="toggleThemeAndClose" class="flex items-center gap-3 py-3 text-slate-700 dark:text-slate-300 hover:text-sky-600 font-semibold transition-colors w-full">
          <Sun v-if="isDark" class="w-5 h-5" />
          <Moon v-else class="w-5 h-5" />
          {{ isDark ? 'Light Mode' : 'Dark Mode' }}
        </button>
        <div v-if="isAuthenticated" class="pt-4 border-t border-slate-200 dark:border-slate-700">
          <div class="flex items-center gap-3 py-3">
            <div class="w-10 h-10 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold">
              <img v-if="profileImage" :src="profileImage" alt="Profile" class="w-full h-full object-cover" />
              <span v-else>{{ userInitial }}</span>
            </div>
            <p class="font-bold text-slate-800 dark:text-white">{{ userName }}</p>
          </div>
          <router-link to="/my-rooms" class="flex items-center gap-3 py-3 text-slate-700 dark:text-slate-300 hover:text-sky-600 font-semibold transition-colors" @click="mobileMenuOpen = false">
            <Building2 class="w-5 h-5" />
            My Rooms
          </router-link>
          <router-link to="/my-payments" class="flex items-center gap-3 py-3 text-slate-700 dark:text-slate-300 hover:text-sky-600 font-semibold transition-colors" @click="mobileMenuOpen = false">
             <CreditCard class="w-5 h-5" />
             My Payments
           </router-link>
           <router-link to="/profile-management" class="flex items-center gap-3 py-3 text-slate-700 dark:text-slate-300 hover:text-sky-600 font-semibold transition-colors" @click="mobileMenuOpen = false">
             <User class="w-5 h-5" />
             Profile Management
           </router-link>
          <button @click="logout" class="flex items-center gap-3 py-3 text-red-600 font-semibold transition-colors w-full">
            <LogOut class="w-5 h-5" />
            Logout
          </button>
        </div>
        <router-link v-else to="/login" class="block py-3 px-6 mt-4 text-center bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-2xl font-bold border-2 border-slate-200 dark:border-slate-700 hover:border-sky-500 transition-colors" @click="mobileMenuOpen = false">Login / Sign Up</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, X, Sun, Moon, User, LogOut, CreditCard } from 'lucide-vue-next'

const route = useRoute()

const mobileMenuOpen = ref(false)
const scrolled = ref(false)
const isDark = ref(false)
const isAuthenticated = ref(false)
const profileOpen = ref(false)
const user = ref({ name: '', email: '' })
const profileImage = ref('')
const profileDropdownRef = ref(null)

let scrollHandler = null

const userName = computed(() => user.value.name || 'User')
const userEmail = computed(() => user.value.email || '')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

const checkAuth = () => {
  isAuthenticated.value = localStorage.getItem('isAuthenticated') === 'true'
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
  loadProfileImage()
}

const loadProfileImage = () => {
  const storedImage = localStorage.getItem('profileImage')
  if (storedImage) {
    profileImage.value = storedImage
  }
}

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

const logout = () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('user')
  isAuthenticated.value = false
  user.value = { name: '', email: '' }
  profileOpen.value = false
  mobileMenuOpen.value = false
}

onMounted(() => {
  checkAuth()
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }

  scrollHandler = () => {
    scrolled.value = window.scrollY > 50
  }
  window.addEventListener('scroll', scrollHandler)

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
  document.removeEventListener('click', handleClickOutside)
})

watch(() => route.path, () => {
  loadProfileImage()
})

const handleClickOutside = (event) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target)) {
    profileOpen.value = false
  }
}
</script>
