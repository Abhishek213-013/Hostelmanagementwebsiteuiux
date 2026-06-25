<template>
  <!-- Step 4: Booking Confirmed -->
  <div v-if="step === 4" class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-20 px-6">
    <AnimatedSection>
      <div class="relative text-center max-w-lg">
        <div class="inline-block mb-8">
          <div class="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl bg-green-500">
            <CheckCircle2 class="w-16 h-16 text-white drop-shadow-lg" />
          </div>
        </div>
        <h1 class="text-5xl lg:text-6xl font-black mb-4 text-green-600">Booking Confirmed!</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-2">Your booking has been confirmed successfully.</p>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          A confirmation email will be sent to <span class="font-semibold text-gray-800 dark:text-gray-200">{{ bookingData.email_number }}</span>
        </p>

        <div v-if="currentBooking?.id" class="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow border border-gray-200 dark:border-gray-700">
          <p class="text-sm text-green-600 mb-1">Booking ID</p>
          <p class="font-mono font-bold text-gray-800 dark:text-white text-lg">{{ currentBooking.id }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Transaction ID: {{ paymentTransactionId }}</p>
          <div class="mt-4 flex items-center justify-center gap-2">
            <span class="inline-block w-3 h-3 rounded-full bg-green-500"></span>
            <span class="text-green-600 font-semibold">Status: Confirmed</span>
          </div>
        </div>

        <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 mb-8">
          <h3 class="text-lg font-bold text-green-800 dark:text-green-200 mb-2">What's Next?</h3>
          <ul class="text-sm text-green-700 dark:text-green-300 space-y-2 text-left">
            <li class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 flex-shrink-0" />
              Your booking has been confirmed
            </li>
            <li class="flex items-center gap-2">
              <Phone class="w-4 h-4 flex-shrink-0" />
              We'll contact you with move-in details
            </li>
            <li class="flex items-center gap-2">
              <Clock class="w-4 h-4 flex-shrink-0" />
              Check-in date: {{ bookingData.check_in_date }}
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
        <!-- Step 3: PayStation Payment -->
        <div v-if="step === 3 && selectedRoom">
          <AnimatedSection>
            <div class="relative">
              <div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div class="grid grid-cols-1 lg:grid-cols-2">
                  <div class="relative min-h-[500px] lg:min-h-0">
                    <img :src="selectedRoom.image || getRoomImage(selectedRoom.room_type?.name)" :alt="selectedRoom.title" class="w-full h-full object-cover" />
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

                    <!-- PayStation Payment Interface -->
                    <div v-if="!payStationStep || payStationStep === 'method'">
                      <h2 class="text-xl font-black mb-4 text-teal-600">PayStation Payment</h2>
                      
                      <!-- Booking Summary -->
                      <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                        <h4 class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Booking Summary</h4>
                        <div class="space-y-2 text-sm">
                          <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">Room</span>
                            <span class="font-semibold text-gray-800 dark:text-white">{{ selectedRoom.room_type?.name || selectedRoom.title }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">Transaction ID</span>
                            <span class="font-mono text-xs text-gray-800 dark:text-white">{{ paymentTransactionId || 'Will be generated' }}</span>
                          </div>
                          <div class="border-t pt-2 mt-2 flex justify-between">
                            <span class="font-bold text-gray-800 dark:text-white">Total Amount</span>
                            <span class="font-black text-lg text-teal-600">৳{{ Math.round((selectedRoom.room_price || selectedRoom.price) * 2).toLocaleString() }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Payment Method Selection -->
                      <div class="space-y-3 mb-6">
                        <h3 class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Payment Method</h3>
                        
                        <!-- bKash -->
                        <button @click="selectPaymentMethod('bkash')" 
                          :class="['w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3',
                            selectedMethod === 'bkash' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-pink-300']">
                          <div class="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center">
                            <span class="text-white font-black text-xs">bK</span>
                          </div>
                          <div class="text-left">
                            <p class="font-bold text-gray-800 dark:text-white">bKash</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Pay with bKash mobile wallet</p>
                          </div>
                        </button>

                        <!-- Nagad -->
                        <button @click="selectPaymentMethod('nagad')"
                          :class="['w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3',
                            selectedMethod === 'nagad' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-red-300']">
                          <div class="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                            <span class="text-white font-black text-xs">N</span>
                          </div>
                          <div class="text-left">
                            <p class="font-bold text-gray-800 dark:text-white">Nagad</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Pay with Nagad mobile wallet</p>
                          </div>
                        </button>

                        <!-- Rocket -->
                        <button @click="selectPaymentMethod('rocket')"
                          :class="['w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3',
                            selectedMethod === 'rocket' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-purple-300']">
                          <div class="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                            <span class="text-white font-black text-xs">R</span>
                          </div>
                          <div class="text-left">
                            <p class="font-bold text-gray-800 dark:text-white">Rocket</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Pay with Rocket mobile wallet</p>
                          </div>
                        </button>

                        <!-- Card Payment -->
                        <button @click="selectPaymentMethod('card')"
                          :class="['w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3',
                            selectedMethod === 'card' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-blue-300']">
                          <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                            <CreditCard class="w-5 h-5 text-white" />
                          </div>
                          <div class="text-left">
                            <p class="font-bold text-gray-800 dark:text-white">Credit/Debit Card</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Visa, MasterCard, Amex</p>
                          </div>
                        </button>
                      </div>

                      <button @click="proceedToPayment" :disabled="!selectedMethod"
                        :class="['w-full py-4 rounded-2xl font-bold text-white transition-all',
                          selectedMethod ? 'bg-teal-600 hover:bg-teal-700 hover:shadow-lg' : 'bg-gray-300 cursor-not-allowed']">
                        Proceed to Pay ৳{{ Math.round((selectedRoom.room_price || selectedRoom.price) * 2).toLocaleString() }}
                      </button>
                    </div>

                    <!-- bKash Payment Form -->
                    <div v-if="payStationStep === 'bkash-form'" class="space-y-4">
                      <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center">
                            <span class="text-white font-black text-xs">bK</span>
                          </div>
                          <h3 class="font-black text-gray-800 dark:text-white">bKash Payment</h3>
                        </div>
                        <button @click="payStationStep = 'method'" class="text-gray-400 hover:text-gray-600">
                          <X class="w-5 h-5" />
                        </button>
                      </div>

                      <div class="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-xl p-3 mb-4">
                        <p class="text-xs text-pink-700 dark:text-pink-300">
                          <strong>Sandbox Test:</strong> Use 01929918378 | PIN: 12121 | OTP: 123456
                        </p>
                      </div>

                      <form @submit.prevent="processPayment" class="space-y-4">
                        <div>
                          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">bKash Account Number</label>
                          <input type="tel" v-model="paymentForm.phone" placeholder="01XXXXXXXXX"
                            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-pink-500 focus:outline-none transition-all" />
                        </div>
                        <div>
                          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">PIN</label>
                          <input type="password" v-model="paymentForm.pin" maxlength="5" placeholder="*****"
                            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-pink-500 focus:outline-none transition-all" />
                        </div>
                        <button type="submit" :disabled="processingPayment"
                          class="w-full py-4 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-all disabled:opacity-50">
                          <template v-if="processingPayment">
                            <span class="flex items-center justify-center gap-2">
                              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                              </svg>
                              Processing...
                            </span>
                          </template>
                          <template v-else>
                            Pay ৳{{ Math.round((selectedRoom.room_price || selectedRoom.price) * 2).toLocaleString() }}
                          </template>
                        </button>
                      </form>
                    </div>

                    <!-- Card Payment Form -->
                    <div v-if="payStationStep === 'card-form'" class="space-y-4">
                      <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                            <CreditCard class="w-5 h-5 text-white" />
                          </div>
                          <h3 class="font-black text-gray-800 dark:text-white">Card Payment</h3>
                        </div>
                        <button @click="payStationStep = 'method'" class="text-gray-400 hover:text-gray-600">
                          <X class="w-5 h-5" />
                        </button>
                      </div>

                      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 mb-4">
                        <p class="text-xs text-blue-700 dark:text-blue-300">
                          <strong>Test Card:</strong> 4111 1111 1111 1111 | Exp: 12/25 | CVV: 123
                        </p>
                      </div>

                      <form @submit.prevent="processPayment" class="space-y-4">
                        <div>
                          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Card Number</label>
                          <input type="text" v-model="paymentForm.cardNumber" placeholder="4111 1111 1111 1111"
                            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none transition-all font-mono" />
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Expiry</label>
                            <input type="text" v-model="paymentForm.expiry" placeholder="MM/YY" maxlength="5"
                              class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none transition-all font-mono" />
                          </div>
                          <div>
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">CVV</label>
                            <input type="password" v-model="paymentForm.cvv" placeholder="123" maxlength="4"
                              class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none transition-all font-mono" />
                          </div>
                        </div>
                        <button type="submit" :disabled="processingPayment"
                          class="w-full py-4 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all disabled:opacity-50">
                          <template v-if="processingPayment">
                            <span class="flex items-center justify-center gap-2">
                              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                              </svg>
                              Processing...
                            </span>
                          </template>
                          <template v-else>
                            Pay ৳{{ Math.round((selectedRoom.room_price || selectedRoom.price) * 2).toLocaleString() }}
                          </template>
                        </button>
                      </form>
                    </div>

                    <!-- OTP Verification -->
                    <div v-if="payStationStep === 'otp'" class="space-y-4">
                      <div class="text-center mb-4">
                        <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-teal-100 flex items-center justify-center">
                          <Shield class="w-8 h-8 text-teal-600" />
                        </div>
                        <h3 class="font-black text-gray-800 dark:text-white">Verify OTP</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Enter the OTP sent to {{ paymentForm.phone }}</p>
                        <p class="text-xs text-amber-600 dark:text-amber-400 mt-2">Sandbox OTP: 123456</p>
                      </div>

                      <form @submit.prevent="verifyOTP" class="space-y-4">
                        <div>
                          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">OTP Code</label>
                          <input type="text" v-model="paymentForm.otp" maxlength="6" placeholder="123456"
                            class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-teal-500 focus:outline-none transition-all text-center text-2xl font-mono tracking-widest" />
                        </div>
                        <button type="submit" :disabled="processingPayment"
                          class="w-full py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all disabled:opacity-50">
                          <template v-if="processingPayment">
                            <span class="flex items-center justify-center gap-2">
                              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                              </svg>
                              Verifying...
                            </span>
                          </template>
                          <template v-else>
                            Verify & Pay
                          </template>
                        </button>
                        <button type="button" @click="goBackToPaymentForm"
                          class="w-full py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm">
                          Back to Payment
                        </button>
                      </form>
                    </div>

                    <!-- Payment Success -->
                    <div v-if="payStationStep === 'success'" class="text-center py-6">
                      <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 class="w-10 h-10 text-green-600" />
                      </div>
                      <h3 class="text-2xl font-black text-gray-800 dark:text-white mb-2">Payment Successful!</h3>
                      <p class="text-gray-600 dark:text-gray-400 mb-2">Transaction ID: {{ paymentTransactionId }}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Your booking has been confirmed</p>
                      <button @click="completePayment" class="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all">
                        View Booking Confirmation
                      </button>
                    </div>

                    <!-- Payment Failed -->
                    <div v-if="payStationStep === 'failed'" class="text-center py-6">
                      <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <X class="w-10 h-10 text-red-600" />
                      </div>
                      <h3 class="text-2xl font-black text-gray-800 dark:text-white mb-2">Payment Failed</h3>
                      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ paymentError }}</p>
                      <button @click="payStationStep = 'method'" class="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all">
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        <!-- Step 2: Booking Form -->
        <div v-else class="relative max-w-2xl mx-auto">
          <AnimatedSection>
            <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
              <h2 class="text-3xl font-black mb-6 text-teal-600">Booking Information</h2>

              <!-- Tab Navigation -->
              <div class="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
                <button v-for="(tab, i) in tabs" :key="i" @click="currentTab = i" type="button"
                  :class="['px-4 py-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap',
                    currentTab === i
                      ? 'border-teal-600 text-teal-600'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300']">
                  {{ tab }}
                </button>
              </div>

              <form @submit.prevent="confirmBooking">
                <!-- Tab 1: Booking Info -->
                <div v-show="currentTab === 0" class="space-y-5">
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-2">Check-in Date <span class="text-red-500">*</span></label>
                    <input type="date" v-model="bookingData.check_in_date"
                      :class="['w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 transition-all font-semibold text-gray-800 dark:text-gray-200',
                        formErrors.check_in_date ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500/20']" />
                    <p v-if="formErrors.check_in_date" class="text-red-500 text-sm mt-1">{{ formErrors.check_in_date }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-2">Select Seat <span class="text-red-500">*</span></label>
                    <select v-model="selectedSeatId" @change="bookingData.seat_id = selectedSeatId"
                      :class="['w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 transition-all font-semibold text-gray-800 dark:text-gray-200',
                        formErrors.seat ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500/20']">
                      <option value="">Select a seat</option>
                      <option v-for="seat in availableSeats" :key="seat.id" :value="seat.id">
                        Seat {{ seat.id }} - {{ seat.seat_description || 'Available' }}
                      </option>
                    </select>
                    <p v-if="availableSeats.length === 0 && selectedRoom" class="text-red-500 text-sm mt-1">
                      No seats available for this room
                    </p>
                    <p v-if="formErrors.seat" class="text-red-500 text-sm mt-1">{{ formErrors.seat }}</p>
                  </div>
                </div>

                <!-- Tab 2: Boarder Info -->
                <div v-show="currentTab === 1" class="space-y-5">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-bold text-teal-600 mb-2">Boarder Name <span class="text-red-500">*</span></label>
                      <input type="text" placeholder="Enter your full name" v-model="bookingData.party_name"
                        :class="['w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400',
                          formErrors.party_name ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500/20']" />
                      <p v-if="formErrors.party_name" class="text-red-500 text-sm mt-1">{{ formErrors.party_name }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-teal-600 mb-2">Boarder Name (Bangla)</label>
                      <input type="text" placeholder="আপনার নাম লিখুন" v-model="bookingData.party_name_bn"
                        class="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-bold text-teal-600 mb-2">Boarder Mobile Number <span class="text-red-500">*</span></label>
                      <input type="tel" placeholder="Enter mobile number" v-model="bookingData.mobile_number"
                        :class="['w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400',
                          formErrors.mobile_number ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500/20']" />
                      <p v-if="formErrors.mobile_number" class="text-red-500 text-sm mt-1">{{ formErrors.mobile_number }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-teal-600 mb-2">Boarder Whatsapp Number <span class="text-gray-400 text-xs">(Optional)</span></label>
                      <input type="tel" placeholder="WhatsApp number" v-model="bookingData.whats_app"
                        class="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-2">Boarder Email <span class="text-red-500">*</span></label>
                    <input type="email" placeholder="Enter email address" v-model="bookingData.email_number"
                      :class="['w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400',
                        formErrors.email_number ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500/20']" />
                    <p v-if="formErrors.email_number" class="text-red-500 text-sm mt-1">{{ formErrors.email_number }}</p>
                  </div>
                </div>

                <!-- Tab 3: Guardian Info & Address -->
                <div v-show="currentTab === 2" class="space-y-5">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-bold text-teal-600 mb-2">Guardian Phone Number <span class="text-red-500">*</span></label>
                      <input type="tel" placeholder="Enter guardian phone number" v-model="bookingData.phone_number"
                        :class="['w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400',
                          formErrors.phone_number ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500/20']" />
                      <p v-if="formErrors.phone_number" class="text-red-500 text-sm mt-1">{{ formErrors.phone_number }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-teal-600 mb-2">House</label>
                      <input type="text" placeholder="House number/name" v-model="bookingData.house"
                        class="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-bold text-teal-600 mb-2">Street</label>
                      <input type="text" placeholder="Street name" v-model="bookingData.street"
                        class="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-teal-600 mb-2">Division</label>
                      <select v-model="selectedDivisionId" @change="onDivisionChange"
                        class="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200">
                        <option value="">Select Division</option>
                        <option v-for="div in divisions" :key="div.id" :value="div.id">{{ div.name }}</option>
                      </select>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-bold text-teal-600 mb-2">District</label>
                      <select v-model="bookingData.district_id" @change="onDistrictChange"
                        class="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200">
                        <option value="">Select District</option>
                        <option v-for="dist in districts" :key="dist.id" :value="dist.id">{{ dist.name }}</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-teal-600 mb-2">Upazila</label>
                      <select v-model="bookingData.upazila_id" @change="onUpazilaChange"
                        class="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200">
                        <option value="">Select Upazila</option>
                        <option v-for="upa in upazilas" :key="upa.id" :value="upa.id">{{ upa.name }}</option>
                      </select>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-bold text-teal-600 mb-2">Union</label>
                      <select v-model="bookingData.union_id"
                        class="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200">
                        <option value="">Select Union</option>
                        <option v-for="uni in unions" :key="uni.id" :value="uni.id">{{ uni.name }}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Tab 4: Social Media Links -->
                <div v-show="currentTab === 3" class="space-y-5">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-bold text-teal-600 mb-2">Facebook</label>
                      <input type="url" placeholder="Facebook profile URL" v-model="bookingData.fb"
                        class="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-teal-600 mb-2">Twitter/X</label>
                      <input type="url" placeholder="Twitter/X profile URL" v-model="bookingData.twiter"
                        class="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-bold text-teal-600 mb-2">Instagram</label>
                      <input type="url" placeholder="Instagram profile URL" v-model="bookingData.instagram"
                        class="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-teal-600 mb-2">LinkedIn</label>
                      <input type="url" placeholder="LinkedIn profile URL" v-model="bookingData.linked_in"
                        class="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-2">YouTube</label>
                    <input type="url" placeholder="YouTube channel URL" v-model="bookingData.youtube"
                      class="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-2">Notes <span class="text-gray-400 text-xs">(Optional)</span></label>
                    <textarea placeholder="Any special requirements or preferences..." v-model="bookingData.notes"
                      class="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400 resize-none h-28"></textarea>
                  </div>
                  <!-- Terms & Conditions -->
                  <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <label class="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" v-model="termsAccepted"
                        class="mt-0.5 w-5 h-5 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-teal-600 focus:ring-teal-500 focus:ring-2 transition-all cursor-pointer" />
                      <span class="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                        I agree to the
                        <router-link to="/terms" class="text-teal-600 font-bold hover:underline">Terms & Conditions</router-link>
                        and
                        <router-link to="/privacy" class="text-teal-600 font-bold hover:underline">Privacy Policy</router-link>
                        <span class="text-red-500">*</span>
                      </span>
                    </label>
                    <p v-if="formErrors.terms" class="text-red-500 text-sm mt-1">{{ formErrors.terms }}</p>
                  </div>
                </div>

                <!-- Tab Navigation Buttons -->
                <div class="flex justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button type="button" @click="prevTab" v-if="currentTab > 0"
                    class="px-6 py-3 rounded-2xl font-bold text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 transition-all flex items-center gap-2">
                    <ChevronRight class="w-5 h-5 rotate-180" />
                    Previous
                  </button>
                  <div v-else></div>
                  <button type="button" v-if="currentTab < tabs.length - 1" @click="nextTab"
                    class="px-6 py-3 rounded-2xl font-bold text-white bg-teal-600 hover:bg-teal-700 transition-all flex items-center gap-2">
                    Next
                    <ChevronRight class="w-5 h-5" />
                  </button>
                  <button type="submit" v-else :disabled="submittingBooking"
                    class="px-8 py-3 rounded-2xl font-bold text-white bg-teal-600 hover:bg-teal-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <template v-if="submittingBooking">
                      <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </template>
                    <template v-else>
                      Continue to Payment
                      <ChevronRight class="w-5 h-5" />
                    </template>
                  </button>
                </div>
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
import { useHead } from '@vueuse/head'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, X, CreditCard, Clock, Phone, Shield } from 'lucide-vue-next'
import AnimatedSection from '../components/ui/AnimatedSection.vue'
import { useRooms } from '../composables/useRooms'
import { useBookings } from '../composables/useBookings'
import { useLocations } from '../composables/useLocations'

useHead({
  title: 'Book a Room - SylhetStay | Student Accommodation Booking',
  meta: [
    { name: 'description', content: 'Book your premium student accommodation at SylhetStay in Sylhet, Bangladesh. Easy online booking process with PayStation payment.' },
    { name: 'keywords', content: 'book room Sylhet, student accommodation booking, SylhetStay booking, reserve room, student housing' },
    { property: 'og:title', content: 'Book a Room - SylhetStay' },
    { property: 'og:description', content: 'Complete your booking for premium student accommodation in Sylhet. Secure payment via PayStation.' },
    { property: 'og:type', content: 'website' },
  ]
})

const route = useRoute()
const router = useRouter()
const step = ref(2)
const currentTab = ref(0)
const tabs = ['Booking Info', 'Boarder Info', 'Guardian Info & Address', 'Social Media Links']

// PayStation state
const payStationStep = ref(null) // null, 'method', 'bkash-form', 'card-form', 'otp', 'success', 'failed'
const selectedMethod = ref('')
const paymentTransactionId = ref('')
const processingPayment = ref(false)
const paymentError = ref('')
const paymentForm = ref({
  phone: '',
  pin: '',
  otp: '',
  cardNumber: '',
  expiry: '',
  cvv: ''
})

const availableSeats = ref([])
const selectedSeatId = ref(null)

const { rooms, roomTypes, loading: roomsLoading, error: roomsError, fetchRooms, fetchRoomDetails, checkRoomAvailability } = useRooms()
const { createBooking, currentBooking, loading: bookingLoading, error: bookingError } = useBookings()
const { divisions, districts, upazilas, unions, loading: locationLoading, fetchDivisions, fetchDistricts, fetchUpazilas, fetchUnions } = useLocations()

const submittingBooking = ref(false)
const formErrors = ref({})
const selectedDivisionId = ref('')
const selectedRoom = ref(null)
const termsAccepted = ref(false)

const autofillFromUserData = () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser)
      if (user.name) bookingData.value.party_name = user.name
      if (user.phone) bookingData.value.mobile_number = user.phone
      if (user.email) bookingData.value.email_number = user.email
    } catch (e) {
      console.error('Error parsing user data for autofill:', e)
    }
  }
}

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
  billing_amount: 0,
  status: 1, // Auto-approved
  notes: ''
})

