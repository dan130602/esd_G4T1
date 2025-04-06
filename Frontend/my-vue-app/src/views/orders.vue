<template>
  <section class="orders-container">
    <div v-for="order in orders" :key="order.order_id" class="order-block">
      <h3>Order ID: {{ order.order_id }}</h3>

      <table class="table table-bordered table-striped">
  <thead class="table-dark">
    <tr>
      <th>Product Name</th>
      <th>Quantity</th>
      <th>Subtotal ($)</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in order.items" :key="item.id">
      <td>{{ item.product_name }}</td>
      <td>{{ item.quantity }}</td>
      <td>{{ item.order_item_subtotal }}</td>
    </tr>
    <tr class="table-primary">
      <td><strong>Status:</strong> {{ order.status }}</td>
      <td><strong>Total:</strong></td>
      <td><strong>{{ order.total_amount }} $</strong></td>
    </tr>
  </tbody>
</table>


      <br />
    </div>
  </section>
  <!-- <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br> -->
</template>

<script>
import { auth } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";

export default {
  name: "orders",
  data() {
    return {
      orders: [],
      userId: null // Replace with actual logged-in user ID later
    };
  },
  mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.userId = user.uid;
        console.log("User ID:", this.userId);
        await this.fetchOrders(); // Only fetch after user is available
      } else {
        console.warn("No user is logged in.");
      }
    });
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await fetch(`http://localhost:8000/api/order/user/${this.userId}`);
        const data = await response.json();
        this.orders = data.orders || [];
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    }
  }
};
</script>

<style scoped>
.orders-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

strong, th {
  font-weight: bold;
}
</style>
