import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/homepage.vue'
import cart from "../views/cart.vue"
import orders from "../views/orders.vue"
import payment from "../views/payment.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/cart',
      name: 'cart',
      component: cart,
    },
    {
      path: '/orders',
      name: 'orders',
      component: orders,
    },
    {
      path: '/payment',
      name: 'payment',
      component: payment,
    },
  ],
})

export default router