const getRoomImage = (roomTypeName) => {
  const images = {
    'shared': 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    'semi-private': 'https://images.unsplash.com/photo-1771327811795-6197403af846?w=800',
    'premium': 'https://images.unsplash.com/photo-1663811397091-9a13493eff11?w=800',
    'standard': 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800'
  }
  return images[roomTypeName?.toLowerCase()] || images.standard
}

// Generate transaction ID
const generateTransactionId = () => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `PAY${timestamp}${random}`
}

// Payment method selection
const selectPaymentMethod = (method) => {
  selectedMethod.value = method
}

// Proceed to payment form
const proceedToPayment = () => {
  if (!selectedMethod.value) return
  
  // Generate transaction ID
  paymentTransactionId.value = generateTransactionId()
  
  // Show appropriate payment form
  if (selectedMethod.value === 'bkash' || selectedMethod.value === 'nagad' || selectedMethod.value === 'rocket') {
    payStationStep.value = 'bkash-form'
    // Pre-fill test credentials for sandbox
    paymentForm.value.phone = '01929918378'
    paymentForm.value.pin = '12121'
    paymentForm.value.otp = '123456'
  } else if (selectedMethod.value === 'card') {
    payStationStep.value = 'card-form'
    // Pre-fill test card details
    paymentForm.value.cardNumber = '4111 1111 1111 1111'
    paymentForm.value.expiry = '12/25'
    paymentForm.value.cvv = '123'
  }
}

