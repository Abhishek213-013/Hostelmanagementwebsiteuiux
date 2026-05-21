<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading profile...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <Header />
      <div class="max-w-[1400px] mx-auto px-6 lg:px-12 py-32">
        <div class="mb-12">
          <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <User class="w-5 h-5 text-teal-600" />
            <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">Profile Management</span>
          </div>
          <h1 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600">Profile Management</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">Update your personal information and manage your account settings</p>
        </div>

        <!-- Success/Error Messages -->
        <div v-if="successMessage" class="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 class="w-5 h-5 flex-shrink-0" />
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
          <AlertCircle class="w-5 h-5 flex-shrink-0" />
          {{ errorMessage }}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Profile Photo & Info Section -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center">
            <div class="w-32 h-32 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-4xl mb-4 shadow-lg overflow-hidden">
              <img v-if="profileImage" :src="profileImage" alt="Profile" class="w-full h-full object-cover" />
              <span v-else>{{ userInitial }}</span>
            </div>
            
            <!-- Verification Badge -->
            <div v-if="currentUser?.is_verified" class="flex items-center gap-1 mb-1">
              <CheckCircle2 class="w-4 h-4 text-teal-600" />
              <span class="text-xs text-teal-600 font-semibold">Verified Account</span>
            </div>
            <div v-else class="flex items-center gap-1 mb-1">
              <Clock class="w-4 h-4 text-amber-500" />
              <span class="text-xs text-amber-600 font-semibold">Pending Verification</span>
            </div>
            
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ userName }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ userEmail }}</p>
            
            <!-- User Info Badges -->
            <div class="flex flex-wrap gap-2 justify-center mb-4">
              <span v-if="currentUser?.university" class="px-2 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium">
                {{ currentUser.university }}
              </span>
              <span v-if="currentUser?.department" class="px-2 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium">
                {{ currentUser.department }}
              </span>
              <span class="px-2 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium capitalize">
                {{ currentUser?.role || 'Boarder' }}
              </span>
            </div>
            
            <button @click="triggerFileInput" class="w-full max-w-[200px] py-2.5 px-5 bg-teal-600 text-white rounded-xl font-semibold text-sm hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg">
              Change Photo
            </button>
            <input type="file" ref="fileInput" @change="handlePhotoUpload" accept="image/*" class="hidden" />
          </div>

          <!-- Personal Information Section -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-black text-teal-600 mb-4">Personal Information</h3>
            <form @submit.prevent="saveProfile" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input 
                  v-model="formData.name" 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400" 
                  placeholder="Enter your full name" 
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input 
                  v-model="formData.email" 
                  type="email" 
                  class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400" 
                  placeholder="Enter your email" 
                  readonly
                />
                <p class="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input 
                  v-model="formData.phone" 
                  type="tel" 
                  class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400" 
                  placeholder="Enter your phone number" 
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                <input 
                  v-model="formData.dob" 
                  type="date" 
                  class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700" 
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <input 
                  v-model="formData.address" 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400" 
                  placeholder="Enter your address"
                />
              </div>
              
              <!-- Academic Info -->
              <div v-if="currentUser?.university">
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">University</label>
                <input 
                  v-model="formData.university" 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700" 
                  readonly
                />
              </div>
              <div v-if="currentUser?.department">
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Department</label>
                <input 
                  v-model="formData.department" 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700" 
                  readonly
                />
              </div>
              
              <div>
                <button type="submit" class="w-full py-2.5 bg-teal-600 text-white rounded-lg font-bold text-sm hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <!-- Change Password & Settings Section -->
          <div class="space-y-6">
            <!-- Change Password -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-6">
              <h3 class="text-lg font-black text-teal-600 mb-4">Change Password</h3>
              <form @submit.prevent="changePassword" class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                  <input 
                    v-model="passwordForm.current" 
                    type="password" 
                    class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400" 
                    placeholder="Enter current password" 
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                  <input 
                    v-model="passwordForm.new" 
                    type="password" 
                    class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400" 
                    placeholder="Enter new password" 
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                  <input 
                    v-model="passwordForm.confirm" 
                    type="password" 
                    class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400" 
                    placeholder="Confirm new password" 
                  />
                </div>
                <div>
                  <button type="submit" class="w-full py-2.5 bg-teal-600 text-white rounded-lg font-bold text-sm hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1">
                    Change Password
                  </button>
                </div>
              </form>
            </div>

            <!-- Account Info Card -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-6">
              <h3 class="text-lg font-black text-teal-600 mb-4">Account Info</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Account Status</span>
                  <span :class="currentUser?.is_active ? 'text-teal-600' : 'text-red-500'" class="font-semibold">
                    {{ currentUser?.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Verification</span>
                  <span :class="currentUser?.is_verified ? 'text-teal-600' : 'text-amber-500'" class="font-semibold">
                    {{ currentUser?.is_verified ? 'Verified' : 'Pending' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">2FA</span>
                  <span :class="currentUser?.two_factor_enabled ? 'text-teal-600' : 'text-gray-400'" class="font-semibold">
                    {{ currentUser?.two_factor_enabled ? 'Enabled' : 'Disabled' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Language</span>
                  <span class="font-semibold text-gray-700 dark:text-gray-300">{{ currentUser?.preferred_language === 'bn' ? 'Bangla' : 'English' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { User, CheckCircle2, AlertCircle, Clock } from 'lucide-vue-next'

const fileInput = ref(null)
const profileImage = ref('')
const loading = ref(true)
const users = ref([])
const successMessage = ref('')
const errorMessage = ref('')

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  dob: '',
  address: '',
  university: '',
  department: ''
})

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

// Get current user from localStorage
const currentUser = computed(() => {
  const stored = localStorage.getItem('user')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }
  return null
})

const userInitial = computed(() => formData.name ? formData.name.charAt(0).toUpperCase() : 'U')
const userName = computed(() => formData.name || 'User')
const userEmail = computed(() => formData.email || 'user@sylhetstay.com')

// Clear messages after timeout
const clearMessages = () => {
  setTimeout(() => {
    successMessage.value = ''
    errorMessage.value = ''
  }, 3000)
}

// Fetch user data
async function fetchUserData() {
  loading.value = true
  try {
    const response = await axios.get('https://raw.githubusercontent.com/Abhishek213-013/dummyJson/refs/heads/main/users.json')
    users.value = response.data
    
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      const userId = localStorage.getItem('currentUserId')
      
      if (userId) {
        const matchedUser = users.value.find(u => u.id === parseInt(userId))
        if (matchedUser) {
          // Update localStorage with full user data from JSON
          localStorage.setItem('user', JSON.stringify({
            id: matchedUser.id,
            name: matchedUser.name,
            email: matchedUser.email,
            phone: matchedUser.phone || '',
            avatar: matchedUser.avatar || '',
            role: matchedUser.role,
            university: matchedUser.university || '',
            department: matchedUser.department || '',
            address: matchedUser.address || '',
            dob: matchedUser.dob || '',
            is_verified: matchedUser.is_verified,
            is_active: matchedUser.is_active,
            two_factor_enabled: matchedUser.two_factor_enabled,
            preferred_language: matchedUser.preferred_language
          }))
          
          // Dispatch event for Header to update
          window.dispatchEvent(new Event('profileUpdated'))
          
          // Populate form
          formData.name = matchedUser.name
          formData.email = matchedUser.email
          formData.phone = matchedUser.phone || ''
          formData.dob = matchedUser.dob || ''
          formData.address = matchedUser.address || ''
          formData.university = matchedUser.university || ''
          formData.department = matchedUser.department || ''
          
          // Set avatar
          if (matchedUser.avatar && matchedUser.avatar.includes('unsplash')) {
            profileImage.value = matchedUser.avatar
          }
        }
      } else {
        // Use stored user data if no ID match
        formData.name = parsed.name || ''
        formData.email = parsed.email || ''
        formData.phone = parsed.phone || ''
        formData.address = parsed.address || ''
        formData.dob = parsed.dob || ''
        formData.university = parsed.university || ''
        formData.department = parsed.department || ''
      }
    }
  } catch (err) {
    console.error('Error fetching user data:', err)
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      formData.name = parsed.name || ''
      formData.email = parsed.email || ''
      formData.phone = parsed.phone || ''
      formData.address = parsed.address || ''
      formData.dob = parsed.dob || ''
    }
  } finally {
    loading.value = false
  }
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profileImage.value = e.target.result
      localStorage.setItem('profileImage', e.target.result)
      
      const stored = localStorage.getItem('user')
      if (stored) {
        const user = JSON.parse(stored)
        user.avatar = e.target.result
        localStorage.setItem('user', JSON.stringify(user))
      }
      
      // Dispatch custom event for Header sync
      window.dispatchEvent(new Event('profileUpdated'))
      
      successMessage.value = 'Profile photo updated successfully!'
      clearMessages()
    }
    reader.readAsDataURL(file)
  }
}

const saveProfile = () => {
  const stored = localStorage.getItem('user')
  if (stored) {
    const user = JSON.parse(stored)
    user.name = formData.name
    user.phone = formData.phone
    user.dob = formData.dob
    user.address = formData.address
    localStorage.setItem('user', JSON.stringify(user))
    
    // Dispatch custom event for Header sync
    window.dispatchEvent(new Event('profileUpdated'))
  }
  
  successMessage.value = 'Profile updated successfully!'
  clearMessages()
}

const changePassword = () => {
  if (!passwordForm.current) {
    errorMessage.value = 'Please enter your current password.'
    clearMessages()
    return
  }
  if (passwordForm.new !== passwordForm.confirm) {
    errorMessage.value = 'New passwords do not match!'
    clearMessages()
    return
  }
  if (passwordForm.new.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters long!'
    clearMessages()
    return
  }
  
  successMessage.value = 'Password changed successfully!'
  clearMessages()
  passwordForm.current = ''
  passwordForm.new = ''
  passwordForm.confirm = ''
}

onMounted(() => {
  fetchUserData()
  
  // Load stored profile image
  const storedImage = localStorage.getItem('profileImage')
  if (storedImage) {
    profileImage.value = storedImage
  }
})
</script>