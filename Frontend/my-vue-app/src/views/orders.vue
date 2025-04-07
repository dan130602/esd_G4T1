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
            <th>
              <input type="checkbox" v-model="order.refundWholeOrder" @change="toggleWholeOrderRefund(order)" :disabled="allItemsRefunded(order)"/>
              Refund All
            </th>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Subtotal ($)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in order.items" :key="item.id">
            <td>
              <button
                class="btn btn-sm btn-warning"
                @click="openItemRefundModal(order, item)"
                :disabled="item.refunded || order.refundWholeOrder"
              >
                {{ item.refunded ? "Refunded" : "Refund" }}
                <span v-if="item.refunded" class="badge bg-success ms-2">Refunded</span>

              </button>
            </td>
            <td>{{ item.item_id }}</td>  
            <td>{{ item.item_name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.order_item_subtotal }}</td>


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
          :disabled="order.refundProcessing || order.refundSent || allItemsRefunded(order)" 
          placeholder="Reason for refund..."
          class="form-control refund-input"
        />
        <button
          class="btn btn-danger mt-2"
          @click="requestRefund(order)"
          :disabled="order.refundProcessing || order.refundSent || allItemsRefunded(order)"
        >
          {{ order.refundProcessing ? "Refund in progress..." : order.refundSent ? "Refund Request Sent" : "Request Refund" }}
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
        <p v-if="selectedItemMessage" class="text-danger mb-0 ms-4 me-auto">{{ selectedItemMessage }}</p>
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
      selectedItemReason: "",
      selectedItemMessage: "",
      refundWholeOrder: false,
      refundMessage: "",
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
      try {
        const response = await fetch(`http://localhost:8000/api/order/user/${this.userId}`);
        const data = await response.json();

        this.orders = data.orders.map(order => ({
          ...order,
          refundReason: "",
          refundProcessing: false,
          refundSent: false,
          refundMessage: "",
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
      this.selectedItemMessage = "";

      const modalEl = document.getElementById("refundModal");
      if (window.bootstrap && modalEl) {
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
      } else {
        console.error("Bootstrap modal library not found.");
      }
    },

    async confirmItemRefund() {
      if (!this.selectedItemReason.trim()) {
        this.selectedItemMessage = "Please enter a reason for refund.";
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          this.selectedItem.refunded = true;
          this.selectedItem.selectedForRefund = false;
          this.selectedItemReason = "";
          this.selectedOrder.refundWholeOrder = false;

          const updateOrderStatus = await fetch(`http://localhost:8000/api/order/${this.selectedOrder.order_id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "processing" })
          });

          if (!updateOrderStatus.ok) {
            console.warn("Order status update failed.");
          }

          const modalEl = document.getElementById("refundModal");
          bootstrap.Modal.getInstance(modalEl).hide();
        } else {
          const data = await res.json();
          this.selectedItemMessage = data.message || "Refund failed.";
        }
      } catch (err) {
        console.error("Item refund failed:", err);
        this.selectedItemMessage = "An error occurred while processing refund.";
      }
    },

    async requestRefund(order) {
      const itemsToRefund = order.items.filter(item => !item.refunded);
      if (itemsToRefund.length === 0) {
        order.refundMessage = "All items are already refunded.";
        return;
      }

      if (!order.refundReason.trim()) {
        order.refundMessage = "Please enter a refund reason.";
        return;
      }

      const itemIds = itemsToRefund.map(item => item.item_id);
      const payload = {
        userId: this.userId,
        orderId: order.order_id,
        reason: order.refundReason,
        itemIds: itemIds
      };

      order.refundProcessing = true;
      order.refundMessage = "Processing refund...";

      try {
        const res = await fetch("http://localhost:8000/refunds/refunds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          order.items.forEach(item => {
            if (itemIds.includes(item.item_id)) {
              item.refunded = true;
              item.selectedForRefund = false;
            }
          });
          order.refundSent = true;
          order.refundReason = "";
          order.refundWholeOrder = false;
          order.refundMessage = "Refund completed successfully.";

          await fetch(`http://localhost:8000/api/order/${order.order_id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "processing" })
          });
        } else {
          const data = await res.json();
          order.refundMessage = data.message || "Refund failed.";
        }
      } catch (err) {
        console.error("Refund error:", err);
        order.refundMessage = "An error occurred while processing the refund.";
      } finally {
        order.refundProcessing = false;
      }
    },

    toggleWholeOrderRefund(order) {
      if (order.refundWholeOrder) {
        order.items.forEach(item => {
          if (!item.refunded) item.selectedForRefund = true;
        });
      } else {
        order.items.forEach(item => {
          item.selectedForRefund = false;
        });
      }
    },

    allItemsRefunded(order) {
      return order.items.every(item => item.refunded);
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
