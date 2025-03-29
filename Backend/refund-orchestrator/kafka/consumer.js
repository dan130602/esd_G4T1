import { Kafka } from 'kafkajs';
import { handleRefundStatus } from '../services/refundService.js'; 
const kafka = new Kafka({
  clientId: 'refund-orchestrator',
  brokers: ['localhost:9092'], // Docker service name + port need to change when dockerised!!!!!!!
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
      console.log('[Kafka] Refund update received:', data);

      // Call your custom logic handler
      console.log(JSON.stringify(data))
      await handleRefundStatus(data);
    },
  });
};
