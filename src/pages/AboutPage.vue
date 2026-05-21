<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading about page...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="fetchAboutData" class="px-6 py-2 bg-teal-600 text-white rounded-lg">Retry</button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <Header />
      <div class="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <!-- Hero Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div class="space-y-8">
            <div class="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow border border-gray-200 dark:border-gray-700">
              <div class="p-2 bg-teal-600 rounded-xl">
                <Award class="w-4 h-4 text-white" />
              </div>
              <span class="text-sm font-bold tracking-wider text-teal-600 uppercase">Est. {{ pageData.established || '2020' }}</span>
            </div>
            <h1 class="text-3xl lg:text-5xl font-black leading-[1.1] tracking-tight">
              <span class="block text-teal-600">Creating</span>
              <span class="block text-gray-800 dark:text-white">Home Away</span>
              <span class="block mt-2 text-teal-600 text-4xl lg:text-6xl">From Home</span>
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
              {{ pageData.story || 'Providing exceptional accommodation to students pursuing their academic dreams.' }}
            </p>
            <div class="flex flex-wrap gap-4 pt-4">
              <button @click="openTourModal" class="group px-8 py-4 text-white rounded-2xl font-bold shadow hover:shadow-xl flex items-center gap-3 cursor-pointer" style="background: #0d9488">
                <Calendar class="w-5 h-5" />
                <span>Book a Tour</span>
                <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <router-link to="/contact" class="px-8 py-4 bg-white dark:bg-gray-800 text-teal-800 dark:text-teal-200 rounded-2xl font-bold border-2 border-gray-200 dark:border-gray-700 hover:border-teal-500 transition-all flex items-center gap-3 shadow hover:shadow-xl">
                <Phone class="w-5 h-5" />
                Contact Us
              </router-link>
            </div>
          </div>
          <div class="relative">
            <div class="relative grid grid-cols-2 gap-4">
              <div v-for="(item, i) in aboutImages" :key="i" :class="['group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 border-2 border-gray-200 dark:border-gray-700', i % 2 === 1 ? 'mt-8' : '']">
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                <img :src="item.src" :alt="item.label" class="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-700" />
                <div class="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span class="px-3 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full text-sm font-bold text-gray-800 dark:text-gray-200">{{ item.label }}</span>
                </div>
                <div class="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-teal-600">
                  <Sparkles class="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          <div v-for="stat in stats" :key="stat.label" class="group bg-white dark:bg-gray-800 hover:bg-teal-600 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700 hover:border-teal-500 text-center transition-all duration-300">
            <div class="w-12 h-12 mx-auto mb-4 rounded-2xl bg-teal-600 group-hover:bg-white flex items-center justify-center shadow transition-all duration-300">
              <component :is="stat.icon" class="w-5 h-5 text-white group-hover:text-teal-600" />
            </div>
            <div class="text-2xl font-black mb-2 text-teal-600 group-hover:text-white flex items-center justify-center gap-1 transition-colors duration-300">
              {{ stat.num }}<span v-if="stat.suffix" class="text-2xl">{{ stat.suffix }}</span>
            </div>
            <div class="text-gray-600 dark:text-gray-400 group-hover:text-teal-100 font-semibold transition-colors duration-300">{{ stat.label }}</div>
          </div>
        </div>

        <!-- Mission & Vision -->
        <div v-if="pageData.mission || pageData.vision" class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div v-if="pageData.mission" class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow border border-gray-200 dark:border-gray-700">
            <div class="w-12 h-12 rounded-2xl mb-6 bg-teal-600 flex items-center justify-center">
              <Target class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-2xl font-black mb-4 text-teal-600">Our Mission</h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ pageData.mission }}</p>
          </div>
          <div v-if="pageData.vision" class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow border border-gray-200 dark:border-gray-700">
            <div class="w-12 h-12 rounded-2xl mb-6 bg-teal-600 flex items-center justify-center">
              <Eye class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-2xl font-black mb-4 text-teal-600">Our Vision</h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ pageData.vision }}</p>
          </div>
        </div>

        <!-- Values Section -->
        <div v-if="pageData.core_values" class="mb-20">
          <div class="text-center mb-10">
            <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Award class="w-5 h-5 text-teal-600" />
              <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">Our Principles</span>
            </div>
            <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600">Core Values</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">The principles that guide everything we do and define our commitment to excellence</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="value in pageData.core_values" :key="value.title" class="group bg-white dark:bg-gray-800 hover:bg-teal-600 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700 hover:border-teal-500 transition-all duration-300">
              <div class="w-12 h-12 rounded-2xl mb-6 bg-teal-600 group-hover:bg-white flex items-center justify-center shadow transition-all duration-300">
                <component :is="iconMap[value.icon] || Award" class="w-5 h-5 text-white group-hover:text-teal-600" />
              </div>
              <h3 class="text-xl font-black mb-3 text-teal-600 group-hover:text-white transition-colors duration-300">{{ value.title }}</h3>
              <p class="text-gray-600 dark:text-gray-400 group-hover:text-teal-100 leading-relaxed transition-colors duration-300">{{ value.description }}</p>
            </div>
          </div>
        </div>

        <!-- Timeline Section -->
        <div v-if="pageData.timeline" class="mb-20">
          <div class="text-center mb-10">
            <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Sparkles class="w-5 h-5 text-amber-500" />
              <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">Our Story</span>
            </div>
            <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600">Our Journey</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">From humble beginnings to industry leadership</p>
          </div>
          <div class="relative">
            <div class="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gray-200"></div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div v-for="(milestone, i) in pageData.timeline" :key="i" 
                   class="relative group"
                   @mouseenter="activeMilestone = i"
                   @mouseleave="activeMilestone = null">
                <div class="relative z-10 w-15 h-15 mx-auto mb-6 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow bg-teal-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Clock class="w-5 h-5" />
                </div>
                <div :class="['bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700 transition-all duration-500', activeMilestone === i ? 'shadow-lg -translate-y-2 border-teal-400' : '']">
                  <div class="text-center">
                    <div class="text-xl font-black mb-1 text-teal-600">{{ milestone.year }}</div>
                    <h4 class="text-base font-black mb-2 text-teal-600">{{ milestone.event }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ milestone.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Achievements Section -->
        <div v-if="pageData.achievements" class="mb-20">
          <div class="text-center mb-10">
            <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Award class="w-5 h-5 text-teal-600" />
              <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">Recognition</span>
            </div>
            <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600">Achievements</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">Milestones that define our success</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="achievement in pageData.achievements" :key="achievement.year" class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700">
              <div class="text-3xl font-black mb-2 text-teal-600">{{ achievement.year }}</div>
              <h4 class="text-lg font-black mb-2 text-teal-600">{{ achievement.title }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ achievement.description }}</p>
            </div>
          </div>
        </div>

        <!-- Nearby Universities -->
        <div v-if="pageData.nearby_universities" class="mb-20">
          <div class="text-center mb-10">
            <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <MapPin class="w-5 h-5 text-teal-600" />
              <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">Prime Location</span>
            </div>
            <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600">Nearby Universities</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">Located within minutes of major educational institutions</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="uni in pageData.nearby_universities" :key="uni.name" class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700 flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center flex-shrink-0">
                <Building2 class="w-6 h-6 text-white" />
              </div>
              <div class="flex-1">
                <h4 class="font-black text-teal-600">{{ uni.name }}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ uni.full_name }}</p>
              </div>
              <div class="text-right">
                <div class="font-bold text-teal-600">{{ uni.distance_km }} km</div>
                <div class="text-xs text-gray-500">{{ uni.travel_time_minutes }} min</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Section (from JSON if available, else default) -->
        <div v-if="pageData.team_stats" class="mb-20">
          <div class="text-center mb-10">
            <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Users class="w-5 h-5 text-teal-600" />
              <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">The People</span>
            </div>
            <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600">Meet Our Team</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">Dedicated professionals committed to your success</p>
          </div>
          
          <!-- Team Stats -->
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            <div v-if="pageData.team_stats.total_employees" class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow border border-gray-200 dark:border-gray-700">
              <div class="text-2xl font-black text-teal-600">{{ pageData.team_stats.total_employees }}</div>
              <div class="text-sm text-gray-500">Total Team</div>
            </div>
            <div v-if="pageData.team_stats.management" class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow border border-gray-200 dark:border-gray-700">
              <div class="text-2xl font-black text-teal-600">{{ pageData.team_stats.management }}</div>
              <div class="text-sm text-gray-500">Management</div>
            </div>
            <div v-if="pageData.team_stats.security_staff" class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow border border-gray-200 dark:border-gray-700">
              <div class="text-2xl font-black text-teal-600">{{ pageData.team_stats.security_staff }}</div>
              <div class="text-sm text-gray-500">Security</div>
            </div>
            <div v-if="pageData.team_stats.maintenance_staff" class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow border border-gray-200 dark:border-gray-700">
              <div class="text-2xl font-black text-teal-600">{{ pageData.team_stats.maintenance_staff }}</div>
              <div class="text-sm text-gray-500">Maintenance</div>
            </div>
            <div v-if="pageData.team_stats.housekeeping" class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow border border-gray-200 dark:border-gray-700">
              <div class="text-2xl font-black text-teal-600">{{ pageData.team_stats.housekeeping }}</div>
              <div class="text-sm text-gray-500">Housekeeping</div>
            </div>
          </div>

          <!-- Team Members -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="member in teamMembers" :key="member.name" class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
              <div class="relative h-72 overflow-hidden">
                <img :src="member.image" :alt="member.name" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              </div>
              <div class="p-6">
                <h4 class="text-xl font-black mb-1 text-teal-600">{{ member.name }}</h4>
                <p class="text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">{{ member.role }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ member.bio }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Location Info -->
        <div v-if="pageData.location" class="mb-20 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow border border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center">
              <MapPin class="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 class="text-xl font-black text-teal-600">Our Location</h3>
              <p class="text-gray-600 dark:text-gray-400">{{ pageData.location }}</p>
            </div>
          </div>
        </div>

        <!-- Founder Info -->
        <div v-if="pageData.founded_by" class="mb-20 bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 text-white text-center">
          <Users class="w-12 h-12 mx-auto mb-4 text-white/80" />
          <p class="text-lg text-white/80 mb-2">Founded by</p>
          <h3 class="text-2xl font-black">{{ pageData.founded_by }}</h3>
        </div>

        <!-- CTA Section -->
        <div class="bg-teal-600 rounded-2xl p-12 md:p-20 text-white text-center">
          <h2 class="text-2xl lg:text-3xl font-black mb-6">Ready to Join Our Community?</h2>
          <p class="text-lg text-white/90 mb-10 max-w-2xl mx-auto">Be part of a thriving student community that supports your academic journey and creates lifelong memories</p>
          <div class="flex flex-wrap justify-center gap-4">
            <router-link to="/rooms" class="px-10 py-5 bg-white text-teal-600 rounded-xl font-black flex items-center gap-3">
              <Calendar class="w-5 h-5" />
              Book Your Room
              <ChevronRight class="w-5 h-5" />
            </router-link>
            <router-link to="/contact" class="px-10 py-5 bg-teal-700 text-white rounded-xl font-black border-2 border-teal-500 flex items-center gap-3">
              <Phone class="w-5 h-5" />
              Contact Us
            </router-link>
          </div>
        </div>
        <TourBookingModal :isOpen="isTourModalOpen" @close="closeTourModal" />
      </div>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import TourBookingModal from '../components/TourBookingModal.vue'
