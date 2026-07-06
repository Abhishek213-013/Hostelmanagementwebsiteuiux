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
                    <span class="text-white font-bold">
                      {{ room.total_seats > 0 ? `Total ${room.total_seats} ${room.total_seats === 1 ? 'Seat' : 'Seats'}` : 'Seats: N/A' }}
                    </span>
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
                  {{ isRoomAvailable ? 'Available for booking' : 'Not Available' }}
                </span>
              </div>

              <!-- Available seats info with progress bar -->
              <div v-if="isRoomAvailable && room.total_seats > 0" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div class="flex items-center gap-2 text-green-700 dark:text-green-300 mb-3">
                  <CheckCircle2 class="w-5 h-5" />
                  <span class="font-medium">
                    {{ room.available_seats }} out of {{ room.total_seats }} {{ room.total_seats === 1 ? 'seat' : 'seats' }} available
                  </span>
                </div>
                <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    class="bg-teal-500 h-full rounded-full transition-all duration-500" 
                    :style="{ width: `${(room.available_seats / room.total_seats) * 100}%` }"
                  ></div>
                </div>
              </div>

              <!-- No seats configured -->
              <div v-else-if="room.total_seats === 0 && room.status !== 'checking'" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                <div class="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                  <AlertCircle class="w-5 h-5" />
                  <span class="font-medium">Seat information not available for this room</span>
                </div>
              </div>

              <!-- Fully booked -->
              <div v-else-if="!isRoomAvailable && room.total_seats > 0" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div class="flex items-center gap-2 text-red-700 dark:text-red-300 mb-3">
                  <X class="w-5 h-5" />
                  <span class="font-medium">All {{ room.total_seats }} {{ room.total_seats === 1 ? 'seat is' : 'seats are' }} booked</span>
                </div>
                <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div class="bg-red-500 h-full rounded-full" style="width: 100%"></div>
                </div>
              </div>

              <!-- Loading availability -->
              <div v-else-if="checkingAvailability || room.status === 'checking'" class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <div class="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                  <span class="font-medium">Checking availability...</span>
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
                  <Users class="w-5 h-5 text-teal-600" />
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Total Seats</div>
                    <div class="font-bold text-gray-800 dark:text-gray-200">
                      {{ room.total_seats > 0 ? room.total_seats : 'N/A' }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <CheckCircle2 class="w-5 h-5 text-teal-600" />
                  <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Available Seats</div>
                    <div class="font-bold" :class="isRoomAvailable ? 'text-teal-600' : 'text-red-500'">
                      {{ room.total_seats > 0 ? room.available_seats : 'N/A' }}
                    </div>
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
                {{ !isRoomAvailable ? 'Not Available' : 'Book Now' }}
                <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <!-- ==================== ROOM AMENITIES SECTION ==================== -->
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

          <!-- ==================== EXTRA SERVICES SECTION ==================== -->
          <div v-if="extraServices.length > 0" class="mt-16 mb-10">
            <div class="text-center mb-12">
              <h2 class="text-2xl lg:text-3xl font-black text-teal-600 mb-4">Extra Services</h2>
              <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Enhance your stay with these premium add-on services. Available exclusively for current boarders of this room.
              </p>
              
              <div v-if="!isAuthenticated" class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Shield class="w-4 h-4 text-blue-600" />
                <span class="text-sm text-blue-700 dark:text-blue-400">
                  <button @click="showLoginRequiredAlert" class="underline hover:text-blue-800 dark:hover:text-blue-300">Login</button> 
                  to subscribe to these services
                </span>
              </div>
              
              <div v-else-if="!isBorderOfRoom" class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <Shield class="w-4 h-4 text-amber-600" />
                <span class="text-sm text-amber-700 dark:text-amber-400">Only current boarders can subscribe to these services</span>
              </div>
              
              <div v-else-if="isBorderOfRoom" class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle2 class="w-4 h-4 text-green-600" />
                <span class="text-sm text-green-700 dark:text-green-400">You are a boarder of this room - you can subscribe to extra services</span>
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
                      : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 hover:shadow-lg hover:-translate-y-1',
                    !isBorderOfRoom ? 'opacity-80' : '']">
                
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
                    :title="!isBorderOfRoom ? 'Only available for current boarders' : 'Subscribe to this service'"
                    :class="['px-5 py-2.5 rounded-xl font-bold text-sm transition-all',
                      isBorderOfRoom && !subscribingService
                        ? 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-md active:scale-95 cursor-pointer'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed']">
                    <span v-if="subscribingService && subscribingServiceId === service.id" class="flex items-center gap-2">
                      <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </span>
                    <span v-else-if="!isBorderOfRoom">
                      <Lock class="w-4 h-4 inline-block mr-1" />
                      Boarders Only
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
                
                <div v-if="!isBorderOfRoom && !subscribedServiceIds.includes(service.id)" 
                    class="mt-2 text-xs text-center text-gray-500 dark:text-gray-400 italic">
                  * Only current boarders of this room can subscribe
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

          <!-- ==================== REVIEWS SECTION ==================== -->
          <div class="mt-16 mb-8 text-center">
            <h2 class="text-2xl lg:text-3xl font-black mb-8 text-center text-teal-600">Share Your Experience</h2>
            
            <div v-if="!isAuthenticated" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
              <Shield class="w-4 h-4 text-blue-600" />
              <span class="text-sm text-blue-700 dark:text-blue-400">
                <button @click="showLoginRequiredAlert" class="underline hover:text-blue-800 dark:hover:text-blue-300 font-medium">Login</button> 
                to write a review
              </span>
            </div>
            
            <div v-else-if="!isBorderOfRoom" class="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-4">
              <Lock class="w-4 h-4 text-amber-600" />
              <span class="text-sm text-amber-700 dark:text-amber-400">Only current boarders of this room can write reviews</span>
            </div>
            
            <div v-else-if="isBorderOfRoom && hasUserReviewed" class="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4">
              <CheckCircle2 class="w-4 h-4 text-green-600" />
              <span class="text-sm text-green-700 dark:text-green-400">You have already reviewed this room. You can edit or delete your review below.</span>
            </div>
            
            <div v-else-if="isBorderOfRoom && !hasUserReviewed" class="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4">
              <Star class="w-4 h-4 text-green-600" />
              <span class="text-sm text-green-700 dark:text-green-400">Share your experience with other potential boarders!</span>
            </div>

            <div class="mt-4">
              <button v-if="!showReviewForm" @click="handleWriteReview" 
                      :disabled="!canWriteReview && !hasUserReviewed"
                      :class="['inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold shadow transition-all',
                        canWriteReview && !hasUserReviewed
                          ? 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-xl hover:scale-105' 
                          : hasUserReviewed
                            ? 'bg-amber-500 text-white hover:bg-amber-600 hover:shadow-xl hover:scale-105 cursor-pointer'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed']">
                <Star class="w-5 h-5" :class="{ 'fill-white': hasUserReviewed }" />
                <span v-if="!isAuthenticated">Login to Write a Review</span>
                <span v-else-if="!isBorderOfRoom">Write a Review (Boarders Only)</span>
                <span v-else-if="hasUserReviewed">Edit Your Review</span>
                <span v-else>Write a Review</span>
              </button>
            </div>

            <!-- Review Form Modal -->
            <div v-if="showReviewForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="showReviewForm = false">
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-2xl border border-gray-200 dark:border-gray-700 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-8">
                  <h3 class="text-2xl font-black text-teal-600">{{ isEditingReview ? 'Edit Your Review' : 'Write a Review' }}</h3>
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
                    <textarea v-model="reviewForm.comment" rows="5" placeholder="Share your experience living in this room..."
                              class="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"></textarea>
                  </div>

                  <p v-if="reviewErrors" class="text-red-500 text-sm font-medium">{{ reviewErrors }}</p>

                  <div class="flex gap-3">
                    <button type="button" @click="showReviewForm = false"
                            class="flex-1 py-4 rounded-xl font-bold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-lg">
                      Cancel
                    </button>
                    <button type="submit" :disabled="submittingReview"
                            :class="['flex-1 py-4 rounded-xl font-bold text-white transition-all text-lg', 
                              submittingReview ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 hover:shadow-lg']">
                      <span v-if="submittingReview" class="flex items-center justify-center gap-2">
                        <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </span>
                      <span v-else>{{ isEditingReview ? 'Update Review' : 'Submit Review' }}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Review Stats & Cards -->
          <div class="mb-10">
            <h2 class="text-2xl lg:text-3xl font-black mb-4 text-center text-teal-600">Boarder Reviews</h2>
            
            <div v-if="roomReviews.length > 0" class="max-w-3xl mx-auto mb-8">
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

            <div v-if="roomReviews.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
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
                      ✓ Verified Boarder
                    </span>
                    <span class="text-xs text-gray-400">{{ formatDate(review.created_at) }}</span>
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

                <div v-if="review.user.id === currentUserId" class="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button @click="handleWriteReview(review)" 
                          class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors text-xs font-medium" 
                          title="Edit your review">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </button>
                  <button @click="deleteUserReview(review.id)" 
                          class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-xs font-medium" 
                          title="Delete your review">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Delete
                  </button>
                </div>

                <div v-if="review.helpful_count > 0" class="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <ThumbsUp class="w-4 h-4 text-gray-400" />
                  <span class="text-xs text-gray-500">{{ review.helpful_count }} found this helpful</span>
                </div>
              </div>
            </div>

            <div v-if="!loading && room && roomReviews.length === 0" class="text-center">
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
                <Star class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 class="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No Reviews Yet</h3>
                <p class="text-gray-500 dark:text-gray-400 text-sm">
                  <span v-if="isBorderOfRoom && !hasUserReviewed">Be the first to review this room!</span>
                  <span v-else>No boarders have reviewed this room yet.</span>
                </p>
              </div>
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
  Phone, Mail, MapPin as MapPinIcon, Home, Award, Lock, AlertCircle
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

