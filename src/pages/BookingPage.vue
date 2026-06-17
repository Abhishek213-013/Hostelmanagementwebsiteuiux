<template>
  <!-- Step 4: Booking Confirmed (Under Approval) -->
  <div v-if="step === 4" class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-20 px-6">
    <AnimatedSection>
      <div class="relative text-center max-w-lg">
        <div class="inline-block mb-8">
          <div class="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl bg-amber-500">
            <Clock class="w-16 h-16 text-white drop-shadow-lg" />
          </div>
        </div>
        <h1 class="text-5xl lg:text-6xl font-black mb-4 text-amber-600">Booking Under Approval</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-2">Your booking has been submitted for review.</p>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          A confirmation email has been sent to <span class="font-semibold text-gray-800 dark:text-gray-200">{{ bookingData.email_number }}</span>
        </p>

        <div v-if="currentBooking?.id" class="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow border border-gray-200 dark:border-gray-700">
          <p class="text-sm text-amber-600 mb-1">Booking ID</p>
          <p class="font-mono font-bold text-gray-800 dark:text-white text-lg">{{ currentBooking.id }}</p>
          <div class="mt-4 flex items-center justify-center gap-2">
            <span class="inline-block w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
            <span class="text-amber-600 font-semibold">Status: Pending Approval</span>
          </div>
        </div>

        <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8">
          <h3 class="text-lg font-bold text-amber-800 dark:text-amber-200 mb-2">What's Next?</h3>
          <ul class="text-sm text-amber-700 dark:text-amber-300 space-y-2 text-left">
            <li class="flex items-center gap-2">
              <Clock class="w-4 h-4 flex-shrink-0" />
              Your booking is being reviewed by our team
            </li>
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 flex-shrink-0" />
              You'll receive confirmation within 24 hours
            </li>
            <li class="flex items-center gap-2">
              <Phone class="w-4 h-4 flex-shrink-0" />
              We may contact you for verification
            </li>
          </ul>
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
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
        <button @click="retryFetch" class="mt-4 px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors">
          Try Again
        </button>
      </div>

      <div v-else>
        <!-- Step 3: Payment -->
        <div v-if="step === 3 && selectedRoom">
          <AnimatedSection>
            <div class="relative">
              <div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div class="grid grid-cols-1 lg:grid-cols-2">
                  <div class="relative min-h-[500px] lg:min-h-0">
                    <img :src="selectedRoom.image || '/default-room.jpg'" :alt="selectedRoom.title" class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent"></div>
                    <div class="absolute bottom-8 left-8 right-8">
                      <div class="inline-block px-4 py-2 rounded-xl text-white font-black shadow-xl mb-4 bg-teal-600">
                        {{ selectedRoom.room_type?.name || selectedRoom.type }}
                      </div>
                      <h3 class="text-4xl font-black text-white mb-2">{{ selectedRoom.room_number || selectedRoom.title }}</h3>
                      <p class="text-white/80 text-xl">৳{{ (selectedRoom.room_price || selectedRoom.price).toLocaleString() }}/month</p>
                    </div>
                  </div>
                  <div class="p-10">
                    <button @click="step = 2" class="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center gap-2">
                      <ArrowLeft class="w-4 h-4" />
                      Back to Booking
                    </button>
                    <h2 class="text-xl font-black mb-8 text-teal-600">Select Payment Method</h2>

                    <div class="mb-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl border-2 border-gray-200 dark:border-gray-600">
                      <h4 class="text-lg font-black text-gray-800 dark:text-white mb-4">Booking Summary</h4>
                      <div class="space-y-3 text-gray-600 dark:text-gray-400">
                        <div class="text-sm flex justify-between">
                          <span>Room Type</span>
                          <span class="font-bold text-gray-800 dark:text-white">{{ selectedRoom.room_type?.name || selectedRoom.title }}</span>
                        </div>
                        <div class="text-sm flex justify-between">
                          <span>Monthly Rent</span>
                          <span class="font-bold text-gray-800 dark:text-white">৳{{ (selectedRoom.room_price || selectedRoom.price).toLocaleString() }}</span>
                        </div>
                        <div class="text-sm flex justify-between">
                          <span>Security Deposit</span>
                          <span class="font-bold text-gray-800 dark:text-white">৳{{ Math.round((selectedRoom.room_price || selectedRoom.price) * 2).toLocaleString() }}</span>
                        </div>
                        <div class="text-sm border-t border-gray-300 pt-3 mt-3 flex justify-between">
                          <span class="font-black text-lg text-gray-800 dark:text-white">Total to Pay</span>
                          <span class="font-black text-2xl text-gray-800 dark:text-white">৳{{ Math.round((selectedRoom.room_price || selectedRoom.price) * 2).toLocaleString() }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Payment Status Messages -->
                    <div v-if="paymentStatus?.status === 'failed'" class="text-center py-6 mb-6">
                      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <X class="w-8 h-8 text-red-600" />
                      </div>
                      <h3 class="text-2xl font-black text-gray-800 dark:text-white mb-2">Payment Failed</h3>
                      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ paymentStatus.message }}</p>
                      <button @click="paymentStatus = null" class="px-6 py-3 text-white rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition-all bg-teal-600">
                        Try Again
                      </button>
                    </div>

                    <div v-else-if="paymentStatus?.status === 'canceled'" class="text-center py-6 mb-6">
                      <h3 class="text-2xl font-black text-gray-800 dark:text-white mb-4">Payment Canceled</h3>
                      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ paymentStatus.message }}</p>
                      <button @click="paymentStatus = null" class="px-6 py-3 rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition-all bg-gray-100 dark:bg-gray-700">
                        Go Back
                      </button>
                    </div>

                    <div v-else class="space-y-4 mb-8">
                      <button v-for="method in paymentMethods" :key="method.id"
                        @click="selectPayment(method.id)"
                        :disabled="isProcessing"
                        :class="['w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4',
                          selectedPayment === method.id
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/50 dark:border-teal-400'
                            : 'border-gray-200 dark:border-gray-600 hover:border-teal-300 bg-white dark:bg-gray-700',
                          'disabled:opacity-50']">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg" :style="{ background: method.color }">
                          <component :is="method.icon" class="w-6 h-6 text-white" />
                        </div>
                        <div class="text-left flex-1">
                          <h4 class="text-lg font-black text-gray-800 dark:text-white">{{ method.title }}</h4>
                          <p class="text-sm text-gray-600 dark:text-gray-400">{{ method.desc }}</p>
                        </div>
                        <div v-if="selectedPayment === method.id" class="w-6 h-6 rounded-full flex items-center justify-center bg-teal-600">
                          <CheckCircle2 class="w-4 h-4 text-white" />
                        </div>
                      </button>
                    </div>

                    <!-- Payment Gateway Modal Trigger -->
                    <button @click="initiatePayment"
                      :disabled="!selectedPayment || isProcessing || submittingBooking"
                      :class="['w-full py-5 rounded-2xl font-bold text-white text-lg shadow transition-all flex items-center justify-center gap-3',
                        selectedPayment && !isProcessing && !submittingBooking
                          ? 'hover:shadow-xl hover:scale-[1.02]'
                          : 'bg-gray-300 cursor-not-allowed']"
                      :style="selectedPayment && !isProcessing && !submittingBooking ? { background: '#0d9488' } : {}">
                      <template v-if="isProcessing || submittingBooking">
                        <svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ submittingBooking ? 'Creating Booking...' : 'Processing...' }}
                      </template>
                      <template v-else>
                        <CreditCard class="w-6 h-6" />
                        Pay Now ৳{{ selectedRoom ? Math.round((selectedRoom.room_price || selectedRoom.price) * 2).toLocaleString() : '' }}
                      </template>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <!-- Payment Gateway Modal -->
          <Teleport to="body">
            <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <AnimatedSection>
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                  <!-- SSLCommerz Style Header -->
                  <div v-if="selectedPayment === 'sslcommerz'" class="p-6">
                    <div class="flex items-center justify-between mb-6">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                          <Shield class="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 class="font-black text-gray-800 dark:text-white">SSLCommerz</h3>
                          <p class="text-xs text-gray-500">Secure Payment Gateway</p>
                        </div>
                      </div>
                      <button @click="showPaymentModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X class="w-6 h-6" />
                      </button>
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-600 dark:text-gray-400">Amount to Pay</span>
                        <span class="text-2xl font-black text-gray-800 dark:text-white">৳{{ Math.round((selectedRoom.room_price || selectedRoom.price) * 2).toLocaleString() }}</span>
                      </div>
                      <div class="text-xs text-gray-500">Transaction ID: {{ generatedTranId }}</div>
                    </div>

                    <!-- SSLCommerz Payment Form -->
                    <form @submit.prevent="processSSLCommerzPayment" class="space-y-4">
                      <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Card Number</label>
                        <div class="relative">
                          <input type="text" v-model="sslForm.cardNumber" @input="formatCardNumber" maxlength="19" placeholder="1234 5678 9012 3456"
                            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-teal-500 focus:outline-none transition-all font-mono" />
                          <div class="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" class="h-4 opacity-50" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" class="h-4 opacity-50" />
                          </div>
                        </div>
                      </div>

                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Expiry Date</label>
                          <input type="text" v-model="sslForm.expiry" @input="formatExpiry" maxlength="5" placeholder="MM/YY"
                            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-teal-500 focus:outline-none transition-all font-mono" />
                        </div>
                        <div>
                          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">CVV</label>
                          <input type="password" v-model="sslForm.cvv" maxlength="4" placeholder="***"
                            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-teal-500 focus:outline-none transition-all font-mono" />
                        </div>
                      </div>

                      <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Card Holder Name</label>
                        <input type="text" v-model="sslForm.cardHolder" placeholder="John Doe"
                          class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-teal-500 focus:outline-none transition-all" />
                      </div>

                      <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Lock class="w-4 h-4" />
                        <span>Secured by SSLCommerz. Your data is encrypted.</span>
                      </div>

                      <button type="submit" :disabled="sslProcessing"
                        class="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                        <template v-if="sslProcessing">
                          <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                          Processing...
                        </template>
                        <template v-else>
                          <Lock class="w-5 h-5" />
                          Pay Securely
                        </template>
                      </button>
                    </form>
                  </div>

                  <!-- Mobile Banking Modal -->
                  <div v-else-if="selectedPayment === 'mobile-banking'" class="p-6">
                    <div class="flex items-center justify-between mb-6">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                          <Smartphone class="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 class="font-black text-gray-800 dark:text-white">Mobile Banking</h3>
                          <p class="text-xs text-gray-500">bKash, Nagad, Rocket</p>
                        </div>
                      </div>
                      <button @click="showPaymentModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X class="w-6 h-6" />
                      </button>
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-600 dark:text-gray-400">Amount to Pay</span>
                        <span class="text-2xl font-black text-gray-800 dark:text-white">৳{{ Math.round((selectedRoom.room_price || selectedRoom.price) * 2).toLocaleString() }}</span>
                      </div>
                    </div>

                    <div class="space-y-3 mb-6">
                      <button @click="mobileProvider = 'bkash'" :class="['w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3',
                        mobileProvider === 'bkash' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20' : 'border-gray-200 dark:border-gray-600']">
                        <div class="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center flex-shrink-0">
                          <span class="text-white font-black text-sm">bKash</span>
                        </div>
                        <span class="font-bold text-gray-800 dark:text-white">bKash</span>
                      </button>
                      <button @click="mobileProvider = 'nagad'" :class="['w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3',
                        mobileProvider === 'nagad' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600']">
                        <div class="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0">
                          <span class="text-white font-black text-sm">Nagad</span>
                        </div>
                        <span class="font-bold text-gray-800 dark:text-white">Nagad</span>
                      </button>
                      <button @click="mobileProvider = 'rocket'" :class="['w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3',
                        mobileProvider === 'rocket' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-600']">
                        <div class="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                          <span class="text-white font-black text-sm">Rocket</span>
                        </div>
                        <span class="font-bold text-gray-800 dark:text-white">Rocket</span>
                      </button>
                    </div>

                    <form @submit.prevent="processMobilePayment" class="space-y-4">
                      <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label>
                        <input type="tel" v-model="mobileForm.number" placeholder="01XXXXXXXXX"
                          class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-teal-500 focus:outline-none transition-all" />
                      </div>
                      <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">PIN</label>
                        <input type="password" v-model="mobileForm.pin" maxlength="5" placeholder="*****"
                          class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-teal-500 focus:outline-none transition-all" />
                      </div>
                      <button type="submit" :disabled="!mobileProvider || sslProcessing" :class="['w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50',
                        mobileProvider === 'bkash' ? 'bg-pink-500 hover:bg-pink-600' :
                        mobileProvider === 'nagad' ? 'bg-red-500 hover:bg-red-600' :
                        mobileProvider === 'rocket' ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-300']">
                        <template v-if="sslProcessing">
                          <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                          Processing...
                        </template>
                        <template v-else>
                          <Smartphone class="w-5 h-5" />
                          Pay with {{ mobileProvider || 'Mobile' }}
                        </template>
                      </button>
                    </form>
                  </div>

                  <!-- Credit/Debit Card Modal -->
                  <div v-else-if="selectedPayment === 'credit-card'" class="p-6">
                    <div class="flex items-center justify-between mb-6">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                          <CreditCard class="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 class="font-black text-gray-800 dark:text-white">Credit/Debit Card</h3>
                          <p class="text-xs text-gray-500">Visa, MasterCard, Amex</p>
                        </div>
                      </div>
                      <button @click="showPaymentModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X class="w-6 h-6" />
                      </button>
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-600 dark:text-gray-400">Amount to Pay</span>
                        <span class="text-2xl font-black text-gray-800 dark:text-white">৳{{ Math.round((selectedRoom.room_price || selectedRoom.price) * 2).toLocaleString() }}</span>
                      </div>
                    </div>

                    <form @submit.prevent="processCardPayment" class="space-y-4">
                      <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Card Number</label>
                        <input type="text" v-model="sslForm.cardNumber" @input="formatCardNumber" maxlength="19" placeholder="1234 5678 9012 3456"
                          class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-teal-500 focus:outline-none transition-all font-mono" />
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Expiry</label>
                          <input type="text" v-model="sslForm.expiry" @input="formatExpiry" maxlength="5" placeholder="MM/YY"
                            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-teal-500 focus:outline-none transition-all font-mono" />
                        </div>
                        <div>
                          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">CVV</label>
                          <input type="password" v-model="sslForm.cvv" maxlength="4" placeholder="***"
                            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-teal-500 focus:outline-none transition-all font-mono" />
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Card Holder</label>
                        <input type="text" v-model="sslForm.cardHolder" placeholder="John Doe"
                          class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-teal-500 focus:outline-none transition-all" />
                      </div>
                      <button type="submit" :disabled="sslProcessing"
                        class="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                        <template v-if="sslProcessing">
                          <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                          Processing...
                        </template>
                        <template v-else>
                          <CreditCard class="w-5 h-5" />
                          Pay ৳{{ Math.round((selectedRoom.room_price || selectedRoom.price) * 2).toLocaleString() }}
                        </template>
                      </button>
                    </form>
                  </div>

                  <!-- Net Banking Modal -->
                  <div v-else-if="selectedPayment === 'net-banking'" class="p-6">
                    <div class="flex items-center justify-between mb-6">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center">
                          <Building2 class="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 class="font-black text-gray-800 dark:text-white">Net Banking</h3>
                          <p class="text-xs text-gray-500">All Major Banks</p>
                        </div>
                      </div>
                      <button @click="showPaymentModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X class="w-6 h-6" />
                      </button>
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                        <span class="text-2xl font-black text-gray-800 dark:text-white">৳{{ Math.round((selectedRoom.room_price || selectedRoom.price) * 2).toLocaleString() }}</span>
                      </div>
                    </div>

                    <div class="space-y-3 mb-6">
                      <button v-for="bank in banks" :key="bank.id" @click="selectedBank = bank.id"
                        :class="['w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3',
                          selectedBank === bank.id ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-200 dark:border-gray-600']">
                        <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                          <Building2 class="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </div>
                        <span class="font-bold text-gray-800 dark:text-white">{{ bank.name }}</span>
                      </button>
                    </div>

                    <button @click="processNetBanking" :disabled="!selectedBank || sslProcessing"
                      class="w-full py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                      <template v-if="sslProcessing">
                        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Processing...
                      </template>
                      <template v-else>
                        <Building2 class="w-5 h-5" />
                        Proceed to Net Banking
                      </template>
                    </button>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </Teleport>
        </div>

        <!-- Step 2: Booking Form -->
        <div v-else class="relative max-w-2xl mx-auto">
          <AnimatedSection>
            <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 border-2 border-gray-200 dark:border-gray-700">
              <h2 class="text-3xl font-black mb-8 text-teal-600">Booking Information</h2>
              <form @submit.prevent="confirmBooking" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="group">
                    <label class="block text-sm font-bold text-teal-600 mb-3">Check-in Date</label>
                    <input type="date" v-model="bookingData.check_in_date"
                      :class="['w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 transition-all font-semibold text-gray-800 dark:text-gray-200',
                        formErrors.check_in_date ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500/20']" required />
                    <p v-if="formErrors.check_in_date" class="text-red-500 text-sm mt-1">{{ formErrors.check_in_date }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">Check-out Date</label>
                    <input type="date" v-model="bookingData.check_out_date"
                      :class="['w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 transition-all font-semibold text-gray-800 dark:text-gray-200',
                        formErrors.check_out_date ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20']" required />
                    <p v-if="formErrors.check_out_date" class="text-red-500 text-sm mt-1">{{ formErrors.check_out_date }}</p>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-bold text-teal-600 mb-3">Select Seat</label>
                      <select v-model="selectedSeatId" @change="bookingData.seat_id = selectedSeatId"
                        class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200">
                        <option value="">Select a seat</option>
                        <option v-for="seat in availableSeats" :key="seat.id" :value="seat.id">
                          Seat {{ seat.id }} - {{ seat.seat_description || 'Available' }}
                        </option>
                      </select>
                      <p v-if="availableSeats.length === 0 && selectedRoom" class="text-red-500 text-sm mt-1">
                        No seats available for this room
                      </p>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="group">
                    <label class="block text-sm font-bold text-teal-600 mb-3">Party Name</label>
                    <input type="text" placeholder="Enter your full name" v-model="bookingData.party_name"
                      :class="['w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400',
                        formErrors.party_name ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500/20']" required />
                    <p v-if="formErrors.party_name" class="text-red-500 text-sm mt-1">{{ formErrors.party_name }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">Party Name (Bangla)</label>
                    <input type="text" placeholder="আপনার নাম লিখুন" v-model="bookingData.party_name_bn"
                      class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">Mobile Number</label>
                    <input type="tel" placeholder="Enter mobile number" v-model="bookingData.mobile_number"
                      :class="['w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400',
                        formErrors.mobile_number ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20']" required />
                    <p v-if="formErrors.mobile_number" class="text-red-500 text-sm mt-1">{{ formErrors.mobile_number }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">Phone Number</label>
                    <input type="tel" placeholder="Enter phone number" v-model="bookingData.phone_number"
                      class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">WhatsApp</label>
                    <input type="tel" placeholder="WhatsApp number" v-model="bookingData.whats_app"
                      class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">Email Address</label>
                    <input type="email" placeholder="Enter email address" v-model="bookingData.email_number"
                      :class="['w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400',
                        formErrors.email_number ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500/20']" required />
                    <p v-if="formErrors.email_number" class="text-red-500 text-sm mt-1">{{ formErrors.email_number }}</p>
                  </div>
                </div>

                <!-- Address Fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">House</label>
                    <input type="text" placeholder="House number/name" v-model="bookingData.house"
                      class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">Street</label>
                    <input type="text" placeholder="Street name" v-model="bookingData.street"
                      class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">Division</label>
                    <select v-model="selectedDivisionId" @change="onDivisionChange"
                      class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200">
                      <option value="">Select Division</option>
                      <option v-for="div in divisions" :key="div.id" :value="div.id">{{ div.name }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">District</label>
                    <select v-model="bookingData.district_id" @change="onDistrictChange"
                      class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200">
                      <option value="">Select District</option>
                      <option v-for="dist in districts" :key="dist.id" :value="dist.id">{{ dist.name }}</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">Upazila</label>
                    <select v-model="bookingData.upazila_id" @change="onUpazilaChange"
                      class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200">
                      <option value="">Select Upazila</option>
                      <option v-for="upa in upazilas" :key="upa.id" :value="upa.id">{{ upa.name }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">Union</label>
                    <select v-model="bookingData.union_id"
                      class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200">
                      <option value="">Select Union</option>
                      <option v-for="uni in unions" :key="uni.id" :value="uni.id">{{ uni.name }}</option>
                    </select>
                  </div>
                </div>

                <!-- Social Media Links -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">Facebook</label>
                    <input type="url" placeholder="Facebook profile URL" v-model="bookingData.fb"
                      class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">Twitter/X</label>
                    <input type="url" placeholder="Twitter/X profile URL" v-model="bookingData.twiter"
                      class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">Instagram</label>
                    <input type="url" placeholder="Instagram profile URL" v-model="bookingData.instagram"
                      class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">LinkedIn</label>
                    <input type="url" placeholder="LinkedIn profile URL" v-model="bookingData.linked_in"
                      class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-bold text-teal-600 mb-3">YouTube</label>
                  <input type="url" placeholder="YouTube channel URL" v-model="bookingData.youtube"
                    class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                </div>

                <div>
                  <label class="block text-sm font-bold text-teal-600 mb-3">Notes (Optional)</label>
                  <textarea placeholder="Any special requirements or preferences..." v-model="bookingData.notes"
                    class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400 resize-none h-36"></textarea>
                </div>

                <button type="submit" :disabled="submittingBooking" class="w-full group py-5 rounded-2xl font-bold text-white shadow hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed bg-teal-600">
                  <template v-if="submittingBooking">
                    <svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </template>
                  <template v-else>
                    Continue to Payment
                    <ChevronRight class="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </template>
                </button>
              </form>
            </div>
          </AnimatedSection>
        </div>
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
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, X, CreditCard, Smartphone, Building2, Clock, Phone, Lock, Shield } from 'lucide-vue-next'
import AnimatedSection from '../components/ui/AnimatedSection.vue'
import { useRooms } from '../composables/useRooms'
import { useBookings } from '../composables/useBookings'
import { useLocations } from '../composables/useLocations'
import { roomAPI } from '../services/api'

const route = useRoute()
const router = useRouter()
const step = ref(2)

// Payment modal state
const showPaymentModal = ref(false)
const sslProcessing = ref(false)
const generatedTranId = ref('')
const mobileProvider = ref('')
const selectedBank = ref('')

// SSLCommerz form
const sslForm = ref({
  cardNumber: '',
  expiry: '',
  cvv: '',
  cardHolder: ''
})

// Mobile banking form
const mobileForm = ref({
  number: '',
  pin: ''
})

// Banks list
const banks = [
  { id: 'dutch-bangla', name: 'Dutch-Bangla Bank' },
  { id: 'brac', name: 'BRAC Bank' },
  { id: 'city', name: 'City Bank' },
  { id: 'eastern', name: 'Eastern Bank' },
  { id: 'ucb', name: 'United Commercial Bank' },
  { id: 'prime', name: 'Prime Bank' },
  { id: 'one', name: 'ONE Bank' },
  { id: 'mutual-trust', name: 'Mutual Trust Bank' }
]

const availableSeats = ref([])
const selectedSeatId = ref(null)

const { rooms, roomTypes, loading: roomsLoading, error: roomsError, fetchRooms, fetchRoomDetails, checkRoomAvailability } = useRooms()
const { createBooking, currentBooking, loading: bookingLoading, error: bookingError, updateBookingStatus } = useBookings()
const { divisions, districts, upazilas, unions, loading: locationLoading, fetchDivisions, fetchDistricts, fetchUpazilas, fetchUnions } = useLocations()

const selectedPayment = ref('')
const isProcessing = ref(false)
const submittingBooking = ref(false)
const paymentStatus = ref(null)
const formErrors = ref({})
const selectedDivisionId = ref('')
const selectedRoom = ref(null)

const bookingData = ref({
  branch_id: 1,
  room_id: null,
  seat_id: null,
  billing_type_id: 1,
  party_name: '',
  party_name_bn: '',
  mobile_number: '',
  phone_number: '',
  whats_app: '',
  email_number: '',
  house: '',
  street: '',
  union_id: '',
  upazila_id: '',
  district_id: '',
  division_id: '',
  fb: '',
  twiter: '',
  instagram: '',
  linked_in: '',
  youtube: '',
  check_in_date: '',
  check_out_date: '',
  billing_amount: 0,
  status: 2, // 2 = pending
  notes: ''
})

const paymentMethods = [
  { id: 'sslcommerz', title: 'SSLCommerz', desc: 'Pay securely with SSLCOMMERZ gateway (Bangla)', icon: Shield, color: '#0d9488' },
  { id: 'credit-card', title: 'Credit/Debit Card', desc: 'Visa, MasterCard, American Express', icon: CreditCard, color: '#3b82f6' },
  { id: 'mobile-banking', title: 'Mobile Banking', desc: 'bKash, Nagad, Rocket, Upay', icon: Smartphone, color: '#ec4899' },
  { id: 'net-banking', title: 'Net Banking', desc: 'All major banks supported', icon: Building2, color: '#4b5563' }
]

// Generate random transaction ID
const generateTranId = () => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `SSL${timestamp}${random}`
}

// Format card number with spaces
const formatCardNumber = (e) => {
  let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '')
  if (value.length > 16) value = value.slice(0, 16)
  const parts = value.match(/.{1,4}/g)
  sslForm.value.cardNumber = parts ? parts.join(' ') : value
}

// Format expiry date
const formatExpiry = (e) => {
  let value = e.target.value.replace(/[^0-9]/g, '')
  if (value.length > 4) value = value.slice(0, 4)
  if (value.length > 2) {
    value = value.slice(0, 2) + '/' + value.slice(2)
  }
  sslForm.value.expiry = value
}

// Fetch available seats
const fetchAvailableSeats = async (roomId) => {
  try {
    const availability = await checkRoomAvailability(roomId)
    let availData = availability
    if (availData && availData.data) availData = availData.data
    
    if (availData && availData.available_seats) {
      availableSeats.value = availData.available_seats
      if (availableSeats.value.length > 0) {
        selectedSeatId.value = availableSeats.value[0].id
        bookingData.value.seat_id = selectedSeatId.value
      }
    } else if (availData && availData.data && availData.data.available_seats) {
      availableSeats.value = availData.data.available_seats
      if (availableSeats.value.length > 0) {
        selectedSeatId.value = availableSeats.value[0].id
        bookingData.value.seat_id = selectedSeatId.value
      }
    }
  } catch (err) {
    console.error('Failed to fetch available seats:', err)
    availableSeats.value = [{ id: 1, seat_description: 'Default Seat' }]
    selectedSeatId.value = 1
    bookingData.value.seat_id = 1
  }
}

// Initialize component
onMounted(async () => {
  if (!localStorage.getItem('isAuthenticated')) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }

  await fetchDivisions()

  const roomId = route.query.roomId
  if (roomId) {
    try {
      const room = await fetchRoomDetails(roomId)
      selectedRoom.value = room
      
      bookingData.value.room_id = room.id
      bookingData.value.branch_id = room.branch_id
      bookingData.value.billing_amount = room.room_price
      
      await fetchAvailableSeats(roomId)
    } catch (error) {
      console.error('Failed to fetch room details:', error)
    }
  }
})

const onDivisionChange = async () => {
  if (selectedDivisionId.value) {
    bookingData.value.division_id = selectedDivisionId.value
    await fetchDistricts(selectedDivisionId.value)
    bookingData.value.district_id = ''
    bookingData.value.upazila_id = ''
    bookingData.value.union_id = ''
  }
}

const onDistrictChange = async () => {
  if (bookingData.value.district_id) {
    await fetchUpazilas(bookingData.value.district_id)
    bookingData.value.upazila_id = ''
    bookingData.value.union_id = ''
  }
}

const onUpazilaChange = async () => {
  if (bookingData.value.upazila_id) {
    await fetchUnions(bookingData.value.upazila_id)
    bookingData.value.union_id = ''
  }
}

const validateForm = () => {
  const errors = {}
  if (!bookingData.value.party_name.trim()) errors.party_name = 'Name is required'
  if (!bookingData.value.email_number.trim()) errors.email_number = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(bookingData.value.email_number)) errors.email_number = 'Email is invalid'
  if (!bookingData.value.mobile_number.trim()) errors.mobile_number = 'Mobile number is required'
  if (!bookingData.value.check_in_date) errors.check_in_date = 'Check-in date is required'
  if (!bookingData.value.check_out_date) errors.check_out_date = 'Check-out date is required'
  if (bookingData.value.check_in_date && bookingData.value.check_out_date && 
      bookingData.value.check_in_date >= bookingData.value.check_out_date) {
    errors.check_out_date = 'Check-out must be after check-in'
  }
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const confirmBooking = async () => {
  if (!validateForm()) return
  
  if (!bookingData.value.seat_id) {
    formErrors.value.seat = 'Please select a seat'
    return
  }
  
  if (!bookingData.value.room_id) {
    formErrors.value.submit = 'Room information is missing. Please go back and select a room.'
    return
  }
  
  submittingBooking.value = true
  
  const bookingPayload = {
    branch_id: parseInt(bookingData.value.branch_id),
    room_id: parseInt(bookingData.value.room_id),
    seat_id: parseInt(bookingData.value.seat_id),
    billing_type_id: parseInt(bookingData.value.billing_type_id),
    party_name: bookingData.value.party_name,
    party_name_bn: bookingData.value.party_name_bn || "",
    mobile_number: bookingData.value.mobile_number,
    phone_number: bookingData.value.phone_number || "",
    whats_app: bookingData.value.whats_app || "",
    email_number: bookingData.value.email_number,
    house: bookingData.value.house || "",
    street: bookingData.value.street || "",
    union_id: bookingData.value.union_id ? parseInt(bookingData.value.union_id) : null,
    upazila_id: bookingData.value.upazila_id ? parseInt(bookingData.value.upazila_id) : null,
    district_id: bookingData.value.district_id ? parseInt(bookingData.value.district_id) : null,
    division_id: bookingData.value.division_id ? parseInt(bookingData.value.division_id) : null,
    fb: bookingData.value.fb || "",
    twiter: bookingData.value.twiter || "",
    instagram: bookingData.value.instagram || "",
    linked_in: bookingData.value.linked_in || "",
    youtube: bookingData.value.youtube || "",
    check_in_date: bookingData.value.check_in_date,
    check_out_date: bookingData.value.check_out_date,
    billing_amount: parseFloat(bookingData.value.billing_amount),
    status: 2, // Pending status
    notes: bookingData.value.notes || ""
  }
  
  try {
    const booking = await createBooking(bookingPayload)
    if (booking) {
      step.value = 3
    }
  } catch (error) {
    console.error('Failed to create booking:', error)
    if (error.response?.data?.message) {
      formErrors.value.submit = error.response.data.message
    } else if (error.response?.data?.error) {
      formErrors.value.submit = error.response.data.error
    } else if (error.message) {
      formErrors.value.submit = error.message
    } else {
      formErrors.value.submit = 'Failed to create booking. Please try again.'
    }
  } finally {
    submittingBooking.value = false
  }
}

const selectPayment = (method) => {
  selectedPayment.value = method
}

// Open payment modal
const initiatePayment = () => {
  if (!selectedPayment.value) return
  
  generatedTranId.value = generateTranId()
  showPaymentModal.value = true
  
  // Reset forms
  sslForm.value = { cardNumber: '', expiry: '', cvv: '', cardHolder: '' }
  mobileForm.value = { number: '', pin: '' }
  mobileProvider.value = ''
  selectedBank.value = ''
}

// Process SSLCommerz payment
const processSSLCommerzPayment = async () => {
  sslProcessing.value = true
  
  // Simulate payment processing
  await new Promise(resolve => setTimeout(resolve, 2500))
  
  // Simulate success (90% success rate)
  const isSuccess = Math.random() > 0.1
  
  if (isSuccess) {
    showPaymentModal.value = false
    paymentStatus.value = { status: 'success', message: 'Payment successful! Your booking is under approval.' }
    
    // Update booking status to pending (2)
    if (currentBooking.value?.id) {
      try {
        await updateBookingStatus(currentBooking.value.id, 2)
      } catch (err) {
        console.error('Failed to update booking status:', err)
      }
    }
    
    step.value = 4
  } else {
    paymentStatus.value = { status: 'failed', message: 'Payment failed. Please try again.' }
    showPaymentModal.value = false
  }
  
  sslProcessing.value = false
}

// Process mobile banking payment
const processMobilePayment = async () => {
  if (!mobileProvider.value) return
  
  sslProcessing.value = true
  
  await new Promise(resolve => setTimeout(resolve, 2500))
  
  const isSuccess = Math.random() > 0.1
  
  if (isSuccess) {
    showPaymentModal.value = false
    paymentStatus.value = { status: 'success', message: 'Payment successful! Your booking is under approval.' }
    
    if (currentBooking.value?.id) {
      try {
        await updateBookingStatus(currentBooking.value.id, 2)
      } catch (err) {
        console.error('Failed to update booking status:', err)
      }
    }
    
    step.value = 4
  } else {
    paymentStatus.value = { status: 'failed', message: 'Mobile payment failed. Please try again.' }
    showPaymentModal.value = false
  }
  
  sslProcessing.value = false
}

// Process card payment
const processCardPayment = async () => {
  sslProcessing.value = true
  
  await new Promise(resolve => setTimeout(resolve, 2500))
  
  const isSuccess = Math.random() > 0.1
  
  if (isSuccess) {
    showPaymentModal.value = false
    paymentStatus.value = { status: 'success', message: 'Payment successful! Your booking is under approval.' }
    
    if (currentBooking.value?.id) {
      try {
        await updateBookingStatus(currentBooking.value.id, 2)
      } catch (err) {
        console.error('Failed to update booking status:', err)
      }
    }
    
    step.value = 4
  } else {
    paymentStatus.value = { status: 'failed', message: 'Card payment failed. Please try again.' }
    showPaymentModal.value = false
  }
  
  sslProcessing.value = false
}

// Process net banking payment
const processNetBanking = async () => {
  if (!selectedBank.value) return
  
  sslProcessing.value = true
  
  await new Promise(resolve => setTimeout(resolve, 2500))
  
  const isSuccess = Math.random() > 0.1
  
  if (isSuccess) {
    showPaymentModal.value = false
    paymentStatus.value = { status: 'success', message: 'Payment successful! Your booking is under approval.' }
    
    if (currentBooking.value?.id) {
      try {
        await updateBookingStatus(currentBooking.value.id, 2)
      } catch (err) {
        console.error('Failed to update booking status:', err)
      }
    }
    
    step.value = 4
  } else {
    paymentStatus.value = { status: 'failed', message: 'Net banking payment failed. Please try again.' }
    showPaymentModal.value = false
  }
  
  sslProcessing.value = false
}

const resetBooking = () => {
  step.value = 2
  paymentStatus.value = null
  selectedPayment.value = ''
  showPaymentModal.value = false
  bookingData.value = {
    branch_id: selectedRoom.value?.branch_id || 1,
    room_id: selectedRoom.value?.id,
    seat_id: null,
    billing_type_id: 1,
    party_name: '',
    party_name_bn: '',
    mobile_number: '',
    phone_number: '',
    whats_app: '',
    email_number: '',
    house: '',
    street: '',
    union_id: '',
    upazila_id: '',
    district_id: '',
    division_id: '',
    fb: '',
    twiter: '',
    instagram: '',
    linked_in: '',
    youtube: '',
    check_in_date: '',
    check_out_date: '',
    billing_amount: selectedRoom.value?.room_price || 0,
    status: 2,
    notes: ''
  }
  formErrors.value = {}
}

const retryFetch = () => {
  fetchDivisions()
  fetchRooms()
}
</script>

<style scoped>
.animate-gradient-shift {
  background-size: 300% 300%;
  animation: gradientShift 4s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>