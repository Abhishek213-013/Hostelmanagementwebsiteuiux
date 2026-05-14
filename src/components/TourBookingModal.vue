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
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Book a Tour</h3>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 pl-13">Fill in your details and we'll confirm your appointment</p>
        </div>
        
        <!-- Form -->
        <div class="px-6 pb-6">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input 
                type="text" 
                v-model="form.name" 
                placeholder="John Doe"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-gray-700 outline-none" 
                required 
              />
            </div>
            
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input 
                type="email" 
                v-model="form.email" 
                placeholder="john@example.com"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-gray-700 outline-none" 
                required 
              />
            </div>
            
            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              <input 
                type="tel" 
                v-model="form.phone" 
                placeholder="+1 (555) 000-0000"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-gray-700 outline-none" 
                required 
              />
            </div>
            
            <!-- Date & Time -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Date & Time</label>
              <input 
                type="datetime-local" 
                v-model="form.scheduleTime"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 outline-none cursor-pointer" 
                required 
              />
            </div>
            
            <!-- Submit Button -->
            <button 
              type="submit" 
              class="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all hover:shadow-lg hover:shadow-teal-500/25 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-6"
            >
              <Calendar class="w-5 h-5" />
              Book Appointment
            </button>
            
            <!-- Footer Text -->
            <p class="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
              We'll send you a confirmation via email and WhatsApp
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Calendar, X } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const form = ref({
  name: '',
  email: '',
  phone: '',
  scheduleTime: ''
})

// Prevent body scroll when modal is open
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
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

const handleSubmit = () => {
  const appointments = JSON.parse(localStorage.getItem('tourAppointments') || '[]')
  appointments.push({
    ...form.value,
    id: Date.now(),
    status: 'pending',
    createdAt: new Date().toISOString()
  })
  localStorage.setItem('tourAppointments', JSON.stringify(appointments))
  alert('Appointment requested successfully! We will contact you shortly.')
  form.value = { name: '', email: '', phone: '', scheduleTime: '' }
  closeModal()
}

const closeModal = () => {
  emit('close')
}
</script>