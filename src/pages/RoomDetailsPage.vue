<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
    <!-- Loading State -->
    <main v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading room details...</p>
      </div>
    </main>

    <!-- Error State -->
    <main v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md">
          <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
          <button @click="fetchRoomData" class="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all">
            Try Again
          </button>
        </div>
      </div>
    </main>

    <!-- Room Not Found -->
    <main v-else-if="!room" class="min-h-[60vh] flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-6xl font-black text-teal-600 mb-4">Room Not Found</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">The room you're looking for doesn't exist.</p>
        <router-link to="/rooms" class="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
          View All Rooms
        </router-link>
      </div>
    </main>

    <!-- Main Content -->
    <main v-else>
      <Header />
      <div class="relative">
        <!-- Back Button -->
        <div class="max-w-7xl mx-auto px-6 pt-8">
          <router-link to="/rooms" class="group flex items-center gap-2 text-teal-600 hover:text-teal-500 transition-colors font-medium">
            <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Rooms
          </router-link>
        </div>

        <!-- Room Details Section -->
        <div class="max-w-7xl mx-auto px-6 py-10">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Left Side - Room Image -->
            <div class="space-y-6">
              <div class="relative">
                <div class="rounded-xl overflow-hidden shadow border border-gray-200 dark:border-gray-700">
                  <img :src="currentImage" :alt="room.room_number || 'Room Image'" class="w-full h-[400px] object-cover" />
                  <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>

                  <div class="absolute top-6 left-6">
                    <div class="px-5 py-3 bg-teal-600 text-white rounded-xl font-black shadow-lg text-lg">
                      ৳{{ (room.room_price || 0).toLocaleString() }}<span class="text-sm font-normal">/mo</span>
                    </div>
                  </div>

                  <div class="absolute bottom-6 left-6 flex items-center gap-3 px-5 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                    <Users class="w-5 h-5 text-white" />
                    <span class="text-white font-bold">Up to {{ availabilityData?.capacity || getCapacityFromType(room.room_type?.name) }} People</span>
                  </div>

                  <div class="absolute bottom-6 right-6 px-5 py-3 bg-white dark:bg-gray-800 rounded-full shadow">
                    <span class="text-gray-800 dark:text-white font-black">{{ getDefaultSize() }} sq ft</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Side - Room Details -->
            <div class="flex flex-col space-y-6">
              <div class="flex flex-wrap gap-3">
                <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <Sparkles class="w-5 h-5 text-teal-600" />
                  <span class="text-sm font-bold tracking-wide text-teal-600 capitalize">{{ room.room_type?.room_type_title || room.room_type?.name || 'Standard' }}</span>
                </div>
              </div>

              <h1 class="text-3xl lg:text-4xl font-black text-teal-600">{{ room.room_number || 'Room ' + room.id }}</h1>

              <!-- Availability Status -->
              <div class="flex items-center gap-3">
                <div :class="['w-4 h-4 rounded-full', isRoomAvailable ? 'bg-teal-500' : 'bg-red-500']"></div>
                <span class="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {{ isRoomAvailable ? 'Available for booking' : 'Currently Booked' }}
                </span>
              </div>

              <!-- Available seats info -->
              <div v-if="availabilityData?.available_seats?.length > 0" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div class="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <CheckCircle2 class="w-5 h-5" />
                  <span class="font-medium">{{ availabilityData.available_seats.length }} seat(s) available</span>
                </div>
              </div>

              <div v-if="availabilityData?.available_seats?.length === 0 && availabilityData?.is_available === false" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div class="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <X class="w-5 h-5" />
                  <span class="font-medium">No seats available for selected dates</span>
                </div>
              </div>

              <p class="text-base text-gray-600 dark:text-gray-400 leading-relaxed">{{ room.room_description || getDefaultDescription(room.room_type?.name) }}</p>

              <div class="grid grid-cols-2 gap-4 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-3">
                  <Bed class="w-5 h-5 text-teal-600" />
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Room Number</div>
                    <div class="font-bold text-gray-800 dark:text-gray-200">{{ room.room_number || 'N/A' }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <Building2 class="w-5 h-5 text-teal-600" />
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Floor</div>
                    <div class="font-bold text-gray-800 dark:text-gray-200">{{ room.floor_id || 'N/A' }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <Building2 class="w-5 h-5 text-teal-600" />
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Building</div>
                    <div class="font-bold text-gray-800 dark:text-gray-200">{{ room.building_id || 'N/A' }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <Building2 class="w-5 h-5 text-teal-600" />
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Branch</div>
                    <div class="font-bold text-gray-800 dark:text-gray-200">{{ room.branch_id || 'N/A' }}</div>
                  </div>
                </div>
              </div>

              <button 
                @click="handleBookNow" 
                :disabled="!isRoomAvailable"
                :class="['group px-8 py-4 text-white rounded-xl font-black shadow transition-all flex items-center justify-center gap-3',
                  !isRoomAvailable 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-teal-600 hover:bg-teal-700 hover:shadow-xl hover:scale-105']">
                {{ !isRoomAvailable ? 'Currently Unavailable' : 'Book Now' }}
                <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <!-- ==================== ROOM AMENITIES SECTION (service_type_id = 1) ==================== -->
          <div v-if="roomAmenities.length > 0" class="mt-16 mb-10">
            <h2 class="text-2xl lg:text-3xl font-black mb-12 text-center text-teal-600">Room Amenities</h2>
            
            <div v-if="loadingServices" class="flex justify-center py-8">
              <div class="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div v-for="(service, i) in roomAmenities" :key="'amenity-' + i" 
                   class="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700 hover:bg-teal-600 hover:text-white hover:shadow-lg hover:-translate-y-2 hover:border-teal-600 transition-all duration-500 flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-teal-600 group-hover:bg-white/20 transition-colors duration-500">
                  <component :is="getServiceIcon(service)" class="w-6 h-6 text-white" />
                </div>
                <div class="flex-1 min-w-0">
                  <span class="text-gray-800 dark:text-gray-200 font-semibold group-hover:text-white transition-colors duration-500 block truncate">{{ service.service_name }}</span>
                  <p v-if="service.service_description" class="text-xs text-gray-500 dark:text-gray-400 group-hover:text-white/80 transition-colors duration-500 mt-1 line-clamp-2">{{ service.service_description }}</p>
                </div>
                <CheckCircle2 class="w-5 h-5 text-teal-500 flex-shrink-0 group-hover:text-white transition-colors duration-500" />
              </div>
            </div>
          </div>

          <div v-else-if="!loadingServices && room" class="mt-16 mb-10 text-center">
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
              <CheckCircle2 class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 class="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No Amenities Listed</h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm">Amenities for this room will be added soon.</p>
            </div>
          </div>

          <!-- ==================== EXTRA SERVICES SECTION (service_type_id = 2) ==================== -->
          <div v-if="extraServices.length > 0" class="mt-16 mb-10">
            <div class="text-center mb-12">
              <h2 class="text-2xl lg:text-3xl font-black text-teal-600 mb-4">Extra Services</h2>
              <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Enhance your stay with these premium add-on services. Available exclusively for current boarders of this room.
              </p>
              <div v-if="!isBorderOfRoom" class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <Shield class="w-4 h-4 text-amber-600" />
                <span class="text-sm text-amber-700 dark:text-amber-400">Only current boarders can subscribe to these services</span>
              </div>
            </div>
            
            <div v-if="loadingServices" class="flex justify-center py-8">
              <div class="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="(service, i) in extraServices" :key="'extra-' + i" 
                   :class="['group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border transition-all duration-500',
                     subscribedServiceIds.includes(service.id) 
                       ? 'border-teal-500 dark:border-teal-400 ring-2 ring-teal-500/20' 
                       : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 hover:shadow-lg hover:-translate-y-1']">
                
                <div class="flex items-start gap-4 mb-4">
                  <div :class="['w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-500',
                    subscribedServiceIds.includes(service.id) 
                      ? 'bg-teal-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-teal-600 group-hover:bg-teal-600 group-hover:text-white']">
                    <component :is="getServiceIcon(service)" class="w-7 h-7" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-gray-800 dark:text-gray-200 text-lg">{{ service.service_name }}</h3>
                    <p v-if="service.service_description" class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{{ service.service_description }}</p>
                  </div>
                </div>
                
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div class="flex items-baseline gap-1">
                    <span class="text-2xl font-black text-teal-600">৳{{ (service.service_price || 0).toLocaleString() }}</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">/mo</span>
                  </div>
                  
                  <button 
                    v-if="!subscribedServiceIds.includes(service.id)"
                    @click="subscribeToService(service.id)"
                    :disabled="!isBorderOfRoom || subscribingService"
                    :class="['px-5 py-2.5 rounded-xl font-bold text-sm transition-all',
                      isBorderOfRoom && !subscribingService
                        ? 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-md active:scale-95'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed']">
                    <span v-if="subscribingService && subscribingServiceId === service.id" class="flex items-center gap-2">
                      <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </span>
                    <span v-else>Subscribe</span>
                  </button>
                  
                  <button 
                    v-else
                    @click="viewServiceReceipt(service.id)"
                    class="px-5 py-2.5 rounded-xl font-bold text-sm bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors flex items-center gap-2">
                    <CheckCircle2 class="w-4 h-4" />
                    Subscribed
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="!loadingServices && room" class="mt-16 mb-10 text-center">
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
              <Sparkles class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 class="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No Extra Services Available</h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm">Check back later for premium add-on services.</p>
            </div>
          </div>

          <!-- Write a Review Section -->
          <div class="mt-16 mb-8 text-center">
            <button v-if="!showReviewForm" @click="handleWriteReview" 
                    :class="['inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold shadow transition-all',
                      canWriteReview && !hasUserReviewed
                        ? 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-xl hover:scale-105' 
                        : 'bg-gray-400 text-white cursor-pointer']">
              <Star class="w-5 h-5" />
              <span v-if="!isAuthenticated">Login to Write a Review</span>
              <span v-else-if="!canWriteReview">Write a Review</span>
              <span v-else-if="hasUserReviewed">Review Already Submitted</span>
              <span v-else>Write a Review</span>
            </button>

            <!-- Review Form Modal -->
            <div v-if="showReviewForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="showReviewForm = false">
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-2xl border border-gray-200 dark:border-gray-700 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-8">
                  <h3 class="text-2xl font-black text-teal-600">{{ isEditingReview ? 'Edit Review' : 'Write a Review' }}</h3>
                  <button @click="showReviewForm = false" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <X class="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form @submit.prevent="submitReview" class="space-y-7">
                  <div>
                    <label class="block text-base font-bold text-gray-700 dark:text-gray-300 mb-3">Rating</label>
                    <div class="flex items-center gap-1">
                      <Star v-for="n in 5" :key="n" @click="reviewForm.rating = n"
                            :class="['w-10 h-10 cursor-pointer transition-all hover:scale-110', 
                              n <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300']" />
                      <span class="ml-3 text-base text-gray-500">({{ reviewForm.rating }}/5)</span>
                    </div>
                  </div>

                  <div>
                    <label class="block text-base font-bold text-gray-700 dark:text-gray-300 mb-3">Title</label>
                    <input v-model="reviewForm.title" type="text" placeholder="Summary of your experience"
                           class="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" />
                  </div>

                  <div>
                    <label class="block text-base font-bold text-gray-700 dark:text-gray-300 mb-3">Comment</label>
                    <textarea v-model="reviewForm.comment" rows="5" placeholder="Share your experience..."
                              class="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"></textarea>
                  </div>

                  <p v-if="reviewErrors" class="text-red-500 text-sm font-medium">{{ reviewErrors }}</p>

                  <button type="submit" :disabled="submittingReview"
                          :class="['w-full py-4 rounded-xl font-bold text-white transition-all text-lg', 
                            submittingReview ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 hover:shadow-lg']">
                    <span v-if="submittingReview" class="flex items-center justify-center gap-2">
                      <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </span>
                    <span v-else>{{ isEditingReview ? 'Update Review' : 'Submit Review' }}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- Reviews Section -->
          <div v-if="roomReviews.length > 0" class="mb-10">
            <h2 class="text-2xl lg:text-3xl font-black mb-4 text-center text-teal-600">Borders Reviews</h2>
            
            <div class="max-w-3xl mx-auto mb-8">
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-4">
                    <div class="text-4xl font-black text-teal-600">{{ reviewStats.average_rating }}</div>
                    <div>
                      <div class="flex items-center gap-1">
                        <Star v-for="n in 5" :key="n" :class="['w-5 h-5', n <= Math.round(reviewStats.average_rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300']" />
                      </div>
                      <p class="text-sm text-gray-500 mt-1">{{ reviewStats.total_reviews }} review{{ reviewStats.total_reviews !== 1 ? 's' : '' }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="space-y-2">
                  <div v-for="rating in [5,4,3,2,1]" :key="rating" class="flex items-center gap-3">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400 w-4">{{ rating }}</span>
                    <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div class="bg-amber-400 h-2 rounded-full transition-all duration-500" 
                           :style="{ width: `${getRatingPercentage(rating)}%` }"></div>
                    </div>
                    <span class="text-xs text-gray-500 w-8">{{ getRatingCount(rating) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <div v-for="review in roomReviews.slice(0, 4)" :key="review.id" 
                   class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-700">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <img :src="review.user.avatar" :alt="review.user.name" 
                         class="w-10 h-10 rounded-full object-cover border-2 border-teal-600" />
                    <div>
                      <h4 class="font-bold text-gray-800 dark:text-gray-200">{{ review.user.name }}</h4>
                      <div class="flex items-center gap-1">
                        <Star v-for="n in 5" :key="n" :class="['w-3 h-3', n <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300']" />
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span v-if="review.verified" class="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium">
                      ✓ Verified
                    </span>
                    <span class="text-xs text-gray-400">{{ formatDate(review.created_at) }}</span>
                    <div v-if="review.user.id === currentUserId" class="flex items-center gap-1 ml-2">
                      <button @click="handleWriteReview(review)" 
                              class="p-1.5 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 text-teal-600 transition-colors" 
                              title="Edit review">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button @click="deleteUserReview(review.id)" 
                              class="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors" 
                              title="Delete review">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <h5 class="font-bold text-gray-800 dark:text-gray-200 mb-2">{{ review.title }}</h5>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">{{ review.comment }}</p>

                <div class="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span>{{ review.stay_duration }}</span>
                  <span>{{ review.stay_period }}</span>
                </div>

                <div v-if="review.response" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <Shield class="w-4 h-4 text-teal-600" />
                    <span class="text-xs font-bold text-teal-600">{{ review.response.from }}</span>
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ review.response.message }}</p>
                </div>

                <div v-if="review.helpful_count > 0" class="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <ThumbsUp class="w-4 h-4 text-gray-400" />
                  <span class="text-xs text-gray-500">{{ review.helpful_count }} found this helpful</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!loading && room && roomReviews.length === 0" class="mt-16 mb-10 text-center">
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
              <Star class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 class="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No Reviews Yet</h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm">Be the first to review this room!</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>

    <!-- Service Subscription Receipt Modal -->
    <ServiceReceiptModal 
      v-if="showServiceReceipt"
      :service-receipt="selectedServiceReceipt"
      :room="room"
      :user="currentUser"
      @close="showServiceReceipt = false"
      @print="printServiceReceipt"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useHead } from '@vueuse/head'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import ServiceReceiptModal from '../components/rooms/ServiceReceiptModal.vue'
