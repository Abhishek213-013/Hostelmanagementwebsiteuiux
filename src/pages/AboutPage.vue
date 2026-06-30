<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <main v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading about page...</p>
      </div>
    </main>

    <!-- Error State -->
    <main v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md">
          <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
          <button @click="fetchAllData" class="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all">
            Try Again
          </button>
        </div>
      </div>
    </main>

    <!-- Main Content -->
    <main v-else>
      <Header />
      <div class="max-w-[1400px] mx-auto px-6 lg:px-12 pt-24 lg:pt-28 pb-20">
        <!-- Hero Section / About Us -->
        <div v-if="pageData.about" class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div class="space-y-8">
            <div class="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow border border-gray-200 dark:border-gray-700">
              <div class="p-2 bg-teal-600 rounded-xl">
                <Award class="w-4 h-4 text-white" />
              </div>
              <span class="text-sm font-bold tracking-wider text-teal-600 uppercase">{{ pageData.about.badge }}</span>
            </div>
            <h1 class="text-3xl lg:text-5xl font-black leading-[1.1] tracking-tight">
              <span class="block text-teal-600">{{ pageData.about.headline_part1 }}</span>
              <span class="block text-gray-800 dark:text-white">{{ pageData.about.headline_part2 }}</span>
              <span class="block mt-2 text-teal-600 text-4xl lg:text-6xl">{{ pageData.about.headline_part3 }}</span>
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
              {{ pageData.about.description }}
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
              <div v-for="(item, i) in pageData.about.images" :key="i" :class="['group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 border-2 border-gray-200 dark:border-gray-700', i % 2 === 1 ? 'mt-8' : '']">
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
        <div v-if="pageData.stats" class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          <div v-for="stat in pageData.stats" :key="stat.label" class="group bg-white dark:bg-gray-800 hover:bg-teal-600 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700 hover:border-teal-500 text-center transition-all duration-300">
            <div class="w-12 h-12 mx-auto mb-4 rounded-2xl bg-teal-600 group-hover:bg-white flex items-center justify-center shadow transition-all duration-300">
              <component :is="stat.icon" class="w-5 h-5 text-white group-hover:text-teal-600" />
            </div>
            <div class="text-2xl font-black mb-2 text-teal-600 group-hover:text-white flex items-center justify-center gap-1 transition-colors duration-300">
              {{ stat.num }}<span v-if="stat.suffix" class="text-2xl">{{ stat.suffix }}</span>
            </div>
            <div class="text-gray-600 dark:text-gray-400 group-hover:text-teal-100 font-semibold transition-colors duration-300">{{ stat.label }}</div>
          </div>
        </div>

        <!-- Mission -->
        <div v-if="pageData.mission" class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div v-if="pageData.mission" class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow border border-gray-200 dark:border-gray-700">
            <div class="w-12 h-12 rounded-2xl mb-6 bg-teal-600 flex items-center justify-center">
              <Target class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-2xl font-black mb-4 text-teal-600">Our Mission</h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ pageData.mission.description }}</p>
          </div>
          <div v-if="pageData.vision" class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow border border-gray-200 dark:border-gray-700">
            <div class="w-12 h-12 rounded-2xl mb-6 bg-teal-600 flex items-center justify-center">
              <Eye class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-2xl font-black mb-4 text-teal-600">Our Vision</h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ pageData.vision.description }}</p>
          </div>
        </div>

        <!-- Core Values -->
        <div v-if="pageData.core_values && pageData.core_values.length > 0" class="mb-20">
          <div class="text-center mb-10">
            <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Award class="w-5 h-5 text-teal-600" />
              <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">Our Principles</span>
            </div>
            <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600">Core Values</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">The principles that guide everything we do and define our commitment to excellence</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="value in pageData.core_values" :key="value.id" class="group bg-white dark:bg-gray-800 hover:bg-teal-600 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700 hover:border-teal-500 transition-all duration-300">
              <div class="w-12 h-12 rounded-2xl mb-6 bg-teal-600 group-hover:bg-white flex items-center justify-center shadow transition-all duration-300">
                <component :is="getIconComponent(value.icon)" class="w-5 h-5 text-white group-hover:text-teal-600" />
              </div>
              <h3 class="text-xl font-black mb-3 text-teal-600 group-hover:text-white transition-colors duration-300">{{ value.title }}</h3>
              <p class="text-gray-600 dark:text-gray-400 group-hover:text-teal-100 leading-relaxed transition-colors duration-300">{{ value.description }}</p>
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div v-if="pageData.timeline && pageData.timeline.length > 0" class="mb-20">
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
                    <h4 class="text-base font-black mb-2 text-teal-600">{{ milestone.title }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ milestone.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Achievements -->
        <div v-if="pageData.achievements && pageData.achievements.length > 0" class="mb-20">
          <div class="text-center mb-10">
            <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Award class="w-5 h-5 text-teal-600" />
              <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">Recognition</span>
            </div>
            <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600">Achievements</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">Milestones that define our success</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="achievement in pageData.achievements" :key="achievement.id" class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700">
              <div class="text-3xl font-black mb-2 text-teal-600">{{ achievement.year }}</div>
              <h4 class="text-lg font-black mb-2 text-teal-600">{{ achievement.title }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ achievement.description }}</p>
            </div>
          </div>
        </div>

        <!-- Nearby Universities -->
        <div v-if="pageData.nearby_universities && pageData.nearby_universities.length > 0" class="mb-20">
          <div class="text-center mb-10">
            <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <MapPin class="w-5 h-5 text-teal-600" />
              <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">Prime Location</span>
            </div>
            <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600">Nearby Universities</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">Located within minutes of major educational institutions</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="uni in pageData.nearby_universities" :key="uni.id" class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700 flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center flex-shrink-0">
                <Building2 class="w-6 h-6 text-white" />
              </div>
              <div class="flex-1">
                <h4 class="font-black text-teal-600">{{ uni.title }}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ uni.subtitle }}</p>
              </div>
              <div class="text-right">
                <div class="font-bold text-teal-600">{{ uni.distance || '2' }} km</div>
                <div class="text-xs text-gray-500">{{ uni.time || '5' }} min</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Section (lazy loaded) -->
        <div data-lazy-team class="mb-20">
          <!-- Loading State -->
          <div v-if="teamLoading" class="text-center py-20">
            <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400">Loading team...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="teamError" class="text-center py-10">
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md mx-auto">
              <p class="text-red-600 dark:text-red-400">{{ teamError }}</p>
            </div>
          </div>

          <!-- Team Content -->
          <template v-else-if="teamMembers.length > 0">
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
              <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow border border-gray-200 dark:border-gray-700">
                <div class="text-2xl font-black text-teal-600">{{ teamMembers.length }}</div>
                <div class="text-sm text-gray-500">Total Team</div>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow border border-gray-200 dark:border-gray-700">
                <div class="text-2xl font-black text-teal-600">{{ teamDepartments }}</div>
                <div class="text-sm text-gray-500">Departments</div>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow border border-gray-200 dark:border-gray-700">
                <div class="text-2xl font-black text-teal-600">{{ teamExperience }}</div>
                <div class="text-sm text-gray-500">Avg. Experience</div>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow border border-gray-200 dark:border-gray-700">
                <div class="text-2xl font-black text-teal-600">{{ activeMembers }}</div>
                <div class="text-sm text-gray-500">Active Members</div>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow border border-gray-200 dark:border-gray-700">
                <div class="text-2xl font-black text-teal-600">{{ earliestJoinYear }}</div>
                <div class="text-sm text-gray-500">Since</div>
              </div>
            </div>

            <!-- Team Members Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div v-for="member in teamMembers" :key="member.id" 
                   class="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                   @click="selectedMember = selectedMember?.id === member.id ? null : member">
                <div class="relative h-72 overflow-hidden">
                  <img :src="member.avatar" :alt="member.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                  
                  <!-- Active/Inactive Badge -->
                  <div class="absolute top-4 right-4">
                    <span :class="['px-2 py-1 rounded-full text-xs font-bold shadow', 
                      member.is_active ? 'bg-teal-600 text-white' : 'bg-red-500 text-white']">
                      {{ member.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                  
                  <!-- Contact Info Overlay -->
                  <div class="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="flex gap-2">
                      <a v-if="member.email" :href="`mailto:${member.email}`" 
                         class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors"
                         @click.stop>
                        <Mail class="w-4 h-4 text-white" />
                      </a>
                      <a v-if="member.phone" :href="`tel:${member.phone.replace(/\s/g, '')}`"
                         class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors"
                         @click.stop>
                        <Phone class="w-4 h-4 text-white" />
                      </a>
                    </div>
                  </div>
                </div>
                <div class="p-6">
                  <h4 class="text-xl font-black mb-1 text-teal-600">{{ member.name }}</h4>
                  <p class="text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">{{ member.role }}</p>
                  
                  <!-- Short Bio -->
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{{ member.short_bio }}</p>
                  
                  <!-- Joined Date -->
                  <div class="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar class="w-3 h-3" />
                    <span>Joined {{ formatDate(member.joining_date) }}</span>
                  </div>

                  <!-- Expand Indicator -->
                  <div class="text-center mt-3">
                    <ChevronDown :class="['w-5 h-5 text-teal-600 transition-transform mx-auto', 
                      selectedMember?.id === member.id ? 'rotate-180' : '']" />
                  </div>
                </div>
                
                <!-- Expanded Details -->
                <div v-if="selectedMember?.id === member.id" 
                     class="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                  <!-- Full Bio -->
                  <div>
                    <h5 class="text-xs font-bold text-teal-600 mb-2 uppercase">About</h5>
                    <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ member.bio }}</p>
                  </div>
                  
                  <!-- Contact Info -->
                  <div>
                    <h5 class="text-xs font-bold text-teal-600 mb-2 uppercase">Contact</h5>
                    <div class="space-y-1">
                      <a v-if="member.email" :href="`mailto:${member.email}`" 
                         class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 transition-colors">
                        <Mail class="w-4 h-4" /> {{ member.email }}
                      </a>
                      <a v-if="member.phone" :href="`tel:${member.phone.replace(/\s/g, '')}`"
                         class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 transition-colors">
                        <Phone class="w-4 h-4" /> {{ member.phone }}
                      </a>
                    </div>
                  </div>
                  
                  <!-- Social Links -->
                  <div v-if="member.social_links && Object.keys(member.social_links).filter(k => member.social_links[k]).length > 0">
                    <h5 class="text-xs font-bold text-teal-600 mb-2 uppercase">Social</h5>
                    <div class="flex gap-2">
                      <a v-if="member.social_links.facebook" :href="member.social_links.facebook" target="_blank" rel="noopener noreferrer"
                         class="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors">
                        <Facebook class="w-4 h-4" />
                      </a>
                      <a v-if="member.social_links.linkedin" :href="member.social_links.linkedin" target="_blank" rel="noopener noreferrer"
                         class="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors">
                        <Linkedin class="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- CTA Section -->
        <div class="bg-teal-600 rounded-2xl p-12 md:p-20 text-white text-center">
          <h2 class="text-2xl lg:text-3xl font-black mb-6">Ready to Join Our Community?</h2>
          <p class="text-lg text-white/90 mb-10 max-w-2xl mx-auto">Be part of a thriving student community that supports your academic journey and creates lifelong memories</p>
          <div class="flex flex-wrap justify-center gap-4">
            <router-link to="/rooms" class="px-10 py-5 bg-white text-teal-600 rounded-xl font-black flex items-center gap-3 hover:shadow-lg transition-all">
              <Calendar class="w-5 h-5" />
              Book Your Room
              <ChevronRight class="w-5 h-5" />
            </router-link>
            <router-link to="/contact" class="px-10 py-5 bg-teal-700 text-white rounded-xl font-black border-2 border-teal-500 flex items-center gap-3 hover:bg-teal-800 transition-all">
              <Phone class="w-5 h-5" />
              Contact Us
            </router-link>
          </div>
        </div>
        <TourBookingModal :isOpen="isTourModalOpen" @close="closeTourModal" />
      </div>
      <Footer />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useHead } from '@vueuse/head'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import TourBookingModal from '../components/TourBookingModal.vue'
