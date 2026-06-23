<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <main v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading contact information...</p>
      </div>
    </main>

    <!-- Error State -->
    <main v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md">
          <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
          <button @click="fetchContactData" class="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all">
            Try Again
          </button>
        </div>
      </div>
    </main>

    <!-- Main Content -->
    <main v-else>
      <Header />
      <div class="max-w-[1400px] mx-auto px-6 lg:px-12 pt-24 lg:pt-28 pb-20">
        <!-- Header -->
        <div v-if="pageData.contact" class="text-center mb-12">
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow border border-gray-200 dark:border-gray-700 mb-8">
            <div class="p-2 bg-teal-600 rounded-xl">
              <component :is="getIconComponent(pageData.contact.icon)" class="w-4 h-4 text-white" />
            </div>
            <span class="text-sm font-bold tracking-wider text-teal-600 uppercase">{{ pageData.contact.title }}</span>
          </div>
          <h1 class="text-3xl lg:text-5xl font-black mb-6 leading-[1.1]">
            <span class="block text-teal-600">{{ pageData.contact.subtitle?.split(' ')[0] || 'Get In' }}</span>
            <span class="text-4xl lg:text-5xl text-gray-700 dark:text-gray-300 font-light">{{ pageData.contact.subtitle?.split(' ').slice(1).join(' ') || 'Touch With Us' }}</span>
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">{{ pageData.contact.description }}</p>
        </div>

        <!-- Contact Info Cards -->
        <div v-if="contactInfo.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div v-for="(info, i) in contactInfo" :key="i" 
               class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
               @mouseenter="hoveredCard = i"
               @mouseleave="hoveredCard = null">
            <div class="w-10 h-10 mb-6 rounded-2xl bg-teal-600 flex items-center justify-center shadow">
              <component :is="getIconComponent(info.icon)" class="w-5 h-5 text-white" />
            </div>
            <h3 class="text-xl font-black mb-4 text-teal-600">{{ info.title }}</h3>
            <div v-for="(detail, j) in info.details" :key="j">
              <template v-if="info.icon === 'heroicon-o-phone' && detail.startsWith('+')">
                <a :href="`tel:${detail.replace(/\s/g, '')}`" class="text-gray-600 dark:text-gray-400 font-medium leading-relaxed hover:text-teal-600 transition-colors block">{{ detail }}</a>
              </template>
              <template v-else-if="info.icon === 'eva-email'">
                <a :href="`mailto:${detail}`" class="text-gray-600 dark:text-gray-400 font-medium leading-relaxed hover:text-teal-600 transition-colors block">{{ detail }}</a>
              </template>
              <template v-else>
                <p class="text-gray-600 dark:text-gray-400 font-medium leading-relaxed whitespace-pre-line">{{ detail }}</p>
              </template>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          <!-- Contact Form -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-10">
            <!-- Success Message -->
            <div v-if="submitted" class="text-center py-12">
              <div class="w-24 h-24 mx-auto mb-8 rounded-full bg-teal-600 flex items-center justify-center shadow-2xl">
                <CheckCircle2 class="w-12 h-12 text-white" />
              </div>
              <h2 class="text-3xl font-black mb-4 text-teal-600">Message Sent!</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-8 text-lg">Thank you for reaching out. We'll get back to you soon.</p>
              <button @click="resetForm" class="px-8 py-4 text-white rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition-all mx-auto inline-flex items-center gap-2" :style="{ background: '#0d9488' }">
                Send Another Message
                <ChevronRight class="w-5 h-5" />
              </button>
            </div>
            
            <!-- Error Message -->
            <div v-else-if="formError" class="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {{ formError }}
            </div>
            
            <!-- Contact Form -->
            <div v-else>
              <h2 class="text-3xl font-black mb-8 text-teal-600">Send us a Message</h2>
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">Full Name</label>
                    <input type="text" placeholder="Enter your full name" v-model="formData.name"
                           class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" required />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">Email Address</label>
                    <input type="email" placeholder="Enter your email" v-model="formData.email"
                           class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" required />
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">Phone Number</label>
                    <input type="tel" placeholder="Enter your phone number" v-model="formData.phone"
                           class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400" />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-teal-600 mb-3">Subject</label>
                    <select v-model="formData.subject"
                            class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200" required>
                      <option value="">Select a subject</option>
                      <option value="booking">Booking Inquiry</option>
                      <option value="inquiry">General Inquiry</option>
                      <option value="complaint">Complaint</option>
                      <option value="suggestion">Suggestion</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-bold text-teal-600 mb-3">Message</label>
                  <textarea placeholder="Enter your message" v-model="formData.message"
                            class="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all font-semibold text-gray-800 dark:text-gray-200 placeholder:text-gray-400 resize-none h-36" required></textarea>
                </div>
                <button type="submit" :disabled="sending"
                        class="w-full group py-5 rounded-2xl font-bold text-white shadow hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed" 
                        :style="{ background: '#0d9488' }">
                  <span v-if="sending" class="flex items-center gap-3">
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                  <span v-else class="flex items-center gap-3">
                    <Send class="w-6 h-6" />
                    Send Message
                    <ChevronRight class="w-6 h-6" />
                  </span>
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
                <button @click="openTourModal"
                        class="group flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:scale-105 w-full text-left">
                  <div class="p-2 rounded-xl bg-teal-600 group-hover:scale-110 transition-transform">
                    <Calendar class="w-5 h-5 text-white" />
                  </div>
                  <span class="font-semibold text-gray-800 dark:text-gray-200">Schedule a Tour</span>
                </button>
                <router-link to="/rooms"
                             class="group flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:scale-105">
                  <div class="p-2 rounded-xl bg-teal-600 group-hover:scale-110 transition-transform">
                    <Building2 class="w-5 h-5 text-white" />
                  </div>
                  <span class="font-semibold text-gray-800 dark:text-gray-200">Book a Room</span>
                </router-link>
              </div>
            </div>

            <!-- Social Media -->
            <div class="bg-gray-900 rounded-2xl p-8 text-white">
              <h2 class="text-2xl font-black mb-4">Follow Us</h2>
              <p class="mb-6 text-white/90">Stay connected with us on social media for updates and news.</p>
              <div class="flex gap-4">
                <a v-for="(url, platform) in socialLinks" :key="platform" :href="url" target="_blank" rel="noopener noreferrer"
                   class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all">
                  <component :is="socialIconMap[platform]" class="w-6 h-6 text-white" />
                </a>
              </div>
            </div>

            <!-- Office Hours -->
            <!-- <div v-if="officeHours" class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-8">
              <h2 class="text-xl font-black mb-4 text-teal-600">{{ officeHours.title }}</h2>
              <div class="space-y-3">
                <div v-for="(line, index) in officeHours.lines" :key="index" class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ line.day }}</span>
                  <span class="text-sm text-teal-600 font-bold">{{ line.time }}</span>
                </div>
              </div>
            </div> -->

            <!-- Emergency Contact -->
            <div v-if="emergencyContact" class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-8">
              <h2 class="text-xl font-black mb-4 text-teal-600">{{ emergencyContact.title }}</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">{{ emergencyContact.description }}</p>
              <a :href="`tel:${emergencyContact.phone?.replace(/\s/g, '')}`" class="group text-2xl font-black flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors">
                {{ emergencyContact.phone }}
                <ChevronRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <!-- Map -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.727256099589!2d92.01732531540178!3d24.89774928036656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3751f2d53c30e91%3A0x3b85a6b1e8e7e8a8!2sSylhet%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1600000000000!5m2!1sen!2sbd"
            width="100%" height="400" style="border:0" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>

        <!-- Newsletter Section -->
        <div class="mt-12">
          <div class="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 md:p-12 text-white">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Mail class="w-5 h-5 text-white" />
                  </div>
                  <span class="text-sm font-bold tracking-wider uppercase">Newsletter</span>
                </div>
                <h2 class="text-2xl md:text-3xl font-black mb-2">Subscribe to Our Newsletter</h2>
                <p class="text-white/80 text-sm md:text-base">Stay updated with our latest offers, events, and news about student accommodations.</p>
              </div>
              
              <div>
                <!-- Success Message - After Subscription -->
                <div v-if="isSubscribed" class="space-y-4">
                  <div class="bg-green-500/20 border border-green-400/50 rounded-xl p-4 text-center">
                    <CheckCircle2 class="w-8 h-8 mx-auto mb-2 text-green-300" />
                    <p class="font-semibold">Successfully Subscribed!</p>
                    <p class="text-sm text-white/80">You are now subscribed to our newsletter.</p>
                  </div>
                  
                  <!-- Unsubscribe Button (shown after success) -->
                  <div class="text-center">
                    <button 
                      @click="showUnsubscribeForm = !showUnsubscribeForm" 
                      class="text-white/70 hover:text-white text-sm underline transition-colors"
                    >
                      {{ showUnsubscribeForm ? 'Hide' : 'Unsubscribe?' }}
                    </button>
                    
                    <!-- Unsubscribe Form (shown when clicked) -->
                    <div v-if="showUnsubscribeForm" class="mt-3 p-3 bg-white/10 rounded-xl">
                      <form @submit.prevent="handleNewsletterUnsubscribe" class="flex flex-col sm:flex-row gap-2">
                        <input 
                          type="email" 
                          v-model="unsubscribeEmail" 
                          placeholder="Enter your email to unsubscribe"
                          class="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-sm"
                          required
                        />
                        <button 
                          type="submit" 
                          :disabled="newsletterUnsubscribing"
                          class="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {{ newsletterUnsubscribing ? 'Unsubscribing...' : 'Unsubscribe' }}
                        </button>
                        <button 
                          type="button" 
                          @click="showUnsubscribeForm = false"
                          class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold text-sm transition-colors"
                        >
                          Cancel
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                
                <!-- Error Message -->
                <div v-else-if="newsletterError" class="bg-red-500/20 border border-red-400/50 rounded-xl p-4 mb-4 text-center">
                  <X class="w-8 h-8 mx-auto mb-2 text-red-300" />
                  <p class="font-semibold">Subscription Failed</p>
                  <p class="text-sm text-white/80">{{ newsletterError }}</p>
                  <button 
                    @click="resetNewsletterState" 
                    class="mt-2 text-sm text-white/70 hover:text-white underline transition-colors"
                  >
                    Try Again
                  </button>
                </div>
                
                <!-- Subscribe Form (hidden when subscribed) -->
                <form v-else @submit.prevent="handleNewsletterSubscribe" class="flex flex-col sm:flex-row gap-3">
                  <div class="flex-1">
                    <input 
                      type="email" 
                      v-model="newsletterEmail" 
                      placeholder="Enter your email address"
                      class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    :disabled="newsletterSubscribing"
                    class="px-6 py-3 bg-white text-teal-600 rounded-xl font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    <span v-if="newsletterSubscribing" class="flex items-center gap-2">
                      <svg class="animate-spin h-5 w-5 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subscribing...
                    </span>
                    <span v-else class="flex items-center gap-2">
                      Subscribe
                      <Send class="w-4 h-4" />
                    </span>
                  </button>
                </form>
                
                <!-- Unsubscribe Link (only shown when not subscribed) -->
                <p v-if="!isSubscribed && !newsletterSuccess" class="text-xs text-white/60 mt-3 text-center sm:text-left">
                  By subscribing, you agree to receive our newsletter. 
                  <button @click="showUnsubscribeForm = !showUnsubscribeForm" class="text-white/80 hover:text-white underline transition-colors">
                    Unsubscribe?
                  </button>
                </p>
                
                <!-- Unsubscribe Form (shown when toggled, only when not subscribed) -->
                <div v-if="showUnsubscribeForm && !isSubscribed && !newsletterSuccess" class="mt-3 p-3 bg-white/10 rounded-xl">
                  <form @submit.prevent="handleNewsletterUnsubscribe" class="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="email" 
                      v-model="unsubscribeEmail" 
                      placeholder="Enter your email to unsubscribe"
                      class="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-sm"
                      required
                    />
                    <button 
                      type="submit" 
                      :disabled="newsletterUnsubscribing"
                      class="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ newsletterUnsubscribing ? 'Unsubscribing...' : 'Unsubscribe' }}
                    </button>
                    <button 
                      type="button" 
                      @click="showUnsubscribeForm = false"
                      class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TourBookingModal :isOpen="isTourModalOpen" @close="closeTourModal" />
      <Footer />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import axios from 'axios'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import TourBookingModal from '../components/TourBookingModal.vue'