import { useRooms } from '../composables/useRooms'
import { useReviews } from '../composables/useReviews'
import { roomAPI, bookingAPI, authAPI } from '../services/api'
import apiClient from '../services/api'
import { 
  ArrowLeft, Users, Bed, CheckCircle2, Wifi, Wind, Utensils, Coffee, 
  Dumbbell, Car, BookOpen, Shield, Sparkles, Building2, ArrowRight, X,
  Star, ThumbsUp, Clock, MapPin, Bath, Maximize2, Tv, Gamepad2, Refrigerator,
  WashingMachine, Music, Zap, Mic, Camera, Sun, Trees, Droplets, ShoppingBag,
  Phone, Mail, MapPin as MapPinIcon, Home, Award
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { fetchRoomDetails, loading: roomsLoading, error: roomsError, currentRoom } = useRooms()

useHead({
  title: () => currentRoom.value ? `Room ${currentRoom.value.room_number || currentRoom.value.id} - SylhetStay` : 'Room Details - SylhetStay',
  meta: () => currentRoom.value ? [
    { name: 'description', content: `Book ${currentRoom.value.room_number || 'this room'} at SylhetStay. ${currentRoom.value.room_description || 'Premium student accommodation in Sylhet, Bangladesh.'} ৳${(currentRoom.value.room_price || 0).toLocaleString()}/month.` },
    { name: 'keywords', content: `room ${currentRoom.value.room_number}, student room Sylhet, accommodation, ${currentRoom.value.room_type?.room_type_title || 'student housing'}` },
    { property: 'og:title', content: `Room ${currentRoom.value.room_number || currentRoom.value.id} - SylhetStay` },
    { property: 'og:description', content: `${currentRoom.value.room_description || 'Premium student accommodation in Sylhet.'} Starting at ৳${(currentRoom.value.room_price || 0).toLocaleString()}/month.` },
    { property: 'og:type', content: 'website' },
  ] : []
})

const { 
  reviews: roomReviews, 
  stats: reviewStats, 
  fetchReviews, 
  getRatingPercentage, 
  getRatingCount,
  createReview,
  updateReview,
  deleteReview,
  clearReviews,
  loading: reviewsLoading
} = useReviews()

const currentImage = ref('')
const availabilityData = ref(null)
const checkInDate = ref('')
const checkOutDate = ref('')
const checkingAvailability = ref(false)

const isBorderOfRoom = ref(false)
const currentBorderId = ref(null)
const currentUserId = ref(null)
const debugInfo = ref([])
const currentUser = ref({})

const showReviewForm = ref(false)
const submittingReview = ref(false)
const isEditingReview = ref(false)
const editingReviewId = ref(null)
const reviewForm = ref({
  rating: 5,
  title: '',
  comment: ''
})
const reviewErrors = ref('')

const roomAmenities = ref([])
const extraServices = ref([])
const loadingServices = ref(false)
const subscribingService = ref(false)
const subscribingServiceId = ref(null)
const subscribedServiceIds = ref([])

// Service Receipt state
const showServiceReceipt = ref(false)
const selectedServiceReceipt = ref(null)

// Service subscription receipts storage (in localStorage for persistence)
const serviceReceipts = ref([])

const isAuthenticated = computed(() => {
  const auth = localStorage.getItem('isAuthenticated') === 'true' || !!localStorage.getItem('auth_token')
  return auth
})

const canWriteReview = computed(() => {
  return isAuthenticated.value && isBorderOfRoom.value
})

const hasUserReviewed = computed(() => {
  if (!currentUserId.value) return false
  return roomReviews.value.some(review => {
    const reviewUserId = review.user?.id || review.user_id || review.border_user_id
    return reviewUserId == currentUserId.value
  })
})

const loading = ref(true)
const error = ref('')

const room = computed(() => currentRoom.value)

const isRoomAvailable = computed(() => {
  if (!availabilityData.value) return false
  return availabilityData.value.is_available === true && 
         availabilityData.value.available_seats?.length > 0
})

// Load user data
const loadUserData = () => {
  try {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    currentUser.value = userData
    currentUserId.value = userData.id || userData.user_id || userData.border_id || null
  } catch (e) {
    console.error('Error loading user data:', e)
  }
}

// Load service receipts from localStorage
const loadServiceReceipts = () => {
  try {
    const receipts = JSON.parse(localStorage.getItem('serviceReceipts') || '[]')
    serviceReceipts.value = receipts
    
    // Update subscribedServiceIds based on receipts
    subscribedServiceIds.value = receipts.map(r => r.service_id)
  } catch (e) {
    console.error('Error loading service receipts:', e)
    serviceReceipts.value = []
  }
}

// Save service receipts to localStorage
const saveServiceReceipts = () => {
  try {
    localStorage.setItem('serviceReceipts', JSON.stringify(serviceReceipts.value))
  } catch (e) {
    console.error('Error saving service receipts:', e)
  }
}

// Generate a unique receipt number
const generateReceiptNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SRV-${timestamp}-${random}`
}

// Generate receipt for service subscription
const generateServiceReceipt = (service, subscriptionResponse) => {
  const receipt = {
    id: generateReceiptNumber(),
    service_id: service.id,
    service_name: service.service_name,
    service_description: service.service_description,
    service_price: service.service_price || 0,
    room_id: room.value.id,
    room_number: room.value.room_number,
    room_type: room.value.room_type?.room_type_title || room.value.room_type?.name || 'Standard',
    border_id: currentBorderId.value,
    border_name: currentUser.value?.name || 'N/A',
    border_email: currentUser.value?.email || 'N/A',
    border_phone: currentUser.value?.phone || currentUser.value?.mobile_number || 'N/A',
    subscription_date: new Date().toISOString(),
    subscription_response: subscriptionResponse,
    status: 'active'
  }
  
  // Add to receipts array
  serviceReceipts.value.unshift(receipt)
  saveServiceReceipts()
  
  // Update subscribed service IDs
  if (!subscribedServiceIds.value.includes(service.id)) {
    subscribedServiceIds.value.push(service.id)
  }
  
  return receipt
}

const fetchRoomServices = async () => {
  if (!room.value?.id) return
  
  loadingServices.value = true
  try {
    const response = await apiClient.get(`/room-available-services/${room.value.id}`)
    
    console.log('Raw API Response for room services:', response.data)
    
    // Handle the specific API response structure:
    // { available_services: [...], selected_services: [...] }
    let availableServicesData = []
    let selectedServicesData = []
    
    if (response.data) {
      // Get available services (not yet assigned)
      if (Array.isArray(response.data.available_services)) {
        availableServicesData = response.data.available_services
        console.log('Found available_services array with', availableServicesData.length, 'items')
      }
      
      // Get selected/assigned services (already assigned to room)
      if (Array.isArray(response.data.selected_services)) {
        selectedServicesData = response.data.selected_services
        console.log('Found selected_services array with', selectedServicesData.length, 'items')
      }
    }
    
    // Fetch assigned services from the room data as well (from service_on_rooms)
    let assignedServicesFromRoom = []
    
    // The room object might have service_on_room data
    if (room.value?.service_on_room && Array.isArray(room.value.service_on_room)) {
      assignedServicesFromRoom = room.value.service_on_room
        .filter(item => item.service)
        .map(item => item.service)
      console.log('Services from room.service_on_room:', assignedServicesFromRoom.length, 'items')
    }
    
    // Also check room_type services
    let roomTypeServices = []
    if (room.value?.room_type?.service_on_room_type && Array.isArray(room.value.room_type.service_on_room_type)) {
      roomTypeServices = room.value.room_type.service_on_room_type
        .filter(item => item.service)
        .map(item => item.service)
      console.log('Services from room_type:', roomTypeServices.length, 'items')
    }
    
    // Combine all services and remove duplicates by ID
    const allServicesMap = new Map()
    
    // Add available services
    availableServicesData.forEach(service => {
      if (service && service.id) {
        allServicesMap.set(service.id, service)
      }
    })
    
    // Add selected/assigned services
    selectedServicesData.forEach(service => {
      if (service && service.id) {
        allServicesMap.set(service.id, service)
      }
    })
    
    // Add services from room data
    assignedServicesFromRoom.forEach(service => {
      if (service && service.id) {
        allServicesMap.set(service.id, service)
      }
    })
    
    // Add room type services
    roomTypeServices.forEach(service => {
      if (service && service.id) {
        // Only add if not already present
        if (!allServicesMap.has(service.id)) {
          allServicesMap.set(service.id, service)
        }
      }
    })
    
    // Convert map back to array
    const servicesData = Array.from(allServicesMap.values())
    
    console.log('Combined servicesData (array):', servicesData)
    console.log('Number of total services:', servicesData.length)
    
    // Log each service for debugging
    servicesData.forEach((service, index) => {
      console.log(`Service ${index + 1}:`, {
        id: service.id,
        name: service.service_name,
        type_id: service.service_type_id,
        type: service.service_type,
        price: service.service_price
      })
    })
    
    // Now safely filter by service_type_id
    // service_type_id = 1 -> Room Amenities (included in room)
    roomAmenities.value = servicesData.filter(service => {
      if (!service || typeof service !== 'object') return false
      return service.service_type_id === 1 || service.service_type?.id === 1
    })
    
    // service_type_id = 2 -> Extra Services (paid add-ons)
    extraServices.value = servicesData.filter(service => {
      if (!service || typeof service !== 'object') return false
      return service.service_type_id === 2 || service.service_type?.id === 2
    })
    
    console.log('Room Amenities (service_type_id=1):', roomAmenities.value.length, 'items')
    roomAmenities.value.forEach(s => console.log('  -', s.service_name))
    
    console.log('Extra Services (service_type_id=2):', extraServices.value.length, 'items')
    extraServices.value.forEach(s => console.log('  -', s.service_name, '৳' + (s.service_price || 0)))
    
    // Mark already subscribed/assigned services
    subscribedServiceIds.value = [...serviceReceipts.value.map(r => r.service_id)]
    
    // Also add selected services from API as subscribed
    selectedServicesData.forEach(service => {
      if (service && service.id && !subscribedServiceIds.value.includes(service.id)) {
        // Only mark type-2 services as "subscribed" (type-1 are amenities)
        if (service.service_type_id === 2 || service.service_type?.id === 2) {
          subscribedServiceIds.value.push(service.id)
        }
      }
    })
    
    console.log('Final subscribed service IDs:', subscribedServiceIds.value)
    
  } catch (err) {
    console.error('Error fetching room services:', err)
    console.log('Falling back to existing service data structure...')
    fallbackToExistingServices()
  } finally {
    loadingServices.value = false
  }
}

const fallbackToExistingServices = () => {
  const allServices = []
  
  if (room.value?.room_type?.service_on_room_type) {
    room.value.room_type.service_on_room_type.forEach(item => {
      if (item.service) {
        allServices.push({
          ...item.service,
          source: 'room_type'
        })
      }
    })
  }
  
  if (room.value?.service_on_room) {
    room.value.service_on_room.forEach(item => {
      if (item.service) {
        const exists = allServices.some(s => s.id === item.service.id)
        if (!exists) {
          allServices.push({
            ...item.service,
            source: 'room'
          })
        }
      }
    })
  }
  
  roomAmenities.value = allServices.filter(service => 
    service.service_type_id === 1 || service.service_type?.id === 1
  )
  
  extraServices.value = allServices.filter(service => 
    service.service_type_id === 2 || service.service_type?.id === 2
  )
}

const subscribeToService = async (serviceId) => {
  if (!isAuthenticated.value) {
    showLoginRequiredAlert()
    return
  }
  
  if (!isBorderOfRoom.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Access Restricted',
      text: 'Only current boarders can subscribe to extra services.',
      confirmButtonColor: '#0d9488',
      confirmButtonText: 'OK'
    })
    return
  }
  
  const service = extraServices.value.find(s => s.id === serviceId)
  if (!service) return
  
  // Show confirmation dialog with price
  Swal.fire({
    title: 'Subscribe to Service',
    html: `
      <div class="text-left">
        <p class="mb-3"><strong>Service:</strong> ${service.service_name}</p>
        <p class="mb-3"><strong>Price:</strong> ৳${(service.service_price || 0).toLocaleString()}/month</p>
        ${service.service_description ? `<p class="mb-3"><strong>Description:</strong> ${service.service_description}</p>` : ''}
      </div>
      <p class="text-sm text-gray-500 mt-4">This service will be added to your monthly bill.</p>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#0d9488',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Subscribe Now',
    cancelButtonText: 'Cancel'
  }).then(async (result) => {
    if (result.isConfirmed) {
      subscribingService.value = true
      subscribingServiceId.value = serviceId
      
      try {
        const response = await apiClient.post('/room-assign-services', {
          room_id: room.value.id,
          services: [serviceId]
        })
        
        // Generate receipt for the subscription
        const receipt = generateServiceReceipt(service, response.data)
        
        // Show the receipt
        selectedServiceReceipt.value = receipt
        showServiceReceipt.value = true
        
        Swal.fire({
          icon: 'success',
          title: 'Subscribed!',
          text: `You have successfully subscribed to ${service.service_name}.`,
          confirmButtonColor: '#0d9488',
          timer: 2000,
          showConfirmButton: true
        })
        
      } catch (err) {
        console.error('Error subscribing to service:', err)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Failed to subscribe to service. Please try again.',
          confirmButtonColor: '#0d9488'
        })
      } finally {
        subscribingService.value = false
        subscribingServiceId.value = null
      }
    }
  })
}

