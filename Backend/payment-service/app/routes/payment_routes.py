from flask import Blueprint, jsonify
from app.controllers.payment_controller import PaymentController
from app.models.payment_model import Payment, PaymentItem

payment_controller = PaymentController()
payment_bp = Blueprint('payments', __name__)

#Get payment record
@payment_bp.route('/<int:payment_id>', methods=['GET'])
def get_payment_record(payment_id):
    return payment_controller.get_payment_record(payment_id)

#Start a payment process 
@payment_bp.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():    
    return payment_controller.create_checkout_session()

#Stripe webhook
@payment_bp.route('/stripe_webhook', methods=['POST'])
def stripe_webhook():   
    print("Webhook called") 
    return payment_controller.stripe_webhook()

#Refund
@payment_bp.route('/refund/<int:order_id>', methods=['POST'])
def refund(order_id):
    return payment_controller.refund(order_id)

#get order by session_id
@payment_bp.route('/session/<session_id>', methods=['GET'])
def get_payment_by_session(session_id):
    try:
        # Find the payment record with this session ID
        payment = Payment.query.filter_by(stripe_session_id=session_id).first()
        
        if not payment:
            return jsonify({"error": "Payment not found"}), 404
        
        # Get payment items if they exist
        payment_items = PaymentItem.query.filter_by(
            payment_id=payment.payment_id
        ).all()
        
        # Construct response
        response = {
            "order_id": payment.order_id,
            "amount": payment.amount,
            "items": [
                {
                    "name": item.name,
                    "quantity": item.quantity,
                    "item_price": item.item_price,
                    "total_price": item.total_price
                } for item in payment_items
            ] if payment_items else []
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500