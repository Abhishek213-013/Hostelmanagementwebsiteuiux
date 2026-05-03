<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="relative">
      <Header />

      <!-- Vibrant Hero Section - Full Width with Background Images -->
      <section class="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        <div class="relative w-full">
          <!-- Carousel - Full width with background images -->
          <div class="relative w-full overflow-hidden" ref="carouselRef">
            <div class="flex transition-transform duration-500 ease-out" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
              <!-- Slide 1 -->
              <div class="relative w-full min-h-screen flex-shrink-0 flex items-center justify-center">
                <div class="absolute inset-0 z-0">
                  <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1920&q=80" alt="Modern student accommodation" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/50"></div>
                </div>
                <div class="relative z-10 text-center text-white px-6 lg:px-12 max-w-[1400px] mx-auto space-y-8">
                  <div class="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                    <div class="w-3 h-3 bg-teal-400 rounded-full"></div>
                    <MapPin class="w-5 h-5 text-teal-400" />
                    <span class="text-sm font-bold text-white tracking-wide">Sylhet, Bangladesh</span>
                  </div>
                  <div class="space-y-6">
                    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                      <span class="block text-white">Your Home</span>
                      <span class="block text-white">Away From Home</span>
                      <span class="block mt-2 text-teal-400">in Sylhet</span>
                    </h1>
                    <p class="text-l sm:text-xl text-gray-200 leading-relaxed font-medium max-w-3xl mx-auto">
                      Experience premium student accommodation with <span class="text-teal-400 font-bold">cutting-edge amenities</span>, <span class="text-white font-bold">vibrant community</span>, and an environment designed for success.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Slide 2 -->
              <div class="relative w-full min-h-screen flex-shrink-0 flex items-center justify-center">
                <div class="absolute inset-0 z-0">
                  <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80" alt="Comfortable study room" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/50"></div>
                </div>
                <div class="relative z-10 text-center text-white px-6 lg:px-12 max-w-[1400px] mx-auto space-y-8">
                  <div class="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                    <MapPin class="w-5 h-5 text-teal-400" />
                    <span class="text-sm font-bold text-white">Prime Location</span>
                  </div>
                  <div class="space-y-6">
                    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                      <span class="block text-white">Study in</span>
                      <span class="block text-teal-400">Comfort</span>
                    </h1>
                    <p class="text-l sm:text-xl text-gray-200 leading-relaxed font-medium max-w-3xl mx-auto">
                      Fully furnished rooms with <span class="text-teal-400 font-bold">modern furniture</span>, <span class="text-white font-bold">high-speed WiFi</span>, and dedicated study areas.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Slide 3 -->
              <div class="relative w-full min-h-screen flex-shrink-0 flex items-center justify-center">
                <div class="absolute inset-0 z-0">
                  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80" alt="Student community" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/50"></div>
                </div>
                <div class="relative z-10 text-center text-white px-6 lg:px-12 max-w-[1400px] mx-auto space-y-8">
                  <div class="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                    <MapPin class="w-5 h-5 text-teal-400" />
                    <span class="text-sm font-bold text-white">Community Living</span>
                  </div>
                  <div class="space-y-6">
                    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                      <span class="block text-white">Build Your</span>
                      <span class="block text-teal-400">Network</span>
                    </h1>
                    <p class="text-l sm:text-xl text-gray-200 leading-relaxed font-medium max-w-3xl mx-auto">
                      Join a <span class="text-teal-400 font-bold">vibrant community</span> of students from top universities with <span class="text-teal-400 font-bold">networking events</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Slider Indicator Dots -->
            <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              <button
                v-for="(slide, index) in slides"
                :key="index"
                @click="goToSlide(index)"
                class="w-3 h-3 rounded-full transition-all duration-300"
                :class="currentSlide === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'"
                :aria-label="`Go to slide ${index + 1}`"
              />
            </div>
          </div>

          <!-- Search Widget - Full Width Container -->
          <div class="w-full px-6 lg:px-12 mt-12">
            <div class="max-w-[1400px] mx-auto">
              <div class="relative bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div class="space-y-3">
                    <label class="block text-sm font-bold text-teal-600 tracking-wide uppercase">Room Type</label>
                    <select v-model="searchFilters.roomType" class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-teal-500 focus:outline-none font-semibold text-gray-800">
                      <option value="">All Types</option>
                      <option value="single">Single</option>
                      <option value="shared">Shared</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>

                  <div class="space-y-3">
                    <label class="block text-sm font-bold text-teal-600 tracking-wide uppercase">Seats</label>
                    <select v-model="searchFilters.seats" class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-teal-500 focus:outline-none font-semibold text-gray-800">
                      <option value="">Any</option>
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="4">4 People</option>
                    </select>
                  </div>

                  <div class="space-y-3">
                    <label class="block text-sm font-bold text-teal-600 tracking-wide uppercase">Max Price</label>
                    <select v-model="searchFilters.maxPrice" class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-teal-500 focus:outline-none font-semibold text-gray-800">
                      <option value="">Any Budget</option>
                      <option value="5000">৳5,000/mo</option>
                      <option value="8000">৳8,000/mo</option>
                      <option value="12000">৳12,000/mo</option>
                    </select>
                  </div>

                  <div class="flex items-end">
                    <button @click="handleSearch" class="w-full px-8 py-3 text-white rounded-xl font-bold bg-teal-600 hover:bg-teal-700 transition-colors">
                      <span class="flex items-center justify-center gap-3">
                        <Search class="w-5 h-5" />
                        Search
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Availability Cards -->
      <section class="py-16">
        <div class="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection v-for="(card, i) in availabilityCards" :key="i">
              <div class="bg-white rounded-2xl p-6 shadow border border-gray-200">
                <div class="flex items-start justify-between mb-6">
                  <div class="p-4 rounded-2xl bg-teal-600">
                    <component :is="card.icon" class="w-7 h-7 text-white" />
                  </div>
                  <span class="px-4 py-2 text-white rounded-full text-sm font-bold bg-teal-600">
                    {{ card.badge }}
                  </span>
                </div>
                <h3 class="text-2xl font-black mb-2 text-teal-600">{{ card.title }}</h3>
                <p class="text-gray-600 mb-8">{{ card.desc }}</p>
                <div class="flex items-center justify-between">
                  <div class="text-2xl font-black text-teal-600">{{ card.price }}</div>
                  <router-link to="/rooms" class="w-12 h-12 rounded-full flex items-center justify-center bg-teal-600 hover:bg-teal-700 transition-colors">
                    <ArrowRight class="w-6 h-6 text-white" />
                  </router-link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section id="about" class="py-16">
        <div class="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div class="space-y-6">
                <div class="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow border border-gray-200">
                  <div class="p-2 bg-teal-600 rounded-xl">
                    <Award class="w-4 h-4 text-white" />
                  </div>
                  <span class="text-sm font-bold tracking-wider text-teal-600 uppercase">Est. 2020</span>
                </div>

                <h2 class="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                  <span class="block text-teal-600 text-4xl lg:text-5xl">Welcome to</span>
                  <span class="block mt-2 text-teal-600 text-4xl lg:text-5xl">SylhetStay</span>
                </h2>

                <p class="text-l text-gray-600 leading-relaxed">
                  Providing exceptional accommodation to students pursuing their academic dreams. We understand the importance of a <span class="text-teal-600 font-bold">comfortable</span>, <span class="text-gray-800 font-bold">safe</span>, and <span class="text-teal-600 font-bold">study-conducive</span> environment.
                </p>

                <div class="flex flex-wrap items-center gap-6">
                  <div class="flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-xl border border-gray-200">
                    <div class="flex -space-x-2">
                      <div v-for="n in 4" :key="n" class="w-8 h-8 rounded-full border-2 border-white bg-teal-600"></div>
                    </div>
                    <div class="text-left">
                      <div class="font-bold text-teal-600">150+ Students</div>
                      <div class="text-xs text-gray-600">Living Here</div>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-xl border border-gray-200">
                    <div class="flex items-center">
                      <Star v-for="n in 5" :key="n" class="w-5 h-5 fill-amber-400 text-amber-400" />
                    </div>
                    <div class="text-left">
                      <div class="font-bold text-amber-600">4.8/5.0</div>
                      <div class="text-xs text-gray-600">Rating</div>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-xl border border-gray-200">
                    <TrendingUp class="w-6 h-6 text-teal-600" />
                    <div class="text-left">
                      <div class="font-bold text-teal-600">98% Occupied</div>
                      <div class="text-xs text-gray-600">High Demand</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="(item, i) in aboutImages" :key="i" class="relative rounded-2xl overflow-hidden shadow" :class="i % 2 === 1 ? 'mt-8' : ''">
                  <img :src="item.src" :alt="item.label" class="w-full h-60 object-cover" />
                  <div class="absolute bottom-4 left-4">
                    <span class="px-3 py-1 bg-white rounded-full text-sm font-bold text-gray-800">{{ item.label }}</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <!-- Facilities -->
      <section class="py-16">
        <div class="max-w-[1400px] mx-auto px-6 lg:px-12">
          <AnimatedSection>
            <div class="text-center mb-16">
              <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 bg-white">
                <span class="text-sm font-bold tracking-wide text-teal-600">Premium Amenities</span>
              </div>
              <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600">World-Class Facilities</h2>
              <p class="text-l text-gray-600 max-w-2xl mx-auto">Everything you need for <span class="text-teal-600 font-bold">success</span>, all under one roof</p>
            </div>
          </AnimatedSection>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AnimatedSection v-for="(item, i) in facilities" :key="i">
              <div class="bg-white rounded-xl p-6 shadow border border-gray-200 text-center hover:bg-teal-600 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                <div class="w-16 h-16 mx-auto mb-4 bg-teal-600 group-hover:bg-white rounded-xl flex items-center justify-center transition-all duration-500">
                  <component :is="item.icon" class="w-8 h-8 text-white group-hover:text-teal-600" />
                </div>
                <h4 class="text-lg font-black mb-2 text-teal-600 group-hover:text-white transition-colors duration-500">{{ item.label }}</h4>
                <p class="text-sm text-gray-600 group-hover:text-teal-100 transition-colors duration-500">{{ item.desc }}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <!-- Rooms -->
      <section class="py-16">
        <div class="max-w-[1400px] mx-auto px-6 lg:px-12">
          <AnimatedSection>
            <div class="text-center mb-16">
              <div class="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow border border-gray-200 mb-8">
                <div class="p-2 bg-teal-600 rounded-xl">
                  <Home class="w-4 h-4 text-white" />
                </div>
                <span class="text-sm font-bold tracking-wider text-teal-600 uppercase">Find Your Space</span>
              </div>
              <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600 leading-[1.1]">Choose Your Perfect Room</h2>
            </div>
          </AnimatedSection>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection v-for="(room, i) in rooms" :key="i">
              <div class="relative">
                <div v-if="room.popular" class="absolute -top-5 left-1/2 -translate-x-1/2 z-20 px-6 py-2.5 text-white rounded-full text-sm font-bold shadow-lg flex items-center gap-2 bg-teal-600">
                  <Star class="w-4 h-4 fill-current" />
                  Most Popular
                </div>
                <div class="bg-white rounded-2xl overflow-hidden shadow border border-gray-200">
                  <div class="relative h-64 overflow-hidden">
                    <img :src="room.img" :alt="room.title" class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                  </div>
                  <div class="p-6">
                    <h3 class="text-2xl font-black mb-3 text-teal-600">{{ room.title }}</h3>
                    <p class="text-gray-600 mb-6">{{ room.desc }}</p>
                    <div class="space-y-3 mb-8">
                      <div v-for="(feature, j) in room.features" :key="j" class="flex items-center gap-3">
                        <div class="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 class="w-4 h-4 text-teal-600" />
                        </div>
                        <span class="text-gray-700 font-medium">{{ feature }}</span>
                      </div>
                    </div>
                    <div class="flex items-center justify-between pt-6 border-t border-gray-200">
                      <div>
                        <div class="text-sm text-teal-600 mb-1">Starting from</div>
                        <div class="text-2xl font-black text-teal-600">{{ room.price }}<span class="text-lg">/mo</span></div>
                      </div>
                      <router-link :to="`/rooms/${room.type}`" class="px-6 py-3 text-white rounded-xl font-bold bg-teal-600 hover:bg-teal-700 transition-colors">
                        View Details
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <!-- Gallery -->
      <section class="py-16">
        <div class="max-w-[1400px] mx-auto px-6 lg:px-12">
          <AnimatedSection>
            <div class="text-center mb-16">
              <div class="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow border border-gray-200 mb-8">
                <div class="p-2 bg-teal-600 rounded-xl">
                  <Camera class="w-4 h-4 text-white" />
                </div>
                <span class="text-sm font-bold tracking-wider text-teal-600 uppercase">Photo Gallery</span>
              </div>
              <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600 leading-[1.1]">Explore Our Beautiful Space</h2>
              <p class="text-l text-gray-600">Take a visual tour of your new home</p>
            </div>
          </AnimatedSection>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div
              v-for="(item, i) in galleryImages"
              :key="i"
              @click="openLightbox(i)"
              class="relative rounded-2xl overflow-hidden shadow group hover:opacity-80 transition-all duration-300 cursor-pointer"
              :class="i % 2 === 1 ? 'mt-8' : ''"
            >
              <img :src="item.src" :alt="item.label" class="w-full h-60 object-cover brightness-110 group-hover:scale-110 transition-transform duration-300" />
              <div class="absolute bottom-4 left-4">
                <span class="px-3 py-1 bg-white rounded-full text-sm font-bold text-gray-800">{{ item.label }}</span>
              </div>
            </div>
            <div class="relative rounded-2xl overflow-hidden flex items-center justify-center bg-gray-700 cursor-pointer" @click="openLightbox(0)">
              <div class="text-center text-white">
                <div class="text-5xl font-black mb-2">+24</div>
                <div class="font-bold">More Photos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Lightbox Modal -->
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-xl"
        @click="closeLightbox"
      >
        <button class="absolute top-8 right-8 p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white group" @click="closeLightbox">
          <X class="w-6 h-6 group-hover:rotate-90 transition-transform" />
        </button>

        <button class="absolute left-8 p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white group hover:scale-110" @click.stop="prevImage">
          <ChevronLeft class="w-8 h-8" />
        </button>

        <button class="absolute right-8 p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white group hover:scale-110" @click.stop="nextImage">
          <ChevronRight class="w-8 h-8" />
        </button>

        <div class="max-w-5xl max-h-[80vh] mx-6" @click.stop>
          <img :src="galleryImages[currentImageIndex].src" :alt="galleryImages[currentImageIndex].label" class="w-full h-full object-contain rounded-2xl shadow-2xl" />
          <div class="text-center mt-6">
            <span class="inline-block px-4 py-2 text-white rounded-xl font-bold shadow-xl bg-teal-600">
              {{ galleryImages[currentImageIndex].label }}
            </span>
            <p class="text-white text-sm mt-3 font-medium">{{ currentImageIndex + 1 }} / {{ galleryImages.length }}</p>
          </div>
        </div>
      </div>

      <!-- Testimonials -->
      <section class="py-16">
        <div class="max-w-[1400px] mx-auto px-6 lg:px-12">
          <AnimatedSection>
            <div class="text-center mb-16">
              <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 bg-white">
                <Users class="w-5 h-5 text-teal-600" />
                <span class="text-sm font-bold tracking-wide text-teal-600">The People</span>
              </div>
              <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600">What Students Say</h2>
              <p class="text-l text-gray-600">Hear from our happy residents</p>
            </div>
          </AnimatedSection>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="(testimonial, i) in testimonials" :key="i" class="bg-white rounded-2xl p-6 shadow border border-gray-200">
              <div class="flex gap-1 mb-6">
                <Star v-for="n in 5" :key="n" class="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
              <p class="text-gray-700 mb-8 leading-relaxed">{{ testimonial.text }}</p>
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center">
                  <span class="text-white font-bold text-base">{{ testimonial.name[0] }}</span>
                </div>
                <div>
                  <div class="font-black text-gray-800">{{ testimonial.name }}</div>
                  <div class="text-sm text-teal-600">{{ testimonial.uni }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-16">
        <div class="bg-teal-600 rounded-2xl p-12 md:p-20 text-white text-center mx-6 lg:mx-12">
          <h2 class="text-2xl lg:text-3xl font-black mb-6">Ready to Join Our Community?</h2>
          <p class="text-l text-white/90 mb-10 max-w-2xl mx-auto">Be part of a thriving student community that supports your academic journey and creates lifelong memories</p>
          <div class="flex flex-wrap justify-center gap-4">
            <router-link to="/booking" class="px-10 py-5 bg-white text-teal-600 rounded-xl font-black flex items-center gap-3 hover:bg-gray-100 transition-colors">
              <Calendar class="w-5 h-5" />
              Book Your Room
              <ChevronRight class="w-5 h-5" />
            </router-link>
            <router-link to="/contact" class="px-10 py-5 bg-teal-700 text-white rounded-xl font-black border-2 border-teal-500 flex items-center gap-3 hover:bg-teal-800 transition-colors">
              <Phone class="w-5 h-5" />
              Contact Us
            </router-link>
          </div>
        </div>
      </section>

      <!-- Sticky Button -->
      <router-link to="/rooms" class="fixed bottom-8 right-8 px-8 py-4 text-white rounded-full font-black shadow-lg z-50 flex items-center gap-3 bg-teal-600 hover:bg-teal-700 transition-colors">
        <Home class="w-6 h-6" />
        <span>Book Your Seat</span>
        <ArrowRight class="w-6 h-6" />
      </router-link>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search, Users, Wifi, Wind, Coffee, Car, Shield, BookOpen, MapPin, Phone, Mail, Menu, X, Home, Utensils, Dumbbell, Camera, CheckCircle2, Star, Sparkles, Award, ArrowRight, Calendar, Download, TrendingUp, ChevronRight, ChevronLeft
} from 'lucide-vue-next'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import AnimatedSection from '../components/ui/AnimatedSection.vue'

