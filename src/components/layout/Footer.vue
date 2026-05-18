<template>
  <footer class="relative bg-slate-900 dark:bg-slate-950 text-white py-4 md:py-6">
    <div class="max-w-[1400px] mx-auto px-6 lg:px-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4">
        <div class="space-y-3 md:space-y-4">
          <router-link to="/" class="flex items-center gap-3 mb-3 md:mb-4">
            <img src="@/assets/logo/logo.png" alt="Logo" class="h-12 md:h-16 w-auto" />
          </router-link>
          <div class="flex gap-4">
            <a href="#" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sky-500 transition-all cursor-pointer">
              <Facebook class="w-5 h-5" />
            </a>
            <a href="#" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sky-500 transition-all cursor-pointer">
              <Instagram class="w-5 h-5" />
            </a>
            <a href="#" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sky-500 transition-all cursor-pointer">
              <Twitter class="w-5 h-5" />
            </a>
            <a href="#" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 transition-all cursor-pointer">
              <Youtube class="w-5 h-5" />
            </a>
          </div>
        </div>

        <div v-for="(col, colIndex) in footerColumns" :key="col.title" :class="colIndex < 2 ? 'hidden md:block' : ''">
          <h4 class="font-black mb-3 md:mb-4">{{ col.title }}</h4>
          <div class="space-y-2">
            <div v-for="link in col.links" :key="link.label">
<a v-if="link.path.startsWith('#') || link.path.startsWith('tel:') || link.path.startsWith('mailto:')" 
                  :href="link.path" class="text-muted-foreground hover:text-white transition-colors cursor-pointer">
                 {{ link.label }}
               </a>
               <router-link v-else :to="link.path" class="text-muted-foreground hover:text-white transition-colors cursor-pointer">
                 {{ link.label }}
               </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="bg-gradient-to-r from-sky-500/20 to-emerald-500/20 dark:from-sky-500/30 dark:to-emerald-500/30 rounded-3xl p-4 mb-6 border border-white/10">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="text-center md:text-left">
            <h4 class="font-black text-2xl mb-2">Subscribe to Our Newsletter</h4>
            <p class="text-muted-foreground">Get the latest updates and offers directly to your inbox</p>
          </div>
          <div class="flex gap-3 w-full md:w-auto">
            <div class="relative flex-1 md:w-72">
              <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="email" placeholder="Enter your email" 
                     class="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all" />
            </div>
            <button class="px-6 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl font-bold hover:scale-105 transition-all flex items-center gap-2">
              <Send class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div> -->

      <div class="border-t border-slate-800 dark:border-slate-700 pt-2 md:pt-3 text-center text-muted-foreground">
        <p>&copy; 2026 SylhetStay Hostel. All rights reserved.</p>
        <p class="mt-1">Developed By - <a href="https://itlabsolutions.com" target="_blank" rel="noopener noreferrer" class="hover:text-sky-500 transition-colors">IT Lab Solutions Ltd.</a></p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Facebook, Instagram, Twitter, Youtube, Mail, Send } from 'lucide-vue-next'

const footerColumns = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Rooms', path: '/rooms' },
      { label: 'Facilities', path: '/facilities' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'About Us', path: '/about' }
    ]
  },
  {
    title: 'Information',
    links: [
      { label: 'Admission', path: '/rooms' },
      { label: 'Payment', path: '/rooms' },
      { label: 'FAQs', path: '/about' },
      { label: 'Terms', path: '/about' }
    ]
  },
  {
    title: 'Contact',
    links: [
      { label: '123 Akhalia Road', path: '/contact' },
      { label: '+880 1711-123456', path: 'tel:+8801711123456' },
      { label: 'info@sylhetstay.com', path: 'mailto:info@sylhetstay.com' }
    ]
  }
]
</script>
