<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading payment history...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md">
          <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
          <button @click="fetchPayments" class="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all">
            Try Again
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
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
        <div v-if="myPayments.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
            <div class="text-2xl font-black text-teal-600">{{ myPayments.length }}</div>
            <div class="text-xs text-gray-500">Total Payments</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 text-center">
            <div class="text-2xl font-black text-green-600">{{ completedPayments }}</div>
            <div class="text-xs text-gray-500">Completed</div>
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

        <!-- Payment Cards -->
        <div v-if="myPayments.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="payment in myPayments" :key="payment.id" 
               class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
            <!-- Payment Header -->
            <div :class="['relative h-48 overflow-hidden', getStatusBgClass(payment.status)]">
              <div class="absolute inset-0 flex items-center justify-center">
                <CreditCard class="w-20 h-20 text-white/30" />
              </div>
              
              <!-- Status Badge -->
              <div class="absolute top-4 right-4">
                <span :class="['px-3 py-1 rounded-full text-xs font-bold shadow', getStatusClass(payment.status)]">
                  {{ formatStatus(payment.status) }}
                </span>
              </div>
              
              <!-- Transaction ID -->
              <div class="absolute bottom-4 left-4">
                <span class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/30">
                  Ref: BOK-{{ payment.id }}
                </span>
              </div>
            </div>
            
            <div class="p-6">
              <!-- Room & Booking -->
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
              
              <!-- Payment Info -->
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
              
              <!-- Payment Dates -->
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
              
              <!-- Guest Info -->
              <div class="mb-4 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  <span class="font-bold">Guest:</span> {{ payment.party?.party_name || 'N/A' }}
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <span class="font-bold">Contact:</span> {{ payment.party?.contact?.mobile_number || 'N/A' }}
                </p>
              </div>
              
              <!-- Payment Method -->
              <div class="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <CreditCard class="w-3 h-3" />
                <span>Payment Method: SSLCommerz</span>
              </div>
              
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
        <div v-if="myPayments.length === 0 && !loading" class="text-center py-20">
          <CreditCard class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No Payment History</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">Your payment records will appear here once you make a booking</p>
          <router-link to="/rooms" class="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
            <Building2 class="w-5 h-5" />
            Browse Rooms
          </router-link>
        </div>
      </div>

      <!-- Receipt Modal -->
      <div v-if="showReceipt && selectedPayment" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          <!-- Modal Header -->
          <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h3 class="text-lg font-black text-teal-600">Payment Receipt</h3>
            <button @click="closeReceipt" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <!-- Receipt Content -->
          <div class="overflow-y-auto flex-1 p-4">
            <div id="receipt-content">
              <div class="receipt-container mx-auto" style="width: 100%; max-width: 420px; aspect-ratio: 2/1; border: 2px solid #0d9488; padding: 16px; background: white;">
                <!-- Receipt Header -->
                <div class="flex items-center justify-between mb-2 pb-2 border-b-2 border-teal-600">
                  <div class="flex items-center gap-2">
                    <img src="@/assets/logo/logo.png" alt="SylhetStay Logo" class="w-19 h-16 object-contain" onerror="this.style.display='none'" />
                    <div v-if="!logoLoaded" class="flex items-center">
                      <span class="text-lg font-black text-teal-600">SylhetStay</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-2xs font-bold text-gray-500">RECEIPT #</p>
                    <p class="text-sm font-black text-teal-600">BOK-{{ selectedPayment.id }}</p>
                  </div>
                </div>

                <!-- Receipt Body -->
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

                <!-- Description Table -->
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
                    <p class="text-2xs font-bold text-teal-600 mt-0.5">SylhetStay Management</p>
                  </div>
                </div>

                <!-- Footer -->
                <div class="text-center mt-2 pt-2 border-t border-gray-200">
                  <p class="text-2xs text-gray-500">Thank you for your payment!</p>
                  <p class="text-2xs text-gray-400 mt-0.5">SylhetStay • 123 Akhalia Road, Sylhet • +880 1711-123456</p>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { useBookings } from '../composables/useBookings'
import { CreditCard, X, Printer, Building2, Calendar, Clock } from 'lucide-vue-next'

const router = useRouter()
const { bookings, fetchAllBookings, loading: bookingsLoading, error: bookingsError } = useBookings()

const myPayments = ref([])
const loading = ref(true)
const error = ref('')
const selectedPayment = ref(null)
const showReceipt = ref(false)
const logoLoaded = ref(true)

// Computed stats
const completedPayments = computed(() => myPayments.value.filter(p => p.status === 1).length)
const pendingPayments = computed(() => myPayments.value.filter(p => p.status === 0).length)
const totalPaid = computed(() => myPayments.value
  .filter(p => p.status === 1)
  .reduce((sum, p) => sum + (p.billing_amount || 0), 0)
)

// Fetch payments from bookings API
async function fetchPayments() {
  loading.value = true
  error.value = ''
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
      myPayments.value = allBookingsArray.filter(b => {
        return b.party?.contact?.email_number === currentUserEmail
      })
      console.log('Filtered payments for user:', myPayments.value)
    } else {
      myPayments.value = allBookingsArray
      console.log('Showing all payments:', myPayments.value)
    }
    
    myPayments.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    
  } catch (err) {
    console.error('Error fetching payments:', err)
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
    '<title>Payment Receipt - SylhetStay</title>',
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
  fetchPayments()
})
</script>

<style scoped>
.text-2xs {
  font-size: 0.65rem;
  line-height: 1rem;
}
</style>