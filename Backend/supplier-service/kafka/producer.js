import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'supplier-service',
  brokers: ['kafka:9093'], // Use Docker service name and port
});

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log('[Kafka] Producer connected');
};

export const sendRefundStatus = async (message) => {
  await producer.send({
    topic: 'refund-status-topic',
    messages: [
      {
        value: JSON.stringify(message),
      },
    ],
  });

  console.log('[Kafka] Refund status sent:', message);
};
