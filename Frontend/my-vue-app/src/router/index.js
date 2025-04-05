import { createRouter, createWebHistory } from 'vue-router'
import homepage from '../views/homepage.vue'
import cart from "../views/cart.vue"
import orders from "../views/orders.vue"
import payment from "../views/payment.vue"
import CheckoutSuccess from "../views/CheckoutSuccess.vue"
import CheckoutFailure from "../views/CheckoutFailure.vue"
import supplier from "../views/supplier.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/homepage',
      name: 'homepage',
      component: homepage,
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
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login.vue'),
      meta: { hideNavbar: true }  // if needed
    },
    { 
      path: "/register",
      name: "Register",
      component: () => import("@/views/RegisterView.vue")
    },
    {
      path: '/supplier',
      name: 'supplier',
      component: supplier,
      meta: { hideNavbar: true }
    },
  ],
})

export default router
