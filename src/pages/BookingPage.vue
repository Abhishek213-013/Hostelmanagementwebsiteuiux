<template>
  <!-- Step 4: Booking Confirmed -->
  <div v-if="step === 4" class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-20 px-6">
    <AnimatedSection>
      <div class="relative text-center max-w-lg">
        <div class="inline-block mb-8">
          <div class="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl bg-teal-600">
            <CheckCircle2 class="w-16 h-16 text-white drop-shadow-lg" />
          </div>
        </div>
        <h1 class="text-5xl lg:text-6xl font-black mb-4 text-teal-600">Booking Confirmed!</h1>
        <p class="text-xl text-gray-600 mb-2">Your room has been reserved successfully.</p>
        <p class="text-gray-700 mb-4">
          A confirmation email has been sent to <span class="font-semibold text-gray-800">{{ bookingData.email }}</span>
        </p>

        <div v-if="transactionId" class="bg-white rounded-2xl p-6 mb-8 shadow border border-gray-200">
          <p class="text-sm text-teal-600 mb-1">Transaction ID</p>
          <p class="font-mono font-bold text-gray-800 text-lg">{{ transactionId }}</p>
        </div>

        <div class="flex flex-wrap gap-4 justify-center">
          <router-link to="/" class="group px-8 py-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl text-emerald-800 dark:text-emerald-200 rounded-2xl font-bold hover:bg-white dark:hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-3">
            <ArrowLeft class="w-5 h-5" />
            Back to Home
          </router-link>
          <button @click="resetBooking" class="group relative px-8 py-4 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-110 transition-all flex items-center gap-3 animate-gradient-shift" style="background: linear-gradient(to right, #059669, #06b6d4, #f59e0b, #059669)">
            Book Another Room
            <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div class="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </AnimatedSection>
  </div>

  <!-- Steps 2 and 3: Booking Form and Payment -->
  <div v-else class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
    <Header />
    <div class="max-w-6xl mx-auto w-full flex-1 pt-28 pb-20 px-6">
      <!-- Step 3: Payment -->
      <div v-if="step === 3 && selectedRoom">
        <AnimatedSection>
          <div class="relative">
            <div class="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
              <div class="grid grid-cols-1 lg:grid-cols-2">
                <div class="relative min-h-[500px] lg:min-h-0">
                  <img :src="selectedRoom.image" :alt="selectedRoom.title" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent"></div>
                  <div class="absolute bottom-8 left-8 right-8">
                    <div class="inline-block px-4 py-2 rounded-xl text-white font-black shadow-xl mb-4 bg-teal-600">
                      {{ selectedRoom.type.replace('-', ' ') }}
                    </div>
                    <h3 class="text-4xl font-black text-white mb-2">{{ selectedRoom.title }}</h3>
                    <p class="text-white/80 text-xl">৳{{ selectedRoom.price.toLocaleString() }}/month</p>
                  </div>
                </div>
                <div class="p-10">
                  <button @click="step = 2" class="mb-6 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2">
                    <ArrowLeft class="w-4 h-4" />
                    Back to Booking
                  </button>
                  <h2 class="text-xl font-black mb-8 text-teal-600">Select Payment Method</h2>

                  <div class="mb-6 p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
                    <h4 class="text-lg font-black text-gray-800 mb-4">Booking Summary</h4>
                    <div class="space-y-3 text-gray-600">
                      <div class="text-sm flex justify-between">
                        <span>Room Type</span>
                        <span class="font-bold text-gray-800">{{ selectedRoom.title }}</span>
                      </div>
                      <div class="text-sm flex justify-between">
                        <span>Monthly Rent</span>
                        <span class="font-bold text-gray-800">৳{{ selectedRoom.price.toLocaleString() }}</span>
                      </div>
                      <div class="text-sm flex justify-between">
                        <span>Security Deposit</span>
                        <span class="font-bold text-gray-800">৳{{ Math.round(selectedRoom.price * 2).toLocaleString() }}</span>
                      </div>
                      <div class="text-sm border-t border-gray-300 pt-3 mt-3 flex justify-between">
                        <span class="font-black text-lg text-gray-800">Total to Pay</span>
                        <span class="font-black text-2xl text-gray-800">৳{{ Math.round(selectedRoom.price * 2).toLocaleString() }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Payment Status Messages -->
                  <div v-if="paymentStatus?.status === 'failed'" class="text-center py-6 mb-6">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                      <X class="w-8 h-8 text-red-600" />
                    </div>
                    <h3 class="text-2xl font-black text-gray-800 mb-2">Payment Failed</h3>
                    <p class="text-gray-600 mb-4">{{ paymentStatus.message }}</p>
                    <button @click="paymentStatus = null" class="px-6 py-3 text-white rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition-all" style="background: #0d9488">
                      Try Again
                    </button>
                  </div>

                  <div v-else-if="paymentStatus?.status === 'canceled'" class="text-center py-6 mb-6">
                    <h3 class="text-2xl font-black text-gray-800 mb-4">Payment Canceled</h3>
                    <p class="text-gray-600 mb-4">{{ paymentStatus.message }}</p>
                    <button @click="paymentStatus = null" class="px-6 py-3 rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition-all bg-gray-100">
                      Go Back
                    </button>
                  </div>

                  <div v-else class="space-y-4 mb-8">
                    <button v-for="method in paymentMethods" :key="method.id"
                      @click="selectPayment(method.id)"
                      :disabled="isProcessing"
                      :class="['w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4',
                        selectedPayment === method.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300 bg-white',
                        'disabled:opacity-50']">
                      <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg bg-teal-600">
                        <component :is="method.icon" class="w-6 h-6 text-white" />
                      </div>
                      <div class="text-left flex-1">
                        <h4 class="text-lg font-black text-gray-800">{{ method.title }}</h4>
                        <p class="text-sm text-gray-600">{{ method.desc }}</p>
                      </div>
                      <div v-if="selectedPayment === method.id" class="w-6 h-6 rounded-full flex items-center justify-center bg-teal-600">
                        <CheckCircle2 class="w-4 h-4 text-white" />
                      </div>
                    </button>
                  </div>

                  <button @click="confirmPayment"
                    :disabled="!selectedPayment || isProcessing"
                    :class="['w-full py-5 rounded-2xl font-bold text-white text-lg shadow transition-all flex items-center justify-center gap-3',
                      selectedPayment && !isProcessing
                        ? 'hover:shadow-xl hover:scale-[1.02]'
                        : 'bg-gray-300 cursor-not-allowed']"
                    :style="selectedPayment && !isProcessing ? { background: '#0d9488' } : {}">
                    <template v-if="isProcessing">
                      <svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </template>
                    <template v-else>
                      <CheckCircle2 class="w-6 h-6" />
                      Pay Now ৳{{ selectedRoom ? Math.round(selectedRoom.price * 2).toLocaleString() : '' }}
                    </template>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      <!-- Step 2: Booking Form -->
      <div v-else class="relative max-w-2xl mx-auto">
        <AnimatedSection>
          <div class="bg-white rounded-3xl shadow-2xl p-10 border-2 border-gray-200">
            <h2 class="text-3xl font-black mb-8 text-teal-600">Booking Information</h2>
            <form @submit.prevent="confirmBooking" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="group">
                  <label class="block text-sm font-bold text-teal-600 mb-3">Check-in Date</label>
                  <input type="date" v-model="bookingData.checkIn"
                    :class="['w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 transition-all font-semibold text-gray-800',
                      formErrors.checkIn ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20']" required />
                  <p v-if="formErrors.checkIn" class="text-red-500 text-sm mt-1">{{ formErrors.checkIn }}</p>
                </div>
                <div>
                  <label class="block text-sm font-bold text-teal-600 mb-3">Check-out Date</label>
                  <input type="date" v-model="bookingData.checkOut"
                    :class="['w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 transition-all font-semibold text-gray-800',
                      formErrors.checkOut ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20']" required />
                  <p v-if="formErrors.checkOut" class="text-red-500 text-sm mt-1">{{ formErrors.checkOut }}</p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-teal-600 mb-3">Number of Guests</label>
                <select v-model="bookingData.guests" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800">
                  <option :value="1">1 Guest</option>
                  <option :value="2">2 Guests</option>
                  <option :value="3">3 Guests</option>
                  <option :value="4">4 Guests</option>
                </select>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="group">
                  <label class="block text-sm font-bold text-teal-600 mb-3">Your Name</label>
                  <input type="text" placeholder="Enter your name" v-model="bookingData.name"
                    :class="['w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 transition-all font-semibold text-gray-800 placeholder:text-gray-400',
                      formErrors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20']" required />
                  <p v-if="formErrors.name" class="text-red-500 text-sm mt-1">{{ formErrors.name }}</p>
                </div>
                <div>
                  <label class="block text-sm font-bold text-teal-600 mb-3">Email Address</label>
                  <input type="email" placeholder="Enter your email" v-model="bookingData.email"
                    :class="['w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 transition-all font-semibold text-gray-800 placeholder:text-gray-400',
                      formErrors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20']" required />
                  <p v-if="formErrors.email" class="text-red-500 text-sm mt-1">{{ formErrors.email }}</p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-teal-600 mb-3">Phone Number</label>
                <input type="tel" placeholder="Enter your phone number" v-model="bookingData.phone"
                  :class="['w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 transition-all font-semibold text-gray-800 placeholder:text-gray-400',
                    formErrors.phone ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20']" required />
                <p v-if="formErrors.phone" class="text-red-500 text-sm mt-1">{{ formErrors.phone }}</p>
              </div>

              <div>
                <label class="block text-sm font-bold text-teal-600 mb-3">Special Requests (Optional)</label>
                <textarea placeholder="Any special requirements or preferences..." v-model="bookingData.specialRequests"
                  class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-gray-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 placeholder:text-gray-400 resize-none h-36"></textarea>
              </div>

              <button type="submit" class="w-full group py-5 rounded-2xl font-bold text-white shadow hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg" style="background: #0d9488">
                Continue to Payment
                <ChevronRight class="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, X, CreditCard, Smartphone, Building2, Send } from 'lucide-vue-next'
