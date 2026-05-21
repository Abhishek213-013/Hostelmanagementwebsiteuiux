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
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="fetchPageData" class="px-6 py-2 bg-teal-600 text-white rounded-lg">Retry</button>
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
                  <div class="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                    <div v-if="index === 0" class="w-2 h-2 sm:w-3 sm:h-3 bg-teal-400 rounded-full"></div>
                    <MapPin class="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                    <span class="text-xs sm:text-sm font-bold text-white tracking-wide">{{ slide.badge }}</span>
                  </div>
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

          <!-- Search Widget -->
          <div class="w-full px-4 sm:px-6 lg:px-12 mt-8 sm:mt-12">
            <div class="max-w-[1400px] mx-auto">
              <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-8 border border-gray-200 dark:border-gray-700">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
                  <div class="space-y-2 sm:space-y-3">
                    <label class="block text-sm font-bold text-teal-600 tracking-wide uppercase">{{ searchWidgetData.labels?.roomType || 'Room Type' }}</label>
                    <SearchSelect v-model="searchFilters.roomType" :options="searchWidgetData.roomTypeOptions || roomTypeOptions" placeholder="All Types" />
                  </div>
                  <div class="space-y-2 sm:space-y-3">
                    <label class="block text-sm font-bold text-teal-600 tracking-wide uppercase">{{ searchWidgetData.labels?.seats || 'Seats' }}</label>
                    <SearchSelect v-model="searchFilters.seats" :options="searchWidgetData.seatsOptions || seatsOptions" placeholder="Any" />
                  </div>
                  <div class="space-y-2 sm:space-y-3">
                    <label class="block text-sm font-bold text-teal-600 tracking-wide uppercase">{{ searchWidgetData.labels?.maxPrice || 'Max Price' }}</label>
                    <SearchSelect v-model="searchFilters.maxPrice" :options="searchWidgetData.maxPriceOptions || maxPriceOptions" placeholder="Any Budget" />
                  </div>
                  <div class="flex items-end">
                    <button @click="handleSearch" class="w-full px-6 py-2.5 text-white rounded-xl font-bold bg-teal-600 hover:bg-teal-700 transition-colors">
                      <span class="flex items-center justify-center gap-3">
                        <Search class="w-5 h-5" />
                        {{ searchWidgetData.labels?.searchButton || 'Search' }}
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
      <section v-if="pageData.availabilityCards" class="py-12">
        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection v-for="(card, i) in pageData.availabilityCards" :key="i">
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700">
                <div class="flex items-start justify-between mb-6">
                  <div class="p-4 rounded-2xl bg-teal-600">
                    <component :is="iconMap[card.icon]" class="w-7 h-7 text-white" />
                  </div>
                  <span class="px-3 sm:px-4 py-2 text-white rounded-full text-xs sm:text-sm font-bold bg-teal-600 whitespace-nowrap">
                    {{ card.badge }}
                  </span>
                </div>
                <h3 class="text-xl sm:text-2xl font-black mb-2 text-teal-600 break-words">{{ card.title }}</h3>
                <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8 break-words">{{ card.desc }}</p>
                <div class="flex items-center justify-between">
                  <div class="text-xl sm:text-2xl font-black text-teal-600 break-words">{{ card.price }}</div>
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

      <!-- Facilities -->
      <section v-if="pageData.facilities" class="py-12">
        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <AnimatedSection>
            <div class="text-center mb-10">
              <div class="inline-flex items-center gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <span class="text-xs sm:text-sm font-bold tracking-wide text-teal-600">{{ pageData.facilities.badge }}</span>
              </div>
              <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600 break-words">{{ pageData.facilities.headline }}</h2>
              <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto break-words">{{ pageData.facilities.description }}</p>
            </div>
          </AnimatedSection>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <AnimatedSection v-for="(item, i) in pageData.facilities.items" :key="i">
              <div class="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow border border-gray-200 dark:border-gray-700 text-center hover:bg-teal-600 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                <div class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-teal-600 group-hover:bg-white rounded-xl flex items-center justify-center transition-all duration-500">
                  <component :is="iconMap[item.icon]" class="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:text-teal-600" />
                </div>
                <h4 class="text-sm sm:text-lg font-black mb-1 sm:mb-2 text-teal-600 group-hover:text-white transition-colors duration-500 break-words">{{ item.label }}</h4>
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 group-hover:text-teal-100 transition-colors duration-500 break-words">{{ item.desc }}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <!-- Rooms -->
      <section v-if="pageData.rooms" class="py-12">
        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <AnimatedSection>
            <div class="text-center mb-10">
              <div class="inline-flex items-center gap-3 px-4 sm:px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow border border-gray-200 dark:border-gray-700 mb-8">
                <div class="p-2 bg-teal-600 rounded-xl">
                  <Home class="w-4 h-4 text-white" />
                </div>
                <span class="text-xs sm:text-sm font-bold tracking-wider text-teal-600 uppercase">{{ pageData.rooms.badge }}</span>
              </div>
              <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600 leading-[1.1] break-words">{{ pageData.rooms.headline }}</h2>
            </div>
          </AnimatedSection>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection v-for="(room, i) in pageData.rooms.items" :key="i">
              <div class="relative">
                <div v-if="room.popular" class="absolute -top-5 left-1/2 -translate-x-1/2 z-20 px-4 sm:px-6 py-2 sm:py-2.5 text-white rounded-full text-xs sm:text-sm font-bold shadow-lg flex items-center gap-2 bg-teal-600 whitespace-nowrap">
                  <Star class="w-4 h-4 fill-current" />
                  Most Popular
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow border border-gray-200 dark:border-gray-700">
                  <div class="relative h-48 sm:h-64 overflow-hidden">
                    <img :src="room.img" :alt="room.title" class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                  </div>
                  <div class="p-4 sm:p-6">
                    <h3 class="text-xl sm:text-2xl font-black mb-2 sm:mb-3 text-teal-600 break-words">{{ room.title }}</h3>
                    <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 break-words">{{ room.desc }}</p>
                    <div class="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                      <div v-for="(feature, j) in room.features" :key="j" class="flex items-center gap-2 sm:gap-3">
                        <div class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 class="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" />
                        </div>
                        <span class="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium break-words">{{ feature }}</span>
                      </div>
                    </div>
                    <div class="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <div class="text-xs sm:text-sm text-teal-600 mb-1">Starting from</div>
                        <div class="text-xl sm:text-2xl font-black text-teal-600 break-words">{{ room.price }}<span class="text-base sm:text-lg">/mo</span></div>
                      </div>
                      <router-link :to="`/rooms/${room.type}`" class="px-3 sm:px-5 py-1.5 sm:py-2.5 text-white rounded-xl font-bold text-sm sm:text-base bg-teal-600 hover:bg-teal-700 transition-colors whitespace-nowrap">
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
      <section v-if="pageData.gallery" class="py-12">
        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <AnimatedSection>
            <div class="text-center mb-10">
              <div class="inline-flex items-center gap-3 px-4 sm:px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow border border-gray-200 dark:border-gray-700 mb-8">
                <div class="p-2 bg-teal-600 rounded-xl">
                  <Camera class="w-4 h-4 text-white" />
                </div>
                <span class="text-xs sm:text-sm font-bold tracking-wider text-teal-600 uppercase">{{ pageData.gallery.badge }}</span>
              </div>
              <h2 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600 leading-[1.1] break-words">{{ pageData.gallery.headline }}</h2>
              <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 break-words">{{ pageData.gallery.description }}</p>
            </div>
          </AnimatedSection>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div
              v-for="(item, i) in pageData.gallery.images"
              :key="i"
              @click="openLightbox(i)"
              class="relative rounded-2xl overflow-hidden shadow group hover:opacity-80 transition-all duration-300 cursor-pointer"
              :class="i % 2 === 1 ? 'mt-8' : ''"
            >
              <img :src="item.src" :alt="item.label" class="w-full h-40 sm:h-60 object-cover brightness-110 group-hover:scale-110 transition-transform duration-300" />
              <div class="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                <span class="px-2 sm:px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">{{ item.label }}</span>
              </div>
            </div>
            <div class="relative rounded-2xl overflow-hidden flex items-center justify-center bg-gray-700 cursor-pointer" @click="openLightbox(0)">
              <div class="text-center text-white">
                <div class="text-4xl sm:text-5xl font-black mb-2">+{{ pageData.gallery.showMoreCount }}</div>
                <div class="font-bold text-sm sm:text-base">More Photos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Lightbox Modal -->
      <div
        v-if="lightboxOpen && pageData.gallery"
        class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-xl"
        @click="closeLightbox"
      >
        <button class="absolute top-4 sm:top-8 right-4 sm:right-8 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white group" @click="closeLightbox">
          <X class="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform" />
        </button>
        <button class="absolute left-4 sm:left-8 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white group hover:scale-110" @click.stop="prevImage">
          <ChevronLeft class="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
        <button class="absolute right-4 sm:right-8 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white group hover:scale-110" @click.stop="nextImage">
          <ChevronRight class="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
        <div class="max-w-5xl max-h-[80vh] mx-4 sm:mx-6" @click.stop>
          <img :src="pageData.gallery.images[currentImageIndex].src" :alt="pageData.gallery.images[currentImageIndex].label" class="w-full h-full object-contain rounded-2xl shadow-2xl" />
          <div class="text-center mt-4 sm:mt-6">
            <span class="inline-block px-3 sm:px-4 py-2 text-white rounded-xl font-bold shadow-xl text-sm sm:text-base bg-teal-600">
              {{ pageData.gallery.images[currentImageIndex].label }}
            </span>
            <p class="text-white text-xs sm:text-sm mt-2 sm:mt-3 font-medium">{{ currentImageIndex + 1 }} / {{ pageData.gallery.images.length }}</p>
          </div>
        </div>
      </div>

      <!-- Testimonials -->
      <section v-if="testimonials.length > 0" class="py-12">
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

          <!-- Featured Testimonials -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="testimonial in testimonials" :key="testimonial.id" 
                 class="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <!-- Rating Stars -->
              <div class="flex gap-1 mb-4 sm:mb-6">
                <Star v-for="n in 5" :key="n" :class="['w-4 h-4 sm:w-5 sm:h-5', n <= testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600']" />
              </div>
              
              <!-- Content -->
              <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed break-words">
                "{{ testimonial.content }}"
              </p>
              
              <!-- Tags -->
              <div v-if="testimonial.tags && testimonial.tags.length > 0" class="flex flex-wrap gap-1 mb-4">
                <span v-for="tag in testimonial.tags" :key="tag" 
                      class="px-2 py-0.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs">
                  #{{ tag }}
                </span>
              </div>
              
              <!-- User Info -->
              <div class="flex items-center gap-3 sm:gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <img :src="testimonial.user.avatar" :alt="testimonial.user.name" 
                     class="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-teal-600 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="font-black text-sm sm:text-base text-gray-800 dark:text-white truncate">{{ testimonial.user.name }}</div>
                  <div class="text-xs text-teal-600 font-medium">{{ testimonial.university }}</div>
                  <div class="text-xs text-gray-400">{{ testimonial.department }}</div>
                </div>
                <!-- Featured Badge -->
                <div v-if="testimonial.is_featured" class="flex-shrink-0">
                  <span class="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-bold">
                    Featured
                  </span>
                </div>
              </div>
              
              <!-- Stay Info -->
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

      <!-- CTA Section -->
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import {
  Search, Users, Wifi, Wind, Coffee, Car, Shield, BookOpen, MapPin, Phone, Mail, Menu, X, Home, Utensils, Dumbbell, Camera, CheckCircle2, Star, Sparkles, Award, ArrowRight, Calendar, Download, TrendingUp, ChevronRight, ChevronLeft, ChevronDown, Clock
} from 'lucide-vue-next'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import AnimatedSection from '../components/ui/AnimatedSection.vue'
import SearchSelect from '../components/ui/SearchSelect.vue'

