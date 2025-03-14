from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Option 1: Import db directly if it doesn't cause circular imports
from app import db

# Option 2: Or use a function to get db when needed
# def get_db():
#     from app import db
#     return db
# db = get_db()

class Payment(db.Model):
    __tablename__ = 'payment'
    
    payment_id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, nullable=False)
    customer_id = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), nullable=False, default='SGD')
    status = db.Column(db.String(20), nullable=False, default='pending')  # pending, processing, completed, failed
    payment_method = db.Column(db.String(50))
    
    # Stripe specific fields
    stripe_payment_intent_id = db.Column(db.String(100))
    stripe_session_id = db.Column(db.String(100))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    
    def to_dict(self):
        """Convert the model instance to a dictionary"""
        return {
            "payment_id": self.payment_id,
            "order_id": self.order_id,
            "customer_id": self.customer_id,
            "amount": self.amount,
            "currency": self.currency,
            "status": self.status,
            "payment_method": self.payment_method,
            "stripe_payment_intent_id": self.stripe_payment_intent_id,
            "stripe_session_id": self.stripe_session_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

class PaymentItem(db.Model):
    __tablename__ = 'payment_items'
    
    id = db.Column(db.Integer, primary_key=True)
    payment_id = db.Column(db.Integer, db.ForeignKey('payment.payment_id'), nullable=False)
    product_id = db.Column(db.String(100), nullable=True)  # External product reference
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    unit_price = db.Column(db.Float, nullable=False)
    total_price = db.Column(db.Float, nullable=False)  # unit_price * quantity
    
    # Stripe specific fields
    stripe_price_id = db.Column(db.String(100), nullable=True)
    stripe_product_id = db.Column(db.String(100), nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    # Relationship with Payment
    payment = db.relationship('Payment', backref=db.backref('items', lazy=True))
    
    def to_dict(self):
        """Convert the model instance to a dictionary"""
        return {
            "id": self.id,
            "payment_id": self.payment_id,
            "product_id": self.product_id,
            "name": self.name,
            "description": self.description,
            "quantity": self.quantity,
            "unit_price": self.unit_price,
            "total_price": self.total_price,
            "stripe_price_id": self.stripe_price_id,
            "stripe_product_id": self.stripe_product_id,
            "created_at": self.created_at
        }

class Payment_Error(db.Model):
    __bind_key__ = 'error_db'  # Use the secondary database
    __tablename__ = 'payment_error_logs'
    
    error_id = db.Column(db.Integer, primary_key=True)
    payment_id = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=datetime.now)
    module = db.Column(db.String(100))
    error_message = db.Column(db.Text)
    traceback = db.Column(db.Text)
    event_type = db.Column(db.String(100))  #can be NULL
    event_id = db.Column(db.String(100))    #can be NULL
    additional_info = db.Column(db.Text)    #can be NULL
    
    def to_dict(self):
        """Convert the model instance to a dictionary"""
        return {
            "error_id": self.error_id,
            "payment_id": self.payment_id,
            "timestamp": self.timestamp,
            "module": self.module,
            "error_message": self.error_message,
            "traceback": self.traceback,
            "event_type": self.event_type,
            "event_id": self.event_id,
            "additional_info": self.additional_info
        }