const router = useRouter()

const mobileMenuOpen = ref(false)
const searchFilters = ref({
  roomType: '',
  seats: '',
  maxPrice: ''
})
const scrolled = ref(false)
const currentSlide = ref(0)
const lightboxOpen = ref(false)
const currentImageIndex = ref(0)
const autoplayInterval = ref(null)

const slides = ref([0, 1, 2])

const goToSlide = (index) => {
  currentSlide.value = index
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % 3
}

onMounted(() => {
  autoplayInterval.value = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
  }
})

const handleSearch = () => {
  const params = new URLSearchParams()
  if (searchFilters.value.roomType) params.set('type', searchFilters.value.roomType)
  if (searchFilters.value.seats) params.set('seats', searchFilters.value.seats)
  if (searchFilters.value.maxPrice) params.set('maxPrice', searchFilters.value.maxPrice)
  router.push(`/rooms?${params.toString()}`)
}

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1620332372374-f108c53d2e03?w=1200', label: 'Modern Rooms' },
  { src: 'https://images.unsplash.com/photo-1721299417031-de890ff33b26?w=1200', label: 'Premium Suites' },
  { src: 'https://images.unsplash.com/photo-1753505888770-46be3b748b41?w=1200', label: 'Study Areas' },
  { src: 'https://images.unsplash.com/photo-1753505889211-9cfbac527474?w=1200', label: 'Common Spaces' },
  { src: 'https://images.unsplash.com/photo-1723259457560-b76d597f709b?w=1200', label: 'Lounge Area' },
  { src: 'https://images.unsplash.com/photo-1635321349351-de890ff33b26?w=1200', label: 'Reception' },
  { src: 'https://images.unsplash.com/photo-1772944780860-e99bd902d59a?w=1200', label: 'Corridor' },
]

