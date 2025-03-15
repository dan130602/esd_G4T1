import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/homepage.vue'
import cart from "../views/cart.vue"
import orders from "../views/orders.vue"
import payment from "../views/payment.vue"
import CheckoutSuccess from "../views/CheckoutSuccess.vue"
import CheckoutFailure from "../views/CheckoutFailure.vue"

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
    {
      path: '/checkout-success',
      name: 'checkout-success',
      component: CheckoutSuccess,
    },
    {
      path: '/checkout-failure',
      name: 'checkout-failure',
      component: CheckoutFailure,
    },
  ],
})

export default router
