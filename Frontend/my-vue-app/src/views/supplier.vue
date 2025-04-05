<template>
    <header class="login-page">
      <div class="top-bar">
        <div class="language-currency">
          <span>Supplier</span>
        </div>
        <div class="user-section">
          <div class="user-placeholder"></div>
          <div class="profile-link">
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/9423b7a1e50c530ed32b04debed661499212d253fcafd6ec660b8c3ae4d217b4" class="profile-icon" alt="Profile icon" />
            <span>Logout</span>
          </div>
        </div>
      </div>
      <div class="main-nav">
        <div class="logo-container">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/118c29b5408696791199f48dac9da4393149099f78b1f8facb2795216aae3b4a" class="logo-image" alt="E-Comm logo" />
          <span class="logo-text">E-Comm</span>
        </div>
        
      </div>
      <nav class="breadcrumb">
        <div class="breadcrumb-content">
          
          
            <span class="breadcrumb-text">Refund Requests</span>
          
          
        </div>
      </nav>
      <section class="orders-container">
    <div class="orders-wrapper">
      <article class="order-item">
        <div class="order-content">
          <div class="product-info">
            <div class="product-details">
              <figure class="product-image-container">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/afa4ff3f2012f78bd40298514e5c379c87407ebc3bab5675879e6bd8d281eb4e?placeholderIfAbsent=true&apiKey=3f0922c729bd4d318631e96bb560373e"
                  class="product-image"
                  alt="Product image"
                />
              </figure>
              <div class="product-description-container">
                <p class="product-description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                </p>
              </div>
            </div>
          </div>
          <div class="order-details">
            <div class="order-summary">
              <p class="order-price">150 $</p>
              
              
              <div class="action-button">
                <button class="accept-button">Accept</button>
                
              </div>
              <div class="action-button">
                <button class="deny-button">Deny</button>
                
              </div>
            </div>
          </div>
        </div>
      </article>
      
    </div>
  </section>
    </header>
  </template>

<script>
export default {
  name: "supplier",
};
</script>

<style scoped>
  
  /* Orders Component Styles */
.orders-container {
  background-color: #ffffff;
  display: flex;
  padding: 50px;
  flex-direction: column;
  overflow: hidden;
  align-items: center;
}

.orders-wrapper {
  width: 100%;
  max-width: 1248px;
}

.order-item {
  border-radius: 6px;
  background-color: #ffffff;
  width: 100%;
  padding: 31px 80px 18px 9px;
  margin-bottom: 77px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.order-item:last-child {
  margin-bottom: 0;
}

.order-content {
  display: flex;
  gap: 20px;
}

.product-info {
  display: flex;
  flex-direction: column;
  width: 46%;
}

.product-details {
  display: flex;
  gap: 20px;
  flex-grow: 1;
}

.product-image-container {
  display: flex;
  flex-direction: column;
  width: 37%;
  margin: 0;
}

.product-image {
  aspect-ratio: 1.49;
  object-fit: contain;
  object-position: center;
  width: 162px;
  border-radius: 6px;
  flex-grow: 1;
}

.product-description-container {
  display: flex;
  flex-direction: column;
  width: 63%;
  margin-left: 20px;
}

.product-description {
  color: #000000;
  font-size: 14px;
  font-family:
    Poppins,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  font-weight: 400;
  text-align: center;
  margin: auto 0;
  align-self: stretch;
}

.order-details {
  display: flex;
  flex-direction: column;
  width: 54%;
  margin-left: 20px;
}

.order-summary {
  display: flex;
  margin: auto 0;
  align-items: stretch;
  gap: 40px 98px;
  align-self: stretch;
  font-family:
    Poppins,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  font-size: 11px;
  color: #000000;
  font-weight: 300;
  text-align: center;
  flex-wrap: wrap;
}

.order-price {
  font-size: 18px;
  align-self: flex-start;
  margin: 0;
  margin-top: 5px;
}

.order-status {
  align-self: flex-start;
  display: flex;
  margin-top: 9px;
  flex-direction: column;
  align-items: stretch;
  font-weight: 400;
  white-space: nowrap;
}

.status-icon {
  aspect-ratio: 1.25;
  object-fit: contain;
  object-position: center;
  width: 15px;
  align-self: center;
}

.status-text {
  margin-top: 9px;
  margin-bottom: 0;
}

.order-date {
  font-weight: 500;
  margin: auto 0;
  font-size: large;
}

.action-button {
  font-size: 14px;
  color: #ed2323;
  white-space: nowrap;
}

.cancel-button,
.refund-button, .accept-button, .deny-button {
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.15);
  padding: 16px 28px;
  border: none;
  font-family:
    Poppins,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  font-size: 14px;
  color: #ed2323;
  cursor: pointer;
}
.accept-button {
    color: green;
}
.deny-button{
    color: red;
}

.refund-button {
  padding: 15px 29px;
}

/* Second order item specific styles */
.order-item.delivered .order-summary {
  gap: 40px 96px;
}

