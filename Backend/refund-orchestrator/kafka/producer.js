import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'refund-orchestrator',
  brokers: ['localhost:9092'], // Use Docker service name and port
});

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log('[Kafka] Producer connected');
};

export const sendTransaction = async (message) => {
  await producer.send({
    topic: 'transaction-topic',
    messages: [
      {
        value: JSON.stringify(message),
      },
    ],
  });

  console.log('[Kafka] Refund status sent:', message);
};
