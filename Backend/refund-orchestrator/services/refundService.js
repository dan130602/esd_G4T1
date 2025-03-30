import axios from 'axios';
import { API_URLS } from '../urls/apiUrls.js'; // Import API URLs

export const processRefund = async (userId, orderId, refundAmount) => {
    try {
        // Step 1: Check if the order is valid
        const orderResponse = await axios.get(`${API_URLS.orderService}/user/${userId}/order/${orderId}`);
        
        if (orderResponse.status !== 200) {
            return { success: false, message: 'Invalid order ID' };
        }
        console.log("orderresponse: " + orderResponse.data);
        // Step 2: Verify with the supplier service
        // const supplierResponse = await axios.post(API_URLS.supplierService, {
        //     orderId,
        //     refundAmount
        // });
        
        // if (!supplierResponse.data.isRefundAllowed) {
        //     return { success: false, message: 'Refund not allowed by supplier' };
        // }

        // // Step 3: Write to the transaction service for logging
        // const transactionResponse = await axios.post(API_URLS.transactionService, {
        //     orderId,
        //     refundAmount
        // });

        // if (transactionResponse.status === 200) {
        //     return { success: true };
        // } else {
        //     return { success: false, message: 'Failed to log transaction' };
        // }

    } catch (error) {
        console.error(error);
        throw new Error('Internal server error');
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
