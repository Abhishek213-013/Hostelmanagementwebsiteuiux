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
            <p class="text-xl text-white/80">Find your perfect student accommodation</p>
          </div>
        </div>

        <!-- Right Side - Form -->
        <div class="md:w-1/2 p-8 md:p-10">
          <div class="text-center mb-8">
            <h1 class="text-4xl font-black mb-2 text-teal-600">Welcome Back!</h1>
            <p class="text-gray-600 dark:text-gray-400 text-lg">Sign in to continue to your account</p>
          </div>

          <!-- Error Message -->
          <div v-if="loginError" class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
            <AlertCircle class="w-4 h-4 flex-shrink-0" />
            {{ loginError }}
          </div>

          <!-- Success Message -->
          <div v-if="loginSuccess" class="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-2">
            <CheckCircle2 class="w-4 h-4 flex-shrink-0" />
            {{ loginSuccess }}
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <div class="group">
              <label class="block text-sm font-bold text-teal-600 mb-3">Email Address</label>
              <div class="relative">
                <Mail class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
                <input type="email" placeholder="Enter your email" v-model="formData.email"
                       class="w-full pl-14 pr-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200" required />
              </div>
            </div>

            <div class="group">
              <label class="block text-sm font-bold text-teal-600 mb-3">Password</label>
              <div class="relative">
                <Lock class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
                <input :type="showPassword ? 'text' : 'password'" placeholder="Enter your password" v-model="formData.password"
                       class="w-full pl-14 pr-14 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200" required />
                <button type="button" @click="showPassword = !showPassword" class="absolute right-5 top-1/2 -translate-y-1/2 text-teal-400 hover:text-teal-600 transition-colors">
                  <EyeOff v-if="showPassword" class="w-5 h-5" />
                  <Eye v-else class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <label class="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" class="w-5 h-5 rounded border-emerald-300 dark:border-emerald-600 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0" />
                <span class="text-sm text-emerald-700 dark:text-emerald-300 font-medium group-hover:text-emerald-500 dark:group-hover:text-emerald-200 transition-colors">Remember me</span>
              </label>
              <a href="#" class="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline">Forgot password?</a>
            </div>

            <button type="submit"
                    class="w-full group py-5 rounded-2xl font-bold text-white shadow hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style="background: #0d9488"
                    :disabled="isLoading">
              <span v-if="isLoading" class="flex items-center gap-2">
                <Loader2 class="w-5 h-5 animate-spin" />
                Processing...
              </span>
              <span v-else>Sign In</span>
              <ArrowRight v-if="!isLoading" class="w-5 h-5" />
            </button>
          </form>

          <p class="mt-8 text-center text-gray-600 dark:text-gray-400 font-medium">
            Don't have an account?
            <router-link to="/register" class="group text-teal-600 font-bold hover:underline inline-flex items-center gap-1">
              Sign Up
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
import { useRouter, useRoute } from 'vue-router'
import { authAPI } from '../services/api'
import { Building2, Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, ChevronRight, Sparkles, AlertCircle, CheckCircle2, Loader2 } from 'lucide-vue-next'

useHead({
  title: 'Sign In - SylhetStay | Student Accommodation',
  meta: [
    { name: 'description', content: 'Sign in to your SylhetStay account to manage bookings, payments, and profile. Premium student accommodation in Sylhet, Bangladesh.' },
    { name: 'keywords', content: 'sign in, login, SylhetStay account, student accommodation login' },
    { property: 'og:title', content: 'Sign In - SylhetStay' },
    { property: 'og:description', content: 'Access your SylhetStay account to manage your student accommodation bookings.' },
    { property: 'og:type', content: 'website' },
  ]
})

const router = useRouter()
const route = useRoute()
const showPassword = ref(false)
const loginError = ref('')
const loginSuccess = ref('')
const isLoading = ref(false)

const formData = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  loginError.value = ''
  loginSuccess.value = ''
  isLoading.value = true

  try {
    const response = await authAPI.login({
      email: formData.value.email,
      password: formData.value.password
    })
    
    console.log('Login response:', response.data)
    
    // Check for token in response (could be 'token' or 'access_token')
    const token = response.data.token || response.data.access_token
    
    if (token) {
      // Store the token
      localStorage.setItem('auth_token', token)
      localStorage.setItem('token_type', response.data.token_type || 'Bearer')
      localStorage.setItem('isAuthenticated', 'true')
      
      // Store user data if available (could be in 'data' or 'user')
      const userData = response.data.data || response.data.user
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData))
      }
      
      loginSuccess.value = 'Login successful! Redirecting...'
      
      // Dispatch event for Header to update
      window.dispatchEvent(new Event('profileUpdated'))
      
      // Redirect after short delay
      setTimeout(() => {
        const redirect = route.query.redirect || '/'
        router.push(redirect)
      }, 1000)
    } else {
      loginError.value = response.data.message || 'Login failed. Please try again.'
    }
  } catch (error) {
    console.error('Login error:', error)
    
    if (error.response?.status === 401) {
      loginError.value = 'Invalid email or password. Please try again.'
    } else if (error.response?.data?.message) {
      loginError.value = error.response.data.message
    } else if (error.message === 'Network Error') {
      loginError.value = 'Cannot connect to server. Please check if backend is running.'
    } else {
      loginError.value = 'Login failed. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>