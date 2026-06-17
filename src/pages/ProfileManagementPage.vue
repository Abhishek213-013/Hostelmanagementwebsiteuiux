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
            <div v-if="userData?.is_verified" class="flex items-center gap-1 mb-1">
              <CheckCircle2 class="w-4 h-4 text-teal-600" />
              <span class="text-xs text-teal-600 font-semibold">Verified Account</span>
            </div>
            <div v-else class="flex items-center gap-1 mb-1">
              <Clock class="w-4 h-4 text-amber-500" />
              <span class="text-xs text-amber-600 font-semibold">Pending Verification</span>
            </div>
            
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ userData?.name || 'User' }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ userData?.email || '' }}</p>
            
            <!-- User Info Badges -->
            <div class="flex flex-wrap gap-2 justify-center mb-4">
              <span class="px-2 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium capitalize">
                {{ userData?.role || 'Boarder' }}
              </span>
              <span :class="['px-2 py-1 rounded-full text-xs font-medium', 
                userData?.status == 1 ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300']">
                {{ userData?.status == 1 ? 'Active' : 'Inactive' }}
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
              <form @submit.prevent="changePassword" class="space-y-4" autocomplete="off">
                <div>
                  <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                  <input 
                    v-model="passwordForm.current" 
                    type="password" 
                    autocomplete="new-password"
                    name="current-password"
                    class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400" 
                    placeholder="Enter current password" 
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                  <input 
                    v-model="passwordForm.new" 
                    type="password" 
                    autocomplete="new-password"
                    name="new-password"
                    class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400" 
                    placeholder="Enter new password" 
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                  <input 
                    v-model="passwordForm.confirm" 
                    type="password" 
                    autocomplete="new-password"
                    name="confirm-password"
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
                  <span :class="userData?.status == 1 ? 'text-teal-600' : 'text-red-500'" class="font-semibold">
                    {{ userData?.status == 1 ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Member Since</span>
                  <span class="font-semibold text-gray-700 dark:text-gray-300">{{ formatDate(userData?.created_at) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Border ID</span>
                  <span class="font-semibold text-gray-700 dark:text-gray-300">{{ userData?.border_id || 'N/A' }}</span>
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
import { useRouter } from 'vue-router'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { authAPI } from '../services/api'
import { User, CheckCircle2, AlertCircle, Clock } from 'lucide-vue-next'

const router = useRouter()
const fileInput = ref(null)
const profileImage = ref('')
const loading = ref(true)
const userData = ref(null)
const successMessage = ref('')
const errorMessage = ref('')

const formData = reactive({
  name: '',
  email: '',
  phone: ''
})

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

const userInitial = computed(() => {
  const name = formData.name || userData.value?.name || 'User'
  return name.charAt(0).toUpperCase()
})

const clearMessages = () => {
  setTimeout(() => {
    successMessage.value = ''
    errorMessage.value = ''
  }, 5000)
}

// Function to get full image URL
const getImageUrl = (path) => {
  if (!path) return null
  
  // If it's already a full URL, return it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // If it's a data URL (base64), return it
  if (path.startsWith('data:image')) {
    return path
  }
  
  // If it starts with /storage, it's a storage path
  if (path.startsWith('/storage')) {
    // Use the backend URL for storage
    return `http://localhost:8000${path}`
  }
  
  // If it's a relative path from the API
  if (path.startsWith('border-users/')) {
    return `http://localhost:8000/storage/${path}`
  }
  
  // If it's just a filename
  if (!path.includes('/')) {
    return `http://localhost:8000/storage/border-users/${path}`
  }
  
  return path
}

// Fetch user profile from API
async function fetchUserProfile() {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await authAPI.getUser()
    console.log('User profile response:', response.data)
    
    let user = null
    if (response.data && response.data.data) {
      user = response.data.data
    } else if (response.data) {
      user = response.data
    }
    
    if (user) {
      userData.value = user
      
      const storedUser = localStorage.getItem('user')
      let existingUser = {}
      if (storedUser) {
        try {
          existingUser = JSON.parse(storedUser)
        } catch (e) {
          console.error('Error parsing stored user:', e)
        }
      }
      
      const mergedUser = {
        ...existingUser,
        ...user
      }
      localStorage.setItem('user', JSON.stringify(mergedUser))
      
      formData.name = user.name || ''
      formData.email = user.email || ''
      formData.phone = user.phone || ''
      
      // Check if user has avatar - use full URL
      if (user.img) {
        const fullUrl = getImageUrl(user.img)
        profileImage.value = fullUrl
        localStorage.setItem('profileImage', fullUrl) // ADD THIS LINE
        console.log('Profile image URL:', fullUrl)
      } else if (user.avatar) {
        const fullUrl = getImageUrl(user.avatar)
        profileImage.value = fullUrl
        localStorage.setItem('profileImage', fullUrl) // ADD THIS LINE
        console.log('Profile image URL:', fullUrl)
      }
    }
  } catch (err) {
    // ... rest of error handling stays the same
  } finally {
    loading.value = false
  }
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handlePhotoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const uploadFormData = new FormData()
  uploadFormData.append('avatar', file)
  
  try {
    const response = await authAPI.updateAvatar(uploadFormData)
    console.log('Avatar upload response:', response.data)
    
    let avatarUrl = null
    if (response.data && response.data.data) {
      avatarUrl = response.data.data.img || response.data.data.avatar || response.data.data.image
    } else if (response.data) {
      avatarUrl = response.data.img || response.data.avatar || response.data.image
    }
    
    if (avatarUrl) {
      const fullUrl = getImageUrl(avatarUrl)
      profileImage.value = fullUrl
      
      // STORE IN LOCALSTORAGE FOR HEADER
      localStorage.setItem('profileImage', fullUrl)
      
      if (userData.value) {
        userData.value.img = avatarUrl
        userData.value.avatar = avatarUrl
        localStorage.setItem('user', JSON.stringify(userData.value))
      }
      
      window.dispatchEvent(new Event('profileUpdated'))
      successMessage.value = 'Profile photo updated successfully!'
    } else {
      const reader = new FileReader()
      reader.onload = (e) => {
        profileImage.value = e.target.result
        
        // STORE IN LOCALSTORAGE FOR HEADER
        localStorage.setItem('profileImage', e.target.result)
        
        if (userData.value) {
          userData.value.img = e.target.result
          userData.value.avatar = e.target.result
          localStorage.setItem('user', JSON.stringify(userData.value))
        }
        window.dispatchEvent(new Event('profileUpdated'))
        successMessage.value = 'Profile photo updated successfully!'
        clearMessages()
      }
      reader.readAsDataURL(file)
    }
    clearMessages()
  } catch (err) {
    console.error('Error uploading photo:', err)
    errorMessage.value = err.response?.data?.message || 'Failed to upload photo. Please try again.'
    clearMessages()
  }
}

const saveProfile = async () => {
  try {
    const updateData = {
      name: formData.name,
      phone: formData.phone
    }
    
    const response = await authAPI.updateProfile(updateData)
    console.log('Profile update response:', response.data)
    
    let updatedUser = null
    if (response.data && response.data.data) {
      updatedUser = response.data.data
    } else if (response.data) {
      updatedUser = response.data
    }
    
    if (updatedUser) {
      userData.value = updatedUser
      localStorage.setItem('user', JSON.stringify(updatedUser))
      window.dispatchEvent(new Event('profileUpdated'))
    } else {
      if (userData.value) {
        userData.value.name = formData.name
        userData.value.phone = formData.phone
        localStorage.setItem('user', JSON.stringify(userData.value))
        window.dispatchEvent(new Event('profileUpdated'))
      }
    }
    
    successMessage.value = 'Profile updated successfully!'
    clearMessages()
  } catch (err) {
    console.error('Error saving profile:', err)
    errorMessage.value = err.response?.data?.message || 'Failed to save profile. Please try again.'
    clearMessages()
  }
}

const changePassword = async () => {
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
  
  try {
    const response = await authAPI.resetPassword({
      current_password: passwordForm.current,
      password: passwordForm.new,
      password_confirmation: passwordForm.confirm
    })
    
    console.log('Password change response:', response.data)
    successMessage.value = 'Password changed successfully!'
    clearMessages()
    passwordForm.current = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
  } catch (err) {
    console.error('Error changing password:', err)
    errorMessage.value = err.response?.data?.message || 'Failed to change password. Please try again.'
    clearMessages()
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateString
  }
}

onMounted(() => {
  if (!localStorage.getItem('isAuthenticated')) {
    router.push('/login')
    return
  }
  fetchUserProfile()
  
  const storedImage = localStorage.getItem('profileImage')
  if (storedImage) {
    profileImage.value = storedImage
  }
})
</script>