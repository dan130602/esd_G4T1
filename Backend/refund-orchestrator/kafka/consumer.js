import { Kafka } from 'kafkajs';
import { handleRefundStatus } from '../services/refundService.js'; 
const kafka = new Kafka({
  clientId: 'refund-orchestrator',
  brokers: ['kafka:29092'], // Docker service name + port need to change when dockerised!!!!!!!
});

const consumer = kafka.consumer({ groupId: 'refund-orchestrator-group' });

export const startRefundStatusConsumer  = async () => {
  await consumer.connect();
  console.log('[Kafka] Orchestrator consumer connected');

  await consumer.subscribe({ topic: 'refund-status-topic', fromBeginning: false });
  console.log('[Kafka] Subscribed to refund-status-topic');
 
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log('[Kafka] Refund update received from supplier:');

      // Call your custom logic handler
      let status = data.status
      let user_id = data.user_id
      let item_id = data.item_id
      let refundAmount = data.refundAmount
      let orderId = data.orderId
      console.log(orderId)
      await handleRefundStatus(status, user_id, item_id, refundAmount, orderId);
    },
  });
};