import { useTeam } from '../composables/useTeam'
import { useLazyLoader } from '../composables/useLazyLoader'
import { usePages } from '../composables/usePages'
import { 
  Building2, Award, Sparkles, Users, Star, BookOpen, Shield, Wifi, Wind, 
  Utensils, Coffee, Dumbbell, Car, Calendar, MapPin, Phone, TrendingUp, 
  Heart, Clock, Target, CheckCircle2, ArrowRight, ChevronRight, ChevronDown,
  Eye, Mail, Globe, Facebook, Linkedin
} from 'lucide-vue-next'

useHead({
  title: 'About Us - SylhetStay | Premium Student Accommodation',
  meta: [
    { name: 'description', content: 'Learn about SylhetStay - our mission, vision, and journey in providing premium student accommodation in Sylhet, Bangladesh. Meet our team and discover our core values.' },
    { name: 'keywords', content: 'about SylhetStay, student accommodation Sylhet, our mission, team, student housing Bangladesh' },
    { property: 'og:title', content: 'About Us - SylhetStay | Premium Student Accommodation' },
    { property: 'og:description', content: 'Discover the story behind SylhetStay and our commitment to providing the best student living experience in Sylhet.' },
    { property: 'og:type', content: 'website' },
  ]
})

// Use composables
const { teamMembers, loading: teamLoading, error: teamError, fetchFirstTeamMembers } = useTeam()
const { pageSections, fetchPageData: fetchPageSectionsData, loading: pagesLoading } = usePages()
const lazyLoader = useLazyLoader()