// View service receipt
const viewServiceReceipt = (serviceId) => {
  const receipt = serviceReceipts.value.find(r => r.service_id === serviceId)
  if (receipt) {
    selectedServiceReceipt.value = receipt
    showServiceReceipt.value = true
  } else {
    // If receipt not found locally, show a message
    Swal.fire({
      icon: 'info',
      title: 'Receipt Not Found',
      text: 'The receipt for this service could not be found. It may have been cleared from your browser storage.',
      confirmButtonColor: '#0d9488'
    })
  }
}

// Print service receipt
const printServiceReceipt = () => {
  const receiptContent = document.getElementById('service-receipt-content')
  if (!receiptContent) return
  
  const printWindow = window.open('', '_blank', 'width=1000,height=800')
  
  const printHTML = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '<title>Service Subscription Receipt - SylhetStay</title>',
    '<script src="https://cdn.tailwindcss.com"><' + '/script>',
    '<style>',
    '@media print {',
    '  body { margin: 0; padding: 20px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }',
    '  @page { size: A4; margin: 15mm; }',
    '}',
    'body { display: flex; justify-content: center; min-height: 100vh; background: #f9fafb; font-family: system-ui, -apple-system, sans-serif; }',
    '</style>',
    '</head>',
    '<body>',
    '<div style="width: 100%; max-width: 800px; margin: 20px auto; background: white; padding: 20px;">',
    receiptContent.innerHTML,
    '</div>',
    '<script>',
    'window.onload = function() { setTimeout(function() { window.print(); }, 500); }',
    '<' + '/script>',
    '</body>',
    '</html>'
  ].join('\n')

  printWindow.document.write(printHTML)
  printWindow.document.close()
}