import { 
  Building2, Award, Sparkles, Users, Star, BookOpen, Shield, Wifi, Wind, 
  Utensils, Coffee, Dumbbell, Car, Calendar, MapPin, Phone, TrendingUp, 
  Heart, Clock, Target, CheckCircle2, ArrowRight, ChevronRight, Eye 
} from 'lucide-vue-next'

// Icon mapping for dynamic icons from JSON
const iconMap = {
  'shield': Shield,
  'users': Users,
  'dollar-sign': Award,
  'trending-up': TrendingUp,
  'heart': Heart,
  'target': Target,
  'book-open': BookOpen,
  'star': Star,
  'award': Award,
}

const activeMilestone = ref(null)
const isTourModalOpen = ref(false)
const pageData = ref({})
const loading = ref(true)
const error = ref('')

const openTourModal = () => {
  isTourModalOpen.value = true
}

const closeTourModal = () => {
  isTourModalOpen.value = false
}

// Fetch data from JSON
async function fetchAboutData() {
  loading.value = true
  error.value = ''
  try {
    const response = await axios.get('https://raw.githubusercontent.com/Abhishek213-013/dummyJson/refs/heads/main/content_about.json')
    pageData.value = response.data
  } catch (err) {
    console.error('Error fetching about page data:', err)
    error.value = 'Failed to load content. Please check your connection and try again.'
  } finally {
    loading.value = false
  }
}

