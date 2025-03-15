<template>
    <div class="checkout-failure">
      <div class="failure-icon">❌</div>
      <h1 class="failure-message">Payment Failed</h1>
      <p class="sub-message">Something went wrong. Please try again or use another payment method.</p>
  
      <div class="actions">
        <router-link to="/cart"><button class="retry-btn">Back to Cart</button></router-link>
        <router-link to="/"><button class="home-btn">Home</button></router-link>
      </div>
    </div>
  </template>
  
  <style scoped>
  .checkout-failure {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px;
    text-align: center;
  }
  .failure-icon {
    font-size: 60px;
    color: #e53935;
    margin-bottom: 20px;
  }
  .failure-message {
    font-size: 32px;
    margin-bottom: 10px;
  }
  .sub-message {
    font-size: 18px;
    color: #555;
    margin-bottom: 30px;
  }
  .actions button {
    margin: 10px;
    padding: 12px 24px;
    font-size: 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  .retry-btn {
    background-color: #e53935;
    color: white;
  }
  .home-btn {
    background-color: #f5f5f5;
    color: #333;
  }
  </style>
  