<template>
  <section class="returns-container">
    <!-- Tab Navigation -->
    <div class="tabs-container">
      <button 
        class="tab-button" 
        :class="{'active': activeTab === 'returns'}" 
        @click="switchTab('returns')">
        Supplier Returns
      </button>
      <button 
        class="tab-button" 
        :class="{'active': activeTab === 'transactions'}" 
        @click="switchTab('transactions')">
        Transactions
      </button>
    </div>

    <!-- Tab Content -->
    <div v-if="activeTab === 'returns'">
      <div class="supplier-header">
        <h2>Supplier Returns</h2>
      </div>
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
                <p><strong>Quantity:</strong> {{ item.quantity }}</p>
                <p><strong>Status:</strong> {{ item.return_status }}</p>
                <p><strong>Reason:</strong> {{ item.reason }}</p>
                <p><strong>Created At:</strong> {{ formatDate(item.created_at) }}</p>
              </div>
            </div>
            <div class="return-actions">
              <button class="accept-button" @click="handleAccept(item.return_id, item.item_id)" :disabled="item.returnStatusInProgress">Approve</button>
              <button class="deny-button" @click="handleDeny(item.return_id, item.item_id)" :disabled="item.returnStatusInProgress">Deny</button>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- Transactions Tab (Placeholder Content) -->
    <div v-if="activeTab === 'transactions'">
      <div class="supplier-header">
        <h2>Transactions</h2>
      </div>
      <div class="transactions-wrapper">
        <table v-if="transactions.length > 0" class="transactions-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Amount ($)</th>
              <th>Item ID</th>
              <th>Status</th>
              <th>User ID</th>
              
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in transactions" :key="transaction.transaction_id" :class="{'refunded-row': transaction.status === 'refunded'}">
              <td>{{ transaction.transaction_id }}</td>
              <td>{{ transaction.amount }}</td>
              <td>{{ transaction.item_id }}</td>
              <td>{{ transaction.status }}</td>
              <td>{{ transaction.user_id }}</td>
              
              <td>{{ formatDate(transaction.created_at) }}</td>
            </tr>
            <tr class="total-row">
              
              <td colspan="1"><strong>Total:</strong></td>
              <td>{{ totalAmount }}</td>
              <td colspan="4"></td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <p>No transactions available.</p>
        </div>
      </div>
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
      activeTab: 'returns'
    };
  },
  computed: {
    totalAmount() {
      return this.transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    }
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    },
    async handleAccept(returnId, itemId) {
      await this.updateReturnStatus(returnId, "approved", itemId);
    },
    async handleDeny(returnId, itemId) {
      await this.updateReturnStatus(returnId, "rejected", itemId);
    },
    async updateReturnStatus(returnId, status, itemId) {
      try {
        const returnItem = this.returns.find(item => item.return_id === returnId);
        returnItem.returnStatusInProgress = true;
        if (status == "approved"){
          const res = await fetch(`http://localhost:8000/supplier/approve/${returnId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ return_status: status, item_id: itemId })
          });
          console.log(res)
          if (!res.ok) throw new Error(`Failed to update return status`);
          
          const updated = await res.json();
          console.log("Updated return:", updated);
          this.fetchReturns(); // Refresh the list
        }else if (status == "rejected"){
          console.log(status)
          const res = await fetch(`http://localhost:8000/supplier/reject/${returnId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ return_status: status, item_id: itemId })
          });

          if (!res.ok) throw new Error(`Failed to update return status`);
          
          const updated = await res.json();
          console.log("Updated return:", updated);
          this.fetchReturns(); // Refresh the list
        }
        
      } catch (err) {
        console.error(`Error updating return ${returnId}:`, err);
      }
    },
    async fetchReturns() {
      try {
        this.loading = false;
        const res = await fetch("http://localhost:8000/supplier");
        if (!res.ok) throw new Error("Failed to fetch returns");
        const data = await res.json();
        this.returns = data; // array of orders
      } catch (err) {
        console.error("Failed to fetch returns:", err);
      }
    },
    async fetchTransactions() {
      try {
        const res = await fetch('http://localhost:8000/transactions/'); // Replace with your real API endpoint
        this.transactions = await res.json(); // assuming the API returns a list of transactions
        this.loading = false;
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
    },

    switchTab(tab) {
      this.activeTab = tab;
    }

  },
  
  async mounted() {
    try {
      await this.fetchReturns();
      await this.fetchTransactions();
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  },
};
</script>
<style scoped>
.supplier-header {
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
  margin-bottom: 20px;
  text-align: center;
}

.supplier-header h2 {
  color: #007bff;
  font-weight: 600;
  font-size: 28px;
  margin: 0;
}

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

.tabs-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tab-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: bold;
  margin-right: 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.tab-button.active {
  background-color: #0056b3;
}

.tab-button:hover {
  background-color: #0056b3;
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
  width: 95%;
}

.return-actions {
  display: flex;
  gap: 10px;
}

.accept-button,
.deny-button {
  padding: 8px 16px;
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

.transactions-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.transactions-table th, .transactions-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.transactions-table th {
  background-color: #007bff;
  color: white;
}

.transactions-table td {
  font-size: 14px;
}

.refunded-row {
  background-color: #d4edda;
}
</style>

