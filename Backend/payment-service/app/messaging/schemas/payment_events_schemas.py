from datetime import datetime

class PaymentEventSchemas:
    """Standardized schemas for payment-related Kafka events"""
    
    @staticmethod
    def payment_completed(payment):
        """
        Schema for payment.completed event
        
        Args:
            payment: The Payment dictionary
            
        Returns:
            dict: Standardized event payload
        """
        return {
            'event_id': f"pmt-{payment['payment_id']}-{int(datetime.now().timestamp())}",
            'event_type': 'payment.completed',
            'event_version': '1.0',
            'occurred_at': datetime.now().isoformat(),
            'data': {
                'payment_id': payment['payment_id'],
                'order_id': payment['order_id'],
                'user_id': payment['user_id'],
                'amount': float(payment['amount']),
                'currency': payment['currency'],
                'status': payment['status'],
                'payment_method': payment['payment_method'],
                'created_at': payment['created_at'].isoformat() if isinstance(payment['created_at'], datetime) else payment['created_at']
            },
            'metadata': {
                'source': 'payment_service',
                'correlation_id': str(payment['order_id'])
            }
        }
    
    @staticmethod
    def payment_failed(payment_intent_id, order_id, error_message):
        """
        Schema for payment.failed event
        
        Args:
            payment_intent_id: The Stripe payment intent ID
            order_id: The order ID associated with the payment
            error_message: The error message describing why the payment failed
            
        Returns:
            dict: Standardized event payload
        """
        now = datetime.now()
        return {
            'event_id': f"pmt-fail-{payment_intent_id}-{int(now.timestamp())}",
            'event_type': 'payment.failed',
            'event_version': '1.0',
            'occurred_at': now.isoformat(),
            'data': {
                'payment_intent_id': payment_intent_id,
                'order_id': order_id,
                'error_message': error_message,
                'failure_time': now.isoformat()
            },
            'metadata': {
                'source': 'payment_service',
                'correlation_id': str(order_id)
            }
        }