<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
const route = useRoute();

</script>

<template>
  <div>
  <Navbar v-if="!route.meta.hideNavbar"/>

  <RouterView />
  </div>
</template>

<script>
import Navbar from "@/components/navbar.vue"; // Import the navbar

export default {
  components: {
    Navbar,
  },
};
</script>

<style scoped>
/* :root {
  --color-primary: #0d6efd;
  --color-text: #2c3e50;
  --color-text-muted: #6c757d;
  --color-border: #e0e0e0;
  --color-bg-hover: #f8f9fa;
  --font-family: 'Poppins', 'Segoe UI', Roboto, sans-serif;
} */

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  width: 100vw;
  font-family: var(--font-family);
  background-color: #eef3f8;
  color: var(--color-text);
  line-height: 1.6;
}

/* Header */
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom: 1px solid var(--color-border);
}

/* Logo */
.logo {
  display: block;
  margin: 0 auto 2rem;
  max-width: 100px;
}

/* Navbar */
nav {
  width: 100%;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

nav a {
  text-decoration: none;
  color: var(--color-text-muted);
  padding: 0.5rem 1rem;
  border-left: 1px solid var(--color-border);
  transition: color 0.3s ease, background-color 0.3s ease;
  border-radius: 4px;
}

nav a:first-of-type {
  border-left: none;
}

nav a.router-link-exact-active {
  color: var(--color-primary);
  font-weight: 600;
}

nav a:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-primary);
}

/* Media Queries */
@media (min-width: 1024px) {
  header {
    padding-right: calc(var(--section-gap, 2rem) / 2);
  }

  nav {
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
    text-align: left;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
  }
}

</style>
