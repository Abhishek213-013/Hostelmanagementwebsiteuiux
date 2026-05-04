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

      <!-- Receipt Modal -->
      <div v-if="showReceipt && selectedPayment" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          <!-- Modal Header -->
          <div class="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
            <h3 class="text-lg font-black text-teal-600">Payment Receipt</h3>
            <button @click="closeReceipt" class="text-gray-400 hover:text-gray-600 transition-colors">
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <!-- Receipt Content - Scrollable -->
          <div class="overflow-y-auto flex-1 p-4">
            <div id="receipt-content">
               <!-- Receipt Container with 2:1 ratio - Compact size -->
               <div class="receipt-container mx-auto" style="width: 100%; max-width: 420px; aspect-ratio: 2/1; border: 2px solid #0d9488; padding: 16px; background: white;">
                 <!-- Receipt Header with Logo -->
                 <div class="flex items-center justify-between mb-2 pb-2 border-b-2 border-teal-600">
                  <div class="flex items-center gap-2">
                    <img src="@/assets/logo/logo.png" alt="SylhetStay Logo" class="w-19 h-16 object-contain" />
                  </div>
                  <div class="text-right">
                    <p class="text-2xs font-bold text-gray-500">RECEIPT #</p>
                    <p class="text-sm font-black text-teal-600">TXN-{{ selectedPayment.id }}2026</p>
                  </div>
                </div>

                 <!-- Receipt Body -->
                 <div class="grid grid-cols-2 gap-3 mb-3">
                  <!-- Left Column -->
                  <div>
                     <p class="text-2xs font-bold text-gray-500 uppercase mb-0.5">Bill To</p>
                    <p class="text-xs font-bold text-gray-800">John Doe</p>
                    <p class="text-2xs text-gray-600">john.doe@email.com</p>
                    <p class="text-2xs text-gray-600">+880 1712-345678</p>
                    <p class="text-2xs text-gray-600 mt-1">Room 402, Deluxe Wing</p>
                  </div>
                  
                  <!-- Right Column -->
                  <div class="text-right">
                     <p class="text-2xs font-bold text-gray-500 uppercase mb-0.5">Payment Details</p>
                    <p class="text-2xs text-gray-600">Date: <span class="font-bold text-gray-800">{{ selectedPayment.date }}</span></p>
                    <p class="text-2xs text-gray-600">Time: <span class="font-bold text-gray-800">{{ new Date().toLocaleTimeString() }}</span></p>
                    <p class="text-2xs text-gray-600">Method: <span class="font-bold text-gray-800">Credit Card</span></p>
                    <p class="text-2xs text-gray-600">Status: 
                      <span class="font-bold" :class="selectedPayment.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'">
                        {{ selectedPayment.status }}
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
                          <p class="font-bold text-gray-800 text-xs">{{ selectedPayment.description }}</p>
                          <p class="text-gray-500 text-2xs">Booking Ref: BK-{{ selectedPayment.id }}426</p>
                        </td>
                         <td class="text-right py-1.5">
                          <p class="font-black text-teal-600 text-sm">৳{{ selectedPayment.amount }}</p>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                       <tr class="border-t-2 border-teal-600">
                         <td class="py-1.5 font-black text-gray-800 text-xs">Total Amount</td>
                         <td class="text-right py-1.5 font-black text-teal-600 text-sm">৳{{ selectedPayment.amount }}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                 <!-- Signature Area -->
                 <div class="flex justify-between items-end mt-3 pt-2 border-t border-gray-200">
                  <div class="text-2xs text-gray-500">
                    <p class="mb-0.5"><span class="font-bold">Check-in:</span> {{ selectedPayment.date }}</p>
                    <p><span class="font-bold">Check-out:</span> {{ new Date(new Date(selectedPayment.date).getTime() + 3*24*60*60*1000).toISOString().split('T')[0] }}</p>
                  </div>
                  
                  <div class="text-center">
                     <svg class="w-20 h-10 mx-auto mb-0.5" viewBox="0 0 200 60">
                      <path d="M20 40 Q 60 20, 100 40 T 180 30" stroke="#0d9488" stroke-width="2" fill="none" />
                      <text x="100" y="55" text-anchor="middle" fill="#0d9488" font-size="10" font-weight="bold">Authorized Signature</text>
                    </svg>
                     <div class="w-20 border-t-2 border-teal-600 mx-auto"></div>
                    <p class="text-2xs font-bold text-teal-600 mt-0.5">Hostel Management</p>
                  </div>
                </div>

                 <!-- Footer -->
                 <div class="text-center mt-2 pt-2 border-t border-gray-200">
                  <p class="text-2xs text-gray-500">Thank you for staying with us!</p>
                  <p class="text-2xs text-gray-400 mt-0.5">SylhetStay • 123 Akhalia Road, Sylhet • +880 1711-123456</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer with Actions -->
          <div class="flex justify-end gap-2 p-4 border-t border-gray-200 flex-shrink-0">
            <button @click="closeReceipt" class="px-4 py-2 border border-gray-300 rounded-xl font-bold text-gray-700 text-sm hover:bg-gray-50 transition-colors">
              Close
            </button>
            <button @click="printReceipt" class="px-4 py-2 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-colors flex items-center gap-1.5">
              <Printer class="w-4 h-4" />
              Print Receipt
            </button>
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
import { CreditCard, X, Printer } from 'lucide-vue-next'

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

const printReceipt = () => {
  const receiptContent = document.getElementById('receipt-content')
  const printWindow = window.open('', '_blank', 'width=1000,height=800')

  // Clone the receipt and remove inline styles that make it small
  const clonedReceipt = receiptContent.cloneNode(true)
  const receiptContainer = clonedReceipt.querySelector('.receipt-container')

  if (receiptContainer) {
    // Remove inline styles and apply print-friendly styles
    receiptContainer.removeAttribute('style')
    receiptContainer.style.cssText = 'width: 100%; max-width: 800px; border: 3px solid #0d9488; padding: 32px; background: white; margin: 0 auto;'
  }

  // Increase font sizes for better print readability
  const printContent = clonedReceipt.innerHTML.replace(/text-2xs/g, 'text-sm').replace(/text-xs/g, 'text-base').replace(/text-sm/g, 'text-lg').replace(/text-base/g, 'text-xl').replace(/text-2xl/g, 'text-4xl')

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

<style scoped>
.text-2xs {
  font-size: 0.65rem;
  line-height: 1rem;
}
</style>