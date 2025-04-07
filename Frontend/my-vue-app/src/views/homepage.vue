<template>
  <div class="container-fluid">
    <!-- Lazy loading spinner -->
    <SwiperCarousel/>
    <br>
    <div v-if="loading" class="loading-wrapper">
      <div class="spinner"></div>
      <p>Loading products...</p>
    </div>

    <!-- Product cards -->
    <div v-else class="row product-scroll-container">
      <div
        class="col-12 col-md-4 col-lg-3 d-flex justify-content-center"
        v-for="(product, index) in products"
        :key="product.item_id"
      >
        <div class="product-card">
          <div class="image-wrapper">
            <img
              :src="getProductImage(product) || '/Images/placeholder.jpg'"
              :alt="product.item_name"
              class="product-image"
            />
          </div>
          <div class="product-info">
            <h4 class="product-name">{{ product.item_name }}</h4>
            <p class="product-price">${{ product.price }}</p>
            <p class="stock">Only {{ product.quantity }} left in stock</p>

            <div class="quantity-selector">
              <button @click="decreaseQuantity(index)">−</button>
              <span>{{ product.selectedQty }}</span>
              <button @click="increaseQuantity(index, product.quantity)">+</button>
            </div>

            <button class="add-to-cart" @click="addToCart(product)">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { auth } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { reactive } from 'vue';
import Navbar from '@/components/navbar.vue';
import SwiperCarousel from '@/components/SwiperCarousel.vue';
import ProductList from '@/components/ProductList.vue';

// Shared reactive cart state
export const cartState = reactive({
  totalQuantity: 0
});

export default {
  name: 'ProductList',
  components: {
    Navbar,
    SwiperCarousel,
    ProductList
  },
  data() {
    return {
      products: [],
      userId: null,
      loading: true
    };
  },
  async mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.userId = user.uid;
        try {
          const response = await fetch('http://localhost:8000/shop/shop');
          if (!response.ok) throw new Error('Failed to fetch products');
          const data = await response.json();

          this.products = data.map(product => ({
            ...product,
            selectedQty: 1
          }));
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
      this.loading = false;
    });
  },
  methods: {
    increaseQuantity(index, max) {
      if (this.products[index].selectedQty < max) {
        this.products[index].selectedQty++;
      }
    },
    decreaseQuantity(index) {
      if (this.products[index].selectedQty > 1) {
        this.products[index].selectedQty--;
      }
    },
    async addToCart(product) {
      try {
        const item = {
          item_id: product.item_id,
          item_name: product.item_name,
          unit_price: parseFloat(product.price),
          quantity: product.selectedQty
        };

        const res = await axios.post('http://localhost:8000/cart-api/add-to-cart', {
          userId: this.userId,
          item
        });

        if (res.data.success) {
          cartState.totalQuantity += item.quantity;
        } else {
          console.error('Failed to add item.');
        }
      } catch (err) {
        console.error('Add to cart error:', err);
      }
    },
    getProductImage(product) {
      const formattedName = product.item_name.toLowerCase().replace(/\s+/g, '');
      return `../public/images/${formattedName}.jpg`;
    }
  }
};
</script>

<style scoped>
/* Spinner */
.row {
  justify-content: space-evenly;
}
.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #555;
  font-size: 18px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 5px solid #ccc;
  border-top: 5px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Product styling */
.product-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  padding: 40px;
  background-color: #f9f9f9;
}

.product-card {
  width: 260px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
}

.image-wrapper {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f6f6f6;
  padding: 10px;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-info {
  padding: 20px;
  text-align: center;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.product-price {
  font-size: 20px;
  font-weight: bold;
  color: #e91e63;
  margin-bottom: 4px;
}

.stock {
  font-size: 14px;
  color: #777;
  margin-bottom: 16px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 12px 0;
}

.quantity-selector button {
  background-color: #f0f0f0;
  border: none;
  font-size: 18px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.quantity-selector button:hover {
  background-color: #dcdcdc;
}

.quantity-selector span {
  font-weight: bold;
  font-size: 16px;
  width: 24px;
  text-align: center;
}

.add-to-cart {
  margin-top: 12px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #40bfff, #007bff);
  border: none;
  border-radius: 30px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease, transform 0.2s ease;
}

.add-to-cart:hover {
  background: linear-gradient(135deg, #007bff, #0056b3);
  transform: scale(1.05);
}
</style>
