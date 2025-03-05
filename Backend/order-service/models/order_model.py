from app import db
from datetime import datetime
import uuid

class Order(db.Model):
    __tablename__ = 'order'

    order_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(10), nullable=False)
    created = db.Column(db.DateTime, nullable=False, default=datetime.now)
    modified = db.Column(db.DateTime, nullable=False,
                         default=datetime.now, onupdate=datetime.now)
    # items = db.relationship('Order_Item', backref='order', lazy='dynamic')


    def to_dict(self):
        return {
            'order_id': self.order_id,
            'customer_id': self.customer_id,
            'total_amount': float(self.total_amount),
            'status': self.status,
            'created': self.created.isoformat() if self.created else None,
            'modified': self.modified.isoformat() if self.modified else None
            # 'items': [item.to_dict() for item in self.items.all()]
        }

class Order_Item(db.Model):
    __tablename__ = 'order_item'

    item_id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.String(32), nullable=False)
    order_id = db.Column(db.ForeignKey(
        'order.order_id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False, index=True)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    order_item_subtotal = db.Column(db.Numeric(10, 2), nullable=False)

    # order_id = db.Column(db.String(36), db.ForeignKey('order.order_id'), nullable=False)
    # order = db.relationship('Order', backref='order_item')
    order = db.relationship(
        'Order', primaryjoin='Order_Item.order_id == Order.order_id', backref='order_item')

    def to_dict(self):
        return {
            'item_id': self.item_id, 
            'product_id': self.product_id,
            'order_id': self.order_id, 
            'quantity': self.quantity, 
            'unit_price': self.unit_price,
            'order_item_subtotal': self.order_item_subtotal
        }
        
class Order_Error(db.Model):
    __bind_key__ = 'error_db'  # Use the secondary database
    __tablename__ = 'error_logs'
    
    error_id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.now)
    module = db.Column(db.String(100))
    error_message = db.Column(db.Text)
    traceback = db.Column(db.Text)

# def generate_order_id():
#     """Generate a shorter unique order ID."""
#     # Take first 8 characters of a UUID
#     return f"ORD-{str(uuid.uuid4())[:8]}"