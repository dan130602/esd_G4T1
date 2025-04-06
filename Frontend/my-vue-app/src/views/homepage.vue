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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


export default {
  name: 'homepage',
  components: {
    Navbar,
    SwiperCarousel,
    ProductList
  },
  mounted(){
    const auth = getAuth();
    const user = auth.currentUser;
  }
};
</script>

<style scoped>
.homepage-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Added for better vertical centering */
  width: 100vw; /* Full viewport width */
  min-height: 100vh; /* Full viewport height to prevent cut-off */
  background-color: #fff;
  overflow-x: hidden; /* Prevent horizontal scroll on zoom out */
}

.content-section {
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  display: flex;
  justify-content: center; /* Ensure inner content is centered */
}

</style>