import { useContact } from '../composables/useContact'
import { useNewsletter } from '../composables/useNewsletter'
import { usePages } from '../composables/usePages'
import { 
  Building2, MapPin, Phone, Mail, Send, Clock, Facebook, Instagram, 
  Twitter, Youtube, MessageCircle, Calendar, CheckCircle2, ChevronRight, 
  Sparkles, Linkedin, X, Award, Shield, Users, Star, Target, Eye, TrendingUp
} from 'lucide-vue-next'

useHead({
  title: 'Contact Us - SylhetStay | Premium Student Accommodation',
  meta: [
    { name: 'description', content: 'Get in touch with SylhetStay. Contact us for inquiries, bookings, or to schedule a tour of our premium student accommodation in Sylhet, Bangladesh.' },
    { name: 'keywords', content: 'contact SylhetStay, student accommodation inquiry, Sylhet student housing, book a tour, SylhetStay contact' },
    { property: 'og:title', content: 'Contact Us - SylhetStay' },
    { property: 'og:description', content: 'Reach out to SylhetStay for any inquiries about our premium student accommodation in Sylhet.' },
    { property: 'og:type', content: 'website' },
  ]
})

// Use composables
const { sending, error: sendError, success, sendEnquiry, reset } = useContact()
const { 
  subscribe: newsletterSubscribe, 
  unsubscribe: newsletterUnsubscribe,
  subscribing: newsletterSubscribing,
  unsubscribing: newsletterUnsubscribing,
  error: newsletterError,
  success: newsletterSuccess,
  resetNewsletter
} = useNewsletter()
const { pageSections, fetchPageData, loading: pagesLoading } = usePages()

