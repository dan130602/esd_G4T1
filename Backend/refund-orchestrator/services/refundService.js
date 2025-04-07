import axios from 'axios';
import { API_URLS } from '../urls/apiUrls.js'; // Import API URLs
import { sendTransaction } from '../kafka/producer.js'; // Import Kafka producer

export const processRefund = async (userId, orderId, reason, itemIds) => {
    try {
        // Step 1: Check if the order is valid
        let url = `${API_URLS.orderService}/user/${userId}/order/${orderId}`
        const orderResponse = await axios.get(url); 
        
        const orderItems = orderResponse.data["order"]["items"];
        if (orderResponse.status !== 200) {
            return { success: false, message: 'Invalid order ID' };
        }
        const itemsToRefund = orderItems.filter(item => itemIds.includes(item.item_id));

        if (itemsToRefund.length === 0) {
          return { success: false, message: 'No valid items to refund' };
        }
        // Step 2: Verify with the supplier service
        try {
          const supplierUrl = `${API_URLS.supplierService}/create`;
          for (let i = 0; i < itemsToRefund.length; i++) {
            const item = orderItems[i];
            const item_id = item.item_id
            const user_id = userId
            const orderDataJSON = {
                order_id: orderId,
                item_id: item_id,
                user_id,
                state_of_good: "used",
                return_status: "PENDING",
                reason: reason
            };
            await axios.post(supplierUrl, orderDataJSON);
          }
          return { success: true, message: 'Refund request sent to supplier' };
        }
        catch (error) {
          return { success: false, message: "supplier " + error.message };
        }
    } catch (error) {
        // console.error(error);
        throw new Error(error.message);
    }
};

export const handleRefundStatus = async (status, user_id, item_id, refundAmount, orderId) => {
  if (status === 'approved') {
    // Step 3: Process transaction
    const transactionResult = await processTransaction({ user_id, item_id, refundAmount });
    if (!transactionResult.success) {
      return transactionResult; 
    }

    // Step 4: Process refund to Stripe
    const paymentResult = await processRefundToStripe(orderId, refundAmount);
    if (!paymentResult.success) {
      return paymentResult; 
    }

    // Step 5: Send email
    const emailResult = await sendRefundEmail();
    if (!emailResult.success) {
      return emailResult; 
    }

    return { success: true, message: 'Refund request processed successfully' };
  } else if (status === 'rejected') {
    // Maybe notify user or log the reason
    console.log(`[Orchestrator] Refund ${returnId} rejected: ${reason}`);
    return { success: false, message: 'Refund rejected' };
  }
}


async function processTransaction({ user_id, item_id, refundAmount }) {
  try {
    const transactionResponse = await sendTransaction({
      user_id,
      item_id,
      amount: refundAmount,
      status: "completed",
    });
    return { success: true };
  } catch (error) {
    console.error('Error logging transaction:', error.message);
    return { success: false, message: "transaction " + error.message };
  }
}
 
async function processRefundToStripe(orderId, refundAmount) {
  try {
    let paymentUrl = `${API_URLS.paymentService}/refund/${orderId}`;
    const paymentResponse = await axios.post(paymentUrl, {
      amount: refundAmount,
    });
    console.log(paymentResponse.data);
    return { success: true };
  } catch (error) {
    console.error('Error processing payment:', error.message);
    return { success: false, message: "payment " + error.message };
  }
}

async function sendRefundEmail() {
  try {
    let emailUrl = `${API_URLS.emailService}`;
    const emailResponse = await axios.post(emailUrl, {
      email_address: "danielleong02@gmail.com", // New field for email address
      subject: "Refund Successful",
      message: "Refund successful!",
    });
    if (emailResponse.status !== 200) {
      return { success: false, message: 'Failed to send email' };
    }
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error.message);
    return { success: false, message: "email " + error.message };
  }
}

export default { processRefund, handleRefundStatus };