import AnimatedSection from '../components/ui/AnimatedSection.vue'

const route = useRoute()
const router = useRouter()
const step = ref(2)

// Initialize room from URL params and check auth
const selectedPayment = ref('')
const isProcessing = ref(false)
const transactionId = ref('')
const paymentStatus = ref(null)
const formErrors = ref({})

const bookingData = ref({
  checkIn: '',
  checkOut: '',
  guests: 1,
  name: '',
  email: '',
  phone: '',
  specialRequests: ''
})

// Room types
const roomTypes = {
  'shared': {
    id: 1,
    title: 'Shared Room',
    type: 'shared',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    features: ['4 Bunk Beds', 'Shared Bathroom', 'Study Desk', 'Wardrobe', 'High-Speed WiFi', 'Fan']
  },
  'semi-private': {
    id: 2,
    title: 'Semi-Private',
    type: 'semi-private',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1771327811795-6197403af846?w=800',
    features: ['2 Single Beds', 'Attached Bath', 'Study Desks', 'Ceiling Fan', 'High-Speed WiFi', 'Wardrobe']
  },
  'premium': {
    id: 3,
    title: 'Premium Single',
    type: 'premium',
    price: 10500,
    image: 'https://images.unsplash.com/photo-1663811397091-9a13493eff11?w=800',
    features: ['Private Room', 'Attached Bath', 'Air Conditioning', 'Premium Furniture', 'High-Speed WiFi', 'Mini Fridge']
  }
}