const getServiceIcon = (service) => {
  const name = service.service_name?.toLowerCase() || ''
  
  if (name.includes('wifi') || name.includes('internet')) return Wifi
  if (name.includes('ac') || name.includes('air') || name.includes('conditioning')) return Wind
  if (name.includes('kitchen') || name.includes('food') || name.includes('meal')) return Utensils
  if (name.includes('coffee') || name.includes('tea')) return Coffee
  if (name.includes('gym') || name.includes('fitness') || name.includes('exercise')) return Dumbbell
  if (name.includes('parking') || name.includes('car') || name.includes('vehicle')) return Car
  if (name.includes('study') || name.includes('desk') || name.includes('book') || name.includes('library')) return BookOpen
  if (name.includes('security') || name.includes('cctv') || name.includes('guard') || name.includes('safety')) return Shield
  if (name.includes('tv') || name.includes('television') || name.includes('entertainment')) return Tv
  if (name.includes('game') || name.includes('play') || name.includes('console')) return Gamepad2
  if (name.includes('fridge') || name.includes('refrigerator') || name.includes('cooler')) return Refrigerator
  if (name.includes('wash') || name.includes('laundry') || name.includes('cleaning')) return WashingMachine
  if (name.includes('music') || name.includes('audio') || name.includes('sound')) return Music
  if (name.includes('power') || name.includes('electricity') || name.includes('backup')) return Zap
  if (name.includes('bath') || name.includes('shower') || name.includes('toilet') || name.includes('bathroom')) return Bath
  if (name.includes('bed') || name.includes('mattress') || name.includes('pillow')) return Bed
  
  return CheckCircle2
}

