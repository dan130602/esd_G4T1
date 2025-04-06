<template>
  <div class="product-container">
    <div class="product-card" v-for="(product, index) in products" :key="index">
      <img
        :src="getProductImage(product) || '/Images/placeholder.jpg'"
        :alt="product.item_name"
        class="product-image"
      />
      <div class="product-info">
        <p class="product-description">{{ product.item_name }}</p>
        <p class="product-price">${{ product.price }}</p>

        <button class="add-to-cart" @click="addToCart(product)">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProductList',
  data() {
    return {
      products: [],
      userId: 4, // static for testing
    };
  },
    async mounted() {
      try {
        const response = await fetch('http://localhost:8000/shop/shop');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        console.log('✅ Fetched data:', data);
        this.products = data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
  methods: {
    async addToCart(product) {
      try {
        const item = {
          item_id: product.item_id,
          item_name: product.item_name,
          unit_price: parseFloat(product.price),
          quantity: 1,
        };

        const res = await axios.post('http://localhost:8000/cart-api/add-to-cart', {
          userId: this.userId,
          item,
        });

        if (res.data.success) {
          alert('Item added to cart!');
        } else {
          alert('Failed to add item.');
        }
      } catch (err) {
        console.error('Add to cart error:', err);
        alert('Something went wrong.');
      }
    },
    getProductImage(product) {
    const formattedName = product.item_name.toLowerCase().replace(/\s+/g, '');
    const imagePath = `../public/images/${formattedName}.jpg`; // assuming .jpg
    return imagePath;
  },

  },
};
</script>

<style scoped>
.product-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  justify-items: center;
}
.product-card {
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  background: white;
  padding: 10px;
}
.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.product-description {
  min-height: 40px;
  font-size: 14px;
  color: #333;
  text-align: center;
  margin-bottom: 5px;
}
.product-price {
  font-size: 16px;
  font-weight: bold;
  color: #E91E63;
}
.add-to-cart {
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.add-to-cart:hover {
  background-color: #0056b3;
}
</style>
