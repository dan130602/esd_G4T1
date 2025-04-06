from flask import Blueprint, jsonify
from app.controllers.order_controller import OrderController
from app.models.order_model import Order, Order_Item
from app import db

order_bp = Blueprint('order', __name__)
order_controller = OrderController()

#Create new order
@order_bp.route('', methods=['POST'])
def create_order():
    return order_controller.create_order()

#Get order details based on order_id
@order_bp.route('/<int:order_id>', methods=['GET'])
def find_by_order_id(order_id):
    return order_controller.get_order(order_id)

#Update order status based on order_id
@order_bp.route('/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    return order_controller.update_order_status(order_id)

#Get all orders based on user_id
@order_bp.route('/user/<string:user_id>', methods=['GET'])
def find_user_order(user_id):
    return order_controller.get_user_order(user_id)

#Get all orders based on user_id and order_id
@order_bp.route('/user/<string:user_id>/order/<int:order_id>', methods=['GET'])
def find_user_order_orderId(user_id, order_id):
    return order_controller.get_user_specifc_order(user_id, order_id)


