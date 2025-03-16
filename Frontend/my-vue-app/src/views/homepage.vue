<template>
  <div class="homepage-wrapper">
    <SwiperCarousel />
    <div class="content-section">
      <ProductList />
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/navbar.vue';
import SwiperCarousel from '@/components/SwiperCarousel.vue';
import ProductList from '@/components/ProductList.vue';

export default {
  name: 'homepage',
  components: {
    Navbar,
    SwiperCarousel,
    ProductList
  }
};
</script>

<style scoped>
.homepage-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #fff;
}

.content-section {
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  box-sizing: border-box;
  margin-top: 40px; 
}
</style>