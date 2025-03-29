<template>
  <div class="product-container">
    <div class="product-card" v-for="(product, index) in products" :key="index">
      <img
        :src="product.image || '/Images/placeholder.jpg'"
        :alt="product.item_name"
        class="product-image"
      />
      <div class="product-info">
        <p class="product-description">{{ product.item_name }}</p>
        <p class="product-price">${{ product.price }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductList',
  data() {
    return {
      products: [],
    };
  },
  async mounted() {
    try {
      const response = await fetch('http://localhost:8000/shop/'); // 👈 Kong route
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      this.products = data;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  },
};
</script>

<style scoped>
.product-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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
</style>
