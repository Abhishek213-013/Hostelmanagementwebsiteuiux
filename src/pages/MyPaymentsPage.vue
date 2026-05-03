<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Header />
    <div class="max-w-[1400px] mx-auto px-6 lg:px-12 py-32">
      <div class="mb-12">
          <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 bg-white">
          <CreditCard class="w-5 h-5 text-teal-600" />
          <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">My Payments</span>
        </div>
        <h1 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600">My Payments</h1>
        <p class="text-lg text-gray-600 max-w-2xl">Track your payment history and manage upcoming bills</p>
      </div>

      <div v-if="payments.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="payment in payments" :key="payment.id" class="bg-white rounded-2xl overflow-hidden shadow border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
          <div class="relative h-48 overflow-hidden bg-teal-600">
            <div class="absolute inset-0 flex items-center justify-center">
              <CreditCard class="w-20 h-20 text-white/30" />
            </div>
<div class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold" :class="payment.status === 'Paid' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'">
  {{ payment.status }}
</div>
          </div>
          <div class="p-6">
            <h4 class="text-xl font-black mb-2 text-teal-600">{{ payment.description }}</h4>
            <p class="text-sm text-gray-600 mb-4">{{ payment.date }}</p>
<div class="flex items-center justify-between mb-4">
  <span class="text-sm text-gray-600">Amount</span>
  <span class="text-2xl font-black text-teal-600">৳{{ payment.amount }}</span>
</div>
            <button @click="openReceipt(payment)" class="block w-full py-3 bg-teal-600 text-white rounded-xl font-bold text-center hover:bg-teal-700 transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>

      <div v-if="showReceipt && selectedPayment" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-8 shadow-2xl">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-black text-teal-600 dark:text-teal-400">Payment Receipt</h3>
            <button @click="closeReceipt" class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
              <X class="w-6 h-6" />
            </button>
          </div>
          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Description</span>
              <span class="font-bold dark:text-white">{{ selectedPayment.description }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Date</span>
              <span class="font-bold dark:text-white">{{ selectedPayment.date }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Amount</span>
              <span class="font-bold text-teal-600 dark:text-teal-400">৳{{ selectedPayment.amount }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Status</span>
              <span class="font-bold" :class="selectedPayment.status === 'Paid' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'">{{ selectedPayment.status }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Transaction ID</span>
              <span class="font-bold dark:text-white">#TXN-{{ selectedPayment.id }}2026</span>
            </div>
          </div>
          <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-500 dark:text-gray-400 text-center">Thank you for your payment!</p>
          </div>
        </div>
      </div>

      <div v-if="payments.length === 0" class="text-center py-20">
        <CreditCard class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-gray-600 mb-2">No Payment History</h3>
        <p class="text-gray-500 mb-6">Your payment records will appear here</p>
        <router-link to="/payments" class="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition-colors">
          <CreditCard class="w-5 h-5" />
          Make a Payment
        </router-link>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { CreditCard, X } from 'lucide-vue-next'

const payments = ref([])
const selectedPayment = ref(null)
const showReceipt = ref(false)

const openReceipt = (payment) => {
  selectedPayment.value = payment
  showReceipt.value = true
}

const closeReceipt = () => {
  showReceipt.value = false
  selectedPayment.value = null
}

const demoPayments = [
  { id: 1, description: 'Deluxe Suite Booking', date: '2026-04-10', amount: 480, status: 'Paid' },
  { id: 2, description: 'Room Service - Continental Breakfast', date: '2026-04-12', amount: 35, status: 'Paid' },
  { id: 3, description: 'Spa Session - Deep Tissue Massage', date: '2026-04-15', amount: 150, status: 'Pending' },
  { id: 4, description: 'Late Checkout (2 Hours)', date: '2026-04-18', amount: 60, status: 'Pending' },
  { id: 5, description: 'Airport Shuttle Service', date: '2026-04-20', amount: 90, status: 'Paid' }
]

onMounted(() => {
  const storedPayments = localStorage.getItem('payments')
  if (storedPayments) {
    payments.value = JSON.parse(storedPayments)
  } else {
    payments.value = demoPayments
  }
})
</script>
