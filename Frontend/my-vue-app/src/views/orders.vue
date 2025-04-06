<template>

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
              <div class="order-status">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/ae3aa4491d8e186cc4afe9c664779843c388d677a1325c85e369c527e9e5ee98?placeholderIfAbsent=true&apiKey=3f0922c729bd4d318631e96bb560373e"
                  class="status-icon"
                  alt="Order status icon"
                />
                <p class="status-text">Ordered</p>
              </div>
              <p class="order-date">26/12/2024</p>
              <div class="action-button">
                <button class="cancel-button">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </article>
      <article class="order-item delivered">
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
              <div class="order-status">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/496279d55b2488e5538f795f1c4807bb11967fde081bd9040b227e436661f3d9?placeholderIfAbsent=true&apiKey=3f0922c729bd4d318631e96bb560373e"
                  class="status-icon"
                  alt="Order status icon"
                />
                <p class="status-text">Delivered</p>
              </div>
              <p class="order-date">26/12/2024</p>
              <div class="action-button">
                <button class="refund-button">Refund</button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
  </template>
  
  <script>
export default {
  name: "orders",
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
  width:80%;
  margin: auto;
}

.orders-wrapper {
  width: 100%;
  /* max-width: 1248px; */
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
.refund-button {
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


    
  </style>