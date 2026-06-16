<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-20 px-6">
    <div class="w-full max-w-6xl">
      <router-link to="/" class="group flex items-center gap-2 text-emerald-700 dark:text-emerald-300 hover:text-emerald-500 mb-8 font-medium">
        <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </router-link>

      <div class="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
        <div class="md:w-1/2 bg-gradient-to-br from-teal-500 to-emerald-600 p-12 flex items-center justify-center">
          <div class="text-center text-white">
            <Building2 class="w-24 h-24 mx-auto mb-6 text-white/90" />
            <h2 class="text-4xl font-black mb-4">Join Us Today!</h2>
            <p class="text-xl text-white/80">Create your account to book rooms</p>
          </div>
        </div>

        <div class="md:w-1/2 p-8 md:p-10">
          <h1 class="text-4xl font-black mb-8 text-teal-600 text-center">Create Account</h1>

          <div v-if="registerError" class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 rounded-xl text-red-600 text-sm">
            <div v-for="(error, key) in registerError" :key="key">
              <strong>{{ key }}:</strong> {{ Array.isArray(error) ? error.join(', ') : error }}
            </div>
          </div>

          <div v-if="registerSuccess" class="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 rounded-xl text-green-600 text-sm">
            {{ registerSuccess }}
          </div>

          <form @submit.prevent="handleRegister" class="space-y-6">
            <div>
              <label class="block text-sm font-bold text-teal-600 mb-3">Full Name</label>
              <input type="text" v-model="formData.name" 
                     class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all"
                     required />
            </div>

            <div>
              <label class="block text-sm font-bold text-teal-600 mb-3">Email Address</label>
              <input type="email" v-model="formData.email" 
                     class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all"
                     required />
            </div>

            <div>
              <label class="block text-sm font-bold text-teal-600 mb-3">Phone Number</label>
              <input type="tel" v-model="formData.phone" 
                     class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all"
                     required />
            </div>

            <div>
              <label class="block text-sm font-bold text-teal-600 mb-3">Password</label>
              <input type="password" v-model="formData.password" 
                     class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all"
                     required />
            </div>

            <div>
              <label class="block text-sm font-bold text-teal-600 mb-3">Confirm Password</label>
              <input type="password" v-model="formData.password_confirmation" 
                     class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all"
                     required />
            </div>

            <button type="submit"
                    class="w-full py-5 rounded-2xl font-bold text-white shadow hover:shadow-xl transition-all disabled:opacity-50"
                    style="background: #0d9488"
                    :disabled="isLoading">
              <span v-if="isLoading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
              <span v-else>Create Account</span>
            </button>
          </form>

          <p class="mt-8 text-center">
            Already have an account?
            <router-link to="/login" class="text-teal-600 font-bold hover:underline">Sign In</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../services/api'
import { Building2, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const isLoading = ref(false)
const registerError = ref(null)
const registerSuccess = ref('')

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