// Social media icon mapping
const socialIconMap = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
}

// Social links
const socialLinks = {
  facebook: 'https://facebook.com/sylhetstay',
  instagram: 'https://instagram.com/sylhetstay',
  twitter: 'https://twitter.com/sylhetstay',
  linkedin: 'https://linkedin.com/company/sylhetstay',
}

// Helper to get icon component from icon string
const getIconComponent = (iconString) => {
  if (!iconString) return Award
  const iconMap = {
    'bi-chat': MessageCircle,
    'bi-award-fill': Award,
    'bi-shield-fill': Shield,
    'bi-people': Users,
    'bi-building-fill': Building2,
    'carbon-growth': TrendingUp,
    'feathericon-target': Target,
    'heroicon-o-eye': Eye,
    'heroicon-o-phone': Phone,
    'heroicon-o-clock': Clock,
    'ionicon-location': MapPin,
    'eva-email': Mail,
  }
  return iconMap[iconString] || Award
}

// State
const submitted = ref(false)
const formError = ref('')
const hoveredCard = ref(null)
const isTourModalOpen = ref(false)
const newsletterEmail = ref('')
const unsubscribeEmail = ref('')
const isSubscribed = ref(false)
const subscribedEmail = ref('')
const showUnsubscribeForm = ref(false)
const pageData = ref({})
const loading = ref(true)
const error = ref('')

