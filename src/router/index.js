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
    component: () => import('@/pages/BookingPage.vue'),
    meta: { requiresAuth: true }
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
  },
  {
    path: '/my-rooms',
    name: 'MyRooms',
    component: () => import('@/pages/MyRoomsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/my-payments',
    name: 'MyPayments',
    component: () => import('@/pages/MyPaymentsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile-management',
    name: 'ProfileManagement',
    component: () => import('@/pages/ProfileManagementPage.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('isAuthenticated')) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