const openLightbox = (index) => {
  currentImageIndex.value = index
  lightboxOpen.value = true
}

const closeLightbox = () => {
  lightboxOpen.value = false
}

const prevImage = () => {
  currentImageIndex.value = currentImageIndex.value > 0 ? currentImageIndex.value - 1 : galleryImages.length - 1
}

const nextImage = () => {
  currentImageIndex.value = currentImageIndex.value < galleryImages.length - 1 ? currentImageIndex.value + 1 : 0
}

const availabilityCards = [
  { icon: Users, title: '12 Seats Available', desc: 'Across all room types', price: '৳4,500/mo', badge: 'Available Now' },
  { icon: Award, title: 'Premium Rooms', desc: 'AC + Attached Bath', price: '৳10,500/mo', badge: 'Popular' },
  { icon: Sparkles, title: 'Early Bird Discount', desc: 'Book 3 months, get 10% off', price: 'Save ৳1,350', badge: 'Limited' }
]

const aboutImages = [
  { src: 'https://images.unsplash.com/photo-1620332372374-f108c53d2e03?w=600', label: 'Modern Rooms' },
  { src: 'https://images.unsplash.com/photo-1753505888770-46be3b748b41?w=600', label: 'Premium Suites' },
  { src: 'https://images.unsplash.com/photo-1721299417031-de890ff33b26?w=600', label: 'Study Areas' },
  { src: 'https://images.unsplash.com/photo-1753505889211-9cfbac527474?w=600', label: 'Common Spaces' }
]

