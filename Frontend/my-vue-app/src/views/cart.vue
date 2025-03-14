<template>

  <main class="cart">
    <section class="cart-container">
      <header class="cart-header">
        <h2 class="product-label">PRODUCT</h2>
        <div class="price-details">
          <h2 class="price-label">PRICE</h2>
          <h2 class="qty-label">QTY</h2>
          <h2 class="unit-price-label">UNIT PRICE</h2>
        </div>
      </header>
      <div class="divider"></div>
  
      <article class="product-item">
        <div class="product-info">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/39b52805f174cb2cf41a7164a194d5e79856fe7ff4fd16e6113b9235c939d7cc?placeholderIfAbsent=true" alt="Nike Airmax 270 react" class="product-image" />
          <h3 class="product-name">Nike Airmax 270 react</h3>
        </div>
        <div class="product-pricing">
          <p class="total-price">$998</p>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d4e2c2c0a53e8986593dd7391c27c151832a4516ddd6d354317e5d2214d2b350?placeholderIfAbsent=true" alt="Quantity selector" class="quantity-selector" />
          <p class="unit-price">$499</p>
        </div>
      </article>
      <div class="divider"></div>
  
      <article class="product-item">
        <div class="product-info">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/347d99f8ac57859891c4fb62d8b7d8af4a0fcb86862de862dbaa946751e9a79e?placeholderIfAbsent=true" alt="Nike Airmax 270 react" class="product-image" />
          <h3 class="product-name">Nike Airmax 270 react</h3>
        </div>
        <div class="product-pricing">
          <p class="total-price">$998</p>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d4e2c2c0a53e8986593dd7391c27c151832a4516ddd6d354317e5d2214d2b350?placeholderIfAbsent=true" alt="Quantity selector" class="quantity-selector" />
          <p class="unit-price">$499</p>
        </div>
      </article>
      <div class="divider"></div>
  
      <section class="order-summary">
        <div class="summary-labels">
          <p class="subtotal-label">Subtotal</p>
          <p class="shipping-label">Shipping fee</p>
          
        </div>
        <div class="summary-values">
          <p class="subtotal-value">$998</p>
          <div class="shipping-coupon-values">
            <p class="shipping-value">$20</p>
            
          </div>
        </div>
      </section>
  
      <section class="checkout-section">
        
  
        <div class="total-checkout">
          <div class="divider total-divider"></div>
          <div class="total-container">
            <h2 class="total-label">TOTAL</h2>
            <p class="total-value">$118</p>
          </div>
          <router-link to="/payment">
          <button class="checkout-button">
            
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/b1666fd7f55ef234c2e69ee00a809da2536067b72809a56a84141179f90e5508?placeholderIfAbsent=true" alt="Checkout button background" class="checkout-button-bg" />
            
            <span class="checkout-text">Check out</span>
          </button>
          </router-link>
        </div>
      </section>
    </section>
  </main>
  </template>

<script>
export default {
  name: "cart",
};
</script>
  
  <style scoped>
    /* Cart container */
    
.cart {
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  
  flex-direction: column;
  overflow: hidden;
  align-items: start;
  font-family:
    Poppins,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
}

.cart-container {
  display: flex;
  width: 100%;
  max-width: 1256px;
  flex-direction: column;
  align-items: stretch;
}

/* Cart header */
.cart-header {
  align-self: end;
  display: flex;
  width: 100%;
  max-width: 1197px;
  align-items: stretch;
  gap: 20px;
  font-size: 20px;
  color: rgba(34, 38, 42, 1);
  font-weight: 500;
  flex-wrap: wrap;
  justify-content: space-between;
}

.price-details {
  display: flex;
  align-items: stretch;
  gap: 40px 100px;
}

/* Dividers */
.divider {
  background-color: rgba(246, 247, 248, 1);
  display: flex;
  margin-top: 23px;
  flex-shrink: 0;
  height: 2px;
  width: 100%;
}

/* Product items */
.product-item {
  align-self: center;
  display: flex;
  margin-top: 63px;
  width: 100%;
  max-width: 1105px;
  align-items: stretch;
  gap: 20px;
  font-size: 18px;
  color: rgba(38, 38, 38, 1);
  font-weight: 400;
  flex-wrap: wrap;
  justify-content: space-between;
}

.product-info {
  display: flex;
  align-items: stretch;
  gap: 29px;
}

.product-image {
  aspect-ratio: 1.47;
  object-fit: contain;
  object-position: center;
  width: 138px;
  flex-shrink: 0;
  max-width: 100%;
}

.product-name {
  margin-top: auto;
  margin-bottom: auto;
  flex-basis: auto;
  font-size: 18px;
  font-weight: 400;
}

