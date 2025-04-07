<template>
  <section class="orders-container">
    <div v-if="loading" class="loading-spinner">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else>
    <div v-for="(order, orderIndex) in orders" :key="order.order_id" class="order-block">
      <h3>Order ID: {{ order.order_id }}</h3>

      <table class="table table-bordered table-striped">
        <thead class="table-dark">
          <tr>
            <th>Refund</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Subtotal ($)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in order.items" :key="item.id">
            <td>
              <input type="checkbox" v-model="item.selectedForRefund" />
            </td>
            <td>{{ item.product_name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.order_item_subtotal }}</td>
          </tr>
          <tr :class="order.status === 'processing' ? 'table-success' : 'table-primary'">
            <td colspan="2"><strong>Status:</strong> {{ order.status }}</td>
            <td><strong>Total:</strong></td>
            <td><strong>{{ order.total_amount }} $</strong></td>
          </tr>
        </tbody>
      </table>

      <div class="refund-block">
        <input
          type="text"
          v-model="order.refundReason"
          :disabled="order.refundProcessing || order.refundSent || order.status === 'processing'" 
          placeholder="Reason for refund..."
          class="form-control refund-input"
        />
        <button
          class="btn btn-danger mt-2"
          @click="requestRefund(order)"
          :disabled="order.refundProcessing || order.refundSent || order.status === 'processing'"
        >
          {{ order.refundProcessing ? "Refund in progress..." : order.refundSent || order.status === 'processing' ? "Refund Request Sent" : "Request Refund" }}
        </button>
      </div>
      <br />
    </div>
  </div>
  </section>
</template>



<script>
import { auth } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";

export default {
  name: "orders",
  data() {
    return {
      orders: [],
      userId: null
    };
  },
  mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.userId = user.uid;
        await this.fetchOrders();
      }
    });
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      try {
        const response = await fetch(`http://localhost:8000/api/order/user/${this.userId}`);
        const data = await response.json();

        // Add reactive fields
        this.orders = data.orders.map(order => ({
          ...order,
          refundReason: "",
          refundProcessing: false,
          refundSent: false,
          items: order.items.map(item => ({
            ...item,
            selectedForRefund: false
          }))
        }));
        this.loading = false;

      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    },
    async requestRefund(order) {
      const selectedItems = order.items.filter(item => item.selectedForRefund);
      if (selectedItems.length === 0) {
        alert("Please select at least one item to refund.");
        return;
      }
      if (!order.refundReason.trim()) {
        alert("Please enter a reason for refund.");
        return;
      }

      const refundAmount = selectedItems.reduce((sum, item) => {
        return sum + parseFloat(item.order_item_subtotal);
      }, 0);

      const payload = {
        userId: this.userId,
        orderId: order.order_id,
        refundAmount,
        reason: order.refundReason
      };
      console.log(payload)
      order.refundProcessing = true;

      try {
        const res = await fetch("http://localhost:8000/refunds/refunds", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
          order.refundReason = "";
          order.items.forEach(item => (item.selectedForRefund = false));
          order.refundSent = true;
        } else {
          alert(data.message || "Refund failed.");
        }

        const orderPayload = {
          status: "processing",
        } 
        console.log(orderPayload)
        let orderUrl = `http://localhost:8000/api/order/${order.order_id}/status`;
        const updateOrder = await fetch(orderUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(orderPayload)
        });
        const orderData = await updateOrder.json();
      } catch (err) {
        console.error("Refund error:", err);
        alert("Something went wrong.");
      } finally {
        order.refundProcessing = false;

      }
    }


  }
};

</script>

<style scoped>

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
}

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
