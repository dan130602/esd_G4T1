<template>
  <main class="cart">
    <div
      v-if="notification.show"
      :class="['notification', `notification-${notification.type}`]"
    >
      {{ notification.message }}
    </div>
    <section class="cart-container">
      <header class="cart-header">
        <h2 class="product-label fw-bold">Product</h2>
        <div class="price-details">
          <h2 class="fw-bold">Unit Price</h2>
          <h2 class="fw-bold">Qty</h2>
          <h2 class="fw-bold">Subtotal</h2>
        </div>
      </header>

      <div class="divider"></div>

      <article class="product-item" v-for="(product, index) in cartItems" :key="index">
        <div class="product-info">
          <div class="product-details">
            <h3 class="product-name">{{ product.item_name }}</h3>
          </div>
        </div>
        <div class="product-pricing">
          
          <p class="unit-price">${{ product.unit_price }}</p>
          <div class="qty-controls">
            <button @click="decreaseQuantity(product)" class="qty-button">−</button>
            <span class="qty">{{ product.quantity }}</span>
            <button @click="increaseQuantity(product)" class="qty-button">+</button>
          </div>
          <p class="total-price fw-bold">${{ product.unit_price * product.quantity }}</p>
        </div>
      </article>

      <div class="divider"></div>

            <section class="row justify-content-end mt-4 pt-4 border-top">
        <div class="col-md-5 col-lg-4"> <!-- Adjust column size as needed -->
          <div class="card shadow-sm border-0 rounded-3 p-4"> <!-- Card for styling -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="mb-0 fw-bold">Total</h4>
              <h4 class="mb-0 fw-bold">${{ subtotal.toFixed(2) }}</h4>
            </div>
            <button class="btn btn-primary btn-lg w-100 fw-semibold text-white" @click="initiateCheckout()">
              Check out
            </button>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>


<script>
import axios from 'axios';
import { auth } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { cartState } from '../cartState.js';


export default {
  name: "cart",
  data() {
    return {
      cartItems: [],
      subtotal: 0,
      shipping: 20,
      notification: {
        show: false,
        message: "",
        type: "error"
      }
    };
  },
  async mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.userId = user.uid;
        const res = await axios.get(`http://localhost:8000/cart-api/cart/${this.userId}`);
        this.cartItems = res.data.cart;
        this.updateCartQuantity();

        this.calculateSubtotal();
      }
    });
  },
  methods: {
  calculateSubtotal() {
    const items = this.cartItems || [];
    this.subtotal = items.reduce(
      (acc, item) => acc + item.quantity * item.unit_price,
      0
    );
  },

  async increaseQuantity(product) {
    try {
      const userId = this.userId
      const item = {
        item_id: product.item_id,
        item_name: product.product_name,
        quantity: 1,
        unit_price: product.unit_price,
        image: product.image || ''
      };

      await axios.post('http://localhost:8000/cart-api/add-to-cart', {
        userId,
        item
      });

      product.quantity += 1;
      

      this.calculateSubtotal();
      this.updateCartQuantity();

    } catch (err) {
      console.error('Error increasing quantity:', err);
    }
  },

  async decreaseQuantity(product) {
    try {
      const userId = this.userId;

      await axios.post('http://localhost:8000/cart-api/remove-from-cart', {
        userId,
        itemId: product.item_id,
        decreaseBy: 1
      });

      if (product.quantity > 1) {
        product.quantity -= 1;
      } else {
        // Optionally remove item from cart if quantity is 0
        this.cartItems = this.cartItems.filter(item => item.item_id !== product.item_id);
      }

      this.calculateSubtotal();
      this.updateCartQuantity();

    } catch (err) {
      console.error('Error decreasing quantity:', err);
    }
  },

  showNotification(message, type = "error") {
    this.notification.show = true;
    this.notification.message = message;
    this.notification.type = type;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.notification.show = false;
    }, 3000);
  },

  async initiateCheckout() {
    try {
      const userId = this.userId;

      const response = await axios.post('http://localhost:8000/place-order/checkout', 
        {user_id : userId },
        { headers : {'Content-Type' : 'application/json'}}
      );

      console.log(response.data);

      // Check if the request was successful
      if (response.data.success === false) {
        let errorMessage = "Checkout failed";
        
        // Map of error codes 
        const errorMessages = {
          400: "Insufficient stock for items in your cart",
          401: "Unauthorized access",
          403: "Forbidden",
          404: "Service not found",
          500: "Internal server error"
        };
        
        if (response.data.code && errorMessages[response.data.code]) {
          errorMessage = errorMessages[response.data.code];
        }
        
        // Show notification
        this.showNotification(errorMessage);
        return;
      }

      if (response.data.checkout_url) {
        // Redirect to the Stripe checkout page
        window.location.href = response.data.checkout_url;
      } else {
        console.error('Checkout error, missing Stripe URL', response.data.message);
      }
    } catch (err) {
      console.error('Error processing checkout:', err);
      this.showNotification("Error connecting to checkout service");
    }
  },
  updateCartQuantity() {
  const items = this.cartItems || [];
  cartState.totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
}
}

};
</script>

  
<style scoped>
.cart {
  padding: 40px 20px;
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.price-details {
  display: flex;
  gap: 100px;
}

.divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 24px 0;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid #f3f4f6;
  flex-wrap: wrap;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.product-name {
  font-size: 18px;
  font-weight: 500;
  color: #111827;
}

.product-pricing {
  display: flex;
  align-items: center;
  gap: 100px;
  font-size: 16px;
  font-weight: 500;
  color: #4b5563;
}

.qty-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-button {
  background-color: #e5e7eb;
  border: none;
  padding: 8px 12px;
  font-size: 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.qty-button:hover {
  background-color: #d1d5db;
}

.qty {
  min-width: 24px;
  text-align: center;
  font-weight: 600;
}

.unit-price, .total-price {
  min-width: 80px;
  text-align: right;
}

.checkout-section {
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
}

.total-checkout {
  text-align: right;
}

.total-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
}

.checkout-button {
  position: relative;
  padding: 14px 32px;
  font-size: 16px;
  color: #fff;
  font-weight: 600;
  background: linear-gradient(to right, #60a5fa, #3b82f6);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.checkout-button:hover {
  transform: translateY(-2px);
}

.checkout-button-bg {
  display: none;
}

.checkout-text {
  position: relative;
  z-index: 1;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 4px;
  color: white;
  font-weight: 500;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  animation: slide-in 0.3s ease-out, fade-out 0.5s ease-out 2.5s forwards;
}

.notification-error {
  background-color: #f44336;
}

.notification-success {
  background-color: #4CAF50;
}

.notification-warning {
  background-color: #ff9800;
}

@keyframes slide-in {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>