const activeMilestone = ref(null)
const isTourModalOpen = ref(false)
const selectedMember = ref(null)
const pageData = ref({})
const loading = ref(true)
const error = ref('')

// Helper to get icon component from icon string
const getIconComponent = (iconString) => {
  if (!iconString) return Award
  const iconMap = {
    'bi-shield-fill': Shield,
    'bi-people': Users,
    'bi-award-fill': Award,
    'carbon-growth': TrendingUp,
    'feathericon-target': Target,
    'heroicon-o-eye': Eye,
    'elemplus-location': MapPin,
  }
  return iconMap[iconString] || Award
}

// Parse about section data
const parseAboutSection = () => {
  const aboutSection = pageSections.value.find(s => s.section_key === 'about-us')
  if (!aboutSection) return null
  
  const subtitle = aboutSection.subtitle || 'Creating Home Away From Home'
  const parts = subtitle.split(' ')
  let headline_part1 = 'Creating'
  let headline_part2 = 'Home Away'
  let headline_part3 = 'From Home'
  
  if (parts.length >= 3) {
    headline_part1 = parts.slice(0, Math.ceil(parts.length / 3)).join(' ')
    headline_part2 = parts.slice(Math.ceil(parts.length / 3), Math.ceil(2 * parts.length / 3)).join(' ')
    headline_part3 = parts.slice(Math.ceil(2 * parts.length / 3)).join(' ')
  }
  
  return {
    badge: aboutSection.title || 'Est. 2020',
    headline_part1: headline_part1,
    headline_part2: headline_part2,
    headline_part3: headline_part3,
    description: aboutSection.description || '',
    images: aboutSection.items?.map(item => ({
      src: item.image,
      label: item.title || 'Space'
    })).filter(item => item.src) || []
  }
}