const selectedRoom = ref(roomTypes['shared'])

const paymentMethods = [
  { id: 'sslcommerz', title: 'SSLCommerz', desc: 'Pay securely with SSLCOMMERZ gateway', icon: CreditCard },
  { id: 'credit-card', title: 'Credit/Debit Card', desc: 'Visa, MasterCard, American Express', icon: CreditCard },
  { id: 'mobile-banking', title: 'Mobile Banking', desc: 'bKash, Nagad, Rocket, Upay', icon: Smartphone },
  { id: 'net-banking', title: 'Net Banking', desc: 'All major banks supported', icon: Building2 }
]

// Initialize room from URL params and check auth
onMounted(() => {
  if (!localStorage.getItem('isAuthenticated')) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }

  const roomType = route.query.room
  if (roomType && roomTypes[roomType]) {
    selectedRoom.value = roomTypes[roomType]
  }

  // Check for payment status in URL
  const urlParams = new URLSearchParams(window.location.search)
  const paymentStatusParam = urlParams.get('status')
  const tranId = urlParams.get('tran_id')

  if (paymentStatusParam && tranId) {
    if (paymentStatusParam === 'success') {
      paymentStatus.value = { status: 'success', transactionId: tranId, message: 'Payment successful!' }
      transactionId.value = tranId
      step.value = 4
    } else if (paymentStatusParam === 'failed') {
      paymentStatus.value = { status: 'failed', message: 'Payment failed. Please try again.' }
      step.value = 3
    } else if (paymentStatusParam === 'canceled') {
      paymentStatus.value = { status: 'canceled', message: 'Payment was canceled.' }
      step.value = 3
    }
    window.history.replaceState({}, document.title, window.location.pathname)
  }
})