const formData = ref({ 
  name: '', 
  email: '', 
  phone: '', 
  subject: '', 
  message: '' 
})

// Parse contact section
const parseContactSection = () => {
  const contactSection = pageSections.value.find(s => s.section_key === 'contact-us')
  if (!contactSection) return null
  
  return {
    title: contactSection.title || 'Contact Us',
    subtitle: contactSection.subtitle || 'Get In Touch With Us',
    description: contactSection.description || "We'd love to hear from you. Send us a message!",
    icon: contactSection.icon || 'bi-chat'
  }
}

// Parse contact info from items
const parseContactInfo = () => {
  const contactSection = pageSections.value.find(s => s.section_key === 'contact-us')
  if (!contactSection || !contactSection.items) return []
  
  return contactSection.items.map(item => {
    let details = []
    if (item.description) {
      details = item.description.split('\n').filter(d => d.trim())
    }
    
    return {
      id: item.id,
      title: item.title,
      details: details.length > 0 ? details : [item.subtitle || item.description || 'N/A'],
      icon: item.icon || 'bi-building-fill',
      sort_order: item.sort_order
    }
  }).sort((a, b) => a.sort_order - b.sort_order)
}

// Parse office hours
const parseOfficeHours = () => {
  const officeHoursItem = pageSections.value
    .find(s => s.section_key === 'contact-us')
    ?.items?.find(item => item.icon === 'heroicon-o-clock')
  
  if (!officeHoursItem) return null
  
  const lines = officeHoursItem.description?.split('\n').filter(d => d.trim()) || []
  
  return {
    title: officeHoursItem.title || 'Office Hours',
    lines: lines.map(line => {
      const parts = line.split(':')
      if (parts.length >= 2) {
        return { day: parts[0].trim(), time: parts.slice(1).join(':').trim() }
      }
      return { day: line, time: '' }
    })
  }
}