const facilities = [
  { icon: Wifi, label: 'High-Speed WiFi', desc: '100 Mbps fiber' },
  { icon: Wind, label: 'Air Conditioning', desc: 'Premium rooms' },
  { icon: Utensils, label: 'Dining Hall', desc: '3 meals daily' },
  { icon: Coffee, label: 'Common Room', desc: 'Recreation area' },
  { icon: BookOpen, label: 'Study Rooms', desc: 'Quiet & peaceful' },
  { icon: Shield, label: '24/7 Security', desc: 'CCTV & guards' },
  { icon: Car, label: 'Parking', desc: 'Bike & car spaces' },
  { icon: Dumbbell, label: 'Fitness Center', desc: 'Modern equipment' }
]

const rooms = [
  { img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', title: 'Shared Room', desc: 'Perfect for vibrant community', price: '৳4,500', features: ['4 bunk beds', 'Shared bathroom', 'Study desk', 'Wardrobe'], popular: false, type: 'shared' },
  { img: 'https://images.unsplash.com/photo-1771327811795-6197403af846?w=800', title: 'Semi-Private', desc: 'Balance of privacy & affordability', price: '৳7,500', features: ['2 single beds', 'Attached bath', 'Study desks', 'Ceiling fan'], popular: true, type: 'semi-private' },
  { img: 'https://images.unsplash.com/photo-16638113493eff11?w=800', title: 'Premium Single', desc: 'Ultimate privacy & comfort', price: '৳10,500', features: ['Private room', 'Attached bath', 'Air conditioning', 'Premium furniture'], popular: false, type: 'premium' }
]

const testimonials = [
  { name: 'Arafat Rahman', uni: 'SUST, Computer Science', text: 'The facilities are excellent, and the staff is incredibly supportive. The study environment here helped me maintain my GPA!' },
  { name: 'Fatima Hassan', uni: 'Metropolitan University', text: 'WiFi is super fast, and the food quality is great. Made lots of friends here. Highly recommended!' },
  { name: 'Mehedi Khan', uni: 'Sylhet Medical College', text: 'The hostel management made the transition so smooth. Feels like a second home!' }
]
</script>
