<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
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

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Photo Change Section -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center">
          <div class="w-32 h-32 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-4xl mb-4 shadow-lg overflow-hidden">
            <img v-if="profileImage" :src="profileImage" alt="Profile" class="w-full h-full object-cover" />
            <span v-else>{{ userInitial }}</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ userName }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">{{ userEmail }}</p>
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
              />
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
            <div>
              <button type="submit" class="w-full py-2.5 bg-teal-600 text-white rounded-lg font-bold text-sm hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1">
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password Section -->
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
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { User } from 'lucide-vue-next'

const fileInput = ref(null)
const profileImage = ref('')
const formData = reactive({
  name: '',
  email: '',
  phone: '',
  dob: '',
  address: ''
})

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

const userInitial = computed(() => formData.name ? formData.name.charAt(0).toUpperCase() : 'U')
const userName = computed(() => formData.name || 'User')
const userEmail = computed(() => formData.email || 'user@sylhetstay.com')

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
      alert('Profile photo updated successfully!')
    }
    reader.readAsDataURL(file)
  }
}

const saveProfile = () => {
  localStorage.setItem('user', JSON.stringify({
    name: formData.name,
    email: formData.email
  }))
  alert('Profile updated successfully!')
}

const changePassword = () => {
  if (passwordForm.new !== passwordForm.confirm) {
    alert('New passwords do not match!')
    return
  }
  if (passwordForm.new.length < 6) {
    alert('Password must be at least 6 characters long!')
    return
  }
  alert('Password changed successfully!')
  passwordForm.current = ''
  passwordForm.new = ''
  passwordForm.confirm = ''
}

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    formData.name = user.name || ''
    formData.email = user.email || ''
    formData.phone = user.phone || ''
    formData.dob = user.dob || ''
    formData.address = user.address || ''
  }
  const storedImage = localStorage.getItem('profileImage')
  if (storedImage) {
    profileImage.value = storedImage
  }
})
</script>