.product-pricing {
  display: flex;
  margin-top: auto;
  margin-bottom: auto;
  align-items: center;
  gap: 40px 72px;
  white-space: nowrap;
}

.total-price,
.unit-price {
  align-self: stretch;
  margin-top: auto;
  margin-bottom: auto;
}

.quantity-selector {
  aspect-ratio: 2.72;
  object-fit: contain;
  object-position: center;
  width: 125px;
  align-self: stretch;
  flex-shrink: 0;
  max-width: 100%;
}

/* Order summary */
.order-summary {
  align-self: end;
  display: flex;
  margin-top: 100px;
  margin-right: 61px;
  width: 377px;
  max-width: 100%;
  align-items: stretch;
  gap: 20px;
  font-size: 18px;
  color: rgba(38, 38, 38, 1);
  font-weight: 400;
  justify-content: space-between;
}

.summary-labels {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.shipping-label {
  align-self: stretch;
  margin-top: 23px;
}

.coupon-label {
  margin-top: 23px;
}

.summary-values {
  white-space: nowrap;
}

.shipping-coupon-values {
  display: flex;
  margin-top: 23px;
  padding-left: 9px;
  padding-right: 3px;
  flex-direction: column;
  align-items: start;
}

.coupon-value {
  margin-top: 23px;
}

/* Checkout section */
.checkout-section {
  align-self: end;
  display: flex;
  margin-top: 24px;
  margin-right: 63px;
  width: 100%;
  max-width: 1042px;
  align-items: stretch;
  gap: 40px 100px;
  flex-wrap: wrap;
}

/* Voucher container */
.voucher-container {
  display: flex;
  flex-direction: column;
  align-self: start;
  position: relative;
  aspect-ratio: 6.15;
  margin-top: 23px;
  width: 369px;
  padding-left: 20px;
  align-items: stretch;
  gap: 20px;
  font-size: 16px;
  color: rgba(38, 38, 38, 1);
  font-weight: 400;
  justify-content: space-between;
}

.voucher-background {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
}

.voucher-text {
  position: relative;
  margin-top: auto;
  margin-bottom: auto;
}

.apply-voucher {
  aspect-ratio: 1.97;
  object-fit: contain;
  object-position: center;
  width: 118px;
  flex-shrink: 0;
  max-width: 100%;
}

/* Total and checkout */
.total-checkout {
  font-weight: 500;
  flex: 1;
  margin-left: 42rem;
}

.total-divider {
  width: 370px;
  flex-shrink: 0;
  max-width: 100%;
  height: 2px;
  margin-top: 0;
}

.total-container {
  display: flex;
  margin-top: 28px;
  align-items: stretch;
  gap: 20px;
  font-size: 30px;
  color: rgba(34, 38, 42, 1);
  white-space: nowrap;
  justify-content: space-between;
}

.checkout-button {
  display: flex;
  flex-direction: column;
  position: relative;
  aspect-ratio: 6.233;
  margin-top: 24px;
  width: 374px;
  padding: 17px 70px;
  font-size: 18px;
  color: rgba(255, 255, 255, 1);
  background: none;
  border: none;
  cursor: pointer;
  text-align: center;
  font-family:
    Poppins,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
}

.checkout-button-bg {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
}

.checkout-text {
  position: relative;
}

/* Media queries */
@media (max-width: 991px) {
  .cart {
    padding: 100px 20px;
  }

  .cart-container {
    max-width: 100%;
  }

  .cart-header {
    max-width: 100%;
    margin-right: 9px;
  }

  .price-details {
    max-width: 100%;
  }

  .divider {
    max-width: 100%;
  }

  .product-item {
    max-width: 100%;
    margin-top: 40px;
  }

  .product-pricing {
    white-space: initial;
  }

  .divider:nth-of-type(2) {
    max-width: 100%;
    margin-top: 40px;
  }

  .product-item:nth-of-type(2) {
    max-width: 100%;
    margin-top: 40px;
  }

  .product-pricing:nth-of-type(2) {
    white-space: initial;
  }

  .divider:nth-of-type(3) {
    max-width: 100%;
    margin-top: 40px;
  }

  .order-summary {
    margin-top: 40px;
    margin-right: 10px;
  }

  .summary-values {
    white-space: initial;
  }

  .shipping-coupon-values {
    white-space: initial;
  }

  .coupon-value {
    margin-left: 8px;
  }

  .checkout-section {
    max-width: 100%;
    margin-right: 10px;
  }

  .total-divider {
    margin-right: 5px;
  }

  .total-container {
    white-space: initial;
  }

  .checkout-button {
    padding: 17px 20px;
  }
}
    
  </style>
  