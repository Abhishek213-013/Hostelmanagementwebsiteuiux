import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/pages/AboutPage.vue')
  },
  {
    path: '/rooms',
    name: 'Rooms',
    component: () => import('@/pages/RoomsPage.vue')
  },
  {
    path: '/rooms/:id',
    name: 'RoomDetails',
    component: () => import('@/pages/RoomDetailsPage.vue')
  },
  {
    path: '/booking',
    name: 'Booking',
    component: () => import('@/pages/BookingPage.vue')
  },
  {
    path: '/facilities',
    name: 'Facilities',
    component: () => import('@/pages/FacilitiesPage.vue')
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: () => import('@/pages/GalleryPage.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/pages/ContactPage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