const router = useRouter()

// Icon mapping
const iconMap = {
  Users, Wifi, Wind, Coffee, Car, Shield, BookOpen, Utensils, Dumbbell,
  Award, Sparkles, Star, TrendingUp, Calendar, Phone, Home
}

// Default fallback options
const roomTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'single', label: 'Single' },
  { value: 'shared', label: 'Shared' },
  { value: 'premium', label: 'Premium' },
]
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
const searchWidgetData = ref({})
const testimonials = ref([])
const loading = ref(true)
const error = ref('')
const searchFilters = ref({ roomType: '', seats: '', maxPrice: '' })
const currentSlide = ref(0)
const lightboxOpen = ref(false)
const currentImageIndex = ref(0)
const autoplayInterval = ref(null)

// Fetch data from JSON
async function fetchPageData() {
  loading.value = true
  error.value = ''
  try {
    const [homeResponse, testimonialsResponse] = await Promise.all([
      axios.get('https://raw.githubusercontent.com/Abhishek213-013/dummyJson/refs/heads/main/content_home.json'),
      axios.get('https://raw.githubusercontent.com/Abhishek213-013/dummyJson/refs/heads/main/testimonials.json')
    ])
    
    const data = homeResponse.data
    
    // Set hero slides
    heroSlides.value = data.hero?.slides || []
    
    // Set search widget data
    searchWidgetData.value = data.searchWidget || {}
    
    // Set page data
    pageData.value = data
    
    // Set testimonials - show featured first, then others
    const allTestimonials = testimonialsResponse.data || []
    testimonials.value = [
      ...allTestimonials.filter(t => t.is_featured),
      ...allTestimonials.filter(t => !t.is_featured)
    ].slice(0, 6) // Limit to 6 testimonials
    
    // Start autoplay
    if (autoplayInterval.value) clearInterval(autoplayInterval.value)
    autoplayInterval.value = setInterval(nextSlide, data.hero?.autoSlideInterval || 5000)
    
  } catch (err) {
    console.error('Error fetching homepage data:', err)
    error.value = 'Failed to load content. Please check your connection and try again.'
  } finally {
    loading.value = false
  }
}

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
  if (searchFilters.value.roomType) params.set('type', searchFilters.value.roomType)
  if (searchFilters.value.seats) params.set('seats', searchFilters.value.seats)
  if (searchFilters.value.maxPrice) params.set('maxPrice', searchFilters.value.maxPrice)
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
  const images = pageData.value.gallery?.images || []
  if (images.length === 0) return
  currentImageIndex.value = currentImageIndex.value > 0 ? currentImageIndex.value - 1 : images.length - 1
}

const nextImage = () => {
  const images = pageData.value.gallery?.images || []
  if (images.length === 0) return
  currentImageIndex.value = currentImageIndex.value < images.length - 1 ? currentImageIndex.value + 1 : 0
}

onMounted(() => {
  fetchPageData()
})

onUnmounted(() => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
  }
})
</script>