<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <main>
      <Header />
      <div class="max-w-[1000px] mx-auto px-6 lg:px-12 pt-24 lg:pt-28 pb-20">
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow border border-gray-200 dark:border-gray-700 mb-6">
            <Lock class="w-4 h-4 text-teal-600" />
            <span class="text-sm font-bold tracking-wider text-teal-600 uppercase">Privacy</span>
          </div>
          <h1 class="text-4xl lg:text-5xl font-black text-gray-800 dark:text-white mb-4">Privacy Policy</h1>
          <p class="text-lg text-gray-500 dark:text-gray-400">How we collect, use, and protect your information</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-8 md:p-12 space-y-10">
          <section v-for="(section, i) in sections" :key="i">
            <h2 class="text-xl font-black text-teal-600 mb-4">{{ section.title }}</h2>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ section.content }}</p>
          </section>

          <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Last updated: January 2026. If you have any questions about our privacy practices, please
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
import { Lock } from 'lucide-vue-next'

useHead({
  title: 'Privacy Policy - SylhetStay | Premium Student Accommodation',
  meta: [
    { name: 'description', content: 'Privacy policy for SylhetStay student accommodation. Learn how we collect, use, and protect your personal information.' },
    { name: 'keywords', content: 'privacy policy, data protection, SylhetStay privacy, student accommodation privacy' },
  ]
})

const sections = [
  {
    title: '1. Information We Collect',
    content: 'We collect information you provide directly, including your name, email address, phone number, payment information, and identification documents when you create an account, make a booking, or contact us. We also automatically collect certain information when you visit our website, such as your IP address, browser type, device information, and usage data through cookies and similar technologies.'
  },
  {
    title: '2. How We Use Your Information',
    content: 'We use your information to process and manage your bookings, communicate with you about your reservation, send important service updates, improve our services, personalize your experience, and comply with legal obligations. We may also use your information to send promotional materials if you have consented to receive them.'
  },
  {
    title: '3. Cookies and Tracking',
    content: 'Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from. You can control cookie preferences through your browser settings. Disabling certain cookies may affect the functionality of our website.'
  },
  {
    title: '4. Data Sharing and Third Parties',
    content: 'We do not sell your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, processing payments, and delivering services, provided they agree to keep your information confidential. We may also disclose information when required by law or to protect our rights.'
  },
  {
    title: '5. Data Security',
    content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of sensitive data, secure servers, and regular security audits. However, no method of transmission over the Internet is 100% secure.'
  },
  {
    title: '6. Your Rights',
    content: 'You have the right to access, correct, update, or delete your personal information at any time through your account settings. You may also object to or restrict certain processing of your data, and request data portability. To exercise any of these rights, please contact us through the contact page.'
  },
  {
    title: '7. Data Retention',
    content: 'We retain your personal information for as long as your account is active or as needed to provide you services. We may retain certain information longer for legal, tax, or accounting obligations. When we no longer have a legitimate business need to process your information, we will securely delete or anonymize it.'
  },
  {
    title: '8. Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.'
  }
]
</script>
