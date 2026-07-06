<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <main v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading payment history...</p>
      </div>
    </main>

    <!-- Error State -->
    <main v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md">
          <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
          <button @click="fetchAllData" class="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all">
            Try Again
          </button>
        </div>
      </div>
    </main>

    <!-- Main Content -->
    <main v-else>
      <Header />
      <div class="max-w-[1400px] mx-auto px-6 lg:px-12 py-32">
        <div class="mb-12">
          <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CreditCard class="w-5 h-5 text-teal-600" />
            <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">My Payments</span>
          </div>
          <h1 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600">My Payments</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">Track your payment history and manage upcoming bills</p>
        </div>

        <!-- Payment Stats -->
        <div v-if="allPayments.length > 0" class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
            <div class="text-2xl font-black text-teal-600">{{ allPayments.length }}</div>
            <div class="text-xs text-gray-500">Total Records</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
            <div class="text-2xl font-black text-blue-600">{{ bookingPayments.length }}</div>
            <div class="text-xs text-gray-500">Room Bookings</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
            <div class="text-2xl font-black text-purple-600">{{ serviceSubscriptions.length }}</div>
            <div class="text-xs text-gray-500">Extra Services</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
            <div class="text-2xl font-black text-yellow-600">{{ pendingPayments }}</div>
            <div class="text-xs text-gray-500">Pending</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
            <div class="text-2xl font-black text-teal-600">৳{{ totalPaid.toLocaleString() }}</div>
            <div class="text-xs text-gray-500">Total Paid</div>
          </div>
        </div>

        <!-- Tabs -->
        <div v-if="allPayments.length > 0" class="flex gap-2 mb-6">
          <button 
            @click="activeTab = 'all'"
            :class="['px-4 py-2 rounded-xl font-bold text-sm transition-all',
              activeTab === 'all' 
                ? 'bg-teal-600 text-white' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700']">
            All ({{ allPayments.length }})
          </button>
          <button 
            @click="activeTab = 'bookings'"
            :class="['px-4 py-2 rounded-xl font-bold text-sm transition-all',
              activeTab === 'bookings' 
                ? 'bg-teal-600 text-white' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700']">
            <Building2 class="w-4 h-4 inline mr-1" />
            Room Bookings ({{ bookingPayments.length }})
          </button>
          <button 
            @click="activeTab = 'services'"
            :class="['px-4 py-2 rounded-xl font-bold text-sm transition-all',
              activeTab === 'services' 
                ? 'bg-teal-600 text-white' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700']">
            <Sparkles class="w-4 h-4 inline mr-1" />
            Extra Services ({{ serviceSubscriptions.length }})
          </button>
        </div>

        <!-- Payment Cards Grid -->
        <div v-if="filteredPayments.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <!-- Booking Payment Cards -->
          <div v-for="payment in filteredPayments" :key="payment.uniqueKey" 
               class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
            
            <!-- Payment Header -->
            <div :class="['relative h-48 overflow-hidden', payment.type === 'service' ? 'bg-purple-600' : getStatusBgClass(payment.status)]">
              <div class="absolute inset-0 flex items-center justify-center">
                <component :is="payment.type === 'service' ? Sparkles : CreditCard" class="w-20 h-20 text-white/30" />
              </div>
              
              <!-- Status Badge -->
              <div class="absolute top-4 right-4">
                <span :class="['px-3 py-1 rounded-full text-xs font-bold shadow', 
                  payment.type === 'service' ? 'bg-purple-400 text-white' : getStatusClass(payment.status)]">
                  {{ payment.type === 'service' ? 'Subscribed' : formatStatus(payment.status) }}
                </span>
              </div>
              
              <!-- Transaction ID -->
              <div class="absolute bottom-4 left-4">
                <span class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/30">
                  {{ payment.type === 'service' ? 'SRV' : 'BOK' }}-{{ payment.type === 'service' ? payment.id.substring(0, 8) : payment.id }}
                </span>
              </div>
            </div>
            
            <div class="p-6">
              <!-- Service Subscription Card -->
              <template v-if="payment.type === 'service'">
                <div class="mb-3">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Sparkles class="w-4 h-4 text-purple-600" />
                    </div>
                    <h4 class="text-lg font-black text-purple-600">{{ payment.service_name }}</h4>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Receipt: {{ payment.id }}
                  </p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="px-2 py-0.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                      Extra Service
                    </span>
                    <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                      Monthly
                    </span>
                  </div>
                </div>
                
                <div class="space-y-2 mb-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">Service Price</span>
                    <span class="font-bold text-purple-600">৳{{ (payment.service_price || 0).toLocaleString() }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">Status</span>
                    <span class="font-bold text-green-600">Active</span>
                  </div>
                </div>
                
                <div class="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar class="w-3 h-3 text-purple-600" />
                    <span>Subscribed: {{ formatDate(payment.subscription_date) }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-xs text-gray-500">
                    <Home class="w-3 h-3 text-purple-600" />
                    <span>Room: {{ payment.room_number || 'N/A' }}</span>
                  </div>
                </div>
                
                <div class="mb-4 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    <span class="font-bold">Subscriber:</span> {{ payment.border_name || 'N/A' }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span class="font-bold">Contact:</span> {{ payment.border_phone || 'N/A' }}
                  </p>
                </div>
                
                <div class="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <CreditCard class="w-3 h-3" />
                  <span>Billing: Added to Monthly Bill</span>
                </div>
              </template>

              <!-- Booking Payment Card -->
              <template v-else>
                <div class="mb-3">
                  <h4 class="text-xl font-black text-teal-600">Room {{ payment.room?.room_number || 'N/A' }}</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Booking ID: #{{ payment.id }}
                  </p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="px-2 py-0.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs capitalize">
                      {{ payment.room?.room_type?.room_type_title || 'Standard' }}
                    </span>
                    <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                      Monthly
                    </span>
                  </div>
                </div>
                
                <div class="space-y-2 mb-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">Billing Amount</span>
                    <span class="font-bold text-teal-600">৳{{ (payment.billing_amount || 0).toLocaleString() }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">Paid Amount</span>
                    <span class="font-bold text-green-600">৳{{ (payment.billing_amount || 0).toLocaleString() }}</span>
                  </div>
                </div>
                
                <div class="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar class="w-3 h-3 text-teal-600" />
                    <span>Billing Date: {{ formatDate(payment.created_at) }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-xs text-gray-500">
                    <Clock class="w-3 h-3 text-teal-600" />
                    <span>Check-in: {{ formatDate(payment.check_in_date) }}</span>
                  </div>
                </div>
                
                <div class="mb-4 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    <span class="font-bold">Guest:</span> {{ payment.party?.party_name || 'N/A' }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span class="font-bold">Contact:</span> {{ payment.party?.contact?.mobile_number || 'N/A' }}
                  </p>
                </div>
                
                <div class="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <CreditCard class="w-3 h-3" />
                  <span>Payment Method: SSLCommerz</span>
                </div>
              </template>
              
              <!-- Actions -->
              <div class="flex gap-2">
                <button @click="openReceipt(payment)" 
                        class="flex-1 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-center border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm">
                  View Receipt
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredPayments.length === 0 && !loading" class="text-center py-20">
          <CreditCard class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
            {{ activeTab === 'services' ? 'No Service Subscriptions' : activeTab === 'bookings' ? 'No Booking Payments' : 'No Payment History' }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">
            {{ activeTab === 'services' ? 'Your extra service subscriptions will appear here.' : activeTab === 'bookings' ? 'Your booking payment records will appear here once you make a booking.' : 'Your payment records will appear here once you make a booking or subscribe to services.' }}
          </p>
          <router-link to="/rooms" class="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
            <Building2 class="w-5 h-5" />
            Browse Rooms
          </router-link>
        </div>
      </div>

      <!-- Receipt Modal -->
      <div v-if="showReceipt && selectedPayment" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          <!-- Modal Header -->
          <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h3 class="text-lg font-black" :class="selectedPayment.type === 'service' ? 'text-purple-600' : 'text-teal-600'">
              {{ selectedPayment.type === 'service' ? 'Service Subscription Receipt' : 'Payment Receipt' }}
            </h3>
            <button @click="closeReceipt" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <!-- Receipt Content -->
          <div class="overflow-y-auto flex-1 p-4">
            <div id="receipt-content">
              
              <!-- Service Subscription Receipt -->
              <div v-if="selectedPayment.type === 'service'" class="receipt-container mx-auto" style="width: 100%; max-width: 480px; border: 2px solid #7c3aed; padding: 20px; background: white;">
                <!-- Receipt Header with Logo -->
                <div class="flex items-center justify-between mb-3 pb-3 border-b-2 border-purple-600">
                  <div class="flex items-center gap-2">
                    <img 
                      :src="logoUrl || defaultLogo" 
                      alt="City Hostel Logo" 
                      class="h-12 w-auto object-contain"
                      @error="(e) => { e.target.style.display = 'none'; logoLoaded = false; }"
                    />
                    <div v-if="!logoUrl" class="flex items-center gap-2">
                      <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Sparkles class="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p class="text-sm font-black text-purple-600">City Hostel</p>
                        <p class="text-2xs text-gray-500">Service Subscription</p>
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-2xs font-bold text-gray-500 uppercase">Receipt #</p>
                    <p class="text-xs font-black text-purple-600">{{ selectedPayment.id }}</p>
                  </div>
                </div>

                <!-- Subscriber & Subscription Details -->
                <div class="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p class="text-2xs font-bold text-gray-500 uppercase mb-0.5">Subscriber</p>
                    <p class="text-xs font-bold text-gray-800">{{ selectedPayment.border_name }}</p>
                    <p class="text-2xs text-gray-600">{{ selectedPayment.border_email }}</p>
                    <p class="text-2xs text-gray-600">{{ selectedPayment.border_phone }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-2xs font-bold text-gray-500 uppercase mb-0.5">Subscription Details</p>
                    <p class="text-2xs text-gray-600">Date: <span class="font-bold text-gray-800">{{ formatDate(selectedPayment.subscription_date) }}</span></p>
                    <p class="text-2xs text-gray-600">Status: <span class="font-bold text-green-600">Active</span></p>
                    <p class="text-2xs text-gray-600">Room: <span class="font-bold text-gray-800">{{ selectedPayment.room_number }}</span></p>
                  </div>
                </div>

                <!-- Service Information -->
                <div class="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p class="text-2xs font-bold text-purple-600 uppercase mb-1">Service Information</p>
                  <div class="flex items-center gap-2">
                    <div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 class="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p class="text-xs font-bold text-gray-800">{{ selectedPayment.service_name }}</p>
                      <p v-if="selectedPayment.service_description" class="text-2xs text-gray-600 mt-0.5">{{ selectedPayment.service_description }}</p>
                    </div>
                  </div>
                </div>

                <!-- Pricing Table -->
                <div class="mb-3">
                  <table class="w-full text-2xs">
                    <thead>
                      <tr class="border-b-2 border-purple-600">
                        <th class="text-left py-1.5 font-bold text-gray-500 uppercase">Description</th>
                        <th class="text-right py-1.5 font-bold text-gray-500 uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="border-b border-gray-200">
                        <td class="py-1.5">
                          <p class="font-bold text-gray-800 text-xs">{{ selectedPayment.service_name }}</p>
                          <p class="text-gray-500 text-2xs">Monthly Subscription</p>
                          <p class="text-gray-500 text-2xs">Room: {{ selectedPayment.room_number }} ({{ selectedPayment.room_type }})</p>
                        </td>
                        <td class="text-right py-1.5">
                          <p class="font-black text-purple-600 text-sm">৳{{ (selectedPayment.service_price || 0).toLocaleString() }}</p>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr class="border-t-2 border-purple-600">
                        <td class="py-1.5 font-black text-gray-800 text-xs">Total Amount (Monthly)</td>
                        <td class="text-right py-1.5 font-black text-purple-600 text-sm">৳{{ (selectedPayment.service_price || 0).toLocaleString() }}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <!-- Billing Cycle -->
                <div class="mb-3 p-2 bg-gray-50 rounded-lg">
                  <p class="text-2xs text-gray-600">
                    <span class="font-bold">Billing Cycle:</span> Monthly
                  </p>
                  <p class="text-2xs text-gray-600 mt-0.5">
                    <span class="font-bold">Next Billing:</span> {{ getNextBillingDate(selectedPayment.subscription_date) }}
                  </p>
                  <p class="text-2xs text-gray-600 mt-0.5">
                    <span class="font-bold">Payment Method:</span> Added to Monthly Bill
                  </p>
                </div>

                <!-- Signature Area -->
                <div class="flex justify-between items-end mt-3 pt-2 border-t border-gray-200">
                  <div class="text-2xs text-gray-500">
                    <p class="mb-0.5"><span class="font-bold">Subscribed:</span> {{ formatDate(selectedPayment.subscription_date) }}</p>
                    <p><span class="font-bold">Receipt:</span> {{ selectedPayment.id }}</p>
                  </div>
                  <div class="text-center">
                    <svg class="w-20 h-10 mx-auto mb-0.5" viewBox="0 0 200 60">
                      <path d="M20 40 Q 60 20, 100 40 T 180 30" stroke="#7c3aed" stroke-width="2" fill="none" />
                      <text x="100" y="55" text-anchor="middle" fill="#7c3aed" font-size="10" font-weight="bold">Authorized Signature</text>
                    </svg>
                    <div class="w-20 border-t-2 border-purple-600 mx-auto"></div>
                    <p class="text-2xs font-bold text-purple-600 mt-0.5">City Hostel Management</p>
                  </div>
                </div>

                <!-- Footer -->
                <div class="text-center mt-3 pt-2 border-t border-gray-200">
                  <p class="text-2xs text-gray-500">Thank you for subscribing!</p>
                  <p class="text-2xs text-gray-400 mt-0.5">City Hostel • 123 Akhalia Road, Sylhet • +880 1711-123456</p>
                  <p class="text-2xs text-gray-400 mt-0.5">This is a computer-generated receipt</p>
                </div>
              </div>

              <!-- Booking Payment Receipt -->
              <div v-else class="receipt-container mx-auto" style="width: 100%; max-width: 480px; border: 2px solid #0d9488; padding: 20px; background: white;">
                <!-- Receipt Header with Logo -->
                <div class="flex items-center justify-between mb-2 pb-2 border-b-2 border-teal-600">
                  <div class="flex items-center gap-2">
                    <img 
                      :src="logoUrl || defaultLogo" 
                      alt="City Hostel Logo" 
                      class="h-12 w-auto object-contain"
                      @error="(e) => { e.target.style.display = 'none'; logoLoaded = false; }"
                    />
                    <div v-if="!logoUrl" class="flex items-center">
                      <span class="text-lg font-black text-teal-600">City Hostel</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-2xs font-bold text-gray-500">RECEIPT #</p>
                    <p class="text-sm font-black text-teal-600">BOK-{{ selectedPayment.id }}</p>
                  </div>
                </div>

                <!-- Bill To & Payment Details -->
                <div class="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p class="text-2xs font-bold text-gray-500 uppercase mb-0.5">Bill To</p>
                    <p class="text-xs font-bold text-gray-800">{{ selectedPayment.party?.party_name || 'N/A' }}</p>
                    <p class="text-2xs text-gray-600">{{ selectedPayment.party?.contact?.email_number || 'N/A' }}</p>
                    <p class="text-2xs text-gray-600">{{ selectedPayment.party?.contact?.mobile_number || 'N/A' }}</p>
                    <p class="text-2xs text-gray-600 mt-1">Room {{ selectedPayment.room?.room_number || 'N/A' }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-2xs font-bold text-gray-500 uppercase mb-0.5">Payment Details</p>
                    <p class="text-2xs text-gray-600">Date: <span class="font-bold text-gray-800">{{ formatDate(selectedPayment.created_at) }}</span></p>
                    <p class="text-2xs text-gray-600">Method: <span class="font-bold text-gray-800">SSLCommerz</span></p>
                    <p class="text-2xs text-gray-600">Gateway: <span class="font-bold text-gray-800">Online Payment</span></p>
                    <p class="text-2xs text-gray-600">Status: 
                      <span :class="['font-bold', getStatusTextClass(selectedPayment.status)]">
                        {{ formatStatus(selectedPayment.status) }}
                      </span>
                    </p>
                  </div>
                </div>

                <!-- Booking Details -->
                <div class="mb-3 p-2 bg-gray-50 rounded-lg">
                  <p class="text-2xs font-bold text-gray-500 uppercase mb-1">Booking Details</p>
                  <p class="text-2xs text-gray-600">Check-in: {{ formatDate(selectedPayment.check_in_date) }}</p>
                  <p class="text-2xs text-gray-600">Check-out: {{ formatDate(selectedPayment.check_out_date) }}</p>
                  <p class="text-2xs text-gray-600">Room Type: {{ selectedPayment.room?.room_type?.room_type_title || 'Standard' }}</p>
                </div>

                <!-- Pricing Table -->
                <div class="mb-3">
                  <table class="w-full text-2xs">
                    <thead>
                      <tr class="border-b-2 border-teal-600">
                        <th class="text-left py-1.5 font-bold text-gray-500 uppercase">Description</th>
                        <th class="text-right py-1.5 font-bold text-gray-500 uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="border-b border-gray-200">
                        <td class="py-1.5">
                          <p class="font-bold text-gray-800 text-xs">Room {{ selectedPayment.room?.room_number || 'N/A' }} - Monthly Rent</p>
                          <p class="text-gray-500 text-2xs">Booking ID: #{{ selectedPayment.id }}</p>
                        </td>
                        <td class="text-right py-1.5">
                          <p class="font-black text-teal-600 text-sm">৳{{ (selectedPayment.billing_amount || 0).toLocaleString() }}</p>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr class="border-t-2 border-teal-600">
                        <td class="py-1.5 font-black text-gray-800 text-xs">Total Amount</td>
                        <td class="text-right py-1.5 font-black text-teal-600 text-sm">৳{{ (selectedPayment.billing_amount || 0).toLocaleString() }}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <!-- Signature Area -->
                <div class="flex justify-between items-end mt-3 pt-2 border-t border-gray-200">
                  <div class="text-2xs text-gray-500">
                    <p class="mb-0.5"><span class="font-bold">Paid:</span> {{ formatDate(selectedPayment.created_at) }}</p>
                    <p><span class="font-bold">Type:</span> Monthly Rental</p>
                  </div>
                  <div class="text-center">
                    <svg class="w-20 h-10 mx-auto mb-0.5" viewBox="0 0 200 60">
                      <path d="M20 40 Q 60 20, 100 40 T 180 30" stroke="#0d9488" stroke-width="2" fill="none" />
                      <text x="100" y="55" text-anchor="middle" fill="#0d9488" font-size="10" font-weight="bold">Authorized Signature</text>
                    </svg>
                    <div class="w-20 border-t-2 border-teal-600 mx-auto"></div>
                    <p class="text-2xs font-bold text-teal-600 mt-0.5">City Hostel Management</p>
                  </div>
                </div>

                <!-- Footer -->
                <div class="text-center mt-2 pt-2 border-t border-gray-200">
                  <p class="text-2xs text-gray-500">Thank you for your payment!</p>
                  <p class="text-2xs text-gray-400 mt-0.5">City Hostel • 123 Akhalia Road, Sylhet • +880 1711-123456</p>
                  <p class="text-2xs text-gray-400 mt-0.5">This is a computer-generated receipt</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <button @click="closeReceipt" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl font-bold text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Close
            </button>
            <button @click="printReceipt" class="px-4 py-2 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-colors flex items-center gap-1.5">
              <Printer class="w-4 h-4" />
              Print Receipt
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { useRouter } from 'vue-router'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { useBookings } from '../composables/useBookings'
import defaultLogo from '@/assets/logo/logo.png'
import { usePages } from '../composables/usePages'
import { CreditCard, X, Printer, Building2, Calendar, Clock, Sparkles, Home, CheckCircle2 } from 'lucide-vue-next'

useHead({
  title: 'My Payments - City Hostel | Payment History',
  meta: [
    { name: 'description', content: 'Track your payment history and manage bills for your City Hostel student accommodation in Sylhet, Bangladesh.' },
    { name: 'keywords', content: 'payment history, my payments, City Hostel payments, student accommodation bills' },
    { property: 'og:title', content: 'My Payments - City Hostel' },
    { property: 'og:description', content: 'View your payment history and manage bills at City Hostel.' },
    { property: 'og:type', content: 'website' },
    { name: 'robots', content: 'noindex, nofollow' },
  ]
})

const router = useRouter()
const { bookings, fetchAllBookings, loading: bookingsLoading, error: bookingsError } = useBookings()

const bookingPayments = ref([])
const serviceSubscriptions = ref([])
const loading = ref(true)
const error = ref('')
const selectedPayment = ref(null)
const showReceipt = ref(false)
const logoLoaded = ref(true)
const logoUrl = ref('')
const API_BASE_URL = 'https://dev.hostel.accounting.itlab.solutions'
const activeTab = ref('all')

const getFullImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  return `${API_BASE_URL}/storage/${cleanPath}`
}

const loadLogo = async () => {
  try {
    const { fetchHeaderLogo } = usePages()
    const headerSection = await fetchHeaderLogo(1)
    if (headerSection?.items?.length > 0) {
      const activeItem = headerSection.items.find(item => item.status == 1)
      if (activeItem?.image) {
        logoUrl.value = getFullImageUrl(activeItem.image)
        console.log('Logo loaded successfully:', logoUrl.value)
      }
    }
  } catch (error) {
    console.error('Error loading logo:', error)
    // Fallback to default logo is handled in template
  }
}

// Combine all payments
const allPayments = computed(() => {
  const combined = []
  
  // Add booking payments
  bookingPayments.value.forEach(payment => {
    combined.push({
      ...payment,
      type: 'booking',
      uniqueKey: `booking-${payment.id}`
    })
  })
  
  // Add service subscriptions
  serviceSubscriptions.value.forEach(subscription => {
    combined.push({
      ...subscription,
      type: 'service',
      uniqueKey: `service-${subscription.id}`
    })
  })
  
  // Sort by date (newest first)
  combined.sort((a, b) => {
    const dateA = new Date(a.type === 'service' ? a.subscription_date : a.created_at)
    const dateB = new Date(b.type === 'service' ? b.subscription_date : b.created_at)
    return dateB - dateA
  })
  
  return combined
})

// Filtered payments based on active tab
const filteredPayments = computed(() => {
  if (activeTab.value === 'bookings') {
    return bookingPayments.value.map(p => ({ ...p, type: 'booking', uniqueKey: `booking-${p.id}` }))
  }
  if (activeTab.value === 'services') {
    return serviceSubscriptions.value.map(s => ({ ...s, type: 'service', uniqueKey: `service-${s.id}` }))
  }
  return allPayments.value
})

// Computed stats
const pendingPayments = computed(() => 
  bookingPayments.value.filter(p => p.status === 0).length
)

const totalPaid = computed(() => {
  const bookingTotal = bookingPayments.value
    .filter(p => p.status === 1)
    .reduce((sum, p) => sum + (p.billing_amount || 0), 0)
  
  const serviceTotal = serviceSubscriptions.value
    .reduce((sum, s) => sum + (s.service_price || 0), 0)
  
  return bookingTotal + serviceTotal
})

// Load service subscriptions from localStorage
const loadServiceSubscriptions = () => {
  try {
    // Get current user data
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    const userId = userData.id || userData.user_id || userData.border_id || 'anonymous'
    const userEmail = userData.email || ''
    
    // Use the SAME user-specific key pattern as RoomDetailsPage
    const storageKey = `serviceReceipts_${userId}`
    const receipts = JSON.parse(localStorage.getItem(storageKey) || '[]')
    
    // Also check the old non-user-specific key for backward compatibility
    const oldReceipts = JSON.parse(localStorage.getItem('serviceReceipts') || '[]')
    
    // Merge receipts (user-specific takes priority)
    const allReceipts = [...receipts]
    
    // Add old receipts that belong to this user
    oldReceipts.forEach(oldReceipt => {
      const isDuplicate = allReceipts.some(r => r.id === oldReceipt.id)
      const belongsToUser = 
        (oldReceipt.border_email === userEmail) || 
        (oldReceipt.border_id == userId) ||
        (oldReceipt.user_id == userId)
      
      if (!isDuplicate && belongsToUser) {
        allReceipts.push(oldReceipt)
      }
    })
    
    // Filter receipts for current user (safety check)
    serviceSubscriptions.value = allReceipts.filter(receipt => {
      return receipt.border_email === userEmail || 
             receipt.border_id == userId ||
             receipt.user_id == userId
    })
    
    console.log('Loaded service subscriptions:', serviceSubscriptions.value)
    console.log('Storage key used:', storageKey)
    console.log('User ID:', userId, 'Email:', userEmail)
  } catch (e) {
    console.error('Error loading service subscriptions:', e)
    serviceSubscriptions.value = []
  }
}

// Add this function to migrate old receipts to the new user-specific format
const migrateOldReceipts = () => {
  try {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    const userId = userData.id || userData.user_id || userData.border_id || 'anonymous'
    const userEmail = userData.email || ''
    
    const oldReceipts = JSON.parse(localStorage.getItem('serviceReceipts') || '[]')
    
    if (oldReceipts.length > 0) {
      const storageKey = `serviceReceipts_${userId}`
      const existingReceipts = JSON.parse(localStorage.getItem(storageKey) || '[]')
      
      // Find receipts that belong to this user but aren't in the new storage
      const userReceipts = oldReceipts.filter(receipt => {
        const belongsToUser = 
          receipt.border_email === userEmail || 
          receipt.border_id == userId ||
          receipt.user_id == userId
        const notDuplicated = !existingReceipts.some(r => r.id === receipt.id)
        return belongsToUser && notDuplicated
      })
      
      if (userReceipts.length > 0) {
        // Merge and save to user-specific key
        const merged = [...existingReceipts, ...userReceipts]
        localStorage.setItem(storageKey, JSON.stringify(merged))
        
        // Remove migrated receipts from old key
        const remainingOld = oldReceipts.filter(receipt => {
          return !userReceipts.some(r => r.id === receipt.id)
        })
        localStorage.setItem('serviceReceipts', JSON.stringify(remainingOld))
        
        console.log(`Migrated ${userReceipts.length} receipts to ${storageKey}`)
      }
    }
  } catch (e) {
    console.error('Error migrating receipts:', e)
  }
}

// Fetch booking payments from API
async function fetchBookingPayments() {
  try {
    await fetchAllBookings()
    
    console.log('All bookings for payments:', bookings.value)
    
    const storedUser = localStorage.getItem('user')
    let currentUserEmail = ''
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        currentUserEmail = user.email
        console.log('Current user email:', currentUserEmail)
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
    
    let allBookingsArray = []
    if (bookings.value && Array.isArray(bookings.value)) {
      allBookingsArray = bookings.value
    } else if (bookings.value && bookings.value.data && Array.isArray(bookings.value.data)) {
      allBookingsArray = bookings.value.data
    }
    
    console.log('All bookings array:', allBookingsArray)
    
    if (currentUserEmail && allBookingsArray.length > 0) {
      bookingPayments.value = allBookingsArray.filter(b => {
        return b.party?.contact?.email_number === currentUserEmail
      })
      console.log('Filtered payments for user:', bookingPayments.value)
    } else {
      bookingPayments.value = allBookingsArray
      console.log('Showing all payments:', bookingPayments.value)
    }
    
    bookingPayments.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    
  } catch (err) {
    console.error('Error fetching booking payments:', err)
    throw err
  }
}

// Fetch all data
async function fetchAllData() {
  loading.value = true
  error.value = ''
  
  try {
    await fetchBookingPayments()
    loadServiceSubscriptions()
  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = bookingsError.value || 'Failed to load payments. Please check your connection and try again.'
  } finally {
    loading.value = false
  }
}

const openReceipt = (payment) => {
  selectedPayment.value = payment
  showReceipt.value = true
}

const closeReceipt = () => {
  showReceipt.value = false
  selectedPayment.value = null
}

const printReceipt = () => {
  const receiptContent = document.getElementById('receipt-content')
  if (!receiptContent) return
  
  const printWindow = window.open('', '_blank', 'width=1000,height=800')

  const clonedReceipt = receiptContent.cloneNode(true)
  const receiptContainer = clonedReceipt.querySelector('.receipt-container')

  if (receiptContainer) {
    receiptContainer.removeAttribute('style')
    receiptContainer.style.cssText = 'width: 100%; max-width: 800px; border: 3px solid #0d9488; padding: 32px; background: white; margin: 0 auto;'
  }

  const printContent = clonedReceipt.innerHTML
    .replace(/text-2xs/g, 'text-sm')
    .replace(/text-xs/g, 'text-base')
    .replace(/text-sm/g, 'text-lg')

  const printHTML = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '<title>Receipt - City Hostel</title>',
    '<script src="https://cdn.tailwindcss.com"><' + '/script>',
    '<style>',
    '@media print {',
    '  body { margin: 0; padding: 20px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }',
    '  .receipt-container { page-break-inside: avoid; }',
    '  @page { size: A4; margin: 15mm; }',
    '}',
    'body { display: flex; justify-content: center; min-height: 100vh; background: #f9fafb; font-family: system-ui, -apple-system, sans-serif; }',
    '.receipt-container { box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1); }',
    '</style>',
    '</head>',
    '<body>',
    '<div style="width: 100%; max-width: 800px; margin: 20px auto; background: white; padding: 20px;">',
    printContent,
    '</div>',
    '<script>',
    'window.onload = function() { setTimeout(function() { window.print(); }, 500); }',
    '<' + '/script>',
    '</body>',
    '</html>'
  ].join('\n')

  printWindow.document.write(printHTML)
  printWindow.document.close()
}

const getNextBillingDate = (subscriptionDate) => {
  if (!subscriptionDate) return 'N/A'
  const date = new Date(subscriptionDate)
  date.setMonth(date.getMonth() + 1)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

function getStatusBgClass(status) {
  const classes = {
    0: 'bg-yellow-500',
    1: 'bg-teal-600',
    2: 'bg-gray-500',
    3: 'bg-red-500'
  }
  return classes[status] || 'bg-teal-600'
}

function getStatusClass(status) {
  const classes = {
    0: 'bg-yellow-500 text-white',
    1: 'bg-green-500 text-white',
    2: 'bg-gray-500 text-white',
    3: 'bg-red-500 text-white'
  }
  return classes[status] || 'bg-gray-500 text-white'
}

function getStatusTextClass(status) {
  const classes = {
    0: 'text-yellow-600',
    1: 'text-green-600',
    2: 'text-gray-600',
    3: 'text-red-600'
  }
  return classes[status] || 'text-gray-600'
}

function formatStatus(status) {
  const labels = {
    0: 'Pending',
    1: 'Confirmed',
    2: 'Completed',
    3: 'Cancelled'
  }
  return labels[status] || 'Unknown'
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch (e) {
    return dateString.split(' ')[0]
  }
}

onMounted(() => {
  if (!localStorage.getItem('isAuthenticated')) {
    router.push('/login')
    return
  }
  loadLogo()
  migrateOldReceipts()
  fetchAllData()
})
</script>

<style scoped>
.text-2xs {
  font-size: 0.65rem;
  line-height: 1rem;
}
</style>