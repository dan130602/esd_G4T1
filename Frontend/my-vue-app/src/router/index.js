import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
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
