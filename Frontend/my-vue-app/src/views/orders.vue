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
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Subtotal ($)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in order.items" :key="item.id">
            <td>
              <input type="checkbox" v-model="item.selectedForRefund" :disabled="item.refunded || order.status === 'processing'"/>
            </td>
            <td>{{ item.item_id }}</td>  
            <td>{{ item.item_name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.order_item_subtotal }}</td>
            <td>
              <button
                class="btn btn-sm btn-warning"
                @click="openItemRefundModal(order, item)"
                :disabled="item.refunded || order.status === 'processing'"
              >
                {{ item.refunded ? "Refunded" : "Refund" }}
              </button>
            </td>

          </tr>
          <tr :class="order.status === 'processing' ? 'table-success' : 'table-primary'">
            <td colspan="3"><strong>Status:</strong> {{ order.status }}</td>
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


  <div class="modal fade" id="refundModal" tabindex="-1" aria-labelledby="refundModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="refundModalLabel">Refund Reason</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <input
            type="text"
            class="form-control"
            v-model="selectedItemReason"
            placeholder="Enter reason for refund"
          />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger" @click="confirmItemRefund">Submit Refund</button>
        </div>
      </div>
    </div>
  </div>

</template>



<script>
import { auth } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
window.bootstrap = bootstrap;

export default {
  name: "orders",
  data() {
    return {
      orders: [],
      userId: null,
      loading: true,
      selectedOrder: null,
      selectedItem: null,
      selectedItemReason: ""

    };
  },
  mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.userId = user.uid;
        console.log(this.userId)
        await this.fetchOrders();
      }
    });
  },
  methods: {
    async fetchOrders() {
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
              selectedForRefund: false,
              refunded: false 
            }))
          }));

        this.loading = false;

      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    },
    openItemRefundModal(order, item) {
      this.selectedOrder = order;
      this.selectedItem = item;
      this.selectedItemReason = "";

      const modalEl = document.getElementById("refundModal");
      if (window.bootstrap && modalEl) {
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
      } else {
        alert("Bootstrap modal library not found.");
      }
    },

    async confirmItemRefund() {
      if (!this.selectedItemReason.trim()) {
        alert("Please enter a reason for refund.");
        return;
      }

      const payload = {
        userId: this.userId,
        orderId: this.selectedOrder.order_id,
        itemIds: [this.selectedItem.item_id],
        reason: this.selectedItemReason
      };

      try {
        const res = await fetch("http://localhost:8000/refunds/refunds", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          this.selectedItem.refunded = true;
          this.selectedItem.selectedForRefund = false;
          this.selectedItemReason = "";
          const updateOrderStatus = await fetch(`http://localhost:8000/api/order/${this.selectedOrder.order_id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "processing" })
          });
          if (updateOrderStatus.ok) {
            console.log("Order status updated to processing.");
          }
          const modalEl = document.getElementById("refundModal");
          bootstrap.Modal.getInstance(modalEl).hide();
        } else {
          alert("Failed to refund item.");
        }
      } catch (err) {
        console.error("Item refund failed:", err);
        alert("An error occurred.");
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