const showServiceReceipt = ref(false)
const selectedServiceReceipt = ref(null)
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
  if (!room.value) return false
  
  // Consistent with RoomsPage - use seat-based logic
  if (room.value.total_seats > 0) {
    return room.value.available_seats > 0 && room.value.status === 'available'
  }
  
  // No seats configured
  return false
})

// ============================================
// HELPER FUNCTIONS
// ============================================

const debugInfoText = (info) => {
  if (typeof info === 'string') return info
  try {
    return JSON.stringify(info, null, 2)
  } catch (e) {
    return String(info)
  }
}

const getUserStorageKey = (baseKey) => {
  const userId = currentUserId.value || 'anonymous'
  return `${baseKey}_${userId}`
}

// ============================================
// USER DATA & RECEIPTS
// ============================================

const loadUserData = () => {
  try {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    currentUser.value = userData
    currentUserId.value = userData.id || userData.user_id || userData.border_id || null
  } catch (e) {
    console.error('Error loading user data:', e)
  }
}

const loadServiceReceipts = () => {
  try {
    const storageKey = getUserStorageKey('serviceReceipts')
    const receipts = JSON.parse(localStorage.getItem(storageKey) || '[]')
    serviceReceipts.value = receipts
    subscribedServiceIds.value = receipts.map(r => r.service_id)
  } catch (e) {
    console.error('Error loading service receipts:', e)
    serviceReceipts.value = []
    subscribedServiceIds.value = []
  }
}