// Go back to payment form from OTP
const goBackToPaymentForm = () => {
  if (selectedMethod.value === 'card') {
    payStationStep.value = 'card-form'
  } else {
    payStationStep.value = 'bkash-form'
  }
}

// Process payment (validate PIN or card)
const processPayment = () => {
  processingPayment.value = true
  
  // Simulate API call delay
  setTimeout(() => {
    if (selectedMethod.value === 'card') {
      // Validate test card
      if (paymentForm.value.cardNumber.replace(/\s/g, '') === '4111111111111111' && 
          paymentForm.value.expiry === '12/25' && 
          paymentForm.value.cvv === '123') {
        // For card payments, go directly to success
        payStationStep.value = 'success'
      } else {
        paymentError.value = 'Invalid card details. Please use test card: 4111 1111 1111 1111'
        payStationStep.value = 'failed'
      }
    } else {
      // Validate mobile banking test credentials
      if (paymentForm.value.phone === '01929918378' && paymentForm.value.pin === '12121') {
        payStationStep.value = 'otp'
      } else {
        paymentError.value = 'Invalid phone number or PIN. Please use: 01929918378 / 12121'
        payStationStep.value = 'failed'
      }
    }
    processingPayment.value = false
  }, 1500)
}

// Verify OTP
const verifyOTP = () => {
  processingPayment.value = true
  
  // Simulate OTP verification
  setTimeout(() => {
    if (paymentForm.value.otp === '123456') {
      payStationStep.value = 'success'
    } else {
      paymentError.value = 'Invalid OTP. Please use: 123456'
      payStationStep.value = 'failed'
    }
    processingPayment.value = false
  }, 1500)
}

