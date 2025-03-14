from app.messaging.kafka.producer import KafkaMessageProducer
from app.messaging.schemas.payment_events_schemas import PaymentEventSchemas
import logging

class PaymentEventService:
    """Service for publishing payment-related events to Kafka"""
    
    @staticmethod
    def publish_payment_completed(payment):
        """
        Publish a payment.completed event to Kafka
        
        Args:
            payment: The Payment model instance
            
        Returns:
            bool: True if successfully published, False otherwise
        """
        try:
            # Get the Kafka producer
            producer = KafkaMessageProducer.get_instance()
            
            # Prepare the event payload using the schema
            event = PaymentEventSchemas.payment_completed(payment)
            
            # Use order_id as the message key for partitioning
            # This ensures all events for the same order go to the same partition
            key = str(payment.order_id)
            
            # Publish to the payment events topic
            result = producer.publish('payment-events', key, event)
            
            if result:
                logging.info(f"Successfully published payment.completed event for order {payment.order_id}")
            else:
                logging.error(f"Failed to publish payment.completed event for order {payment.order_id}")
                
            return result
            
        except Exception as e:
            logging.error(f"Error publishing payment.completed event: {str(e)}")
            return False
    
    @staticmethod
    def publish_payment_failed(payment_intent_id, order_id, error_message):
        """
        Publish a payment.failed event to Kafka
        
        Args:
            payment_intent_id: The Stripe payment intent ID
            order_id: The order ID associated with the payment
            error_message: The error message describing why the payment failed
            
        Returns:
            bool: True if successfully published, False otherwise
        """
        try:
            # Get the Kafka producer
            producer = KafkaMessageProducer.get_instance()
            
            # Prepare the event payload using the schema
            event = PaymentEventSchemas.payment_failed(payment_intent_id, order_id, error_message)
            
            # Use order_id as the message key for partitioning
            key = str(order_id)
            
            # Publish to the payment events topic
            result = producer.publish('payment-events', key, event)
            
            if result:
                logging.info(f"Successfully published payment.failed event for order {order_id}")
            else:
                logging.error(f"Failed to publish payment.failed event for order {order_id}")
                
            return result
            
        except Exception as e:
            logging.error(f"Error publishing payment.failed event: {str(e)}")
            return False