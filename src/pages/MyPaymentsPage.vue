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
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="fetchPayments" class="px-6 py-2 bg-teal-600 text-white rounded-lg">Retry</button>
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
                  {{ payment.transaction_id }}
                </span>
              </div>
            </div>
            
            <div class="p-6">
              <!-- Room & Booking -->
              <div class="mb-3">
                <h4 class="text-xl font-black text-teal-600">{{ payment.room_name }}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Booking: {{ payment.booking_reference }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="px-2 py-0.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs capitalize">
                    {{ payment.room_type.replace('-', ' ') }}
                  </span>
                  <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400 capitalize">
                    {{ payment.payment_type.replace('_', ' ') }}
                  </span>
                </div>
              </div>
              
              <!-- Installment Info -->
              <div v-if="payment.installment_plan" class="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 class="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">Installment Plan</h5>
                <div class="text-xs text-blue-600 dark:text-blue-400 space-y-0.5">
                  <p>{{ payment.installment_plan.paid_installments }}/{{ payment.installment_plan.total_installments }} installments paid</p>
                  <p>Next due: {{ formatDate(payment.installment_plan.next_due_date) }}</p>
                  <p class="font-bold">৳{{ payment.installment_plan.installment_amount.toLocaleString() }}/installment</p>
                </div>
              </div>
              
              <!-- Failed Reason -->
              <div v-if="payment.status === 'failed' && payment.failed_reason" class="mb-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p class="text-xs text-red-600 dark:text-red-400">
                  <strong>Reason:</strong> {{ payment.failed_reason }}
                </p>
              </div>
              
              <!-- Notes -->
              <div v-if="payment.notes" class="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p class="text-xs text-gray-600 dark:text-gray-400">{{ payment.notes }}</p>
              </div>
              
              <!-- Price Breakdown -->
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 mb-4">
                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>৳{{ payment.subtotal.toLocaleString() }}</span>
                </div>
                <div v-if="payment.discount > 0" class="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-৳{{ payment.discount.toLocaleString() }}</span>
                </div>
                <div v-if="payment.tax > 0" class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span>৳{{ payment.tax.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between text-base font-black text-teal-600">
                  <span>Total</span>
                  <span>৳{{ payment.amount.toLocaleString() }}</span>
                </div>
              </div>
              
              <!-- Payment Method & Date -->
              <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                <div class="flex items-center gap-1">
                  <CreditCard class="w-3 h-3" />
                  <span>{{ payment.payment_method }}</span>
                </div>
                <span>{{ payment.paid_at ? formatDate(payment.paid_at) : 'Not paid yet' }}</span>
              </div>
              
              <!-- Actions -->
              <div class="flex gap-2">
                <button @click="openReceipt(payment)" 
                        class="flex-1 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-center border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm">
                  View Receipt
                </button>
                <button v-if="payment.status === 'pending' || payment.status === 'failed'"
                        class="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-colors">
                  Pay Now
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
                    <img src="@/assets/logo/logo.png" alt="SylhetStay Logo" class="w-19 h-16 object-contain" />
                  </div>
                  <div class="text-right">
                    <p class="text-2xs font-bold text-gray-500">RECEIPT #</p>
                    <p class="text-sm font-black text-teal-600">{{ selectedPayment.transaction_id }}</p>
                  </div>
                </div>

                <!-- Receipt Body -->
                <div class="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p class="text-2xs font-bold text-gray-500 uppercase mb-0.5">Bill To</p>
                    <p class="text-xs font-bold text-gray-800">{{ selectedPayment.customer_name }}</p>
                    <p class="text-2xs text-gray-600">{{ selectedPayment.customer_email }}</p>
                    <p class="text-2xs text-gray-600">{{ selectedPayment.customer_phone }}</p>
                    <p class="text-2xs text-gray-600 mt-1">{{ selectedPayment.room_name }}</p>
                  </div>
                  
                  <div class="text-right">
                    <p class="text-2xs font-bold text-gray-500 uppercase mb-0.5">Payment Details</p>
                    <p class="text-2xs text-gray-600">Date: <span class="font-bold text-gray-800">{{ formatDate(selectedPayment.paid_at || selectedPayment.created_at) }}</span></p>
                    <p class="text-2xs text-gray-600">Method: <span class="font-bold text-gray-800">{{ selectedPayment.payment_method }}</span></p>
                    <p class="text-2xs text-gray-600">Gateway: <span class="font-bold text-gray-800">{{ selectedPayment.payment_gateway }}</span></p>
                    <p class="text-2xs text-gray-600">Status: 
                      <span :class="['font-bold', getStatusTextClass(selectedPayment.status)]">
                        {{ formatStatus(selectedPayment.status) }}
                      </span>
                    </p>
                  </div>
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
                          <p class="font-bold text-gray-800 text-xs">{{ selectedPayment.room_name }}</p>
                          <p class="text-gray-500 text-2xs">Booking: {{ selectedPayment.booking_reference }}</p>
                        </td>
                        <td class="text-right py-1.5">
                          <p class="font-black text-teal-600 text-sm">৳{{ selectedPayment.amount.toLocaleString() }}</p>
                        </td>
                      </tr>
                      <tr v-if="selectedPayment.discount > 0" class="border-b border-gray-200">
                        <td class="py-1.5 text-green-600 text-2xs">Discount</td>
                        <td class="text-right py-1.5 text-green-600 text-xs">-৳{{ selectedPayment.discount.toLocaleString() }}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr class="border-t-2 border-teal-600">
                        <td class="py-1.5 font-black text-gray-800 text-xs">Total Amount</td>
                        <td class="text-right py-1.5 font-black text-teal-600 text-sm">৳{{ selectedPayment.amount.toLocaleString() }}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <!-- Signature Area -->
                <div class="flex justify-between items-end mt-3 pt-2 border-t border-gray-200">
                  <div class="text-2xs text-gray-500">
                    <p class="mb-0.5"><span class="font-bold">Paid:</span> {{ formatDate(selectedPayment.paid_at) }}</p>
                    <p><span class="font-bold">Type:</span> {{ selectedPayment.payment_type.replace('_', ' ') }}</p>
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
import axios from 'axios'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { CreditCard, X, Printer, Building2 } from 'lucide-vue-next'

const allPayments = ref([])
const myPayments = ref([])
const loading = ref(true)
const error = ref('')
const selectedPayment = ref(null)
const showReceipt = ref(false)

// Computed stats
const completedPayments = computed(() => myPayments.value.filter(p => p.status === 'completed').length)
const pendingPayments = computed(() => myPayments.value.filter(p => p.status === 'pending' || p.status === 'partial').length)
const totalPaid = computed(() => myPayments.value
  .filter(p => p.status === 'completed')
  .reduce((sum, p) => sum + p.amount, 0)
)

// Fetch payments data
async function fetchPayments() {
  loading.value = true
  error.value = ''
  try {
    const response = await axios.get('https://raw.githubusercontent.com/Abhishek213-013/dummyJson/refs/heads/main/payments.json')
    allPayments.value = response.data
    
    // Filter payments for current user
    const currentUserId = localStorage.getItem('currentUserId')
    const storedUser = localStorage.getItem('user')
    
    if (storedUser) {
      const user = JSON.parse(storedUser)
      myPayments.value = allPayments.value.filter(p => p.customer_email === user.email)
    }
    
    // Sort by created date (newest first)
    myPayments.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    
  } catch (err) {
    console.error('Error fetching payments:', err)
    error.value = 'Failed to load payments. Please check your connection and try again.'
  } finally {
    loading.value = false
  }
}

// Receipt modal functions
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

// Helper functions
function getStatusBgClass(status) {
  const classes = {
    'completed': 'bg-teal-600',
    'partial': 'bg-blue-600',
    'pending': 'bg-yellow-500',
    'failed': 'bg-red-500',
  }
  return classes[status] || 'bg-teal-600'
}

function getStatusClass(status) {
  const classes = {
    'completed': 'bg-green-500 text-white',
    'partial': 'bg-blue-500 text-white',
    'pending': 'bg-yellow-500 text-white',
    'failed': 'bg-red-500 text-white',
  }
  return classes[status] || 'bg-gray-500 text-white'
}

function getStatusTextClass(status) {
  const classes = {
    'completed': 'text-green-600',
    'partial': 'text-blue-600',
    'pending': 'text-yellow-600',
    'failed': 'text-red-600',
  }
  return classes[status] || 'text-gray-600'
}

function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(() => {
  fetchPayments()
})
</script>

<style scoped>
.text-2xs {
  font-size: 0.65rem;
  line-height: 1rem;
}
</style>