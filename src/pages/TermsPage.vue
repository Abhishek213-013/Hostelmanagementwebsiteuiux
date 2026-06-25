<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <main>
      <Header />
      <div class="max-w-[1000px] mx-auto px-6 lg:px-12 pt-24 lg:pt-28 pb-20">
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow border border-gray-200 dark:border-gray-700 mb-6">
            <Shield class="w-4 h-4 text-teal-600" />
            <span class="text-sm font-bold tracking-wider text-teal-600 uppercase">Legal</span>
          </div>
          <h1 class="text-4xl lg:text-5xl font-black text-gray-800 dark:text-white mb-4">Terms & Conditions</h1>
          <p class="text-lg text-gray-500 dark:text-gray-400">Please read these terms carefully before booking</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-8 md:p-12 space-y-10">
          <section v-for="(section, i) in sections" :key="i">
            <h2 class="text-xl font-black text-teal-600 mb-4">{{ section.title }}</h2>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ section.content }}</p>
          </section>

          <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Last updated: January 2026. If you have any questions about these terms, please
              <router-link to="/contact" class="text-teal-600 font-bold hover:underline">contact us</router-link>.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  </div>
</template>

<script setup>
import { useHead } from '@vueuse/head'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { Shield } from 'lucide-vue-next'

useHead({
  title: 'Terms & Conditions - SylhetStay | Premium Student Accommodation',
  meta: [
    { name: 'description', content: 'Terms and conditions for booking and using SylhetStay student accommodation services.' },
    { name: 'keywords', content: 'terms and conditions, student accommodation terms, SylhetStay policies' },
  ]
})

const sections = [
  {
    title: '1. Booking and Reservation',
    content: 'By booking a room through SylhetStay, you agree to provide accurate and complete information. All bookings are subject to availability and confirmation. We reserve the right to cancel or modify bookings under extraordinary circumstances with appropriate notice.'
  },
  {
    title: '2. Payment Terms',
    content: 'Full or partial payment may be required at the time of booking to secure your reservation. All payments must be made in the currency specified on the invoice. Late payments may result in cancellation of the booking and applicable fees. We accept various payment methods as listed on our website.'
  },
  {
    title: '3. Cancellation and Refund Policy',
    content: 'Cancellation must be made in writing via email or through your account dashboard. Refund eligibility depends on the notice period: cancellations made 14+ days before move-in date receive a full refund; 7-13 days receive a 50% refund; less than 7 days are non-refundable. Processing fees are non-refundable in all cases.'
  },
  {
    title: '4. Check-In and Check-Out',
    content: 'Check-in time is from 2:00 PM on the scheduled date and check-out is by 11:00 AM. Early check-in or late check-out may be available upon request and subject to additional charges. Government-issued identification is required at check-in.'
  },
  {
    title: '5. Guest Responsibilities',
    content: 'Guests are responsible for maintaining the room and common areas in good condition. Any damage to property beyond normal wear and tear will be charged to the guest. Quiet hours are observed from 10:00 PM to 7:00 AM. Violation of house rules may result in termination of the booking without refund.'
  },
  {
    title: '6. Liability and Indemnification',
    content: 'SylhetStay shall not be liable for any loss, damage, or injury sustained during your stay, except where caused by our negligence. Guests agree to indemnify SylhetStay against any claims arising from their breach of these terms or violation of applicable laws.'
  },
  {
    title: '7. Modifications to Terms',
    content: 'We reserve the right to update or modify these terms at any time without prior notice. Changes will be effective immediately upon posting on this page. It is your responsibility to review these terms periodically. Continued use of our services after any modifications constitutes acceptance of the updated terms.'
  },
  {
    title: '8. Governing Law',
    content: 'These terms shall be governed by and construed in accordance with the laws of Bangladesh. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Sylhet, Bangladesh.'
  }
]
</script>
