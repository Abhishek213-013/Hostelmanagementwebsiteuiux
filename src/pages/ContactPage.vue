<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading contact information...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="fetchContactData" class="px-6 py-2 bg-teal-600 text-white rounded-lg">Retry</button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <Header />
      <div class="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow border border-gray-200 dark:border-gray-700 mb-8">
            <div class="p-2 bg-teal-600 rounded-xl">
              <MessageCircle class="w-4 h-4 text-white" />
            </div>
            <span class="text-sm font-bold tracking-wider text-teal-600 uppercase">Contact Us</span>
          </div>
          <h1 class="text-3xl lg:text-5xl font-black mb-6 leading-[1.1]">
            <span class="block text-teal-600">Get In Touch</span>
            <span class="text-4xl lg:text-5xl text-gray-700 dark:text-gray-300 font-light">With Us</span>
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">We'd love to hear from you. Send us a message!</p>
        </div>

        <!-- Contact Info Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div v-for="(info, i) in contactInfo" :key="i" 
               class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
               @mouseenter="hoveredCard = i"
               @mouseleave="hoveredCard = null">
            <div class="w-10 h-10 mb-6 rounded-2xl bg-teal-600 flex items-center justify-center shadow">
              <component :is="info.icon" class="w-5 h-5 text-white" />
            </div>
            <h3 class="text-xl font-black mb-4 text-teal-600">{{ info.title }}</h3>
            <div v-for="(detail, j) in info.details" :key="j">
              <template v-if="info.icon === Phone && detail.startsWith('+')">
                <a :href="`tel:${detail.replace(/\s/g, '')}`" class="text-gray-600 dark:text-gray-400 font-medium leading-relaxed hover:text-teal-600 transition-colors block">{{ detail }}</a>
              </template>
              <template v-else-if="info.icon === Mail">
                <a :href="`mailto:${detail}`" class="text-gray-600 dark:text-gray-400 font-medium leading-relaxed hover:text-teal-600 transition-colors block">{{ detail }}</a>
              </template>
              <template v-else>
                <p class="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{{ detail }}</p>
              </template>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          <!-- Contact Form -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-10">
            <div v-if="submitted" class="text-center py-12">
              <div class="w-24 h-24 mx-auto mb-8 rounded-full bg-teal-600 flex items-center justify-center shadow-2xl">
                <CheckCircle2 class="w-12 h-12 text-white" />
              </div>
              <h2 class="text-3xl font-black mb-4 text-teal-600">Message Sent!</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-8 text-lg">Thank you for reaching out. We'll get back to you {{ pageData.contact_form?.response_time || 'soon' }}.</p>
              <button @click="submitted = false" class="px-8 py-4 text-white rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition-all mx-auto inline-flex items-center gap-2" :style="{ background: '#0d9488' }">
                Send Another Message
                <ChevronRight class="w-5 h-5" />
              </button>
            </div>
            <div v-else>
              <h2 class="text-3xl font-black mb-8 text-teal-600">Send us a Message</h2>
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">{{ getFieldLabel('name') }}</label>
                    <input type="text" :placeholder="getFieldPlaceholder('name')" v-model="formData.name"
                           class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" required />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">{{ getFieldLabel('email') }}</label>
                    <input type="email" :placeholder="getFieldPlaceholder('email')" v-model="formData.email"
                           class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" required />
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">{{ getFieldLabel('phone') }}</label>
                    <input type="tel" :placeholder="getFieldPlaceholder('phone')" v-model="formData.phone"
                           class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">{{ getFieldLabel('subject') }}</label>
                    <select v-model="formData.subject"
                            class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200" required>
                      <option value="">Select a subject</option>
                      <option v-for="subject in (pageData.subjects || defaultSubjects)" :key="subject.value" :value="subject.value">
                        {{ subject.label }}
                      </option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-bold text-teal-600 mb-3">{{ getFieldLabel('message') }}</label>
                  <textarea :placeholder="getFieldPlaceholder('message')" v-model="formData.message"
                            class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400 resize-none h-36" required></textarea>
                </div>
                <button type="submit" class="w-full group py-5 rounded-2xl font-bold text-white shadow hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg" :style="{ background: '#0d9488' }">
                  <span class="flex items-center gap-3"><Send class="w-6 h-6" />
                  Send Message
                  <ChevronRight class="w-6 h-6" /></span>
                </button>
              </form>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-8">
            <!-- Quick Actions -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-8">
              <h2 class="text-2xl font-black mb-6 text-teal-600">Quick Actions</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <template v-for="link in quickLinks" :key="link.label">
                  <button v-if="link.type === 'button'" @click="openTourModal()"
                          class="group flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:scale-105 w-full text-left">
                    <div class="p-2 rounded-xl bg-teal-600 group-hover:scale-110 transition-transform">
                      <component :is="link.icon" class="w-5 h-5 text-white" />
                    </div>
                    <span class="font-semibold text-gray-800 dark:text-gray-200">{{ link.label }}</span>
                  </button>
                  <router-link v-else :to="link.href"
                               class="group flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:scale-105">
                    <div class="p-2 rounded-xl bg-teal-600 group-hover:scale-110 transition-transform">
                      <component :is="link.icon" class="w-5 h-5 text-white" />
                    </div>
                    <span class="font-semibold text-gray-800 dark:text-gray-200">{{ link.label }}</span>
                  </router-link>
                </template>
              </div>
            </div>

            <!-- Social Media -->
            <div class="bg-gray-900 rounded-2xl p-8 text-white">
              <h2 class="text-2xl font-black mb-4">Follow Us</h2>
              <p class="mb-6 text-white/90">Stay connected with us on social media for updates and news.</p>
              <div class="flex gap-4">
                <a v-for="(social, key) in pageData.social_media" :key="key" :href="social" target="_blank" rel="noopener noreferrer"
                   class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all">
                  <component :is="socialIconMap[key]" class="w-6 h-6 text-white" />
                </a>
                <!-- Fallback if no social media data -->
                <template v-if="!pageData.social_media || Object.keys(pageData.social_media).length === 0">
                  <a v-for="(icon, i) in socialIcons" :key="i" href="#"
                     class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all">
                    <component :is="icon" class="w-6 h-6 text-white" />
                  </a>
                </template>
              </div>
            </div>

            <!-- Emergency Contact -->
            <div v-if="pageData.emergency_contact" class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-8">
              <h2 class="text-xl font-black mb-4 text-teal-600">{{ pageData.emergency_contact.name || 'Emergency Contact' }}</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">Available {{ pageData.emergency_contact.available || '24/7' }}</p>
              <a :href="`tel:${pageData.emergency_contact.phone?.replace(/\s/g, '')}`" class="group text-2xl font-black flex items-center gap-2 text-teal-600">
                {{ pageData.emergency_contact.phone }}
                <ChevronRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <!-- Office Hours -->
            <div v-if="pageData.office_hours" class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-8">
              <h2 class="text-xl font-black mb-4 text-teal-600">Office Hours</h2>
              <div class="space-y-3">
                <div v-for="(hours, key) in pageData.office_hours" :key="key" class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ hours.label }}</span>
                  <span class="text-sm text-teal-600 font-bold">{{ hours.open }} - {{ hours.close }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Map -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <iframe 
            :src="pageData.map_embed_url || defaultMapUrl"
            width="100%" height="400" style="border:0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
      <TourBookingModal :isOpen="isTourModalOpen" @close="closeTourModal" />
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import TourBookingModal from '../components/TourBookingModal.vue'
import { Building2, MapPin, Phone, Mail, Send, Clock, Facebook, Instagram, Twitter, Youtube, MessageCircle, Headphones, Calendar, CheckCircle2, ChevronRight, Sparkles, Linkedin } from 'lucide-vue-next'

// Social media icon mapping
const socialIconMap = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
}