const saveServiceReceipts = () => {
  try {
    const storageKey = getUserStorageKey('serviceReceipts')
    localStorage.setItem(storageKey, JSON.stringify(serviceReceipts.value))
  } catch (e) {
    console.error('Error saving service receipts:', e)
  }
}

const generateReceiptNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SRV-${timestamp}-${random}`
}

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
    user_id: currentUserId.value,
    border_name: currentUser.value?.name || 'N/A',
    border_email: currentUser.value?.email || 'N/A',
    border_phone: currentUser.value?.phone || currentUser.value?.mobile_number || 'N/A',
    subscription_date: new Date().toISOString(),
    subscription_response: subscriptionResponse,
    status: 'active'
  }
  
  serviceReceipts.value.unshift(receipt)
  saveServiceReceipts()
  
  if (!subscribedServiceIds.value.includes(service.id)) {
    subscribedServiceIds.value.push(service.id)
  }
  
  return receipt
}

// ============================================
// BORDER VERIFICATION
// ============================================

const findUserPartyIdForRoom = async (roomId) => {
  const cacheKey = `party_match_${currentUserId.value}_${roomId}`
  const cached = sessionStorage.getItem(cacheKey)
  if (cached) return JSON.parse(cached)
  
  const userData = currentUser.value
  const userName = (userData.name || '').toLowerCase().trim()
  const userPhone = (userData.phone || userData.mobile_number || '').replace(/[^0-9]/g, '')
  const userEmail = (userData.email || '').toLowerCase().trim()
  
  if (!userName && !userPhone && !userEmail) return null
  
  try {
    const bookingsResponse = await bookingAPI.getAllBookings()
    const bookings = bookingsResponse.data?.data || bookingsResponse.data || []
    const roomBookings = bookings.filter(b => (b.room_id || b.room?.id) == roomId)
    
    for (const booking of roomBookings) {
      if (booking.party && typeof booking.party === 'object') {
        const party = booking.party
        const partyName = (party.party_name || party.name || party.full_name || '').toLowerCase().trim()
        
        let partyPhone = ''
        if (party.phone || party.mobile || party.mobile_number) {
          partyPhone = (party.phone || party.mobile || party.mobile_number || '').replace(/[^0-9]/g, '')
        }
        
        const partyEmail = (party.email || party.party_email || '').toLowerCase().trim()
        
        const nameMatch = userName && partyName && (userName === partyName || partyName.includes(userName) || userName.includes(partyName))
        const phoneMatch = userPhone && partyPhone && userPhone === partyPhone
        const emailMatch = userEmail && partyEmail && userEmail === partyEmail
        
        if (nameMatch || phoneMatch || emailMatch) {
          const result = { party_id: booking.party_id, matched_by: nameMatch ? 'name' : (phoneMatch ? 'phone' : 'email') }
          sessionStorage.setItem(cacheKey, JSON.stringify(result))
          return result
        }
      }
    }
    
    return null
  } catch (err) {
    return null
  }
}

const verifyBorderStatus = async () => {
  if (!isAuthenticated.value || !room.value?.id) {
    isBorderOfRoom.value = false
    return
  }
  
  try {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    currentUserId.value = userData.id || userData.user_id || userData.border_id || null
    
    const partyMatch = await findUserPartyIdForRoom(room.value.id)
    isBorderOfRoom.value = !!partyMatch
  } catch (err) {
    isBorderOfRoom.value = false
  }
}

// ============================================
// ROOM SERVICES
// ============================================

const fetchRoomServices = async () => {
  if (!room.value?.id) return
  
  loadingServices.value = true
  try {
    const response = await apiClient.get(`/room-available-services/${room.value.id}`)
    
    let availableServicesData = []
    let selectedServicesData = []
    
    if (response.data) {
      if (Array.isArray(response.data.available_services)) availableServicesData = response.data.available_services
      if (Array.isArray(response.data.selected_services)) selectedServicesData = response.data.selected_services
    }
    
    let assignedServicesFromRoom = []
    if (room.value?.service_on_room && Array.isArray(room.value.service_on_room)) {
      assignedServicesFromRoom = room.value.service_on_room.filter(item => item.service).map(item => item.service)
    }
    
    let roomTypeServices = []
    if (room.value?.room_type?.service_on_room_type && Array.isArray(room.value.room_type.service_on_room_type)) {
      roomTypeServices = room.value.room_type.service_on_room_type.filter(item => item.service).map(item => item.service)
    }
    
    const allServicesMap = new Map()
    availableServicesData.forEach(service => { if (service?.id) allServicesMap.set(service.id, service) })
    selectedServicesData.forEach(service => { if (service?.id) allServicesMap.set(service.id, service) })
    assignedServicesFromRoom.forEach(service => { if (service?.id) allServicesMap.set(service.id, service) })
    roomTypeServices.forEach(service => { if (service?.id && !allServicesMap.has(service.id)) allServicesMap.set(service.id, service) })
    
    const servicesData = Array.from(allServicesMap.values())
    
    roomAmenities.value = servicesData.filter(service => service && typeof service === 'object' && (service.service_type_id === 1 || service.service_type?.id === 1))
    extraServices.value = servicesData.filter(service => service && typeof service === 'object' && (service.service_type_id === 2 || service.service_type?.id === 2))
    
    subscribedServiceIds.value = serviceReceipts.value.map(r => r.service_id)
  } catch (err) {
    fallbackToExistingServices()
  } finally {
    loadingServices.value = false
  }
}

const fallbackToExistingServices = () => {
  const allServices = []
  if (room.value?.room_type?.service_on_room_type) {
    room.value.room_type.service_on_room_type.forEach(item => { if (item.service) allServices.push({ ...item.service, source: 'room_type' }) })
  }
  if (room.value?.service_on_room) {
    room.value.service_on_room.forEach(item => { if (item.service && !allServices.some(s => s.id === item.service.id)) allServices.push({ ...item.service, source: 'room' }) })
  }
  roomAmenities.value = allServices.filter(service => service.service_type_id === 1 || service.service_type?.id === 1)
  extraServices.value = allServices.filter(service => service.service_type_id === 2 || service.service_type?.id === 2)
}

const subscribeToService = async (serviceId) => {
  if (!isAuthenticated.value) { showLoginRequiredAlert(); return }
  if (!isBorderOfRoom.value) {
    Swal.fire({ icon: 'warning', title: 'Access Restricted', text: 'Only current boarders can subscribe to extra services.', confirmButtonColor: '#0d9488' })
    return
  }
  
  const service = extraServices.value.find(s => s.id === serviceId)
  if (!service) return
  
  const result = await Swal.fire({
    title: '<span style="font-size: 1.3rem; font-weight: 800; color: #0d9488;">Subscribe to Service</span>',
    html: `<div style="text-align: left; padding: 5px 0;"><div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding: 12px; background: #f0fdf4; border-radius: 10px;"><div style="width: 44px; height: 44px; background: #0d9488; border-radius: 12px; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 22px;">✓</span></div><div><p style="font-weight: 600; color: #065f46; font-size: 15px;">${service.service_name}</p><p style="color: #0d9488; font-weight: 700; font-size: 18px;">৳${(service.service_price || 0).toLocaleString()}<span style="font-size: 13px; font-weight: 400;">/month</span></p></div></div></div>`,
    showCancelButton: true,
    confirmButtonText: 'Subscribe Now',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#0d9488',
    cancelButtonColor: '#6b7280',
    customClass: { popup: 'swal-custom-popup', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel', actions: 'swal-custom-actions' }
  })
  
  if (result.isConfirmed) {
    subscribingService.value = true
    subscribingServiceId.value = serviceId
    try {
      const response = await apiClient.post('/room-assign-services', { room_id: room.value.id, services: [serviceId] })
      const receipt = generateServiceReceipt(service, response.data)
      selectedServiceReceipt.value = receipt
      showServiceReceipt.value = true
      Swal.fire({ icon: 'success', title: 'Subscribed!', text: `You have successfully subscribed to ${service.service_name}.`, confirmButtonColor: '#0d9488', timer: 2000 })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Failed to subscribe to service.', confirmButtonColor: '#0d9488' })
    } finally {
      subscribingService.value = false
      subscribingServiceId.value = null
    }
  }
}