const getCapacityFromType = (roomTypeName) => {
  const capacities = {
    'shared': 4,
    'semi-private': 2,
    'premium': 1,
    'standard': 2
  }
  return capacities[roomTypeName?.toLowerCase()] || 2
}

const getDefaultSize = () => 250

const getDefaultDescription = (roomTypeName) => {
  const descriptions = {
    'shared': 'Comfortable shared accommodation with modern amenities perfect for students and professionals.',
    'semi-private': 'Semi-private room offering privacy with shared common areas. Ideal for two occupants.',
    'premium': 'Premium single room with attached bathroom and premium furnishings for ultimate comfort.',
    'standard': 'Well-appointed standard room with essential amenities for a comfortable stay.'
  }
  return descriptions[roomTypeName?.toLowerCase()] || 'Comfortable room with modern amenities for a pleasant stay.'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const showNotBorderAlert = () => {
  Swal.fire({
    icon: 'warning',
    title: 'Access Restricted',
    text: 'You are not a border of this room! Only borders can write reviews.',
    confirmButtonColor: '#0d9488',
    confirmButtonText: 'OK',
    footer: '<a href="/rooms" class="text-teal-600 hover:text-teal-700">Browse other rooms</a>'
  })
}

const showLoginRequiredAlert = () => {
  Swal.fire({
    icon: 'info',
    title: 'Login Required',
    text: 'Please login to continue.',
    confirmButtonColor: '#0d9488',
    confirmButtonText: 'Login',
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    cancelButtonColor: '#6b7280',
  }).then((result) => {
    if (result.isConfirmed) {
      router.push({ path: '/login', query: { redirect: `/rooms/${route.params.id}` } })
    }
  })
}

const showAlreadyReviewedAlert = () => {
  Swal.fire({
    icon: 'info',
    title: 'Review Already Submitted',
    text: 'You have already submitted a review for this room. You can edit or delete your existing review.',
    confirmButtonColor: '#0d9488',
    confirmButtonText: 'OK',
  })
}

const verifyBorderStatus = async () => {
  debugInfo.value = []
  
  if (!isAuthenticated.value || !room.value?.id) {
    debugInfo.value.push('❌ Not authenticated or no room ID')
    isBorderOfRoom.value = false
    return
  }
  
  try {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    const authToken = localStorage.getItem('auth_token')
    
    debugInfo.value.push(`Room ID: ${room.value.id}`)
    debugInfo.value.push(`User ID: ${userData.id || 'not found'}`)
    debugInfo.value.push(`Auth Token: ${authToken ? 'Present' : 'Missing'}`)
    
    currentUserId.value = userData.id || userData.user_id || userData.border_id || null
    debugInfo.value.push(`Current User ID: ${currentUserId.value}`)
    
    // METHOD 1: Try getting border profile via /border_user endpoint
    debugInfo.value.push('--- Method 1: Get border profile ---')
    try {
      const borderResponse = await authAPI.getUser()
      const borderData = borderResponse.data?.data || borderResponse.data
      debugInfo.value.push(`Border API Response keys: ${Object.keys(borderData).join(', ')}`)
      
      if (borderData && borderData.id) {
        currentBorderId.value = borderData.id
        debugInfo.value.push(`Border ID: ${borderData.id}`)
        
        const borderRoomId = borderData.room_id 
          || borderData.room?.id 
          || borderData.current_room_id
          || borderData.active_room_id
          || borderData.roomId
        debugInfo.value.push(`Border Room ID (all checks): ${borderRoomId}`)
        
        if (borderRoomId == room.value.id) {
          isBorderOfRoom.value = true
          debugInfo.value.push('✅ MATCH! User is border of this room')
          return
        }
        
        debugInfo.value.push('⚠️ No room_id in border profile, checking bookings...')
      } else {
        debugInfo.value.push('No border profile found')
      }
    } catch (err) {
      debugInfo.value.push(`Method 1 Error: ${err.message}`)
    }
    
    // METHOD 2: Check bookings for this room
    debugInfo.value.push('--- Method 2: Check bookings ---')
    try {
      const bookingsResponse = await bookingAPI.getAllBookings()
      const bookings = bookingsResponse.data?.data || bookingsResponse.data || []
      
      debugInfo.value.push(`Total bookings found: ${bookings.length}`)
      
      const roomBookings = bookings.filter(booking => {
        const bookingRoomId = booking.room_id || booking.room?.id
        const bookingUserId = booking.user_id 
          || booking.border_user_id 
          || booking.border_id 
          || booking.user?.id
          || booking.customer_id
        
        return bookingRoomId == room.value.id
      })
      
      debugInfo.value.push(`Bookings for this room: ${roomBookings.length}`)
      
      if (roomBookings.length > 0) {
        const activeBooking = roomBookings.find(b => b.status === 1 || b.status === '1' || b.status === 'active')
        
        if (activeBooking) {
          isBorderOfRoom.value = true
          debugInfo.value.push('✅ MATCH! Room has active booking')
          return
        }
      }
    } catch (err) {
      debugInfo.value.push(`Method 2 Error: ${err.message}`)
    }
    
    isBorderOfRoom.value = false
    
  } catch (err) {
    console.error('❌ Error verifying border status:', err)
    isBorderOfRoom.value = false
  }
}

const checkAvailability = async () => {
  if (!room.value?.id) return
  
  checkingAvailability.value = true
  try {
    const response = await roomAPI.getRoomAvailability(room.value.id)
    availabilityData.value = response.data?.data || response.data
  } catch (err) {
    console.error('Error checking availability:', err)
  } finally {
    checkingAvailability.value = false
  }
}

const fetchRoomData = async () => {
  const roomId = route.params.id
  
  if (!roomId) {
    loading.value = false
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    loadUserData()
    loadServiceReceipts()
    
    const roomData = await fetchRoomDetails(roomId)
    
    if (!roomData) {
      error.value = 'Room not found'
      loading.value = false
      return
    }
    
    currentImage.value = roomData.image || getRoomImage(roomData.room_type?.name)
    
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    checkInDate.value = today.toISOString().split('T')[0]
    checkOutDate.value = tomorrow.toISOString().split('T')[0]
    
    await verifyBorderStatus()
    await checkAvailability()
    await fetchReviews(roomId)
    await fetchRoomServices()
    
  } catch (err) {
    console.error('Error fetching room data:', err)
    error.value = err.message || 'Failed to load room details'
  } finally {
    loading.value = false
  }
}

const getRoomImage = (roomTypeName) => {
  const images = {
    'shared': 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    'semi-private': 'https://images.unsplash.com/photo-1771327811795-6197403af846?w=800',
    'premium': 'https://images.unsplash.com/photo-1663811397091-9a13493eff11?w=800',
    'standard': 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800'
  }
  return images[roomTypeName?.toLowerCase()] || images.standard
}

const handleBookNow = () => {
  if (!isAuthenticated.value) {
    router.push({ path: '/login', query: { redirect: `/rooms/${route.params.id}` } })
    return
  }
  
  if (room.value && availabilityData.value) {
    sessionStorage.setItem('selectedRoom', JSON.stringify({
      id: room.value.id,
      room_number: room.value.room_number,
      room_price: room.value.room_price,
      room_type: room.value.room_type,
      branch_id: room.value.branch_id,
      building_id: room.value.building_id,
      floor_id: room.value.floor_id,
      check_in_date: checkInDate.value,
      check_out_date: checkOutDate.value,
      available_seats: availabilityData.value.available_seats
    }))
  }
  
  router.push(`/booking?roomId=${route.params.id}`)
}

const handleWriteReview = (review = null) => {
  if (!isAuthenticated.value) {
    showLoginRequiredAlert()
    return
  }
  
  if (!isBorderOfRoom.value) {
    showNotBorderAlert()
    return
  }
  
  if (!review && hasUserReviewed.value) {
    showAlreadyReviewedAlert()
    return
  }
  
  reviewErrors.value = ''
  
  if (review) {
    isEditingReview.value = true
    editingReviewId.value = review.id
    reviewForm.value = {
      rating: review.rating || 5,
      title: review.title || '',
      comment: review.comment || ''
    }
  } else {
    isEditingReview.value = false
    editingReviewId.value = null
    reviewForm.value = { 
      rating: 5, 
      title: '', 
      comment: '' 
    }
  }
  
  showReviewForm.value = true
}

const submitReview = async () => {
  reviewErrors.value = ''
  
  if (!reviewForm.value.title.trim()) {
    reviewErrors.value = 'Title is required'
    return
  }
  if (!reviewForm.value.comment.trim()) {
    reviewErrors.value = 'Comment is required'
    return
  }
  
  submittingReview.value = true
  
  try {
    const reviewData = {
      room_id: room.value.id,
      border_id: currentBorderId.value,
      rating: reviewForm.value.rating,
      title: reviewForm.value.title.trim(),
      comment: reviewForm.value.comment.trim()
    }
    
    if (isEditingReview.value && editingReviewId.value) {
      await updateReview(editingReviewId.value, reviewData)
      
      Swal.fire({
        icon: 'success',
        title: 'Review Updated!',
        text: 'Your review has been updated successfully.',
        confirmButtonColor: '#0d9488',
        timer: 2000,
        showConfirmButton: true
      })
    } else {
      await createReview(reviewData)
      
      Swal.fire({
        icon: 'success',
        title: 'Review Submitted!',
        text: 'Thank you for your review!',
        confirmButtonColor: '#0d9488',
        timer: 2000,
        showConfirmButton: true
      })
    }
    
    showReviewForm.value = false
    isEditingReview.value = false
    editingReviewId.value = null
    
    await fetchReviews(room.value.id)
    
  } catch (err) {
    console.error('❌ Error submitting review:', err)
    const errorMessage = err.response?.data?.message 
      || err.response?.data?.error 
      || err.message 
      || 'Failed to submit review. Please try again.'
    reviewErrors.value = errorMessage
    
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonColor: '#0d9488'
    })
  } finally {
    submittingReview.value = false
  }
}

const deleteUserReview = async (reviewId) => {
  Swal.fire({
    icon: 'warning',
    title: 'Delete Review?',
    text: 'Are you sure you want to delete your review? This action cannot be undone.',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteReview(reviewId)
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your review has been deleted.',
          confirmButtonColor: '#0d9488',
          timer: 2000
        })
        
        await fetchReviews(room.value.id)
      } catch (err) {
        console.error('❌ Error deleting review:', err)
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete review. Please try again.',
          confirmButtonColor: '#0d9488'
        })
      }
    }
  })
}

watch(() => route.params.id, (newId) => {
  if (newId) {
    roomAmenities.value = []
    extraServices.value = []
    clearReviews()
    fetchRoomData()
  }
})

onMounted(() => {
  fetchRoomData()
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