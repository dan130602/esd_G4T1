<template>
    <swiper :modules="modules" :autoplay="{ delay: 3000 }" :loop="true" pagination navigation class="swiper-container">
      <swiper-slide v-for="(slide, index) in slides" :key="index">
        <img :src="slide.image" :alt="slide.text" />
        <div class="slide-text">{{ slide.text }}</div>
      </swiper-slide>
    </swiper>
  </template>
  
  <script>
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Navigation, Pagination, Autoplay } from 'swiper/modules';
  import 'swiper/swiper-bundle.css';
  
  export default {
    components: { Swiper, SwiperSlide },
    data() {
      return {
        modules: [Navigation, Pagination, Autoplay],
        slides: [
          { image: '../public/images/headphones.jpg' , text: 'Headphones' },
          { image: '../public/images/laptop.jpg', text: 'Laptop' },
          { image: '../public/images/smartphone.jpg', text: 'Smartphone' }
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

@media (max-width: 968px) {
  .swiper-container {
    height: 300px;
    max-width: 80%;
    margin: auto;
  }
  
  .slide-text {
    font-size: 14px;
    padding: 8px 12px;
  }
}
</style>

  