// Static data that stays as fallback
const aboutImages = [
  { src: 'https://images.unsplash.com/photo-1620332372374-f108c53d2e03?w=600', label: 'Modern Rooms' },
  { src: 'https://images.unsplash.com/photo-1721299417031-de890ff33b26?w=600', label: 'Premium Suites' },
  { src: 'https://images.unsplash.com/photo-1753505888770-46be3b748b41?w=600', label: 'Study Areas' },
  { src: 'https://images.unsplash.com/photo-1753505889211-9cfbac527474?w=600', label: 'Common Spaces' }
]

const stats = [
  { num: '150+', label: 'Happy Students', icon: Users },
  { num: '4.8', label: 'Rating', icon: Star, suffix: '/5' },
  { num: '50+', label: 'Room Options', icon: Building2 },
  { num: '24/7', label: 'Security', icon: Shield }
]

const teamMembers = [
  { name: 'Md. Rahman', role: 'Managing Director', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600', bio: 'Leading with vision and dedication' },
  { name: 'Fatima Hassan', role: 'Operations Manager', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600', bio: 'Ensuring excellence in daily operations' },
  { name: 'Ahmed Khan', role: 'Facility Head', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600', bio: 'Maintaining world-class facilities' },
  { name: 'Sara Islam', role: 'Student Coordinator', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600', bio: 'Building vibrant student community' }
]

onMounted(() => {
  fetchAboutData()
})
</script>