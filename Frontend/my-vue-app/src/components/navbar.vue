<template>
  <header class="login-page">
    <div class="top-bar">
      <div class="language-currency">
        <div class="language-selector">
          <!-- <span>EN</span>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/7fd684adc611365d7308647bd9dc358ae5124183bb73acd2e565687394b2b56c" class="dropdown-arrow" alt="Dropdown arrow" /> -->
        </div>
        <div class="currency-selector">
          <!-- <span class="currency-code">USD</span>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/7fd684adc611365d7308647bd9dc358ae5124183bb73acd2e565687394b2b56c" class="dropdown-arrow" alt="Dropdown arrow" /> -->
        </div>
      </div>
      <div class="profile-wrapper">
        <div class="user-section">
          <div class="user-placeholder"></div>

          <button class="profile-link" @click.stop="toggleDropdown">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/9423b7a1e50c530ed32b04debed661499212d253fcafd6ec660b8c3ae4d217b4"
              class="profile-icon"
              alt="Profile icon"
            />
            <span>My profile</span>
          </button>
        </div>

        <!-- Keep this inside profile-wrapper so it positions correctly -->
        <div v-if="showDropdown" class="custom-dropdown-menu">
          <button class="logout-button" @click="handleLogout">Logout</button>
        </div>
      </div>

      </div>
    <div class="main-nav">
      <div class="logo-container">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/118c29b5408696791199f48dac9da4393149099f78b1f8facb2795216aae3b4a" class="logo-image" alt="E-Comm logo" />
        <span class="logo-text">Shoplio</span>
      </div>
      <nav class="navigation">
        <div class="nav-links">
          <router-link to="/homepage" class="nav-link" active-class="active">HOME</router-link>
          <router-link to="/orders" class="nav-link" active-class="active">ORDERS</router-link>
        </div>
        <router-link to="/cart">
          <div class="cart-section">
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/4c7960eeae22471aea522fff537b3c3a85b04b00ddc7584ec217757c8135ac11" class="cart-icon" alt="Shopping cart" />
            <!-- <span class="cart-badge" v-if="cartState.totalQuantity > 0">
              {{ cartState.totalQuantity }}
            </span> -->
          </div>
        </router-link>
      </nav>
    </div>
    <nav class="breadcrumb">
      <div class="breadcrumb-content">
        <span class="separator">/</span>
        <router-link v-for="(crumb, index) in breadcrumbs" 
                     :key="index" 
                     :to="crumb.link" 
                     class="breadcrumb-link">
          <span class="breadcrumb-text">{{ crumb.text }}</span>
        </router-link>
        <span class="separator">/</span>
      </div>
    </nav>
  </header>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
