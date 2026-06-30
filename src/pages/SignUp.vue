<template>
  <main class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-20 px-6">
    <div class="w-full max-w-6xl">
      <router-link to="/" class="group flex items-center gap-2 text-emerald-700 dark:text-emerald-300 hover:text-emerald-500 dark:hover:text-emerald-200 mb-8 font-medium transition-colors">
        <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </router-link>

      <div class="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
        <!-- Left Side - Image -->
        <div class="md:w-1/2 bg-gradient-to-br from-teal-500 to-emerald-600 p-12 flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 bg-black/20"></div>
          <div class="relative z-10 text-center text-white">
            <Building2 class="w-24 h-24 mx-auto mb-6 text-white/90" />
            <h2 class="text-4xl font-black mb-4">SylhetStay</h2>
            <p class="text-xl text-white/80">Create your account to book rooms</p>
          </div>
        </div>

        <!-- Right Side - Form -->
        <div class="md:w-1/2 p-8 md:p-10">
          <div class="text-center mb-8">
            <h1 class="text-4xl font-black mb-2 text-teal-600">Create Account</h1>
            <p class="text-gray-600 dark:text-gray-400 text-lg">Join us and start booking rooms today</p>
          </div>

          <!-- Error Message -->
          <div v-if="registerError" class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
            <div v-for="(error, key) in registerError" :key="key" class="flex items-start gap-2">
              <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span><strong>{{ key }}:</strong> {{ Array.isArray(error) ? error.join(', ') : error }}</span>
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="registerSuccess" class="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-2">
            <CheckCircle2 class="w-4 h-4 flex-shrink-0" />
            {{ registerSuccess }}
          </div>

          <form @submit.prevent="handleRegister" class="space-y-6">
            <div class="group">
              <label class="block text-sm font-bold text-teal-600 mb-3">Full Name <span class="text-red-500">*</span></label>
              <div class="relative">
                <User class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
                <input type="text" placeholder="Enter your full name" v-model="formData.name" 
                       class="w-full pl-14 pr-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200"
                       required />
              </div>
            </div>

            <div class="group">
              <label class="block text-sm font-bold text-teal-600 mb-3">Email Address <span class="text-red-500">*</span></label>
              <div class="relative">
                <Mail class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
                <input type="email" placeholder="Enter your email" v-model="formData.email" 
                       class="w-full pl-14 pr-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200"
                       required />
              </div>
            </div>

            <div class="group">
              <label class="block text-sm font-bold text-teal-600 mb-3">Phone Number <span class="text-red-500">*</span></label>
              <div class="relative">
                <Phone class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
                <input type="tel" placeholder="Enter your phone number" v-model="formData.phone" 
                       class="w-full pl-14 pr-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200"
                       required />
              </div>
            </div>

            <div class="group">
              <label class="block text-sm font-bold text-teal-600 mb-3">Password <span class="text-red-500">*</span></label>
              <div class="relative">
                <Lock class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
                <input :type="showPassword ? 'text' : 'password'" placeholder="Create a password" v-model="formData.password" 
                       class="w-full pl-14 pr-14 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200"
                       required />
                <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-teal-400 hover:text-teal-600 transition-colors">
                  <Eye v-if="!showPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div class="group">
              <label class="block text-sm font-bold text-teal-600 mb-3">Confirm Password <span class="text-red-500">*</span></label>
              <div class="relative">
                <Lock class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
                <input :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirm your password" v-model="formData.password_confirmation" 
                       class="w-full pl-14 pr-14 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200"
                       required />
                <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-teal-400 hover:text-teal-600 transition-colors">
                  <Eye v-if="!showConfirmPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
            </div>

            <button type="submit"
                    class="w-full group py-5 rounded-2xl font-bold text-white shadow hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style="background: #0d9488"
                    :disabled="isLoading">
              <span v-if="isLoading" class="flex items-center gap-2">
                <Loader2 class="w-5 h-5 animate-spin" />
                Processing...
              </span>
              <span v-else>Create Account</span>
              <ArrowRight v-if="!isLoading" class="w-5 h-5" />
            </button>
          </form>

          <p class="mt-8 text-center text-gray-600 dark:text-gray-400 font-medium">
            Already have an account?
            <router-link to="/login" class="group text-teal-600 font-bold hover:underline inline-flex items-center gap-1">
              Sign In
              <ChevronRight class="w-4 h-4" />
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useHead } from '@vueuse/head'
import { useRouter } from 'vue-router'
import { authAPI } from '../services/api'
import { Building2, Mail, Lock, User, Phone, ArrowLeft, ArrowRight, ChevronRight, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-vue-next'

useHead({
  title: 'Create Account - SylhetStay | Student Accommodation',
  meta: [
    { name: 'description', content: 'Create your SylhetStay account to book premium student accommodation in Sylhet, Bangladesh. Join our community of happy students today!' },
    { name: 'keywords', content: 'sign up, register, create account, SylhetStay registration, student accommodation booking' },
    { property: 'og:title', content: 'Create Account - SylhetStay' },
    { property: 'og:description', content: 'Join SylhetStay and book your premium student accommodation in Sylhet today.' },
    { property: 'og:type', content: 'website' },
  ]
})

const router = useRouter()
const isLoading = ref(false)
const registerError = ref(null)
const registerSuccess = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: ''
})

const handleRegister = async () => {
  registerError.value = null
  registerSuccess.value = ''
  isLoading.value = true

  if (formData.value.password !== formData.value.password_confirmation) {
    registerError.value = { password: ['Password and Confirm Password do not match.'] }
    isLoading.value = false
    return
  }

  const phoneRegex = /^(?:\+8801|01)\d{9}$/
  if (!phoneRegex.test(formData.value.phone)) {
    registerError.value = { phone: ['Invalid phone number. Must be like 01********* or +8801*********.'] }
    isLoading.value = false
    return
  }

  try {
    const response = await authAPI.register(formData.value)
    
    console.log('Registration response:', response.data)
    
    // Check for token in response
    const token = response.data.token || response.data.access_token
    if (token) {
      // Store the token
      localStorage.setItem('auth_token', token)
      localStorage.setItem('isAuthenticated', 'true')
      
      // Store user data if available
      if (response.data.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data))
      } else if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      // Generate default avatar from name initial
      const userName = formData.value.name || (response.data.data && response.data.data.name) || 'U'
      const initial = userName.charAt(0).toUpperCase()
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#14b8a6"/><stop offset="100%" stop-color="#059669"/></linearGradient></defs><circle cx="64" cy="64" r="64" fill="url(#g)"/><text x="64" y="82" font-size="56" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial,sans-serif">${initial}</text></svg>`
      localStorage.setItem('profileImage', `data:image/svg+xml;base64,${btoa(svg)}`)

      // Dispatch event for Header to update
      window.dispatchEvent(new Event('profileUpdated'))

      registerSuccess.value = 'Registration successful! Redirecting...'
      
      // Redirect to homepage after short delay
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } else {
      // If no token, redirect to login
      registerSuccess.value = 'Registration successful! Please login.'
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  } catch (error) {
    console.error('Registration error:', error)
    if (error.response?.data?.errors) {
      registerError.value = error.response.data.errors
    } else if (error.response?.data?.message) {
      registerError.value = { error: [error.response.data.message] }
    } else {
      registerError.value = { error: ['Registration failed. Please try again.'] }
    }
  } finally {
    isLoading.value = false
  }
}
</script>