// Parse emergency contact
const parseEmergencyContact = () => {
  const items = pageSections.value
    .find(s => s.section_key === 'contact-us')
    ?.items || []
  
  // Find phone item that might be emergency contact
  const phoneItem = items.find(item => item.icon === 'heroicon-o-phone')
  if (!phoneItem) return null
  
  const phones = phoneItem.description?.split('\n').filter(d => d.trim()) || []
  
  return {
    title: 'Emergency Contact',
    description: 'Available 24/7 for urgent matters',
    phone: phones[0] || '+880 1711-123456'
  }
}

// Fetch contact data from API
async function fetchContactData() {
  loading.value = true
  error.value = ''
  try {
    // Fetch page data (sections and items) for Contact page (id: 3)
    await fetchPageData(3)
    
    // Parse all sections
    pageData.value.contact = parseContactSection()
    pageData.value.contactInfo = parseContactInfo()
    pageData.value.officeHours = parseOfficeHours()
    pageData.value.emergencyContact = parseEmergencyContact()
    
  } catch (err) {
    console.error('Error fetching contact data:', err)
    error.value = 'Failed to load contact information. Please check your connection and try again.'
  } finally {
    loading.value = false
  }
}

// Computed contact info from API
const contactInfo = computed(() => {
  return pageData.value.contactInfo || []
})

// Office hours computed
const officeHours = computed(() => {
  return pageData.value.officeHours
})

// Emergency contact computed
const emergencyContact = computed(() => {
  return pageData.value.emergencyContact
})

// Newsletter handlers
const handleNewsletterSubscribe = async () => {
  resetNewsletter()
  try {
    await newsletterSubscribe(newsletterEmail.value)
    subscribedEmail.value = newsletterEmail.value
    isSubscribed.value = true
    newsletterEmail.value = ''
  } catch (err) {
    console.error('Newsletter subscription failed:', err)
    isSubscribed.value = false
  }
}

const handleNewsletterUnsubscribe = async () => {
  resetNewsletter()
  try {
    const emailToUnsubscribe = unsubscribeEmail.value || subscribedEmail.value
    await newsletterUnsubscribe(emailToUnsubscribe)
    unsubscribeEmail.value = ''
    showUnsubscribeForm.value = false
    isSubscribed.value = false
    subscribedEmail.value = ''
  } catch (err) {
    console.error('Newsletter unsubscription failed:', err)
  }
}

const resetNewsletterState = () => {
  resetNewsletter()
  if (!isSubscribed.value) {
    newsletterError.value = null
  }
}

const openTourModal = () => {
  isTourModalOpen.value = true
}

const closeTourModal = () => {
  isTourModalOpen.value = false
}

const resetForm = () => {
  submitted.value = false
  formError.value = ''
  formData.value = { name: '', email: '', phone: '', subject: '', message: '' }
  reset()
}

const handleSubmit = async () => {
  formError.value = ''
  
  // Validate form
  if (!formData.value.name || !formData.value.email || !formData.value.subject || !formData.value.message) {
    formError.value = 'Please fill in all required fields'
    return
  }
  
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.value.email)) {
    formError.value = 'Please enter a valid email address'
    return
  }
  
  try {
    const enquiryData = {
      name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone || '',
      subject: formData.value.subject,
      message: formData.value.message
    }
    
    await sendEnquiry(enquiryData)
    submitted.value = true
  } catch (err) {
    formError.value = sendError.value || 'Failed to send message. Please try again.'
    console.error('Error sending enquiry:', err)
  }
}

onMounted(() => {
  fetchContactData()
})
</script>