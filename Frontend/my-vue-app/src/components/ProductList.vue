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
      products: [
      {
          item_name: "Black PopGrip",
          price: 14.9,
          image: "/Images/Black PopGrip $14.9.webp"
        },
        {
          item_name: "JBL Flip 6 Portable Bluetooth Speaker",
          price: 135,
          image: "/Images/JBL Flip 6 Portable Bluetooth Speaker $135.jpg"
        },
        {
          item_name: "JETech Magnetic Case for iPhone 14",
          price: 16.99,
          image: "/Images/JETech Magnetic Case for iPhone 14 6.1-Inch (Black) $16.99.jpg"
        },
        {
          item_name: "Men's Casual Sports Shoes",
          price: 28.75,
          image: "/Images/Men's Casual Sports Shoes Soft Breathable Running Shoes $28.75.webp"
        },
        {
          item_name: "Single Folding Cell Phone Holder & Tablet Stand",
          price: 5.3,
          image: "/Images/Single Folding Cell Phone Holder & Tablet Stand $5.3.jpg"
        },
        {
          item_name: "SodaStream Fizz & Go Metal Water Bottle",
          price: 59.90,
          image: "/Images/SodaStream Fizz & Go Metal Water Bottle $59.90.webp"
        },
        {
          item_name: "Sports Tee Workout Tops",
          price: 6.5,
          image: "/Images/Sports Tee Workout Tops $6.5.webp"
        },
        {
          item_name: "Tefal Emotion Non Stick Frypan 24cm",
          price: 59,
          image: "/Images/Tefal Emotion Non Stick Frypan 24cm $59.jpg"
        },
        {
          item_name: "Thermos® KFJ-series Deep Non-Stick Frying Pans",
          price: 43.80,
          image: "/Images/Thermos® KFJ-series Deep Non-Stick Frying Pans $43.80.webp"
        }
      ],
      
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