// Default map URL
const defaultMapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.727256099589!2d92.01732531540178!3d24.89774928036656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3751f2d53c30e91%3A0x3b85a6b1e8e7e8a8!2sSylhet%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1600000000000!5m2!1sen!2sbd'

// Default subjects
const defaultSubjects = [
  { value: 'booking', label: 'Booking Inquiry' },
  { value: 'inquiry', label: 'General Inquiry' },
  { value: 'complaint', label: 'Complaint' },
  { value: 'suggestion', label: 'Suggestion' },
  { value: 'other', label: 'Other' }
]

// State
const submitted = ref(false)
const hoveredCard = ref(null)
const isTourModalOpen = ref(false)
const formData = ref({ name: '', email: '', phone: '', subject: '', message: '' })
const pageData = ref({})
const loading = ref(true)
const error = ref('')

// Fetch data from JSON
async function fetchContactData() {
  loading.value = true
  error.value = ''
  try {
    const response = await axios.get('https://raw.githubusercontent.com/Abhishek213-013/dummyJson/refs/heads/main/contact_info.json')
    pageData.value = response.data
  } catch (err) {
    console.error('Error fetching contact data:', err)
    error.value = 'Failed to load contact information. Please check your connection and try again.'
  } finally {
    loading.value = false
  }
}

