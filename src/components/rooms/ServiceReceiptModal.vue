<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
      <!-- Modal Header -->
      <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h3 class="text-lg font-black text-teal-600">Service Subscription Receipt</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <!-- Receipt Content -->
      <div class="overflow-y-auto flex-1 p-4">
        <div id="service-receipt-content">
          <div class="receipt-container mx-auto" style="width: 100%; max-width: 480px; border: 2px solid #0d9488; padding: 20px; background: white;">
            <!-- Receipt Header -->
            <div class="flex items-center justify-between mb-3 pb-3 border-b-2 border-teal-600">
              <div class="flex items-center gap-2">
                <img 
                  :src="logoUrl || defaultLogo" 
                  alt="Logo" 
                  class="h-10 lg:h-12 w-auto object-contain"
                />
              </div>
              <div class="text-right">
                <p class="text-2xs font-bold text-gray-500 uppercase">Receipt #</p>
                <p class="text-xs font-black text-teal-600">{{ serviceReceipt.id }}</p>
              </div>
            </div>

            <!-- Receipt Body -->
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p class="text-2xs font-bold text-gray-500 uppercase mb-0.5">Subscriber</p>
                <p class="text-xs font-bold text-gray-800">{{ serviceReceipt.border_name }}</p>
                <p class="text-2xs text-gray-600">{{ serviceReceipt.border_email }}</p>
                <p class="text-2xs text-gray-600">{{ serviceReceipt.border_phone }}</p>
              </div>
              
              <div class="text-right">
                <p class="text-2xs font-bold text-gray-500 uppercase mb-0.5">Subscription Details</p>
                <p class="text-2xs text-gray-600">Date: <span class="font-bold text-gray-800">{{ formatDate(serviceReceipt.subscription_date) }}</span></p>
                <p class="text-2xs text-gray-600">Status: 
                  <span class="font-bold text-green-600">Active</span>
                </p>
                <p class="text-2xs text-gray-600">Room: <span class="font-bold text-gray-800">{{ room?.room_number || 'N/A' }}</span></p>
              </div>
            </div>

            <!-- Service Details -->
            <div class="mb-3 p-3 bg-teal-50 rounded-lg border border-teal-200">
              <p class="text-2xs font-bold text-teal-600 uppercase mb-1">Service Information</p>
              <div class="flex items-center gap-2">
                <div class="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 class="w-5 h-5 text-white" />
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-800">{{ serviceReceipt.service_name }}</p>
                  <p v-if="serviceReceipt.service_description" class="text-2xs text-gray-600">{{ serviceReceipt.service_description }}</p>
                </div>
              </div>
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
                      <p class="font-bold text-gray-800 text-xs">{{ serviceReceipt.service_name }}</p>
                      <p class="text-gray-500 text-2xs">Monthly Subscription</p>
                      <p class="text-gray-500 text-2xs">Room: {{ serviceReceipt.room_number || 'N/A' }} ({{ serviceReceipt.room_type }})</p>
                    </td>
                    <td class="text-right py-1.5">
                      <p class="font-black text-teal-600 text-sm">৳{{ (serviceReceipt.service_price || 0).toLocaleString() }}</p>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="border-t-2 border-teal-600">
                    <td class="py-1.5 font-black text-gray-800 text-xs">Total Amount (Monthly)</td>
                    <td class="text-right py-1.5 font-black text-teal-600 text-sm">৳{{ (serviceReceipt.service_price || 0).toLocaleString() }}</td>
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
                <span class="font-bold">Next Billing:</span> {{ getNextBillingDate(serviceReceipt.subscription_date) }}
              </p>
              <p class="text-2xs text-gray-600 mt-0.5">
                <span class="font-bold">Payment Method:</span> Added to Monthly Bill
              </p>
            </div>

            <!-- Signature Area -->
            <div class="flex justify-between items-end mt-3 pt-2 border-t border-gray-200">
              <div class="text-2xs text-gray-500">
                <p class="mb-0.5"><span class="font-bold">Subscribed:</span> {{ formatDate(serviceReceipt.subscription_date) }}</p>
                <p><span class="font-bold">Receipt:</span> {{ serviceReceipt.id }}</p>
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
            <div class="text-center mt-3 pt-2 border-t border-gray-200">
              <p class="text-2xs text-gray-500">Thank you for subscribing!</p>
              <p class="text-2xs text-gray-400 mt-0.5">SylhetStay • 123 Akhalia Road, Sylhet • +880 1711-123456</p>
              <p class="text-2xs text-gray-400 mt-0.5">This is a computer-generated receipt</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <button @click="$emit('close')" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl font-bold text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Close
        </button>
        <button @click="$emit('print')" class="px-4 py-2 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-colors flex items-center gap-1.5">
          <Printer class="w-4 h-4" />
          Print Receipt
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { X, Printer, CheckCircle2 } from 'lucide-vue-next'
import { usePages } from '../../composables/usePages'
import defaultLogo from '@/assets/logo/logo.png'

const API_BASE_URL = 'https://dev.hostel.accounting.itlab.solutions'
const logoUrl = ref('')

const getFullImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  return `${API_BASE_URL}/storage/${cleanPath}`
}

const loadLogo = () => {
  const { fetchHeaderLogo } = usePages()
  fetchHeaderLogo(1).then(headerSection => {
    if (headerSection?.items?.length > 0) {
      const activeItem = headerSection.items.find(item => item.status == 1)
      if (activeItem?.image) {
        logoUrl.value = getFullImageUrl(activeItem.image)
      }
    }
  }).catch(() => {})
}

onMounted(() => {
  loadLogo()
})

const props = defineProps({
  serviceReceipt: {
    type: Object,
    required: true
  },
  room: {
    type: Object,
    default: () => ({})
  },
  user: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['close', 'print'])

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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
</script>

<style scoped>
.text-2xs {
  font-size: 0.65rem;
  line-height: 1rem;
}
</style>