// Parse stats
const parseStats = () => {
  return [
    { num: '150+', label: 'Happy Students', icon: Users },
    { num: '4.8', label: 'Rating', icon: Star, suffix: '/5' },
    { num: '50+', label: 'Room Options', icon: Building2 },
    { num: '24/7', label: 'Security', icon: Shield }
  ]
}

// Parse mission section
const parseMission = () => {
  const section = pageSections.value.find(s => s.section_key === 'our-mission')
  if (!section) return null
  return {
    description: section.description || ''
  }
}

// Parse vision section
const parseVision = () => {
  const section = pageSections.value.find(s => s.section_key === 'our-vision')
  if (!section) return null
  return {
    description: section.description || ''
  }
}

// Parse core values
const parseCoreValues = () => {
  const section = pageSections.value.find(s => s.section_key === 'our-principles')
  if (!section || !section.items) return []
  return section.items.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    icon: item.icon
  }))
}

// Parse timeline
const parseTimeline = () => {
  const section = pageSections.value.find(s => s.section_key === 'our_story')
  if (!section || !section.items) return []
  return section.items.map(item => ({
    id: item.id,
    year: item.title,
    title: item.subtitle || 'Event',
    description: item.description
  }))
}

// Parse achievements
const parseAchievements = () => {
  const section = pageSections.value.find(s => s.section_key === 'recognition')
  if (!section || !section.items) return []
  return section.items.map(item => ({
    id: item.id,
    year: item.title,
    title: item.subtitle || 'Achievement',
    description: item.description
  }))
}

