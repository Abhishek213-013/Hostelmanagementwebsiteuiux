<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="flex items-center justify-center min-h-screen px-4 py-6">
      <!-- Backdrop overlay -->
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        @click="closeModal"
      ></div>
      
      <!-- Modal -->
      <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full transform transition-all">
        <!-- Close button -->
        <button 
          @click="closeModal" 
          class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
        >
          <X class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
        
        <!-- Header -->
        <div class="px-6 pt-6 pb-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
              <Calendar class="w-5 h-5 text-teal-600 dark:text-teal-300" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Book a Visit</h3>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 pl-13">Fill in your details and we'll confirm your appointment</p>
        </div>
        
        <!-- Form -->
        <div class="px-6 pb-6">
          
          <form @submit.prevent="handleSubmit" class="space-y-3">
            <!-- Row 1: Name + Email -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  v-model="form.name" 
                  placeholder="John Doe"
                  :class="['w-full px-3 py-2.5 rounded-xl border focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-gray-700 outline-none text-sm', 
                    formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600']"
                  required 
                />
                <p v-if="formErrors.name" class="text-red-500 text-xs mt-1">{{ formErrors.name }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input 
                  type="email" 
                  v-model="form.email" 
                  placeholder="john@example.com"
                  :class="['w-full px-3 py-2.5 rounded-xl border focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-gray-700 outline-none text-sm',
                    formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600']"
                  required 
                />
                <p v-if="formErrors.email" class="text-red-500 text-xs mt-1">{{ formErrors.email }}</p>
              </div>
            </div>
            
            <!-- Row 2: Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input 
                type="tel" 
                v-model="form.phone" 
                placeholder="+880 1711-123456"
                :class="['w-full px-3 py-2.5 rounded-xl border focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-gray-700 outline-none text-sm',
                  formErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600']"
                required 
              />
              <p v-if="formErrors.phone" class="text-red-500 text-xs mt-1">{{ formErrors.phone }}</p>
            </div>

            <!-- Row 3: Date + Time -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Date</label>
                <input 
                  type="date" 
                  v-model="form.preferred_date" 
                  :min="minDate"
                  :class="['w-full px-3 py-2.5 rounded-xl border focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 outline-none cursor-pointer text-sm',
                    formErrors.preferred_date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600']"
                  required 
                />
                <p v-if="formErrors.preferred_date" class="text-red-500 text-xs mt-1">{{ formErrors.preferred_date }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Time</label>
                <select 
                  v-model="form.preferred_time"
                  :class="['w-full px-3 py-2.5 rounded-xl border focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 outline-none cursor-pointer text-sm',
                    formErrors.preferred_time ? 'border-red-500' : 'border-gray-300 dark:border-gray-600']"
                  required
                >
                  <option value="">Select a time</option>
                  <option v-for="time in timeSlots" :key="time" :value="time">{{ time }}</option>
                </select>
                <p v-if="formErrors.preferred_time" class="text-red-500 text-xs mt-1">{{ formErrors.preferred_time }}</p>
              </div>
            </div>
            
            <!-- Row 4: Message -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message (Optional)</label>
              <textarea 
                v-model="form.message" 
                placeholder="Any special requests or questions..."
                rows="2"
                class="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-gray-700 outline-none resize-none text-sm"
              ></textarea>
            </div>
            
            <!-- Submit Button -->
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all hover:shadow-lg hover:shadow-teal-500/25 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting" class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
              <span v-else class="flex items-center gap-2">
                <Calendar class="w-5 h-5" />
                Book Appointment
              </span>
            </button>
            
            <!-- Footer Text -->
            <p class="text-xs text-center text-gray-400 dark:text-gray-500 mt-2">
              We'll send you a confirmation via email and WhatsApp
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { Calendar, X } from 'lucide-vue-next'
import { useTourBookings } from '../composables/useTourBookings'
import Swal from 'sweetalert2'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const { createTourBooking, submitting: isSubmitting, error: submitError } = useTourBookings()

const form = ref({
  name: '',
  email: '',
  phone: '',
  preferred_date: '',
  preferred_time: '',
  message: ''
})

const formErrors = ref({})
const submitted = ref(false)

// Time slots (display format)
const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
]

// Min date for booking (today)
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Convert 12-hour time to 24-hour format for API
const convertTo24Hour = (time12h) => {
  if (!time12h) return ''
  const [time, modifier] = time12h.split(' ')
  let [hours, minutes] = time.split(':')
  
  if (hours === '12') {
    hours = '00'
  }
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12
  }
  if (hours.toString().length === 1) {
    hours = '0' + hours
  }
  
  return `${hours}:${minutes}:00`
}

// Auto-fill user data when modal opens
const autoFillUserData = () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser)
      // Auto-fill name from user data
      if (user.name && !form.value.name) {
        form.value.name = user.name
      }
      // Auto-fill email from user data
      if (user.email && !form.value.email) {
        form.value.email = user.email
      }
      // Auto-fill phone from user data
      if (user.phone && !form.value.phone) {
        form.value.phone = user.phone
      }
    } catch (e) {
      console.error('Error parsing user data:', e)
    }
  }
}

// Validate form
const validateForm = () => {
  const errors = {}
  
  if (!form.value.name.trim()) {
    errors.name = 'Full name is required'
  }
  
  if (!form.value.email.trim()) {
    errors.email = 'Email address is required'
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.email = 'Please enter a valid email address'
  }
  
  if (!form.value.phone.trim()) {
    errors.phone = 'Phone number is required'
  } else if (!/^[\+\d\s\-\(\)]{10,15}$/.test(form.value.phone)) {
    errors.phone = 'Please enter a valid phone number'
  }
  
  if (!form.value.preferred_date) {
    errors.preferred_date = 'Preferred date is required'
  }
  
  if (!form.value.preferred_time) {
    errors.preferred_time = 'Preferred time is required'
  }
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

// Prevent body scroll when modal is open
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
    // Reset form when modal opens
    form.value = {
      name: '',
      email: '',
      phone: '',
      preferred_date: '',
      preferred_time: '',
      message: ''
    }
    formErrors.value = {}
    submitted.value = false
    
    // Auto-fill user data
    autoFillUserData()
    
  } else {
    document.body.style.overflow = ''
  }
})

const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    const time24h = convertTo24Hour(form.value.preferred_time)
    
    const bookingData = {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      preferred_date: form.value.preferred_date,
      preferred_time: time24h,
      message: form.value.message || ''
    }
    
    await createTourBooking(bookingData)
    submitted.value = true
    
    form.value = {
      name: '',
      email: '',
      phone: '',
      preferred_date: '',
      preferred_time: '',
      message: ''
    }
    formErrors.value = {}
    
    closeModal()
    
    Swal.fire({
      icon: 'success',
      title: 'Booking Submitted!',
      text: 'Your visit booking request has been received. We will confirm your appointment via email and WhatsApp.',
      confirmButtonColor: '#0d9488',
      confirmButtonText: 'OK',
      timer: 3000,
      timerProgressBar: true
    })
    
  } catch (err) {
    console.error('Failed to submit visit booking:', err)
    Swal.fire({
      icon: 'error',
      title: 'Submission Failed',
      text: submitError.value || 'Failed to submit your booking. Please try again.',
      confirmButtonColor: '#0d9488',
      confirmButtonText: 'OK'
    })
  }
}

const closeModal = () => {
  emit('close')
}
</script>