// Computed contact info from JSON
const contactInfo = computed(() => {
  const data = pageData.value
  const info = []

  if (data.address_lines || data.address) {
    info.push({
      icon: MapPin,
      title: 'Visit Us',
      details: data.address_lines || [data.address]
    })
  }

  if (data.phone || data.phone_secondary) {
    const phones = []
    if (data.phone) phones.push(data.phone)
    if (data.phone_secondary) phones.push(data.phone_secondary)
    info.push({
      icon: Phone,
      title: 'Call Us',
      details: phones
    })
  }

  if (data.email || data.email_support || data.email_bookings) {
    const emails = []
    if (data.email) emails.push(data.email)
    if (data.email_bookings) emails.push(data.email_bookings)
    if (data.email_support) emails.push(data.email_support)
    info.push({
      icon: Mail,
      title: 'Email Us',
      details: emails
    })
  }

  if (data.office_hours) {
    const hours = []
    for (const key in data.office_hours) {
      const h = data.office_hours[key]
      if (h.label && h.open && h.close) {
        hours.push(`${h.label}: ${h.open} - ${h.close}`)
      }
    }
    if (hours.length > 0) {
      info.push({
        icon: Clock,
        title: 'Office Hours',
        details: hours
      })
    }
  } else {
    info.push({
      icon: Clock,
      title: 'Office Hours',
      details: ['Mon - Sat: 9AM - 8PM', 'Sun: 10AM - 4PM']
    })
  }

  return info.length > 0 ? info : [
    { icon: MapPin, title: 'Visit Us', details: ['123 Akhalia Road', 'Sylhet 3100, Bangladesh'] },
    { icon: Phone, title: 'Call Us', details: ['+880 1711-123456', '+880 1811-654321'] },
    { icon: Mail, title: 'Email Us', details: ['info@sylhetstay.com', 'booking@sylhetstay.com'] },
    { icon: Clock, title: 'Office Hours', details: ['Mon - Sat: 9AM - 8PM', 'Sun: 10AM - 4PM'] }
  ]
})

// Helper functions for form fields
function getFieldLabel(fieldName) {
  const field = pageData.value.contact_form?.fields?.find(f => f.name === fieldName)
  return field?.label || fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
}

function getFieldPlaceholder(fieldName) {
  const field = pageData.value.contact_form?.fields?.find(f => f.name === fieldName)
  return field?.placeholder || `Enter your ${fieldName}`
}

const openTourModal = () => {
  isTourModalOpen.value = true
}

const closeTourModal = () => {
  isTourModalOpen.value = false
}

const quickLinks = [
  { icon: Calendar, label: 'Schedule a Tour', type: 'button' },
  { icon: MessageCircle, label: 'Live Chat', href: '/contact', type: 'link' },
  { icon: Headphones, label: 'FAQs', href: '/about', type: 'link' },
  { icon: Building2, label: 'Book a Room', href: '/rooms', type: 'link' }
]

const socialIcons = [Facebook, Instagram, Twitter, Youtube]

const handleSubmit = () => {
  console.log('Contact form submitted:', formData.value)
  submitted.value = true
}

onMounted(() => {
  fetchContactData()
})
</script>