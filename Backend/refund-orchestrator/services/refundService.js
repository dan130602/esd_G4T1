import axios from 'axios';
import { API_URLS } from '../urls/apiUrls.js'; // Import API URLs
import { sendTransaction } from '../kafka/producer.js'; // Import Kafka producer

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
            const item_id = item.product_id
            const user_id = userId
            const orderDataJSON = {
                order_id: orderId,
                item_id,
                user_id,
                state_of_good: "used",
                return_status: "PENDING",
                reason: reason
            };
            await axios.post(supplierUrl, orderDataJSON);

            // Step 3: Write to the transaction service for logging
            try{
              transactionResponse = await sendTransaction( {
                user_id,
                item_id,
                amount: refundAmount,
                status: "completed",
              });
            }
            catch(error){
              // console.error('Error logging transaction:', error.message);
              return { success: false, message: "transaction " + error.message };
            }
              
            // const transactionResponse = await axios.post(API_URLS.transactionService, {
            //   user_id,
            //   item_id,
            //   amount: refundAmount,
            //   status: "completed",
            // });

            if (transactionResponse.status === 201) {
              return { success: true, message: 'Refund request processed successfully' };
            } else {
              return { success: false, message: 'Failed to log transaction' };
            }
          }
        }
        catch (error) {
          return { success: false, message: "supplier " + error.message };
        }
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
// Step 4: payment
              // try{
              //   let paymentUrl = `${API_URLS.paymentService}/refund`;
              //   const paymentResponse = await axios.post(paymentUrl, {
              //     orderId,
              //     amount: refundAmount,
              //   })
              // }
              // catch(error){
              //   // console.error('Error processing payment:', error.message);
              //   return { success: false, message: "payment " + error.message };
              // }

              // step 5: send email

              // try{
              //   let emailUrl = `${API_URLS.emailService}`;
              //   const emailResponse = await axios.post(emailUrl, {
              //     email_address: "danielleong02@gmail.com",   // New field for email address
              //     subject: "refund successful",              
              //     message: "refund successful!"
              // });
              //   if (emailResponse.status !== 200) {
              //     return { success: false, message: 'Failed to send email' };
              //   }
              // }
              
              // catch(error){
              //   // console.error('Error sending email:', error.message);
              //   return { success: false, message: "email " + error.message };
              // }