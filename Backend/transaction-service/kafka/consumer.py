from confluent_kafka import Consumer
import json
import logging
from services.transactionService import TransactionService

logging.basicConfig(level=logging.INFO)

def start_transaction_consumer():
    consumer = Consumer({
        'bootstrap.servers': 'localhost:9092',  # or 'kafka:29092' if running inside Docker
        'group.id': 'transaction-consumer-group',
        'auto.offset.reset': 'earliest',
    })

    topic = 'transaction-topic'
    consumer.subscribe([topic])
    logging.info(f"Subscribed to Kafka topic: {topic}")

    try:
        while True:
            msg = consumer.poll(1.0)
            if msg is None:
                continue
            if msg.error():
                logging.error(f"Kafka error: {msg.error()}")
                continue

            try:
                data = json.loads(msg.value().decode('utf-8'))
                logging.info(f"📩 Received transaction message: {data}")

                user_id = int(data.get('userId'))
                item_id = int(data.get('itemId'))
                amount = float(data.get('amount'))
                status = data.get('status', 'completed')

                # Insert into DB
                new_txn = TransactionService.create_transaction(
                    user_id=user_id,
                    item_id=item_id,
                    amount=amount,
                    status=status
                )

                logging.info(f"✅ Transaction recorded: ID {new_txn.transaction_id}")

            except Exception as e:
                logging.error(f"❌ Failed to process message: {e}")

    except KeyboardInterrupt:
        logging.info("🛑 Stopping consumer...")
    finally:
        consumer.close()
