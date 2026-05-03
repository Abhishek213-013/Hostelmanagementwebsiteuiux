<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Header />
    <div class="max-w-[1400px] mx-auto px-6 lg:px-12 py-32">
      <div class="mb-12">
          <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <CreditCard class="w-5 h-5 text-teal-600" />
          <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">My Payments</span>
        </div>
        <h1 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600">My Payments</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">Track your payment history and manage upcoming bills</p>
      </div>

      <div v-if="payments.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="payment in payments" :key="payment.id" class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
          <div class="relative h-48 overflow-hidden bg-gradient-to-br" :class="payment.status === 'Paid' ? 'from-green-400 to-teal-500' : 'from-yellow-400 to-orange-500'">
            <div class="absolute inset-0 flex items-center justify-center">
              <CreditCard class="w-20 h-20 text-white/30" />
            </div>
            <div class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
              {{ payment.status }}
            </div>
          </div>
          <div class="p-6">
            <h4 class="text-xl font-black mb-2 text-teal-600">{{ payment.description }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">{{ payment.date }}</p>
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm text-gray-600 dark:text-gray-300">Amount</span>
              <span class="text-2xl font-black text-teal-600">৳{{ payment.amount }}</span>
            </div>
            <button class="block w-full py-3 bg-teal-600 text-white rounded-xl font-bold text-center hover:bg-teal-700 transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <CreditCard class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">No Payment History</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Your payment records will appear here</p>
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
import { CreditCard } from 'lucide-vue-next'

const payments = ref([])

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
