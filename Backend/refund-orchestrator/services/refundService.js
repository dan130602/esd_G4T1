import axios from 'axios';
import { API_URLS } from '../urls/apiUrls.js'; // Import API URLs

export const processRefund = async (userId, orderId, refundAmount, reason) => {
    try {
        // Step 1: Check if the order is valid
        let url = `${API_URLS.orderService}/user/${userId}/order/${orderId}`

        const orderResponse = await axios.get(url); 
        const orderItems = orderResponse.data["order"]["items"];
        if (orderResponse.status !== 200) {
            return { success: false, message: 'Invalid order ID' };
        }
        // Step 2: Verify with the supplier service
        try {
          const supplierUrl = `${API_URLS.supplierService}/create`;
          for (let i = 0; i < orderItems.length; i++) {
            const item = orderItems[i];
            const orderDataJSON = {
                order_id: orderId,
                item_id: item.product_id,
                user_id: userId,
                state_of_good: "used",
                return_status: "PENDING",
                reason: reason
            };
            await axios.post(supplierUrl, orderDataJSON);
            
            // Step 3: Write to the transaction service for logging
            const transactionResponse = await axios.post(API_URLS.transactionService, {
              userId,
              refundAmount
            });

            if (transactionResponse.status === 200) {
              return { success: true };
            } else {
              return { success: false, message: 'Failed to log transaction' };
            }
          }
        }
        catch (error) {
          // console.error('Error verifying with supplier service:', error.message);
          return { success: false, message: "supplier " + error.message };
        }

        
        // if (!supplierResponse.data.isRefundAllowed) {
        //     return { success: false, message: 'Refund not allowed by supplier' };
        // }


    } catch (error) {
        // console.error(error);
        throw new Error(error.message);
    }
};

export const handleRefundStatus = async ({ returnId, status, reason, timestamp }) => {
    try {
      if (status === 'approved') {
        // Log transaction or call payment service
        await axios.post(API_URLS.transactionService, {
          returnId,
          refundAmount: 100, // Ideally you'd include this in the Kafka message
          timestamp,
        });
        console.log(`[Orchestrator] Processed approved refund: ${returnId}`);
      } else if (status === 'rejected') {
        // Maybe notify user or log the reason
        console.log(`[Orchestrator] Refund ${returnId} rejected: ${reason}`);
      }
    } catch (err) {
      console.error('[Orchestrator] Error handling refund status:', err.message);
    }
  };
// export default { processRefund, handleRefundStatus };