const viewServiceReceipt = (serviceId) => {
  const receipt = serviceReceipts.value.find(r => r.service_id === serviceId)
  if (receipt) {
    selectedServiceReceipt.value = receipt
    showServiceReceipt.value = true
  }
}

const printServiceReceipt = () => {
  const receiptContent = document.getElementById('service-receipt-content')
  if (!receiptContent) return
  const printWindow = window.open('', '_blank', 'width=1000,height=800')
  printWindow.document.write(`<!DOCTYPE html><html><head><title>Receipt</title><script src="https://cdn.tailwindcss.com"><\/script></head><body>${receiptContent.innerHTML}<script>window.onload=function(){setTimeout(window.print,500)}<\/script></body></html>`)
  printWindow.document.close()
}

// ============================================
// SERVICE ICON MAPPER
// ============================================

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

// ============================================
// HELPER FUNCTIONS
// ============================================

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
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
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

// ============================================
// ALERT FUNCTIONS
// ============================================

const showNotBorderAlert = () => {
  Swal.fire({ icon: 'warning', title: 'Access Restricted', text: 'You are not a border of this room!', confirmButtonColor: '#0d9488' })
}

const showLoginRequiredAlert = () => {
  Swal.fire({
    icon: 'info', title: 'Login Required', text: 'Please login to continue.',
    confirmButtonColor: '#0d9488', confirmButtonText: 'Login',
    showCancelButton: true, cancelButtonText: 'Cancel', cancelButtonColor: '#6b7280',
  }).then((result) => {
    if (result.isConfirmed) router.push({ path: '/login', query: { redirect: `/rooms/${route.params.id}` } })
  })
}

