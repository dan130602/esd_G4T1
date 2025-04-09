from flask import Blueprint, request, jsonify
from services.transactionService import TransactionService

# Create a Blueprint for transactions
transaction_bp = Blueprint("transaction", __name__)

@transaction_bp.route("/", methods=["GET"])
def get_transactions():
    transactions = TransactionService.get_transactions()
    return jsonify([{ 
        "transaction_id": t.transaction_id, 
        "user_id": t.user_id, 
        "item_id": t.item_id, 
        "amount": t.amount, 
        "status": t.status, 
        "created_at": t.created_at 
    } for t in transactions])

@transaction_bp.route("/", methods=["POST"])
def create_transaction():
    data = request.get_json()
    required_fields = ["user_id", "item_id", "amount", "status"]
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    if data["status"] not in ["completed", "failed", "pending", "refunded"]:
        return jsonify({"error": "Invalid status value"}), 400
    
    new_transaction = TransactionService.create_transaction(data["user_id"], data["item_id"], data["amount"], data["status"])
    
    return jsonify({ 
        "transaction_id": new_transaction.transaction_id, 
        "user_id": new_transaction.user_id, 
        "item_id": new_transaction.item_id, 
        "amount": new_transaction.amount, 
        "status": new_transaction.status, 
        "created_at": new_transaction.created_at 
    }), 201
