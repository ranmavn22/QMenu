import { createRouter, createWebHistory } from 'vue-router'
import QRScanner from '../views/QRScanner.vue'
import MenuView from '../views/MenuView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'qr-scanner',
      component: QRScanner,
    },
    {
      path: '/menu/:id',
      name: 'menu',
      component: MenuView,
    },
  ],
})

export default router
