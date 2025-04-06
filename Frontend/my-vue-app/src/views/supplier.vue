<template>
  <section class="returns-container">
    <div class="returns-wrapper">
      <div v-if="loading" class="spinner-container">
        <div class="spinner"></div>
      </div>

      <article v-else class="return-item" v-for="item in returns" :key="item.return_id">
        <div class="return-content">
          <div class="return-info">
            <div class="return-details">
              <p><strong>Return ID:</strong> {{ item.return_id }}</p>
              <p><strong>Order ID:</strong> {{ item.order_id }}</p>
              <p><strong>Item ID:</strong> {{ item.item_id }}</p>
              <p><strong>User ID:</strong> {{ item.user_id }}</p>
              <p><strong>State of Good:</strong> {{ item.state_of_good }}</p>
              <p><strong>Status:</strong> {{ item.return_status }}</p>
              <p><strong>Created At:</strong> {{ formatDate(item.created_at) }}</p>
            </div>
          </div>
          <div class="return-actions">
            <button class="accept-button" @click="handleAccept(item.return_id)">Approve</button>
            <button class="deny-button" @click="handleDeny(item.return_id)">Deny</button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
export default {
  name: "OrderList",
  data() {
    return {
      returns: [],
      loading: true,
    };
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    },
    async handleAccept(returnId) {
      await this.updateReturnStatus(returnId, "approved");
    },
    async handleDeny(returnId) {
      await this.updateReturnStatus(returnId, "rejected");
    },
    async updateReturnStatus(returnId, status) {
      try {
        if (status == "approved"){
          const res = await fetch(`http://localhost:8000/supplier/approve/${returnId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ return_status: status })
          });
          console.log(res)
          if (!res.ok) throw new Error(`Failed to update return status`);
          
          const updated = await res.json();
          console.log("Updated return:", updated);
          this.fetchReturns(); // Refresh the list
        }else if (status == "rejected"){
          const res = await fetch(`http://localhost:8000/supplier/reject/${returnId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ return_status: status })
          });

          if (!res.ok) throw new Error(`Failed to update return status`);
          
          const updated = await res.json();
          console.log("Updated return:", updated);
          this.fetchReturns(); // Refresh the list
        }
        
      } catch (err) {
        console.error(`Error updating return ${returnId}:`, err);
      }
    }

  },
  async mounted() {
    try {
      const res = await fetch("http://localhost:8000/supplier");
      const data = await res.json();
      this.loading = false;
      this.returns = data; // array of orders
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  },
};
</script>
<style scoped>

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 6px solid #eee;
  border-top: 6px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.returns-container {
  padding: 20px;
}
.returns-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.return-item {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 16px;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  width:95%;
}
.return-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.return-details p {
  margin: 4px 0;
  font-size: 14px;
}
.accept-button,
.deny-button {
  padding: 8px 16px;
  margin-right: 8px;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
.accept-button {
  background-color: #28a745;
}
.deny-button {
  background-color: #dc3545;
}
</style>