const validateForm = () => {
  const errors = {}
  if (!bookingData.value.name.trim()) errors.name = 'Name is required'
  if (!bookingData.value.email.trim()) errors.email = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(bookingData.value.email)) errors.email = 'Email is invalid'
  if (!bookingData.value.phone.trim()) errors.phone = 'Phone number is required'
  if (!bookingData.value.checkIn) errors.checkIn = 'Check-in date is required'
  if (!bookingData.value.checkOut) errors.checkOut = 'Check-out date is required'
  if (bookingData.value.checkIn && bookingData.value.checkOut && bookingData.value.checkIn >= bookingData.value.checkOut) {
    errors.checkOut = 'Check-out must be after check-in'
  }
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const confirmBooking = () => {
  if (!validateForm()) return
  step.value = 3
}

const selectPayment = (method) => {
  selectedPayment.value = method
}

const confirmPayment = async () => {
  if (!selectedPayment.value) return
  paymentStatus.value = null
  isProcessing.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    const newTransactionId = `${selectedPayment.value.toUpperCase()}_${Date.now()}`
    transactionId.value = newTransactionId
    paymentStatus.value = { status: 'success', transactionId: newTransactionId, message: 'Payment successful!' }

    // Save booking to localStorage
    const bookings = JSON.parse(localStorage.getItem('myRooms') || '[]')
    bookings.push({
      id: Date.now(),
      name: selectedRoom.value.title,
      description: `${selectedRoom.value.type} room with modern amenities`,
      image: selectedRoom.value.image,
      status: 'Active',
      checkIn: bookingData.value.checkIn,
      checkOut: bookingData.value.checkOut,
      guests: bookingData.value.guests,
      roomType: selectedRoom.value.type,
      price: selectedRoom.value.price,
      bookedAt: new Date().toISOString()
    })
    localStorage.setItem('myRooms', JSON.stringify(bookings))

    setTimeout(() => {
      step.value = 4
      isProcessing.value = false
    }, 1500)
  } catch (error) {
    paymentStatus.value = { status: 'failed', message: 'Payment failed. Please try again.' }
    isProcessing.value = false
  }
}

const resetBooking = () => {
  step.value = 2
  transactionId.value = ''
  paymentStatus.value = null
  selectedPayment.value = ''
}
</script>
