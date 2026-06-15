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
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-2">Your room has been reserved successfully.</p>
        <p class="text-gray-700 dark:text-gray-300 mb-4">
           A confirmation email has been sent to <span class="font-semibold text-gray-800 dark:text-gray-200">{{ bookingData.email_number }}</span>
        </p>

        <div v-if="currentBooking?.id" class="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow border border-gray-200 dark:border-gray-700">
          <p class="text-sm text-teal-600 mb-1">Booking ID</p>
          <p class="font-mono font-bold text-gray-800 dark:text-white text-lg">{{ currentBooking.id }}</p>
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
                      <button @click="paymentStatus = null" class="px-6 py-3 text-white rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition-all" style="background: #0d9488">
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
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg bg-teal-600">
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

                    <button @click="confirmPayment"
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
                        <CheckCircle2 class="w-6 h-6" />
                        Pay Now ৳{{ selectedRoom ? Math.round((selectedRoom.room_price || selectedRoom.price) * 2).toLocaleString() : '' }}
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
                  <!-- Add this after the check-out date fields -->
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

                <button type="submit" :disabled="submittingBooking" class="w-full group py-5 rounded-2xl font-bold text-white shadow hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed" style="background: #0d9488">
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
        <!-- Debug Section -->
        <div v-if="selectedRoom" class="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs overflow-auto">
          <details>
            <summary class="font-bold cursor-pointer">Debug: Booking Payload</summary>
            <pre class="mt-2">{{ JSON.stringify(bookingData, null, 2) }}</pre>
          </details>
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
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, X, CreditCard, Smartphone, Building2 } from 'lucide-vue-next'
import AnimatedSection from '../components/ui/AnimatedSection.vue'
import { useRooms } from '../composables/useRooms'
import { useBookings } from '../composables/useBookings'
import { useLocations } from '../composables/useLocations'
// Import roomAPI directly if needed, or use the composable method
import { roomAPI } from '../services/api'  // <-- ADD THIS IMPORT

const route = useRoute()
const router = useRouter()
const step = ref(2)

// Add a new state for available seats
const availableSeats = ref([])
const selectedSeatId = ref(null)

// Use composables
const { rooms, roomTypes, loading: roomsLoading, error: roomsError, fetchRooms, fetchRoomDetails, checkRoomAvailability } = useRooms()
const { createBooking, currentBooking, loading: bookingLoading, error: bookingError, updateBookingStatus } = useBookings()
const { divisions, districts, upazilas, unions, loading: locationLoading, fetchDivisions, fetchDistricts, fetchUpazilas, fetchUnions } = useLocations()

// Component state
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
  status: 2,
  notes: ''
})

const paymentMethods = [
  { id: 'sslcommerz', title: 'SSLCommerz', desc: 'Pay securely with SSLCOMMERZ gateway', icon: CreditCard },
  { id: 'credit-card', title: 'Credit/Debit Card', desc: 'Visa, MasterCard, American Express', icon: CreditCard },
  { id: 'mobile-banking', title: 'Mobile Banking', desc: 'bKash, Nagad, Rocket, Upay', icon: Smartphone },
  { id: 'net-banking', title: 'Net Banking', desc: 'All major banks supported', icon: Building2 }
]

// Fix: Use checkRoomAvailability from useRooms instead of direct roomAPI call
const fetchAvailableSeats = async (roomId) => {
  try {
    // Use the composable method instead of direct roomAPI
    const availability = await checkRoomAvailability(roomId)
    console.log('Availability response:', availability)
    
    let availData = availability
    if (availData && availData.data) availData = availData.data
    
    if (availData && availData.available_seats) {
      availableSeats.value = availData.available_seats
      // Auto-select the first available seat if any
      if (availableSeats.value.length > 0) {
        selectedSeatId.value = availableSeats.value[0].id
        bookingData.value.seat_id = selectedSeatId.value
      }
    } else if (availData && availData.data && availData.data.available_seats) {
      // Handle nested response structure
      availableSeats.value = availData.data.available_seats
      if (availableSeats.value.length > 0) {
        selectedSeatId.value = availableSeats.value[0].id
        bookingData.value.seat_id = selectedSeatId.value
      }
    }
  } catch (err) {
    console.error('Failed to fetch available seats:', err)
    // If there's an error, create a default seat option
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
      
      // Fetch available seats for this room
      await fetchAvailableSeats(roomId)
      
      console.log('Selected room:', {
        id: room.id,
        branch_id: room.branch_id,
        room_price: room.room_price,
        available_seats: availableSeats.value
      })
    } catch (error) {
      console.error('Failed to fetch room details:', error)
    }
  }

  // Check for payment status in URL
  const urlParams = new URLSearchParams(window.location.search)
  const paymentStatusParam = urlParams.get('status')
  const tranId = urlParams.get('tran_id')

  if (paymentStatusParam && tranId) {
    if (paymentStatusParam === 'success') {
      paymentStatus.value = { status: 'success', transactionId: tranId, message: 'Payment successful!' }
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
  
  // Make sure we have a seat selected
  if (!bookingData.value.seat_id) {
    formErrors.value.seat = 'Please select a seat'
    return
  }
  
  // Make sure we have the room_id and branch_id
  if (!bookingData.value.room_id) {
    formErrors.value.submit = 'Room information is missing. Please go back and select a room.'
    return
  }
  
  submittingBooking.value = true
  
  // Prepare booking data matching the exact format from your API spec
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
    status: parseInt(bookingData.value.status),
    notes: bookingData.value.notes || ""
  }
  
  console.log('Sending booking payload:', JSON.stringify(bookingPayload, null, 2))
  
  try {
    const booking = await createBooking(bookingPayload)
    if (booking) {
      step.value = 3
    }
  } catch (error) {
    console.error('Failed to create booking:', error)
    
    // Display detailed error message
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

const confirmPayment = async () => {
  if (!selectedPayment.value) return
  paymentStatus.value = null
  isProcessing.value = true

  try {
    // Here you would integrate with your actual payment gateway
    // For now, we'll simulate a successful payment
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update booking status after successful payment
    if (currentBooking.value?.id) {
      await updateBookingStatus(currentBooking.value.id, 1) // 1 might represent confirmed
    }
    
    paymentStatus.value = { status: 'success', message: 'Payment successful!' }
    step.value = 4
  } catch (error) {
    paymentStatus.value = { status: 'failed', message: 'Payment failed. Please try again.' }
    console.error('Payment failed:', error)
  } finally {
    isProcessing.value = false
  }
}

const resetBooking = () => {
  step.value = 2
  paymentStatus.value = null
  selectedPayment.value = ''
  bookingData.value = {
    branch_id: selectedRoom.value?.branch_id || 1,  // Use room's branch_id
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