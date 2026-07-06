<template>
  <footer class="relative bg-slate-900 dark:bg-slate-950 text-white py-4 md:py-6">
    <div class="max-w-[1400px] mx-auto px-6 lg:px-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4">
        <div class="space-y-3 md:space-y-4">
          <router-link to="/" class="flex items-center gap-3 mb-3 md:mb-4">
            <img :src="logoUrl || defaultLogo" alt="Logo" class="h-12 md:h-16 w-auto" />
          </router-link>
          <div class="flex gap-4">
            <a v-if="socialLinks.facebook" :href="socialLinks.facebook" aria-label="Facebook" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sky-500 transition-all cursor-pointer">
              <Facebook class="w-5 h-5" />
            </a>
            <a v-if="socialLinks.instagram" :href="socialLinks.instagram" aria-label="Instagram" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sky-500 transition-all cursor-pointer">
              <Instagram class="w-5 h-5" />
            </a>
            <a v-if="socialLinks.twitter" :href="socialLinks.twitter" aria-label="Twitter" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sky-500 transition-all cursor-pointer">
              <Twitter class="w-5 h-5" />
            </a>
            <a v-if="socialLinks.youtube" :href="socialLinks.youtube" aria-label="Youtube" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 transition-all cursor-pointer">
              <Youtube class="w-5 h-5" />
            </a>
          </div>
        </div>

        <div v-for="(col, colIndex) in columns" :key="col.title" :class="colIndex < 2 ? 'hidden md:block' : ''">
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

      <div class="border-t border-slate-800 dark:border-slate-700 pt-2 md:pt-3 text-center text-muted-foreground">
        <p>{{ copyrightText }}</p>
        <p class="mt-1">Developed By - <a href="https://itlabsolutions.com" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 hover:text-sky-500 transition-colors"><img src="@/assets/logo/itlabsolutions-bg-white.webp" alt="IT Lab Solutions" class="h-5 w-auto inline-block" /> IT Lab Solutions Ltd.</a></p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { usePages } from '../../composables/usePages'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-vue-next'
import defaultLogo from '@/assets/logo/logo.png'

const API_BASE_URL = 'https://dev.hostel.accounting.itlab.solutions'
const logoUrl = ref('')
const copyrightText = ref('\u00a9 2026 SylhetStay Hostel. All rights reserved.')
const socialLinks = ref({
  facebook: '',
  instagram: '',
  twitter: '',
  youtube: ''
})
const columns = ref([
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
])

const getFullImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  return `${API_BASE_URL}/storage/${cleanPath}`
}

const parseLinks = (text) => {
  if (!text) return []
  return text.split('\n').filter(line => line.trim()).map(line => {
    const parts = line.split('|')
    return { label: parts[0]?.trim() || '', path: parts[1]?.trim() || '#' }
  })
}

const loadFooter = () => {
  const { fetchFooterSection } = usePages()
  fetchFooterSection(1).then(footerSection => {
    if (!footerSection?.items?.length) return

    const items = footerSection.items

    // Logo
    const logoItem = items.find(item => item.title === 'footer_logo' && item.status == 1)
    if (logoItem?.image) {
      logoUrl.value = getFullImageUrl(logoItem.image)
    }

    // Social links
    const fbItem = items.find(item => item.title === 'social_fb' && item.status == 1)
    if (fbItem?.subtitle) socialLinks.value.facebook = fbItem.subtitle

    const igItem = items.find(item => item.title === 'social_ig' && item.status == 1)
    if (igItem?.subtitle) socialLinks.value.instagram = igItem.subtitle

    const twItem = items.find(item => item.title === 'social_tw' && item.status == 1)
    if (twItem?.subtitle) socialLinks.value.twitter = twItem.subtitle

    const ytItem = items.find(item => item.title === 'social_yt' && item.status == 1)
    if (ytItem?.subtitle) socialLinks.value.youtube = ytItem.subtitle

    // Columns
    const colItems = items
      .filter(item => item.title?.startsWith('col_') && item.status == 1)
      .sort((a, b) => a.title.localeCompare(b.title))
    if (colItems.length > 0) {
      columns.value = colItems.map(item => ({
        title: item.subtitle || 'Links',
        links: parseLinks(item.description)
      }))
    }

    // Copyright
    const copyrightItem = items.find(item => item.title === 'copyright' && item.status == 1)
    if (copyrightItem?.description) {
      copyrightText.value = copyrightItem.description
    }
  }).catch(() => {})
}

onMounted(() => {
  loadFooter()
  window.addEventListener('footerUpdated', loadFooter)
  window.addEventListener('logoUpdated', loadFooter)
})

onUnmounted(() => {
  window.removeEventListener('footerUpdated', loadFooter)
  window.removeEventListener('logoUpdated', loadFooter)
})
</script>
