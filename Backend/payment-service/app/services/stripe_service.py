import stripe
import traceback
import logging
from app.models.payment_model import Payment, Payment_Error, PaymentItem
from app import db
from app.config import Config
from datetime import datetime

stripe.api_key = Config.STRIPE_API_KEY
logger = logging.getLogger('payment-service')

class StripeService:
    # def __init__(self):
        # Get the Stripe API key from config
    
    # @staticmethod
    # def _log_error(exception):
    #     error_session = db.session
    #     try:
    #         error_log = Payment_Error(
    #             module="Payment - Stripe Service",
    #             error_message=str(exception),
    #             traceback=traceback.format_exc()
    #         )
    #         error_session.add(error_log)
    #         error_session.commit()
    #     except Exception as log_error:
    #         # Fallback if error logging itself fails
    #         print(f"Error logging failed: {str(log_error)}")
    #     finally:
    #         error_session.close()
 
    @staticmethod
    def _log_error(exception, module="Payment - Stripe Service", event_type=None, event_id=None, additional_info=None):
        """Unified error logging for all Stripe service errors"""
        error_session = db.session
        try:
            '''Create a detailed error log with optional webhook-specific fields'''
            error_log = Payment_Error(
                module=module,
                error_message=str(exception),
                traceback=traceback.format_exc(),
                event_type=event_type,    # Will be None for non-webhook errors
                event_id=event_id,        # Will be None for non-webhook errors
                additional_info=str(additional_info) if additional_info else None
            )
            error_session.add(error_log)
            error_session.commit()
            
            '''Print detailed information during development'''
            # if Config.DEBUG:
            #     print(f"ERROR in {module}: {str(exception)}")
            #     if event_type:
            #         print(f"Event type: {event_type}, Event ID: {event_id}")
            #     print(traceback.format_exc())
            
        except Exception as log_error:
            ''' Fallback if error logging itself fails'''
            # print(f"Error logging failed: {str(log_error)}")
            # print(f"Original error: {str(exception)}")
            logging.error(f"Error logging failed: {str(log_error)}")
            logging.error(f"Original error: {str(exception)}")
            if event_type:
                # print(f"Event type: {event_type}, Event ID: {event_id}")
                logging.error(f"Event type: {event_type}, Event ID: {event_id}")
        finally:
            error_session.close()
    
    #Fallback HTTP method if Kafka does not send event.
    @staticmethod
    def _notify_orchestrator(payment_dict):
        try: 
            import requests
            orch_url = Config.ORCHESTRATOR_SERVICE_URL
            webhook_endpoint = f"{orch_url}/api/place-an-order/payment-webhook"
            
            # Payload similar to Kafka event schema
            payload = {
                "event_type": "payment.completed",
                "data" : {
                    "payment_id" : payment_dict["payment_id"],
                    "order_id" : payment_dict["order_id"],
                    "status" : "succeeded"
                }
            }
            
            #Send POST request to orch
            response = requests.post(
                webhook_endpoint,
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=5
            )
            
            if response.status_code == 200:
                logging.info(f"Successfully notified place-order-orchestrator via HTTP for order {payment_dict['order_id']}")
                return True
            else:
                logging.error(f"Failed to notify place-order-orchestrator via HTTP. Status code: {response.status_code}.")
                return False
            
        except Exception as e:
            logging.error(f"Error notifying place-order-orchestrator via HTTP. {str(e)}")
            return False
           
    # @staticmethod
    # def create_payment_intent(data): 
    #     try:
    #         #payment_intent return payment_intent object to be passed to frontend 
    #         total_amount = data['total_amount'] *100
    #         payment_intent = stripe.PaymentIntent.create(
    #             amount=total_amount,
    #             currency="sgd",
    #             automatic_payment_methods={'enabled': True},
    #             metadata={
    #                 'order_id': data['order_id'],
    #                 'user_id': data['user_id']
    #             }
    #         )
    #         return payment_intent
    #     except Exception as e:
    #         StripeService._log_error(e)
    #         raise
        
    @staticmethod
    def create_checkout_session(data):
        #Retrieve cart data and pass it to Stripe checkout
        #Create Stripe product object
        #Create Stripe price object
        #Create Stripe checkout session
        try:
            line_items = []
            item_stripe_data = {}
            order_id = data['order_id']
            order_user_id = data['user_id']
            order_total_amount = int(float(data['total_amount']) *100)
            order_date = data['created']
            
            if 'items' in data and isinstance(data['items'], list):
                for item in data['items']:
                    product = stripe.Product.create(
                        name=item['item_name'],
                    )
                    
                    price = stripe.Price.create(
                        product=product.id,
                        unit_amount=int(float(item['item_price'])*100),
                        currency="sgd"
                    )
                    
                    item_id = item.get('id') or str(hash(item['item_name']))
                    item_stripe_data[item_id] = {
                        'stripe_product_id': product.id,
                        'stripe_price_id': price.id,
                    }
                    
                    line_items.append({
                        "price": price.id,
                        "quantity": item.get('quantity', 1)
                    })
                
            else:
                stripe_product_object = stripe.Product.create(
                    name=f"Order #{order_id}" if order_id else "Complete Order",
                    description=f"Order placed on {order_date}" if order_date else "Your Order",
                    metadata={
                        "user_id": order_user_id
                    }
                )
                
                stripe_price_object = stripe.Price.create(
                    currency="sgd",
                    unit_amount=order_total_amount,
                    product=stripe_product_object.id
                    # metadata= {
                    #     "user_id": order_user_id
                    # }
                )
                
                line_items.append({
                    "price": stripe_price_object.id,
                    "quantity": 1
                })
            
             #pending frontend successful and cancel payment page
            success_url=f"http://localhost/checkout_success_test.html?session_id={{CHECKOUT_SESSION_ID}}&order_id={order_id}"
            cancel_url=f"http://localhost/checkout_cancel_test.html?session_id={{CHECKOUT_SESSION_ID}}&order_id={order_id}"
            stripe_checkout_session = stripe.checkout.Session.create(
                success_url=success_url,
                cancel_url=cancel_url,
                line_items=line_items,
                mode="payment",
                metadata={
                    "order_id": order_id,
                    "user_id": order_user_id
                },
                automatic_tax={'enabled': True}
                # tax_rate_data={
                #     'display_name': 'GST',
                #     'inclusive': False,
                #     'percentage': 9.0,
                # }
            )
            
            # Commented out to test checkout page
            payment = Payment(
                order_id=order_id,
                user_id=order_user_id,
                stripe_session_id=stripe_checkout_session.id,
                amount=order_total_amount / 100,
                currency="SGD", 
                status='pending',
                payment_method='card'
            )
            db.session.add(payment)
            db.session.flush()
            
            # Create payment items model if we have multiple items
            if 'items' in data and isinstance(data['items'], list):
                for item in data['items']:
                    item_id = item.get('id') or str(hash(item['item_name']))
                    stripe_data = item_stripe_data.get(item_id, {})    
                    
                    payment_item = PaymentItem(
                        payment_id=payment.payment_id,
                        item_id=item.get('item_id'),
                        name=item['item_name'],
                        description=item.get('description'),
                        quantity=item.get('quantity', 1),
                        item_price=float(item['item_price']),
                        total_price=float(item['item_price']) * item.get('quantity', 1),
                        stripe_price_id=stripe_data.get('stripe_price_id'),  # From your Stripe price creation
                        stripe_product_id=stripe_data.get('stripe_product_id')  # From your Stripe product creation
                    )
                    db.session.add(payment_item)
                    
            db.session.commit()
            
            return {
                "checkout_url": stripe_checkout_session.url,
                "session_id": stripe_checkout_session.id
            }
            
        except Exception as e:
            StripeService._log_error(e)
            logger.error(f"Error: {e}")
            raise
        
    @staticmethod
    def stripe_webhook(request):
        payload = request.data
        # print(payload)
        logger.debug(f"Received webhook payload: {payload}")
        sig_header = request.headers.get('Stripe-Signature')
        endpoint_secret = Config.STRIPE_WEBHOOK_SECRET
        event_type = "unknown"
        event_id = None
    
        try: 
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
            event_type = event['type']
            event_id = event['id']
            
            if event_type == 'checkout.session.completed':
                session = event['data']['object']
                              
                logger.info("=== Checkout Session Completed ===")
                logger.info(f"Order ID: {session.metadata.get('order_id')}")
                logger.info(f"User ID: {session.metadata.get('user_id')}")
                logger.info(f"Amount: {session.amount_total / 100} {session.currency}")
                
                '''Orchestrator would:
                1. Update order status to 'paid'
                2. Finalize inventory in shop service
                3. Send payment confirmation email"
                4. Record transaction in transaction service'''

                order_id = session.metadata.get('order_id')
                user_id = session.metadata.get('user_id')

                if not order_id:
                    raise ValueError("Missing order_id in session metadata")

                #Check for pending payment
                pending_payment = Payment.query.filter_by(
                    stripe_session_id=session.id
                ).first()
                
                if pending_payment:
                    pending_payment.status='completed'
                    pending_payment.stripe_payment_intent_id=session.payment_intent
                    pending_payment.updated_at=datetime.now()
                    db.session.commit()
                
                    # print(f"Payment status updated to completed for session: {session.id}")
                    logger.info(f"Payment status updated to completed for session: {session.id}")
                    # return True
                
                # # Check for duplicate payment
                # existing_payment = Payment.query.filter_by(
                #     stripe_payment_intent_id=session.payment_intent
                # ).first()
            
                # if existing_payment:
                #     # print(f"Payment already processed: {session.payment_intent}")
                #     logger.info(f"Payment already processed: {session.payment_intent}")
                #     return True
                
                try: 
                    payment = Payment(
                        order_id=order_id,
                        user_id=user_id,
                        stripe_payment_intent_id=session.payment_intent,
                        stripe_session_id=session.id,
                        amount=session.amount_total / 100,
                        currency=session.currency.upper(), 
                        status='completed',
                        payment_method=session.payment_method_types[0] if session.payment_method_types else 'card'
                    )
                    db.session.add(payment)
                    db.session.commit()
                    
                    # print("\nPayment record created successfully!")
                    logger.info("\nPayment record created successfully!")
                    
                    #publish event to Kafka to alert Orchestrator
                    if Config.USE_MESSAGING:
                        logger.info(f"Trying to push event via kafka.")
                        
                        from app.messaging.kafka.producer import KafkaMessageProducer
                        logger.info(f"USE_MESSAGING: {Config.USE_MESSAGING}")
                        kafka_producer = KafkaMessageProducer.get_instance()
                        logger.info(f"Kafka producer initialized. Connected: {kafka_producer.connected}")
                        
                        from app.messaging.payment_events import PaymentEventService
                        
                        # Publish the payment completed event
                        result = PaymentEventService.publish_payment_completed(payment.to_dict())
                        logger.info(f"Result: {result}")
                        logger.info(f"Event pushed to Kafka.")
                    else:
                        # HTTP notification for backward compatibility
                        if hasattr(Config, 'ORCHESTRATOR_SERVICE_URL'):
                            StripeService._notify_orchestrator(payment.to_dict())
                            logger.info(f"Event pushed via HTTP to place-order-orchestrator.")
                        else:
                            logger.info(f"Event not pushed via any means.")
                except Exception as db_error:
                    StripeService._log_error(
                        db_error,
                        module="Payment - Database", 
                        event_type=event_type,
                        event_id=event_id,
                        additional_info={
                            "stage": "database_update",
                            "order_id": order_id
                        }
                    )
                    logger.error(f"Error: {db_error}")
                return True
            
            elif event_type == 'payment_intent.payment_failed':
                # Handle failed payments
                payment_intent = event['data']['object']
            
                # print("=== Payment Failed ===")
                # print(f"Payment Intent: {payment_intent.id}")
                # print(f"Error: {payment_intent.last_payment_error.message if payment_intent.last_payment_error else 'Unknown error'}")
                logger.warning("=== Payment Failed ===")
                logger.warning(f"Payment Intent: {payment_intent.id}")
                logger.warning(f"Error: {payment_intent.last_payment_error.message if payment_intent.last_payment_error else 'Unknown error'}")

                order_id = payment_intent.metadata.get('order_id')
                error_message = payment_intent.last_payment_error.message if payment_intent.last_payment_error else 'Unknown error'
                
                # Publish payment failed event to Kafka
                if Config.USE_MESSAGING and order_id:
                    from app.messaging.payment_events import PaymentEventService
                    
                    PaymentEventService.publish_payment_failed(
                        payment_intent.id, order_id, error_message
                    )
                
                # Handle failed payment logic
                # ...
                
                return True
                
            else:
                # Log unhandled event types
                # print(f"Received unhandled event type: {event_type}")
                logging.warning(f"Received unhandled event type: {event_type}")
                
                return True
            
        except ValueError as e:
            # Validation errors
            StripeService._log_error(
                e, 
                module="Payment - Webhook Validation",
                event_type=event_type,
                event_id=event_id
            )
            raise
        except stripe.error.SignatureVerificationError as e:
            # Signature verification errors
            StripeService._log_error(
                e, 
                module="Payment - Webhook Signature",
                event_type="signature_verification_failed"
            )
            raise
        except Exception as e:
            # General errors
            StripeService._log_error(
                e, 
                module="Payment - Webhook Processing",
                event_type=event_type,
                event_id=event_id
            )
            raise
    
    @staticmethod
    def refund(order_id, amount):
        # Pass in order_id
        # Query order_id in payments table
        # Retrieve stripe_payment_intent
        # Create refund object, pass stripe_payment_intent in
        
        try: 
            user_payment = db.session.scalar(db.select(Payment).filter_by(order_id=order_id))
            
            if not user_payment:
                return {"order_id" : order_id, 
                        "refund_status" : "UNSUCCESSFUL",
                        "reason": "order does not exist"}

            user_payment_dict = user_payment.to_dict()
            stripe_payement_intent_id = user_payment_dict["stripe_payment_intent_id"]
            
            if not stripe_payement_intent_id:
                return {"order_id" : order_id, 
                        "refund_status" : "UNSUCCESSFUL",
                        "reason": "stripe_payment_intent_id field empty"}
            
            # For custom amount
            if amount:
                amount_in_cent = int(float(amount)*100) # required by stripe
                refund_response = stripe.Refund.create(payment_intent=stripe_payement_intent_id, amount=amount_in_cent)
            else:
                refund_response = stripe.Refund.create(payment_intent=stripe_payement_intent_id)
                

            # successful refund
            if (refund_response["status"] == "succeeded"):
                logger.info(f"Refund for order_id: {order_id} SUCCESSFUL.")
                if amount:
                    #Partial refund
                    user_payment.status = "partially_refunded" 
                    user_payment.refunded_amount = amount
                else:
                    #Full refund
                    user_payment.refunded_amount = user_payment.amount
                    user_payment.status = "refunded"
                current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
                user_payment.updated_at = current_time
                db.session.commit()
                return {"order_id" : order_id, "refund_status" : "SUCCESSFUL"}
            
            # unsuccessful refund    
            if (refund_response["status"] == "failed"):
                logger.warning(f"Refund for order_id: {order_id} UNSUCCESSFUL.")
                logger.warning(f"Reason: {refund_response['failure_reason']}")
                failure_reason = refund_response["failure_reason"]
                return {"order_id" : order_id, 
                        "refund_status" : "UNSUCCESSFUL", 
                        "reason" : failure_reason
                        }    
            
            # Default case if status is neither succeeded nor failed
            return {
                "order_id": order_id,
                "refund_status": "UNKNOWN",
                "reason": f"Unexpected status: {refund_response['status']}"
            }
            
        except stripe.error.InvalidRequestError as e:
            error_message = str(e)
    
            # "already refunded"
            if "has already been refunded" in error_message:
                # Update database to reflect the refunded status
                user_payment.status = "refunded"
                user_payment.updated_at = datetime.datetime.now()
                db.session.commit()
                
                # Return a success response, since the payment is already refunded
                logger.info(f"Payment for order_id: {order_id} was already refunded.")
                return {"order_id": order_id, 
                        "refund_status": "SUCCESSFUL", 
                        "message": "Payment was already refunded"
                        }
            else:
                # Handle other Stripe errors
                logger.error(f"Stripe error: {error_message}")
                return {"order_id": order_id, 
                        "refund_status": "UNSUCCESSFUL", 
                        "reason": error_message
                        }
        except Exception as e:
            logger.error(f"Error: {e}")
            raise
        
        
        