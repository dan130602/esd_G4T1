from kafka import KafkaProducer
import json
import logging
from app.config import Config

class KafkaMessageProducer:
    """Producer for publishing events to Kafka topics"""
    
    _instance = None
    
    @classmethod
    def get_instance(cls):
        """Singleton pattern ensures only 1 instance exists, reusing same producer connection"""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
    
    def __init__(self):
        """Initialize the Kafka producer"""
        self.producer = None
        self.connected = False
        self._connect()
    
    def _connect(self):
        """Establish connection to Kafka brokers"""
        try:
            # Create producer with retries and acknowledgment settings
            self.producer = KafkaProducer(
                bootstrap_servers=Config.KAFKA_BOOTSTRAP_SERVERS,
                value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                key_serializer=lambda k: str(k).encode('utf-8'),
                acks='all',              # Wait for all replicas to acknowledge
                retries=3,               # Retry failed sends
                retry_backoff_ms=100,    # Backoff time between retries
                max_in_flight_requests_per_connection=1,  # For ordering guarantees
            )
            
            self.connected = True
            logging.info("Successfully connected to Kafka")
            return True
            
        except Exception as e:
            self.connected = False
            logging.error(f"Failed to connect to Kafka: {str(e)}")
            return False
    
    def publish(self, topic, key, payload):
        """
        Publish a message to a Kafka topic
        
        Args:
            topic (str): The Kafka topic to publish to
            key (str): The message key (used for partitioning)
            payload (dict): The message payload
            
        Returns:
            bool: True if successfully published, False otherwise
        """
        if not self.connected:
            if not self._connect():
                logging.error("Cannot publish: Not connected to Kafka")
                return False
        
        try:
            # Send message and get the future result
            future = self.producer.send(topic, key=key, value=payload)
            
            # Block until the message is sent (or times out)
            record_metadata = future.get(timeout=10)
            
            logging.info(f"Published message to {record_metadata.topic}, "
                        f"partition: {record_metadata.partition}, "
                        f"offset: {record_metadata.offset}")
            return True
            
        except Exception as e:
            logging.error(f"Failed to publish message to Kafka: {str(e)}")
            self.connected = False  # Mark as disconnected to trigger reconnect
            return False
    
    def close(self):
        """Close the Kafka producer connection"""
        if self.producer:
            self.producer.flush()  # Make sure all messages are sent
            self.producer.close(timeout=5)
            self.connected = False
            logging.info("Kafka producer connection closed")