/* Media Queries */
@media (max-width: 991px) {
  .orders-container {
    padding: 100px 20px;
  }

  .orders-wrapper {
    max-width: 100%;
  }

  .order-item {
    max-width: 100%;
    padding-right: 20px;
  }

  .order-item.delivered {
    margin-top: 40px;
  }

  .order-content {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }

  .product-info {
    width: 100%;
  }

  .product-details {
    max-width: 100%;
    margin-top: 40px;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }

  .product-image-container {
    width: 100%;
  }

  .product-image {
    margin-top: 25px;
  }

  .product-description-container {
    width: 100%;
    margin-left: 0;
  }

  .product-description {
    margin-top: 40px;
  }

  .order-details {
    width: 100%;
    margin-left: 0;
  }

  .order-summary {
    max-width: 100%;
    margin-top: 40px;
  }

  .order-status,
  .action-button {
    white-space: initial;
  }

  .cancel-button,
  .refund-button {
    padding: 16px 20px;
    white-space: initial;
  }
}

    
.login-page {
  background-color: #fff;
  display: flex;
  padding-top: 20px;
  width: 100vw;  
  justify-content: flex-start;  /* prevent center alignment */
  min-height: 100vh;            /* avoid collapse if there's no content */
  padding-top: 0;  

  flex-direction: column;
  overflow: hidden;
  align-items: center;
  font-family:
    "Proxima Nova",
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
}

@media (max-width: 991px) {
  .login-page {
    padding-bottom: 100px;
  }
}


.top-bar {
  display: flex;
  width: 100%;
  max-width: 1225px;
  align-items: stretch;
  gap: 20px;
  font-size: 20px;
  font-weight: 400;
  flex-wrap: wrap;
  justify-content: space-between;
}

@media (max-width: 991px) {
  .top-bar {
    max-width: 100%;
  }
}

.language-currency {
  display: flex;
  margin-top: auto;
  margin-bottom: auto;
  align-items: stretch;
  gap: 13px;
  white-space: nowrap;
}

@media (max-width: 991px) {
  .language-currency {
    white-space: initial;
  }
}

.language-selector {
  display: flex;
  align-items: stretch;
  gap: 6px;
  color: #262626;
}

@media (max-width: 991px) {
  .language-selector {
    white-space: initial;
  }
}

.dropdown-arrow {
  aspect-ratio: 1.5;
  object-fit: contain;
  object-position: center;
  width: 6px;
  margin-top: auto;
  margin-bottom: auto;
  flex-shrink: 0;
}

.currency-selector {
  display: flex;
  align-items: stretch;
  gap: 5px;
  color: #22262a;
}

@media (max-width: 991px) {
  .currency-selector {
    white-space: initial;
  }
}

.currency-code {
  flex-grow: 1;
}

.user-section {
  display: flex;
  align-items: stretch;
  gap: 35px;
  color: #262626;
}

.user-placeholder {
  background-color: #fff;
  display: flex;
  width: 75px;
  flex-shrink: 0;
  height: 59px;
}

.profile-link {
  align-self: start;
  display: flex;
  margin-top: 9px;
  align-items: stretch;
  gap: 7px;
}

.profile-icon {
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 20px;
  margin-top: auto;
  margin-bottom: auto;
  flex-shrink: 0;
}


.main-nav {
  display: flex;
  
  width: 100%;
  max-width: 1201px;
  align-items: stretch;
  gap: 20px;
  font-family:
    Poppins,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  flex-wrap: wrap;
  justify-content: space-between;
}

@media (max-width: 991px) {
  .main-nav {
    max-width: 100%;
  }
}

.logo-container {
  display: flex;
  margin-top: auto;
  margin-bottom: auto;
  align-items: stretch;
  gap: 6px;
  font-size: 18px;
  color: #22262a;
  font-weight: 700;
  white-space: nowrap;
}

@media (max-width: 991px) {
  .logo-container {
    white-space: initial;
  }
}

.logo-image {
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 44px;
  flex-shrink: 0;
}

.logo-text {
  margin-top: auto;
  margin-bottom: auto;
}

.navigation {
  display: flex;
  align-items: stretch;
  gap: 40px 96px;
  font-size: 24px;
  color: #262626;
  font-weight: 500;
  flex-wrap: wrap;
}

@media (max-width: 991px) {
  .navigation {
    max-width: 100%;
  }
}

.nav-links {
  display: flex;
  margin-top: auto;
  margin-bottom: auto;
  align-items: stretch;
  gap: 40px 95px;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
}

@media (max-width: 991px) {
  .nav-links {
    max-width: 100%;
  }
}

.nav-link {
  cursor: pointer;
  color: black;
}



.nav-link.active {
  color: #40bfff;
  font-family:
    Poppins,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  font-weight: 500;
}



.cart-section {
  display: flex;
  align-items: stretch;
  gap: 40px 50px;
  white-space: nowrap;
}

@media (max-width: 991px) {
  .cart-section {
    white-space: initial;
  }
}

.friends-link {
  margin-top: auto;
  margin-bottom: auto;
  cursor: pointer;
}

.cart-icon {
  aspect-ratio: 1.2;
  object-fit: contain;
  object-position: center;
  width: 67px;
  flex-shrink: 0;
}


.breadcrumb {
  background-color: #f6f7f8;
  align-self: stretch;
  display: flex;
  margin-top: 5px;
  width: 100%;
  padding: 14px 70px;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: #c1c8ce;
  font-weight: 400;
  white-space: nowrap;
  justify-content: center;
}


  .breadcrumb {
    max-width: 100%;
    padding: 14px 20px;
    
    white-space: initial;
  }


.breadcrumb-content {
  display: flex;
  width: 110px;
  align-items: stretch;
  gap: 20px;
  justify-content: space-between;
}


  .breadcrumb-content {
    white-space: initial;
  }

  .breadcrumb-text {
color: #40bfff;

}


.current-page {
  color: #40bfff;
  font-size: 16px;
  font-family:
    Poppins,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  font-weight: 500;
}
</style>

