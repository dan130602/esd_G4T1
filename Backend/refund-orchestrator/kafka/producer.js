import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'refund-orchestrator',
  brokers: ['kafka:29092'], 
});

const producer = kafka.producer({
  retry: {
    retries: 5,  // Retry up to 5 times
    initialRetryTime: 300, // Wait 300ms between retries
  },
});

await producer.connect();

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
