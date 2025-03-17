<template>
  <div class="product-container">
    <div class="product-card" v-for="(product, index) in products" :key="index">
      <img :src="product.image" :alt="product.name" class="product-image" />
      <div class="product-info">
        <p class="product-description">{{ product.name }}</p>
        <p class="product-price">{{ product.price }}</p>
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
        { name: 'Magnetic Case for iPhone 14', price: '$15.90', image: '/Images/JETech Magnetic Case for iPhone 14 6.1-Inch (Black) $16.99.jpg' },
        { name: "Men's Casual Sports Shoes", price: '$28.75', image: "/Images/Men's Casual Sports Shoes Soft Breathable Running Shoes $28.75.webp" },
        { name: "Men's Sports Tee Workout Top", price: '$6.50', image: '/Images/Sports Tee Workout Tops $6.5.webp' },
        { name: 'Black PopGrip Phone Holder', price: '$14.90', image: '/Images/Black PopGrip $14.9.webp' },
        { name: 'JBL Flip 6 Portable Bluetooth Speaker', price: '$135.00', image: '/Images/JBL Flip 6 Portable Bluetooth Speaker $135.jpg' },
        { name: 'Single Folding Phone & Tablet Stand', price: '$5.30', image: '/Images/Single Folding Cell Phone Holder & Tablet Stand $5.3.jpg' },
        { name: 'SodaStream Fizz & Go Water Bottle', price: '$59.90', image: '/Images/SodaStream Fizz & Go Metal Water Bottle $59.90.webp' },
        { name: 'Tefal Emotion Non-Stick Frypan (24cm)', price: '$59.00', image: '/Images/Tefal Emotion Non Stick Frypan 24cm $59.jpg' }
      ]
    }
  }
}
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
</style>
