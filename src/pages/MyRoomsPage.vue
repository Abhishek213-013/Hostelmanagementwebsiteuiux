<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Header />
    <div class="max-w-[1400px] mx-auto px-6 lg:px-12 py-32">
      <div class="mb-12">
          <div class="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <Building2 class="w-5 h-5 text-teal-600" />
          <span class="text-sm font-bold tracking-wide text-teal-600 uppercase">My Rooms</span>
        </div>
        <h1 class="text-3xl lg:text-4xl font-black mb-6 text-teal-600">My Rooms</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">View and manage your booked rooms and reservations</p>
      </div>

      <div v-if="myRooms.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="room in myRooms" :key="room.id" class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
          <div class="relative h-48 overflow-hidden">
            <img :src="room.image" :alt="room.name" class="w-full h-full object-cover" />
            <div class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold" :class="room.status === 'Active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'">
              {{ room.status }}
            </div>
          </div>
          <div class="p-6">
            <h4 class="text-xl font-black mb-2 text-teal-600">{{ room.name }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">{{ room.description }}</p>
            <div class="space-y-2 mb-4">
              <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Calendar class="w-4 h-4 text-teal-600" />
                <span>Check-in: {{ room.checkIn }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Calendar class="w-4 h-4 text-teal-600" />
                <span>Check-out: {{ room.checkOut }}</span>
              </div>
            </div>
            <router-link :to="`/rooms/${room.id}`" class="block w-full py-3 bg-teal-600 text-white rounded-xl font-bold text-center hover:bg-teal-700 transition-colors">
              View Details
            </router-link>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <Building2 class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">No Rooms Booked Yet</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Explore our available rooms and book your stay</p>
        <router-link to="/rooms" class="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition-colors">
          <Building2 class="w-5 h-5" />
          Browse Rooms
        </router-link>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import { Building2, Calendar } from 'lucide-vue-next'

const myRooms = ref([])

onMounted(() => {
  const storedRooms = localStorage.getItem('myRooms')
  if (storedRooms) {
    myRooms.value = JSON.parse(storedRooms)
  }
})
</script>