// Complete payment - go to confirmation page
const completePayment = () => {
  // No API call needed - booking already created with approved status
  step.value = 4
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

  autofillFromUserData()
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

const validateCurrentTab = () => {
  const errors = {}
  if (currentTab.value === 0) {
    if (!bookingData.value.check_in_date) errors.check_in_date = 'Check-in date is required'
    if (!selectedSeatId.value) errors.seat = 'Please select a seat'
  } else if (currentTab.value === 1) {
    if (!bookingData.value.party_name.trim()) errors.party_name = 'Boarder name is required'
    if (!bookingData.value.mobile_number.trim()) errors.mobile_number = 'Mobile number is required'
    if (!bookingData.value.email_number.trim()) errors.email_number = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(bookingData.value.email_number)) errors.email_number = 'Email is invalid'
  } else if (currentTab.value === 2) {
    if (!bookingData.value.phone_number.trim()) errors.phone_number = 'Guardian phone number is required'
  }
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const validateAllTabs = () => {
  const errors = {}
  if (!bookingData.value.check_in_date) errors.check_in_date = 'Check-in date is required'
  if (!selectedSeatId.value) errors.seat = 'Please select a seat'
  if (!bookingData.value.party_name.trim()) errors.party_name = 'Boarder name is required'
  if (!bookingData.value.mobile_number.trim()) errors.mobile_number = 'Mobile number is required'
  if (!bookingData.value.email_number.trim()) errors.email_number = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(bookingData.value.email_number)) errors.email_number = 'Email is invalid'
  if (!bookingData.value.phone_number.trim()) errors.phone_number = 'Guardian phone number is required'
  if (!termsAccepted.value) errors.terms = 'You must agree to the terms & conditions'
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const nextTab = () => {
  if (validateCurrentTab()) {
    currentTab.value++
  }
}

const prevTab = () => {
  currentTab.value--
}

const confirmBooking = async () => {
  if (!validateAllTabs()) return
  
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
    billing_amount: parseFloat(bookingData.value.billing_amount),
    status: 1, // Auto-approved status
    notes: bookingData.value.notes || ""
  }
  
  try {
    const booking = await createBooking(bookingPayload)
    if (booking) {
      step.value = 3
      payStationStep.value = 'method'
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

const resetBooking = () => {
  step.value = 2
  payStationStep.value = null
  selectedMethod.value = ''
  paymentTransactionId.value = ''
  paymentForm.value = { phone: '', pin: '', otp: '', cardNumber: '', expiry: '', cvv: '' }
  
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
    billing_amount: selectedRoom.value?.room_price || 0,
    status: 1,
    notes: ''
  }
  termsAccepted.value = false
  formErrors.value = {}
  autofillFromUserData()
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