// Parse nearby universities
const parseNearbyUniversities = () => {
  const section = pageSections.value.find(s => s.section_key === 'prime-location')
  if (!section || !section.items) return []
  return section.items.map(item => ({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle || '',
    description: item.description,
    distance: item.extra_data?.distance || '2',
    time: item.extra_data?.time || '5'
  }))
}

const openTourModal = () => {
  isTourModalOpen.value = true
}

const closeTourModal = () => {
  isTourModalOpen.value = false
}

function setupLazyTeamLoading() {
  nextTick(() => {
    const el = document.querySelector('[data-lazy-team]')
    if (el) {
      lazyLoader.observe(el, 'team-section', async () => {
        try {
          await fetchFirstTeamMembers()
          console.log('✅ Team members lazily loaded:', teamMembers.value.length)
        } catch (err) {
          console.warn('Team data unavailable:', err)
        }
      })
    }
  })
}

// Progressive fetch - Load critical content first
async function fetchAllData() {
  loading.value = true
  error.value = ''
  
  try {
    console.log('🚀 Starting progressive loading for About page...')
    
    // STEP 1: Load page sections (critical)
    await fetchPageSectionsData(2)
    console.log('✅ Page sections loaded')
    
    // STEP 2: Parse and show about section immediately
    const aboutData = parseAboutSection()
    if (aboutData) {
      pageData.value.about = aboutData
      console.log('✅ About section loaded')
    }
    
    // STEP 3: Parse and show stats
    pageData.value.stats = parseStats()
    console.log('✅ Stats loaded')
    
    // STEP 4: Parse remaining sections (mission, vision, values, timeline, achievements, universities)
    pageData.value.mission = parseMission()
    pageData.value.vision = parseVision()
    pageData.value.core_values = parseCoreValues()
    pageData.value.timeline = parseTimeline()
    pageData.value.achievements = parseAchievements()
    pageData.value.nearby_universities = parseNearbyUniversities()
    console.log('✅ All remaining sections loaded')
    
    console.log('✅ Critical content loaded!')
    
  } catch (err) {
    console.error('Error fetching page data:', err)
    error.value = 'Failed to load content. Please check your connection and try again.'
  } finally {
    loading.value = false
  }
}

// Computed team stats
const teamDepartments = computed(() => {
  const departments = new Set(teamMembers.value.map(m => m.role))
  return departments.size
})

const teamExperience = computed(() => {
  if (teamMembers.value.length === 0) return 'N/A'
  const totalYears = teamMembers.value.reduce((sum, member) => {
    if (member.joining_date) {
      const joinDate = new Date(member.joining_date)
      const years = (new Date().getFullYear() - joinDate.getFullYear())
      return sum + years
    }
    return sum
  }, 0)
  return Math.round(totalYears / teamMembers.value.length) + ' yrs'
})

const activeMembers = computed(() => {
  return teamMembers.value.filter(m => m.is_active).length
})

const earliestJoinYear = computed(() => {
  if (teamMembers.value.length === 0) return 'N/A'
  const dates = teamMembers.value.filter(m => m.joining_date).map(m => new Date(m.joining_date))
  if (dates.length === 0) return 'N/A'
  const earliest = new Date(Math.min(...dates))
  return earliest.getFullYear()
})

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

onMounted(async () => {
  await fetchAllData()
  setupLazyTeamLoading()
})

onUnmounted(() => {
  lazyLoader.cleanup()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>