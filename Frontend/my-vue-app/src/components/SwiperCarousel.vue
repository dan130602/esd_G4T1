<template>
    <swiper :autoplay="{ delay: 3000 }" :loop="true" pagination navigation class="swiper-container">
      <swiper-slide v-for="(slide, index) in slides" :key="index">
        <img :src="slide.image" :alt="slide.text" />
        <div class="slide-text">{{ slide.text }}</div>
      </swiper-slide>
    </swiper>
  </template>
  
  <script>
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import 'swiper/swiper-bundle.css';
  
  export default {
    components: { Swiper, SwiperSlide },
    data() {
      return {
        slides: [
          { image: '/Images/JETech Magnetic Case for iPhone 14 6.1-Inch (Black) $16.99.jpg', text: 'Magnetic Case for iPhone 14' },
          { image: '/Images/Men\'s Casual Sports Shoes Soft Breathable Running Shoes $28.75.webp', text: 'Men\'s Casual Sports Shoes' },
          { image: '/Images/Sports Tee Workout Tops $6.5.webp', text: 'Sports Tee' }
        ]
      }
    }
  }
  </script>

<style scoped>
.swiper-container {
  width: 100%;
  max-width: 1200px;
  height: 400px;
  margin: 0 auto;
  position: relative;
  z-index: 0;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%;
}

.swiper-slide img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}

.slide-text {
  position: absolute;
  bottom: 20px;
  left: 20px;
  max-width: 80%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 5px;
  z-index: 10;
}
</style>

  