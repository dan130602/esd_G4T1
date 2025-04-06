import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
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
      meta: { requiresAuth: true }
    },
    {
      path: '/cart',
      name: 'cart',
      component: cart,
      meta: { requiresAuth: true }
    },
    {
      path: '/orders',
      name: 'orders',
      component: orders,
      meta: { requiresAuth: true }
    },
    {
      path: '/payment',
      name: 'payment',
      component: payment,
      meta: { requiresAuth: true }
    },
    {
      path: '/checkout-success',
      name: 'checkout-success',
      component: CheckoutSuccess,
      meta: { requiresAuth: true }
    },
    {
      path: '/checkout-failure',
      name: 'checkout-failure',
      component: CheckoutFailure,
      meta: { requiresAuth: true }
    },
    {
      path: '/supplier',
      name: 'supplier',
      component: supplier,
      // meta: { requiresAuth: true, hideNavbar: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login.vue'),
      meta: { hideNavbar: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { hideNavbar: true }
    },
  ],
})


let isAuthChecked = false;

router.beforeEach((to, from, next) => {
  const auth = getAuth();

  // Already checked auth once, use the cached user
  if (isAuthChecked) {
    const user = auth.currentUser;
    if (to.meta.requiresAuth && !user) {
      return next('/login');
    }
    return next();
  }

  // First time checking auth – wait for Firebase to load session
  onAuthStateChanged(auth, (user) => {
    isAuthChecked = true;
    if (to.meta.requiresAuth && !user) {
      return next('/login');
    } else {
      return next();
    }
  });
});

export default router
