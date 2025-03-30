from flask import Blueprint, jsonify
from app.controllers.payment_controller import PaymentController

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