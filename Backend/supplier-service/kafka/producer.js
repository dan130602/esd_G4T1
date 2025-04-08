import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'supplier-service',
  brokers: ['kafka:29092'], // Use Docker service name and port
  // brokers: ['localhost:9092']
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

  console.log('[Kafka] Refund status sent to orchestrator:', message);
};