const showAlreadyReviewedAlert = () => {
  Swal.fire({ icon: 'info', title: 'Review Already Submitted', text: 'You have already submitted a review for this room.', confirmButtonColor: '#0d9488' })
}

// ============================================
// DATA FETCHING
// ============================================

const checkAvailability = async () => {
  if (!room.value?.id) return
  checkingAvailability.value = true
  try {
    const response = await roomAPI.getRoomAvailability(room.value.id)
    let availData = response.data?.data || response.data
    
    console.log('📊 Raw availability data:', availData)
    
    if (availData) {
      let availableSeatsCount = 0
      if (availData.available_count !== undefined) {
        availableSeatsCount = availData.available_count
      } else if (availData.available_seats && Array.isArray(availData.available_seats)) {
        availableSeatsCount = availData.available_seats.length
      }
      
      availabilityData.value = {
        ...availData,
        available_count: availableSeatsCount,
        is_available: availableSeatsCount > 0
      }
      
      // ONLY update available_seats if room already has total_seats set
      // DO NOT override total_seats from fetchRoomDetails
      if (room.value && room.value.total_seats !== undefined && room.value.total_seats > 0) {
        // Use the availability API count but respect the total from fetchRoomDetails
        room.value.available_seats = Math.min(availableSeatsCount, room.value.total_seats)
        room.value.status = room.value.available_seats > 0 ? 'available' : 'booked'
      }
    }
  } catch (err) {
    console.error('Error checking availability:', err)
  } finally {
    checkingAvailability.value = false
  }
}

