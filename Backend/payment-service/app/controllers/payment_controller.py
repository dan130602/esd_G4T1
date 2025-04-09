from flask import jsonify, request, current_app, abort
from app.services.payment_service import PaymentService
from app.services.stripe_service import StripeService
from app.models.payment_model import Payment
import stripe
import traceback


class PaymentController:
    def __init__(self, payment_service=None):
        self.payment_service = payment_service or PaymentService()
        
    def get_payment_record(self, payment_id):
        try:
            if not payment_id:
                return jsonify({
                    "code": "400",
                    "error": "Invalid JSON payload"}), 400
            
            payment_record = self.payment_service.get_payment_record(payment_id)
            
            if payment_record is None:
                return jsonify({
                    "code": "404",
                    "error": "Payment record not found"
                }), 404
            return jsonify(payment_record), 200
        except ValueError as e:
            return jsonify({
                "code": "400",
                "error": "Invalid order ID format (non-integer value)"
            }), 400
        # except Exception as e:
        #     return jsonify({"error": "Internal server error"}), 500
        except Exception as e:
            print(f"Error in get_payment_record: {str(e)}")
            print(traceback.format_exc())
            return jsonify({
                "code": "500",
                "error": "Internal server error", "details": str(e)
            }), 500
        
    # def create_payment_intent(self):
    #     data = request.get_json()
    #     if 'total_amount' not in data:
    #         return jsonify({"error": "Amount field not found"}), 400 
            
    #     try:
    #         payment_intent = StripeService.create_payment_intent(data)
    #         #payement_intent returns PaymentIntent object 
    #         #Extract client_secret for frontend to process payment page
    #         return jsonify({
    #             'success': True,
    #             'client_secret': payment_intent.client_secret,
    #             'payment_intent_id': payment_intent.id}), 201
    #     except ValueError as e:
    #         return jsonify({"error": str(e)}), 400
    #     except Exception as e:
    #         return jsonify({"error": "Internal server error"}), 500
    
    def create_checkout_session(self):
        data = request.get_json()
        if 'total_amount' not in data:
            return jsonify({
                "code": "400",
                "error": "Total amount field not found"}), 400 
        
        # if 'order_id' not in data:
        #     return jsonify({
            #  "code": "400",
            # "error": "Order ID field not found"}), 400
            
        try:
            checkout_session = StripeService.create_checkout_session(data)
            return jsonify({
                    'code': 201,
                    'success': True,
                    'checkout_url': checkout_session['checkout_url'],
                    'checkout_session_id': checkout_session['session_id']
                }), 201
        except ValueError as e:
            return jsonify({
                    "code": "400",
                    "error": str(e)
                }), 400
        except Exception as e:
            return jsonify({
                "code": "500",
                "error": str(e)
            }), 500
    
    
    def stripe_webhook(self):
        try:
            if request.content_length > 1024 * 1024:
                print("Request too big")
                return jsonify({
                    "code": 400,
                    "error": "Request payload too large"
                }), 400
            
            StripeService.stripe_webhook(request)
            #Stripe expects a 200 success response
            return jsonify({"success": True}), 200
        except ValueError as e:
            print(f"Webhook validation error: {str(e)}")
            return jsonify({"success": True}), 200
        except stripe.error.SignatureVerificationError as e:
            #Print failed verification, but Stripe still requires response 200
            print(f"Webhook signature verification failed: {str(e)}")
            return jsonify({"success": True}), 200
        except Exception as e:
            print(f"Webhook processing error: {str(e)}")
            print(traceback.format_exc())
            return jsonify({"success": True}), 200
        
    def refund(self, order_id):
        data = request.get_json(silent=True) or {}
        amount = data.get("amount")
        
        if not order_id:
            return jsonify({
                "code": "400",
                "error": "order_id field not found"}), 400 
        
        try:
            refund_response = StripeService.refund(order_id, amount)
            
            if refund_response["refund_status"] == "SUCCESSFUL":
                if "message" in refund_response and refund_response["message"] == "Payment was already refunded":
                    return jsonify({
                        "code": "200",
                        "refund_status": "SUCCESSFUL",
                        "message": "Payment was already refunded"
                    }), 200
                else:
                    # Regular successful refund
                    return jsonify({
                        "code": "200",
                        "refund_status": "SUCCESSFUL"
                    }), 200
                
            if refund_response["refund status"] == "UNSUCCESSFUL":
                return jsonify({
                    "code": "200",
                    "refund_status": "UNSUCCESSFUL",
                    "reason" : refund_response["reason"]
                }), 200     
        except Exception as e:
            print(f"error message: {str(e)}")
            return jsonify({
                "code": "500",
                "error": "Internal server error",
            }), 500
            
    def get_checkout_details(self):
        try:
            session_id = request.args.get('session_id')
            payment_intent_id = request.args.get('payment_intent_id')
            
            if not session_id and not payment_intent_id:
                return jsonify({
                    "code": "400",
                    "error": "Either session_id or payment_intent_id is required"
                }), 400
                
            # Query by session ID or payment intent ID
            if session_id:
                payment = Payment.query.filter_by(stripe_session_id=session_id).first()
            else:
                payment = Payment.query.filter_by(stripe_payment_intent_id=payment_intent_id).first()
            
            if payment is None:
                return jsonify({
                    "code": "404",
                    "error": "Payment record not found"
                }), 404
                
            # Get payment items if any
            payment_items = [item.to_dict() for item in payment.items]
            
            # Create response with payment and items
            response = {
                "payment": payment.to_dict(),
                "items": payment_items
            }
            
            return jsonify(response), 200
            
        except Exception as e:
            print(f"Error in get_checkout_details: {str(e)}")
            print(traceback.format_exc())
            return jsonify({
                "code": "500",
                "error": "Internal server error", 
                "details": str(e)
            }), 500
        
    
            