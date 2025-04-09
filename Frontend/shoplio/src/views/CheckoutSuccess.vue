<template>
  <div class="checkout-success">
    <div class="success-icon">✔️</div>
    <h1 class="success-message">Order Confirmed!</h1>
    <p class="sub-message">Thank you for your purchase. Your order ID is <strong>#{{ orderInfo.order_id || '123456' }}</strong></p>

    <div class="order-summary">
      <div v-if="orderInfo.items && orderInfo.items.length">
        <p><strong>Items:</strong></p>
        <p v-for="(item, index) in orderInfo.items" :key="index">
          {{ item.name }} x{{ item.quantity }}
        </p>
      </div>
      <p v-else><strong>Items:</strong> Nike Airmax 270 react x2</p>
      <p><strong>Total:</strong> ${{ orderInfo.amount || '118' }}</p>
    </div>

    <div class="actions">
      <router-link to="/homepage"><button class="continue-btn">Continue Shopping</button></router-link>
      <router-link to="/orders"><button class="view-orders-btn">View Orders</button></router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "CheckoutSuccess",
  data() {
    return {
      orderInfo: {
        order_id: '',
        items: [],
        amount: 0
      }
    };
  },
  created() {
    // Get session_id from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      // Call the API endpoint to get payment details by session ID
      axios.get(`http://localhost:8000/api/payment/session/${sessionId}`)
        .then(response => {
          this.orderInfo = response.data;
        })
        .catch(error => {
          console.error('Error fetching order:', error);
        });
    }
  }
};
</script>
  
  <style scoped>
  .checkout-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px;
    text-align: center;
  }
  .success-icon {
    font-size: 60px;
    color: #4caf50;
    margin-bottom: 20px;
  }
  .success-message {
    font-size: 32px;
    margin-bottom: 10px;
  }
  .sub-message {
    font-size: 18px;
    color: #555;
    margin-bottom: 30px;
  }
  .order-summary {
    font-size: 16px;
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
    margin-bottom: 30px;
    background: #f9f9f9;
  }
  .actions button {
    margin: 10px;
    padding: 12px 24px;
    font-size: 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  .continue-btn {
    background-color: #1976d2;
    color: white;
  }
  .view-orders-btn {
    background-color: #f5f5f5;
    color: #333;
  }
  </style>
  