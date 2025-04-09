<template>
    <div class="checkout-success">
      <div class="success-icon">✔️</div>
      <h1 class="success-message">Order Confirmed!</h1>
      <p class="sub-message">Thank you for your purchase. Your order ID is <strong>#123456</strong></p>
  
      <div class="order-summary">
        <p><strong>Items:</strong> Nike Airmax 270 react x2</p>
        <p><strong>Total:</strong> $118</p>
        <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
      </div>
  
      <div class="actions">
        <router-link to="/"><button class="continue-btn">Continue Shopping</button></router-link>
        <router-link to="/orders"><button class="view-orders-btn">View Orders</button></router-link>
      </div>
    </div>
  </template>
  
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
  