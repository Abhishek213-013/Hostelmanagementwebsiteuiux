<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading content...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md">
          <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
          <button @click="fetchPageData" class="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all">
            Try Again
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="relative">
      <Header />

      <!-- Vibrant Hero Section -->
      <section class="relative min-h-screen flex items-center justify-center pt-16 lg:pt-20">
        <div class="relative w-full">
          <!-- Carousel -->
          <div class="relative w-full overflow-hidden" ref="carouselRef">
            <div class="flex transition-transform duration-500 ease-out" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
              <div
                v-for="(slide, index) in heroSlides"
                :key="index"
                class="relative w-full min-h-screen flex-shrink-0 flex items-center justify-center"
              >
                <div class="absolute inset-0 z-0">
                  <img :src="slide.image" :alt="slide.badge" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/30"></div>
                </div>
                <div class="relative z-10 text-center text-white px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto space-y-6 sm:space-y-8 w-full">
                  <!-- <div class="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                    <div v-if="index === 0" class="w-2 h-2 sm:w-3 sm:h-3 bg-teal-400 rounded-full"></div>
                    <MapPin class="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                    <span class="text-xs sm:text-sm font-bold text-white tracking-wide">{{ slide.badge }}</span>
                  </div> -->
                  <div class="space-y-4 sm:space-y-6">
                    <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight break-words">
                      <span v-if="slide.headline_part1" class="block text-white">{{ slide.headline_part1 }}</span>
                      <span v-if="slide.headline_part2" class="block" :class="index === 0 ? 'text-white' : 'text-teal-400'">{{ slide.headline_part2 }}</span>
                      <span v-if="slide.headline_part3" class="block mt-2 text-teal-400">{{ slide.headline_part3 }}</span>
                    </h1>
                    <p class="text-sm sm:text-xl text-gray-200 leading-relaxed font-medium max-w-3xl mx-auto px-2">
                      Experience premium student accommodation with <span class="text-teal-400 font-bold">{{ slide.description_part1 }}</span>, <span class="text-white font-bold">{{ slide.description_part2 }}</span>, and an environment designed for success.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Slider Indicator Dots -->
            <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              <button
                v-for="(slide, index) in heroSlides"
                :key="index"
                @click="goToSlide(index)"
                class="w-3 h-3 rounded-full transition-all duration-300"
                :class="currentSlide === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'"
                :aria-label="`Go to slide ${index + 1}`"
              />
            </div>
          </div>

          <!-- Search Widget - Dynamic from API -->
          <div class="w-full px-4 sm:px-6 lg:px-12 mt-8 sm:mt-12">
            <div class="max-w-[1400px] mx-auto">
              <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-8 border border-gray-200 dark:border-gray-700">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
                  <div class="space-y-2 sm:space-y-3">
                    <label class="block text-sm font-bold text-teal-600 tracking-wide uppercase">Room Type</label>
                    <SearchSelect v-model="searchFilters.roomType" :options="roomTypeOptions" placeholder="All Types" />
                  </div>
                  <div class="space-y-2 sm:space-y-3">
                    <label class="block text-sm font-bold text-teal-600 tracking-wide uppercase">Seats</label>
                    <SearchSelect v-model="searchFilters.seats" :options="seatsOptions" placeholder="Any" />
                  </div>
                  <div class="space-y-2 sm:space-y-3">
                    <label class="block text-sm font-bold text-teal-600 tracking-wide uppercase">Max Price</label>
                    <SearchSelect v-model="searchFilters.maxPrice" :options="maxPriceOptions" placeholder="Any Budget" />
                  </div>
                  <div class="flex items-end">
                    <button @click="handleSearch" class="w-full px-6 py-2.5 text-white rounded-xl font-bold bg-teal-600 hover:bg-teal-700 transition-colors">
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

      <!-- Availability Cards - Dynamic from Room Types API -->
      <section v-if="roomTypesList.length > 0" class="py-12">
        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection v-for="(roomType, i) in roomTypesList.slice(0, 3)" :key="i" class="h-full">
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 h-full flex flex-col">
                <div class="flex items-start justify-between mb-6">
                  <div class="p-4 rounded-2xl bg-teal-600">
                    <component :is="getRoomTypeIcon(roomType.room_type_title)" class="w-7 h-7 text-white" />
                  </div>
                  <span class="px-3 sm:px-4 py-2 text-white rounded-full text-xs sm:text-sm font-bold bg-teal-600 whitespace-nowrap">
                    {{ roomType.room_type_price ? 'Premium' : 'Standard' }}
                  </span>
                </div>
                <h3 class="text-xl sm:text-2xl font-black mb-2 text-teal-600 break-words line-clamp-2">{{ roomType.room_type_title || 'Room Type' }}</h3>
                <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8 break-words flex-grow line-clamp-4">{{ roomType.room_type_details || 'Comfortable accommodation with modern amenities' }}</p>
                <div class="flex items-center justify-between mt-auto">
                  <div class="text-xl sm:text-2xl font-black text-teal-600 break-words">
                    ৳{{ (roomType.room_type_price || 0).toLocaleString() }}
                    <span class="text-sm font-normal">/mo</span>
                  </div>
                  <router-link to="/rooms" class="w-12 h-12 rounded-full flex items-center justify-center bg-teal-600 hover:bg-teal-700 transition-colors flex-shrink-0">
                    <ArrowRight class="w-6 h-6 text-white" />
                  </router-link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <!-- About Section - Using mock data -->
      <section v-if="pageData.about" id="about" class="py-12">
        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div class="space-y-6">
                <div class="inline-flex items-center gap-3 px-4 sm:px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow border border-gray-200 dark:border-gray-700">
                  <div class="p-2 bg-teal-600 rounded-xl">
                    <Award class="w-4 h-4 text-white" />
                  </div>
                  <span class="text-xs sm:text-sm font-bold tracking-wider text-teal-600 uppercase">{{ pageData.about.badge }}</span>
                </div>
                <h2 class="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                  <span class="block text-teal-600 text-3xl sm:text-4xl lg:text-5xl">{{ pageData.about.headline_part1 }}</span>
                  <span class="block mt-2 text-teal-600 text-3xl sm:text-4xl lg:text-5xl">{{ pageData.about.headline_part2 }}</span>
                </h2>
                <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed break-words">
                  {{ pageData.about.description }}
                </p>
                <div class="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div
                    v-for="(stat, i) in pageData.about.stats"
                    :key="i"
                    class="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div v-if="stat.icon === 'Star'" class="flex items-center">
                      <Star v-for="n in 5" :key="n" class="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                    </div>
                    <component v-else :is="iconMap[stat.icon]" class="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                    <div class="text-left">
                      <div class="font-bold text-sm sm:text-base" :class="stat.icon === 'Star' ? 'text-amber-600' : 'text-teal-600'">{{ stat.value }}</div>
                      <div class="text-xs text-gray-600 dark:text-gray-400">{{ stat.label }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="(item, i) in pageData.about.images" :key="i" class="relative rounded-2xl overflow-hidden shadow" :class="i % 2 === 1 ? 'mt-8' : ''">
                  <img :src="item.src" :alt="item.label" class="w-full h-40 sm:h-60 object-cover" />
                  <div class="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                    <span class="px-2 sm:px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">{{ item.label }}</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <!-- Facilities - From Real API -->
      <section id="facilities-section" v-if="facilitiesList.length > 0" class="py-12">
        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <AnimatedSection>
            <div class="text-center mb-10">
              <div class="inline-flex items-center gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <span class="text-xs sm:text-sm font-bold tracking-wide text-teal-600">Premium Amenities</span>
              </div>
              <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600 break-words">World-Class Facilities</h2>
              <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto break-words">Everything you need for success, all under one roof</p>
            </div>
          </AnimatedSection>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <AnimatedSection v-for="(item, i) in facilitiesList.slice(0, 8)" :key="i">
              <div class="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow border border-gray-200 dark:border-gray-700 text-center hover:bg-teal-600 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                <div class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-teal-600 group-hover:bg-white rounded-xl flex items-center justify-center transition-all duration-500">
                  <component :is="getFacilityIcon(item.icon)" class="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:text-teal-600" />
                </div>
                <h4 class="text-sm sm:text-lg font-black mb-1 sm:mb-2 text-teal-600 group-hover:text-white transition-colors duration-500 break-words">{{ item.title }}</h4>
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 group-hover:text-teal-100 transition-colors duration-500 break-words">{{ item.short_description }}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <!-- Rooms Section - From Real API -->
      <section v-if="homepageRooms.length > 0" class="py-12">
        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <AnimatedSection>
            <div class="text-center mb-10">
              <div class="inline-flex items-center gap-3 px-4 sm:px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow border border-gray-200 dark:border-gray-700 mb-8">
                <div class="p-2 bg-teal-600 rounded-xl">
                  <Home class="w-4 h-4 text-white" />
                </div>
                <span class="text-xs sm:text-sm font-bold tracking-wider text-teal-600 uppercase">Find Your Space</span>
              </div>
              <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600 leading-[1.1] break-words">Choose Your Perfect Room</h2>
            </div>
          </AnimatedSection>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection v-for="(room, i) in homepageRooms" :key="room.id">
              <div class="relative">
                <div v-if="room.is_popular" class="absolute -top-5 left-1/2 -translate-x-1/2 z-20 px-4 sm:px-6 py-2 sm:py-2.5 text-white rounded-full text-xs sm:text-sm font-bold shadow-lg flex items-center gap-2 bg-teal-600 whitespace-nowrap">
                  <Star class="w-4 h-4 fill-current" />
                  Most Popular
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow border border-gray-200 dark:border-gray-700">
                  <div class="relative h-48 sm:h-64 overflow-hidden">
                    <img :src="getRoomImage(room.room_type?.name)" :alt="room.room_number" class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                    
                    <!-- Availability Badge -->
                    <div class="absolute bottom-4 left-4 flex items-center gap-2">
                      <div :class="['w-2 h-2 rounded-full', room.status === 'available' ? 'bg-green-400' : 'bg-red-400']"></div>
                      <span class="text-white text-xs font-medium">
                        {{ room.status === 'available' ? `${room.available_seats || 1} seat(s) left` : 'Fully booked' }}
                      </span>
                    </div>
                  </div>
                  <div class="p-4 sm:p-6">
                    <h3 class="text-xl sm:text-2xl font-black mb-2 sm:mb-3 text-teal-600 break-words">{{ room.room_number || `Room ${room.id}` }}</h3>
                    <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 break-words">{{ room.room_description || getDefaultDescription(room.room_type?.name) }}</p>
                    <div class="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                      <div v-for="(feature, j) in getRoomFeatures(room.room_type?.name).slice(0, 4)" :key="j" class="flex items-center gap-2 sm:gap-3">
                        <div class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 class="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" />
                        </div>
                        <span class="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium break-words capitalize">{{ feature }}</span>
                      </div>
                    </div>
                    <div class="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <div class="text-xs sm:text-sm text-teal-600 mb-1">Starting from</div>
                        <div class="text-xl sm:text-2xl font-black text-teal-600 break-words">
                          ৳{{ (room.room_price || 0).toLocaleString() }}
                          <span class="text-base sm:text-lg">/mo</span>
                        </div>
                      </div>
                      <router-link :to="`/rooms/${room.id}`" class="px-3 sm:px-5 py-1.5 sm:py-2.5 text-white rounded-xl font-bold text-sm sm:text-base bg-teal-600 hover:bg-teal-700 transition-colors whitespace-nowrap">
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

      <!-- Gallery - From Real API -->
      <section id="gallery-section" v-if="galleryItems.length > 0" class="py-12">
        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <AnimatedSection>
            <div class="text-center mb-10">
              <div class="inline-flex items-center gap-3 px-4 sm:px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow border border-gray-200 dark:border-gray-700 mb-8">
                <div class="p-2 bg-teal-600 rounded-xl">
                  <Camera class="w-4 h-4 text-white" />
                </div>
                <span class="text-xs sm:text-sm font-bold tracking-wider text-teal-600 uppercase">Photo Gallery</span>
              </div>
              <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600 leading-[1.1] break-words">Explore Our Beautiful Space</h2>
              <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 break-words">Take a visual tour of your new home</p>
            </div>
          </AnimatedSection>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div
              v-for="(item, i) in galleryItems.slice(0, 7)"
              :key="i"
              @click="openLightbox(i)"
              class="relative rounded-2xl overflow-hidden shadow group hover:opacity-80 transition-all duration-300 cursor-pointer"
              :class="i % 2 === 1 ? 'mt-8' : ''"
            >
              <img :src="item.src" :alt="item.title" class="w-full h-40 sm:h-60 object-cover brightness-110 group-hover:scale-110 transition-transform duration-300" />
              <div class="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                <span class="px-2 sm:px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">{{ item.title }}</span>
              </div>
            </div>
            <div v-if="galleryItems.length > 7" class="relative rounded-2xl overflow-hidden flex items-center justify-center bg-gray-700 cursor-pointer" @click="openLightbox(0)">
              <div class="text-center text-white">
                <div class="text-4xl sm:text-5xl font-black mb-2">+{{ galleryItems.length - 7 }}</div>
                <div class="font-bold text-sm sm:text-base">More Photos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials - From Real API -->
      <section id="testimonials-section" v-if="testimonials.length > 0" class="py-12">
        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <AnimatedSection>
            <div class="text-center mb-10">
              <div class="inline-flex items-center gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <Users class="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                <span class="text-xs sm:text-sm font-bold tracking-wide text-teal-600">What Students Say</span>
              </div>
              <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600 break-words">Trusted by Students</h2>
              <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 break-words">Hear from our happy residents across Sylhet's top universities</p>
            </div>
          </AnimatedSection>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="testimonial in testimonials" :key="testimonial.id" 
                 class="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div class="flex gap-1 mb-4 sm:mb-6">
                <Star v-for="n in 5" :key="n" :class="['w-4 h-4 sm:w-5 sm:h-5', n <= testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600']" />
              </div>
              <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed break-words">
                "{{ testimonial.content }}"
              </p>
              <div v-if="testimonial.tags && testimonial.tags.length > 0" class="flex flex-wrap gap-1 mb-4">
                <span v-for="tag in testimonial.tags" :key="tag" 
                      class="px-2 py-0.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs">
                  #{{ tag }}
                </span>
              </div>
              <div class="flex items-center gap-3 sm:gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <img :src="testimonial.user.avatar" :alt="testimonial.user.name" 
                     class="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-teal-600 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="font-black text-sm sm:text-base text-gray-800 dark:text-white truncate">{{ testimonial.user.name }}</div>
                  <div class="text-xs text-teal-600 font-medium">{{ testimonial.university }}</div>
                  <div class="text-xs text-gray-400">{{ testimonial.department }}</div>
                </div>
                <div v-if="testimonial.is_featured" class="flex-shrink-0">
                  <span class="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-bold">
                    Featured
                  </span>
                </div>
              </div>
              <div v-if="testimonial.stay_duration" class="mt-3 flex items-center gap-2 text-xs text-gray-400">
                <Clock class="w-3 h-3" />
                <span>{{ testimonial.stay_duration }}</span>
                <span v-if="testimonial.room_name" class="text-gray-300">•</span>
                <span v-if="testimonial.room_name" class="text-teal-600">{{ testimonial.room_name }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section - Using mock data -->
      <section v-if="pageData.cta" class="py-12">
        <div class="bg-teal-600 rounded-2xl p-8 sm:p-12 md:p-20 text-white text-center mx-4 sm:mx-6 lg:mx-12">
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-black mb-4 sm:mb-6 break-words">{{ pageData.cta.headline }}</h2>
          <p class="text-sm sm:text-base text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto break-words">{{ pageData.cta.description }}</p>
          <div class="flex flex-wrap justify-center gap-3 sm:gap-4">
            <router-link v-if="pageData.cta.primaryButton" :to="pageData.cta.primaryButton.link" class="px-6 sm:px-10 py-3 sm:py-5 bg-white text-teal-600 rounded-xl font-black flex items-center gap-2 sm:gap-3 hover:bg-gray-100 transition-colors text-sm sm:text-base whitespace-nowrap">
              <component :is="iconMap[pageData.cta.primaryButton.icon] || Calendar" class="w-4 h-4 sm:w-5 sm:h-5" />
              {{ pageData.cta.primaryButton.text }}
              <ChevronRight class="w-4 h-4 sm:w-5 sm:h-5" />
            </router-link>
            <router-link v-if="pageData.cta.secondaryButton" :to="pageData.cta.secondaryButton.link" class="px-6 sm:px-10 py-3 sm:py-5 bg-teal-700 text-white rounded-xl font-black border-2 border-teal-500 flex items-center gap-2 sm:gap-3 hover:bg-teal-800 transition-colors text-sm sm:text-base whitespace-nowrap">
              <component :is="iconMap[pageData.cta.secondaryButton.icon] || Phone" class="w-4 h-4 sm:w-5 sm:h-5" />
              {{ pageData.cta.secondaryButton.text }}
            </router-link>
          </div>
        </div>
      </section>

      <!-- Sticky Button -->
      <router-link v-if="pageData.stickyButton" :to="pageData.stickyButton.link" class="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 px-4 sm:px-6 py-2.5 sm:py-3 text-white rounded-full font-black shadow-lg z-50 flex items-center gap-2 sm:gap-3 bg-teal-600 hover:bg-teal-700 transition-colors text-sm sm:text-base">
        <Home class="w-5 h-5 sm:w-6 sm:h-6" />
        <span class="hidden sm:inline">{{ pageData.stickyButton.text }}</span>
        <ArrowRight class="w-5 h-5 sm:w-6 sm:h-6" />
      </router-link>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import {
  Search, Users, Wifi, Wind, Coffee, Car, Shield, BookOpen, MapPin, Phone, Mail, Menu, X, Home, Utensils, Dumbbell, Camera, CheckCircle2, Star, Sparkles, Award, ArrowRight, Calendar, Download, TrendingUp, ChevronRight, ChevronLeft, ChevronDown, Clock, Bed, Bath, Tv, Gamepad2
} from 'lucide-vue-next'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import AnimatedSection from '../components/ui/AnimatedSection.vue'
import SearchSelect from '../components/ui/SearchSelect.vue'
import { useRooms } from '../composables/useRooms'
import { useFacilities } from '../composables/useFacilities'
import { useGallery } from '../composables/useGallery'
import { useTestimonials } from '../composables/useTestimonials'
import { useRoomTypes } from '../composables/useRoomTypes'
import { usePages } from '../composables/usePages'

const router = useRouter()
const { rooms, fetchRooms } = useRooms()
const { facilities: facilitiesList, fetchFacilities } = useFacilities()
const { galleryItems, fetchGallery } = useGallery()
const { testimonials: apiTestimonials, fetchTestimonials } = useTestimonials()
const { roomTypes: apiRoomTypes, fetchRoomTypes } = useRoomTypes()
const { pageSections, fetchHeroSection, fetchAboutSection, loading: pagesLoading } = usePages()

// Icon mapping
const iconMap = {
  Users, Wifi, Wind, Coffee, Car, Shield, BookOpen, Utensils, Dumbbell,
  Award, Sparkles, Star, TrendingUp, Calendar, Phone, Home
}

// Room type options from API
const roomTypeOptions = computed(() => {
  const options = [{ value: '', label: 'All Types' }]
  if (apiRoomTypes.value && apiRoomTypes.value.length > 0) {
    apiRoomTypes.value.forEach(type => {
      options.push({
        value: type.id,
        label: type.room_type_title
      })
    })
  }
  return options
})

const seatsOptions = [
  { value: '', label: 'Any' },
  { value: '1', label: '1 Person' },
  { value: '2', label: '2 People' },
  { value: '4', label: '4 People' },
]

const maxPriceOptions = [
  { value: '', label: 'Any Budget' },
  { value: '5000', label: '৳5,000/mo' },
  { value: '8000', label: '৳8,000/mo' },
  { value: '12000', label: '৳12,000/mo' },
]

// State
const pageData = ref({})
const heroSlides = ref([])
const testimonials = ref([])
const homepageRooms = ref([])
const roomTypesList = ref([])
const loading = ref(true)
const error = ref('')
const searchFilters = ref({ roomType: '', seats: '', maxPrice: '' })
const currentSlide = ref(0)
const lightboxOpen = ref(false)
const currentImageIndex = ref(0)
const autoplayInterval = ref(null)

// Progressive loading states
const heroLoaded = ref(false)
const aboutLoaded = ref(false)
const roomsLoaded = ref(false)
const facilitiesLoaded = ref(false)
const galleryLoaded = ref(false)
const testimonialsLoaded = ref(false)

// Get hero slides from API
const getHeroSlides = () => {
  const heroSection = pageSections.value.find(s => s.section_key === 'hero-slider')
  if (heroSection && heroSection.items && heroSection.items.length > 0) {
    return heroSection.items.map(item => ({
      id: item.id,
      badge: item.subtitle || 'Welcome',
      image: item.image,
      headline_part1: item.title?.split(' ').slice(0, 3).join(' ') || item.title || '',
      headline_part2: item.title?.split(' ').slice(3).join(' ') || '',
      headline_part3: '',
      description_part1: 'modern amenities',
      description_part2: 'comfortable spaces',
      sort_order: item.sort_order
    }))
  }
  return []
}

// Get about section from API
const getAboutData = () => {
  const aboutSection = pageSections.value.find(s => s.section_key === 'about')
  if (aboutSection) {
    const subtitle = aboutSection.subtitle || ''
    const title = aboutSection.title || ''
    
    let headline_part1 = ''
    let headline_part2 = ''
    
    if (subtitle) {
      const subtitleParts = subtitle.split(' ')
      
      if (subtitleParts.length > 1) {
        const toIndex = subtitleParts.indexOf('to')
        if (toIndex !== -1 && toIndex < subtitleParts.length - 1) {
          headline_part1 = subtitleParts.slice(0, toIndex + 1).join(' ')
          headline_part2 = subtitleParts.slice(toIndex + 1).join(' ')
        } else {
          const mid = Math.ceil(subtitleParts.length / 2)
          headline_part1 = subtitleParts.slice(0, mid).join(' ')
          headline_part2 = subtitleParts.slice(mid).join(' ')
        }
      } else {
        headline_part1 = subtitle
        headline_part2 = ''
      }
    }
    
    const images = aboutSection.items?.map(item => ({
      src: item.image,
      label: item.title || 'Space'
    })).filter(item => item.src) || []
    
    return {
      badge: title || 'About Us',
      headline_part1: headline_part1 || 'Welcome to',
      headline_part2: headline_part2 || '',
      description: aboutSection.description || '',
      stats: [
        { icon: 'Users', value: '150+', label: 'Happy Students' },
        { icon: 'Star', value: '4.8/5', label: 'Rating' },
        { icon: 'Building2', value: '50+', label: 'Room Options' },
        { icon: 'Shield', value: '24/7', label: 'Security' }
      ],
      images: images
    }
  }
  return null
}

// Get icon for room type card
const getRoomTypeIcon = (title) => {
  const titleLower = title?.toLowerCase() || ''
  if (titleLower.includes('shared')) return Users
  if (titleLower.includes('premium')) return Star
  if (titleLower.includes('single')) return Bed
  return Home
}

// Helper functions for room display
const getRoomImage = (roomTypeName) => {
  const images = {
    'shared': 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    'semi-private': 'https://images.unsplash.com/photo-1771327811795-6197403af846?w=800',
    'premium': 'https://images.unsplash.com/photo-1663811397091-9a13493eff11?w=800',
    'standard': 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800'
  }
  return images[roomTypeName?.toLowerCase()] || images.standard
}

const getDefaultDescription = (roomTypeName) => {
  const descriptions = {
    'shared': 'Comfortable shared accommodation with modern amenities.',
    'semi-private': 'Semi-private room offering privacy with shared common areas.',
    'premium': 'Premium single room with attached bathroom and premium furnishings.',
    'standard': 'Well-appointed standard room with essential amenities.'
  }
  return descriptions[roomTypeName?.toLowerCase()] || 'Comfortable room with modern amenities.'
}

const getRoomFeatures = (roomTypeName) => {
  const features = {
    'shared': ['4 Bunk Beds', 'Shared Bathroom', 'Study Desk', 'Wardrobe', 'High-Speed WiFi', 'Ceiling Fan'],
    'semi-private': ['2 Single Beds', 'Attached Bathroom', 'Study Desks', 'Wardrobe', 'High-Speed WiFi', 'Ceiling Fan'],
    'premium': ['Private Room', 'Attached Bathroom', 'Air Conditioning', 'Premium Furniture', 'High-Speed WiFi', 'Mini Fridge'],
    'standard': ['Comfortable Bed', 'Attached Bathroom', 'Study Desk', 'Wardrobe', 'High-Speed WiFi', 'Ceiling Fan']
  }
  return features[roomTypeName?.toLowerCase()] || features.standard
}

const getFacilityIcon = (iconName) => {
  const iconMap = {
    'ri-wifi-line': Wifi,
    'ri-dumbbell-line': Dumbbell,
    'ri-restaurant-line': Utensils,
    'ri-book-open-line': BookOpen,
    'ri-shield-line': Shield,
    'ri-car-line': Car,
    'ri-coffee-line': Coffee,
  }
  return iconMap[iconName] || Sparkles
}

// Progressive fetch - Load critical content first
async function fetchPageData() {
  loading.value = true
  error.value = ''
  
  try {
    console.log('🚀 Starting progressive loading...')
    
    // STEP 1: Load Hero section first (critical)
    await fetchHeroSection(1)
    const slides = getHeroSlides()
    heroSlides.value = slides
    console.log('✅ Hero loaded:', heroSlides.value.length, 'slides')
    
    // STEP 2: Show the page immediately
    loading.value = false
    
    // STEP 3: Load ALL remaining sections
    console.log('🔄 Loading remaining sections...')
    
    // Fetch about section
    await fetchAboutSection(1)
    const aboutData = getAboutData()
    if (aboutData) {
      pageData.value.about = aboutData
      console.log('✅ About loaded')
    }
    
    // Fetch facilities
    await fetchFacilities()
    facilitiesLoaded.value = true
    console.log('✅ Facilities loaded:', facilitiesList.value.length)
    
    // Fetch gallery
    await fetchGallery()
    galleryLoaded.value = true
    console.log('✅ Gallery loaded:', galleryItems.value.length)
    
    // Fetch testimonials
    await fetchTestimonials()
    testimonials.value = apiTestimonials.value.slice(0, 6)
    testimonialsLoaded.value = true
    console.log('✅ Testimonials loaded:', testimonials.value.length)
    
    // Fetch room types
    await fetchRoomTypes()
    roomTypesList.value = apiRoomTypes.value
    console.log('✅ Room types loaded:', roomTypesList.value.length)
    
    // Fetch rooms
    await fetchRooms()
    homepageRooms.value = rooms.value.slice(0, 3)
    console.log('✅ Rooms loaded:', homepageRooms.value.length)
    
    console.log('✅ All content loaded!')
    
    // Start autoplay
    if (heroSlides.value.length > 0) {
      if (autoplayInterval.value) clearInterval(autoplayInterval.value)
      autoplayInterval.value = setInterval(nextSlide, 5000)
    }
    
  } catch (err) {
    console.error('Error fetching homepage data:', err)
    error.value = 'Failed to load content. Please check your connection and try again.'
    loading.value = false
  }
}

// Update the Intersection Observer setup - FIXED
// const setupIntersectionObserver = () => {
//   if (!('IntersectionObserver' in window)) return
  
//   // Track loaded sections
//   let facilitiesLoading = false
//   let galleryLoading = false
//   let testimonialsLoading = false
  
//   const sectionMap = {
//     'facilities-section': async () => { 
//       if (!facilitiesLoaded.value && !facilitiesLoading) {
//         facilitiesLoading = true
//         console.log('🔄 Loading facilities...')
//         await fetchFacilities()
//         facilitiesLoaded.value = true
//         facilitiesLoading = false
//         console.log('✅ Facilities lazy loaded:', facilitiesList.value.length)
//       }
//     },
//     'gallery-section': async () => { 
//       if (!galleryLoaded.value && !galleryLoading) {
//         galleryLoading = true
//         console.log('🔄 Loading gallery...')
//         await fetchGallery()
//         galleryLoaded.value = true
//         galleryLoading = false
//         console.log('✅ Gallery lazy loaded:', galleryItems.value.length)
//       }
//     },
//     'testimonials-section': async () => { 
//       if (!testimonialsLoaded.value && !testimonialsLoading) {
//         testimonialsLoading = true
//         console.log('🔄 Loading testimonials...')
//         await fetchTestimonials()
//         testimonials.value = apiTestimonials.value.slice(0, 6)
//         testimonialsLoaded.value = true
//         testimonialsLoading = false
//         console.log('✅ Testimonials lazy loaded:', testimonials.value.length)
//       }
//     }
//   }
  
//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         const sectionId = entry.target.id
//         console.log(`👀 Section visible: ${sectionId}`)
//         if (sectionMap[sectionId]) {
//           sectionMap[sectionId]()
//         }
//       }
//     })
//   }, { rootMargin: '200px' }) // Reduced from 400px to 200px
  
//   // Observe sections
//   const sectionIds = ['facilities-section', 'gallery-section', 'testimonials-section']
//   sectionIds.forEach(id => {
//     const element = document.getElementById(id)
//     if (element) {
//       console.log(`👀 Observing: ${id}`)
//       observer.observe(element)
//     } else {
//       console.warn(`⚠️ Element not found: ${id}`)
//     }
//   })
  
//   return observer
// }

const goToSlide = (index) => {
  currentSlide.value = index
}

const nextSlide = () => {
  if (heroSlides.value.length > 0) {
    currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length
  }
}

const handleSearch = () => {
  const params = new URLSearchParams()
  if (searchFilters.value.roomType) params.set('room_type', searchFilters.value.roomType)
  if (searchFilters.value.seats) params.set('seats', searchFilters.value.seats)
  if (searchFilters.value.maxPrice) params.set('max_price', searchFilters.value.maxPrice)
  router.push(`/rooms?${params.toString()}`)
}

const openLightbox = (index) => {
  currentImageIndex.value = index
  lightboxOpen.value = true
}

const closeLightbox = () => {
  lightboxOpen.value = false
}

const prevImage = () => {
  if (galleryItems.value.length === 0) return
  currentImageIndex.value = currentImageIndex.value > 0 ? currentImageIndex.value - 1 : galleryItems.value.length - 1
}

const nextImage = () => {
  if (galleryItems.value.length === 0) return
  currentImageIndex.value = currentImageIndex.value < galleryItems.value.length - 1 ? currentImageIndex.value + 1 : 0
}

// let observer = null

onMounted(() => {
  fetchPageData()
  // observer = setupIntersectionObserver()
})

onUnmounted(() => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
  }
  // if (observer) {
  //   observer.disconnect()
  // }
})
</script>