const fetchRoomData = async () => {
  const roomId = route.params.id
  if (!roomId) { loading.value = false; return }
  
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
    
    console.log('🏠 Room data loaded from fetchRoomDetails:', {
      id: roomData.id,
      number: roomData.room_number,
      total_seats: roomData.total_seats,
      available_seats: roomData.available_seats,
      status: roomData.status
    })
    
    currentImage.value = roomData.image || getRoomImage(roomData.room_type?.name)
    
    // set availabilityData from what fetchRoomDetails already got
    if (roomData.available_seats_list) {
      availabilityData.value = {
        available_seats: roomData.available_seats_list,
        available_count: roomData.available_seats,
        is_available: roomData.available_seats > 0
      }
    }
    
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    checkInDate.value = today.toISOString().split('T')[0]
    checkOutDate.value = tomorrow.toISOString().split('T')[0]
    
    await verifyBorderStatus()
    // DON'T call checkAvailability again - fetchRoomDetails already did it
    await fetchReviews(roomId)
    await fetchRoomServices()
  } catch (err) {
    error.value = err.message || 'Failed to load room details'
  } finally {
    loading.value = false
  }
}

// ============================================
// ACTIONS
// ============================================

const handleBookNow = () => {
  if (!isAuthenticated.value) {
    router.push({ path: '/login', query: { redirect: `/rooms/${route.params.id}` } })
    return
  }
  
  if (room.value) {
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
      available_seats: room.value.available_seats
    }))
  }
  
  router.push(`/booking?roomId=${route.params.id}`)
}

