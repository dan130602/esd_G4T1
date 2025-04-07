<template>
  <main class="cart">
    <section class="cart-container">
      <header class="cart-header">
        <h2 class="product-label">Product</h2>
        <div class="price-details">
          <h2>Price</h2>
          <h2>Qty</h2>
          <h2>Unit Price</h2>
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
          <p class="total-price">${{ product.unit_price * product.quantity }}</p>
          <div class="qty-controls">
            <button @click="decreaseQuantity(product)" class="qty-button">−</button>
            <span class="qty">{{ product.quantity }}</span>
            <button @click="increaseQuantity(product)" class="qty-button">+</button>
          </div>
          <p class="unit-price">${{ product.unit_price }}</p>
        </div>
      </article>

      <div class="divider"></div>

      <section class="checkout-section">
        <div class="total-checkout">
          <div class="total-container">
            <h4 class="total-label">Total: ${{ subtotal }}</h4>
          </div>
          <!-- <router-link to="/payment"> -->
          <button class="checkout-button" @click="initiateCheckout()">
            
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/b1666fd7f55ef234c2e69ee00a809da2536067b72809a56a84141179f90e5508?placeholderIfAbsent=true" alt="Checkout button background" class="checkout-button-bg" />
            
            <span class="checkout-text">Check out</span>
          </button>
          <!-- </router-link> -->
        </div>
      </section>
    </section>
  </main>
</template>


<script>
import axios from 'axios';
import { auth } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";

export default {
  name: "cart",
  data() {
    return {
      cartItems: [],
      subtotal: 0,
      shipping: 20,
    };
  },
  async mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.userId = user.uid;
        const res = await axios.get(`http://localhost:8000/cart-api/cart/${this.userId}`);
        this.cartItems = res.data.cart;
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
    } catch (err) {
      console.error('Error decreasing quantity:', err);
    }
  },

  async initiateCheckout() {
    try {
      const userId = this.userId;

      const response = await axios.post('http://localhost:8000/place-order/checkout', 
        {user_id : userId },
        { headers : {'Content-Type' : 'application/json'}}
      );

      console.log(response.data);

      if (response.data.checkout_url) {
        // Redirect to the Stripe checkout page
        window.location.href = response.data.checkout_url;
      } else {
        console.error('No checkout URL received');
      }
    } catch (err) {
      console.error('Error processing checkout:', err);
    }
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
</style>