export default {
  name: "Navbar",
  data() {
    return {
      showDropdown: false,
    };
  },
  computed: {
    breadcrumbs() {
      // Split the current route path to create breadcrumb items
      const pathParts = this.$route.path.split('/').filter(part => part);
      const breadcrumbs = [];

      // Iterate over the parts and create breadcrumb items
      pathParts.forEach((part, index) => {
        const link = `/${pathParts.slice(0, index + 1).join('/')}`; // Create the link to each part
        breadcrumbs.push({
          text: this.getBreadcrumbText(part), // Get a friendly name for the breadcrumb
          link: link
        });
      });

      

      return breadcrumbs;
    }
  },
  methods: {
    getBreadcrumbText(part) {
      // You can add a switch statement or map to convert URL segments to readable text
      const breadcrumbMap = {
        'homepage': 'Home',
        'orders': 'Orders',
        'cart': 'Cart',
        'login': 'Login'
        // Add more mapping as needed
      };
      return breadcrumbMap[part] || part.charAt(0).toUpperCase() + part.slice(1); // Default to the URL part if no match
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    async handleLogout() {
      const auth = getAuth();
      try {
        console.log("Logging out...");
        await signOut(auth);
        this.$router.push("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    },
  }
};
</script>


  <style scoped>
  

    
    .login-page {
      background-color: #fff;
      display: flex;
      padding-top: 20px;
      width: 100%;  
      
   
      flex-direction: column;
      overflow: hidden;
      align-items: center;
      font-family:
        "Proxima Nova",
        -apple-system,
        Roboto,
        Helvetica,
        sans-serif;
    }
  
    @media (max-width: 991px) {
      .login-page {
        padding-bottom: 100px;
      }
    }
  
    
    .top-bar {
      display: flex;
      width: 100%;
      
      align-items: stretch;
      gap: 20px;
      font-size: 20px;
      font-weight: 400;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  
    
  
    .language-currency {
      display: flex;
      margin-top: auto;
      margin-bottom: auto;
      align-items: stretch;
      gap: 13px;
      white-space: nowrap;
    }
  
    @media (max-width: 991px) {
      .language-currency {
        white-space: initial;
      }
    }
  
    .language-selector {
      display: flex;
      align-items: stretch;
      gap: 6px;
      color: #262626;
    }
  
    @media (max-width: 991px) {
      .language-selector {
        white-space: initial;
      }
    }
  
    .dropdown-arrow {
      aspect-ratio: 1.5;
      object-fit: contain;
      object-position: center;
      width: 6px;
      margin-top: auto;
      margin-bottom: auto;
      flex-shrink: 0;
    }
  
    .currency-selector {
      display: flex;
      align-items: stretch;
      gap: 5px;
      color: #22262a;
    }
  
    @media (max-width: 991px) {
      .currency-selector {
        white-space: initial;
      }
    }
  
    .currency-code {
      flex-grow: 1;
    }
  
    .user-section {
      display: flex;
      align-items: stretch;
      gap: 35px;
      color: #262626;
      position: relative;
    }
  
    .user-placeholder {
      background-color: #fff;
      display: flex;
      width: 75px;
      flex-shrink: 0;
      height: 59px;
    }
  
    .profile-link {
      display: flex;
      align-items: center;
      gap: 7px;
      background: none;
      border: none;
      font-size: 16px;
      color: #262626;
      cursor: pointer;
      padding: 6px 10px;
      border-radius: 6px;
      transition: background-color 0.2s ease;
    }

    .profile-link:hover {
      background-color: #f1f1f1;
    }
  
    .profile-icon {
      aspect-ratio: 1;
      object-fit: contain;
      object-position: center;
      width: 20px;
      margin-top: auto;
      margin-bottom: auto;
      flex-shrink: 0;
    }
  
    
    .main-nav {
      display: flex;
      
      width: 100%;
      
      align-items: stretch;
      gap: 20px;
      font-family:
        Poppins,
        -apple-system,
        Roboto,
        Helvetica,
        sans-serif;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  
    @media (max-width: 991px) {
      .main-nav {
        max-width: 100%;
      }
    }
  
    .logo-container {
      display: flex;
      margin-top: auto;
      margin-bottom: auto;
      align-items: stretch;
      gap: 6px;
      font-size: 18px;
      color: #22262a;
      font-weight: 700;
      white-space: nowrap;
    }
  
    @media (max-width: 991px) {
      .logo-container {
        white-space: initial;
      }
    }
  
    .logo-image {
      aspect-ratio: 1;
      object-fit: contain;
      object-position: center;
      width: 44px;
      flex-shrink: 0;
    }
  
    .logo-text {
      margin-top: auto;
      margin-bottom: auto;
    }
  
    .navigation {
      display: flex;
      align-items: stretch;
      gap: 40px 96px;
      font-size: 24px;
      color: #262626;
      font-weight: 500;
      flex-wrap: wrap;
    }
  
    @media (max-width: 991px) {
      .navigation {
        max-width: 100%;
      }
    }
  
    .nav-links {
      display: flex;
      margin-top: auto;
      margin-bottom: auto;
      align-items: stretch;
      gap: 40px 95px;
      flex-grow: 1;
      flex-shrink: 1;
      flex-basis: auto;
    }
  
    @media (max-width: 991px) {
      .nav-links {
        max-width: 100%;
      }
    }
  
    .nav-link {
      cursor: pointer;
      color: black;
    }

    
  
    .nav-link.active {
      color: #40bfff;
      font-family:
        Poppins,
        -apple-system,
        Roboto,
        Helvetica,
        sans-serif;
      font-weight: 500;
    }

    
  
    .cart-section {
      display: flex;
      align-items: stretch;
      gap: 40px 50px;
      white-space: nowrap;
    }
  
    @media (max-width: 991px) {
      .cart-section {
        white-space: initial;
      }
    }
  
    .friends-link {
      margin-top: auto;
      margin-bottom: auto;
      cursor: pointer;
    }
  
    .cart-icon {
      aspect-ratio: 1.2;
      object-fit: contain;
      object-position: center;
      width: 67px;
      flex-shrink: 0;
    }
  
    
    .breadcrumb {
      background-color: #f6f7f8;
      align-self: stretch;
      display: flex;
      margin-top: 5px;
      width: 100%;
      padding: 14px 70px;
      flex-direction: column;
      align-items: center;
      font-size: 14px;
      color: #c1c8ce;
      font-weight: 400;
      white-space: nowrap;
      justify-content: center;
    }
  
    
      .breadcrumb {
        max-width: 100%;
        padding: 14px 20px;
        
        white-space: initial;
      }
    
  
    .breadcrumb-content {
      display: flex;
      width: 92px;
      align-items: stretch;
      gap: 20px;
      justify-content: space-between;
    }
  
    
      .breadcrumb-content {
        white-space: initial;
      }

      .breadcrumb-text {
  color: #40bfff;
  
}
    
  
    .current-page {
      color: #40bfff;
      font-size: 16px;
      font-family:
        Poppins,
        -apple-system,
        Roboto,
        Helvetica,
        sans-serif;
      font-weight: 500;
    }

    .custom-dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      padding: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 10;
    }

    .logout-button {
      background: none;
      border: none;
      color: #e63946;
      font-weight: 500;
      cursor: pointer;
      padding: 5px 10px;
      font-size: 14px;
    }

    .logout-button:hover {
      background-color: #f8d7da;
      border-radius: 4px;
    }
    .profile-wrapper {
      position: relative;
      display: inline-block;
    }
  </style>
  