const handleWriteReview = (review = null) => {
  if (!isAuthenticated.value) { showLoginRequiredAlert(); return }
  if (!isBorderOfRoom.value) { showNotBorderAlert(); return }
  if (!review && hasUserReviewed.value) { showAlreadyReviewedAlert(); return }
  
  reviewErrors.value = ''
  
  if (review) {
    isEditingReview.value = true
    editingReviewId.value = review.id
    reviewForm.value = { rating: review.rating || 5, title: review.title || '', comment: review.comment || '' }
  } else {
    isEditingReview.value = false
    editingReviewId.value = null
    reviewForm.value = { rating: 5, title: '', comment: '' }
  }
  
  showReviewForm.value = true
}

const submitReview = async () => {
  reviewErrors.value = ''
  if (!reviewForm.value.title.trim()) { reviewErrors.value = 'Title is required'; return }
  if (!reviewForm.value.comment.trim()) { reviewErrors.value = 'Comment is required'; return }
  
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
      Swal.fire({ icon: 'success', title: 'Review Updated!', confirmButtonColor: '#0d9488', timer: 2000 })
    } else {
      await createReview(reviewData)
      Swal.fire({ icon: 'success', title: 'Review Submitted!', confirmButtonColor: '#0d9488', timer: 2000 })
    }
    
    showReviewForm.value = false
    isEditingReview.value = false
    editingReviewId.value = null
    await fetchReviews(room.value.id)
  } catch (err) {
    reviewErrors.value = err.response?.data?.message || err.message || 'Failed to submit review.'
  } finally {
    submittingReview.value = false
  }
}

const deleteUserReview = async (reviewId) => {
  Swal.fire({
    icon: 'warning', title: 'Delete Review?', text: 'Are you sure?',
    showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!', cancelButtonText: 'Cancel'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteReview(reviewId)
        Swal.fire({ icon: 'success', title: 'Deleted!', confirmButtonColor: '#0d9488', timer: 2000 })
        await fetchReviews(room.value.id)
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete review.', confirmButtonColor: '#0d9488' })
      }
    }
  })
}

// ============================================
// WATCHERS & LIFECYCLE
// ============================================

watch(() => currentUserId.value, (newUserId, oldUserId) => {
  if (oldUserId && newUserId !== oldUserId) {
    loadServiceReceipts()
    if (room.value?.id) fetchRoomServices()
  }
})

watch(() => route.params.id, (newId) => {
  if (newId) {
    roomAmenities.value = []
    extraServices.value = []
    clearReviews()
    fetchRoomData()
  }
})

onMounted(() => {
  loadUserData()
  loadServiceReceipts()
  fetchRoomData()
})
</script>

<style>
.swal-custom-popup {
  border-radius: 16px !important;
  padding: 2rem !important;
  max-width: 440px !important;
}

.swal-custom-actions {
  gap: 12px !important;
  margin-top: 1.25rem !important;
  width: 100% !important;
  display: flex !important;
}

.swal-custom-actions button {
  flex: 1 !important;
  margin: 0 !important;
  border-radius: 10px !important;
  padding: 14px 20px !important;
  font-weight: 700 !important;
  font-size: 14px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.swal-custom-confirm {
  background-color: #0d9488 !important;
  color: white !important;
}

.swal-custom-confirm:hover {
  background-color: #0f766e !important;
}

.swal-custom-cancel {
  background-color: #6b7280 !important;
  color: white !important;
}

.swal-custom-cancel:hover {
  background-color: #4b5563 !important;
}
</style>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>