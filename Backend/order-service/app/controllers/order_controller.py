from flask import jsonify, request 
from app.services.order_service import OrderService
import traceback

class OrderController:
    def __init__(self, order_service=None):
        self.order_service = order_service or OrderService()
        
    def create_order(self):
        data = request.get_json()
        
        if not data: 
            return jsonify({"error": "Invalid JSON payload"}), 400
        
        if 'userId' not in data or 'item' not in data:
            return jsonify({"error": "Missing required fields (userId or item)"}), 400
        
        try:    
            order_creation = self.order_service.create_order(data)
            return jsonify(order_creation), 201
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            print(f"Error: {str(e)}")
            return jsonify({"error": "Internal server error", "details": str(e)}), 500
        
    def get_order(self, order_id):
        try:
            order_id = int(order_id)
            order_retrival = self.order_service.get_order(order_id)
            
            # if not order_id:
            #     return jsonify({"error": "Order id not found"}), 404
            
            if order_retrival is None:
                return jsonify({"error": "Order not found"}), 404
            
            return jsonify(order_retrival), 200
        except ValueError as e:
            return jsonify({"error": "Invalid order ID format (non-integer value)"}), 400
        # except Exception as e:
        #     return jsonify({"error": "Internal server error"}), 500
        except Exception as e:
            print(f"Error in get_order: {str(e)}")
            print(traceback.format_exc())
            return jsonify({"error": "Internal server error", "details": str(e)}), 500

    def update_order_status(self, order_id):
        try:
            order_id = int(order_id)
            data = request.get_json()
            updated_order = self.order_service.update_order_status(order_id, data)
            
            # if not order_id:
            #     return jsonify({"error": "Order id not found"}), 404
            
            if updated_order is None: 
                return jsonify({"error": "Order not found"}), 404
            
            return jsonify(updated_order), 200
        except ValueError as e:
            return jsonify({"error": "Invalid order ID format (non-integer value)"}), 400
        except Exception as e:
            return jsonify({"error": "Internal server error"}), 500

    def get_user_order(self, user_id):
        try:
            user_order = self.order_service.get_user_order(user_id)
            
            if not user_order:
                return jsonify({"message": "User has no orders"}), 200

            return jsonify({"orders": user_order}), 200
        except ValueError as e:
            return jsonify({"error": "Invalid order ID format (non-integer value)"}), 400
        except Exception as e:
            return jsonify({"error": "Internal server error"}), 500
            