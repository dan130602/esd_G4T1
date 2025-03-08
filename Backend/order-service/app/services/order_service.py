import traceback
from flask import request
from app import db
from app.models.order_model import Order, Order_Item, Order_Error
from sqlalchemy import select



class OrderService:
    def __init__(self, db_session=None):
        self.db = db_session or db.session
        
    def _log_error(self, exception):
        error_session = db.session
        try:
            error_log = Order_Error(
                module="OrderService",
                error_message=str(exception),
                traceback=traceback.format_exc()
            )
            error_session.add(error_log)
            error_session.commit()
        except Exception as log_error:
            # Fallback if error logging itself fails
            print(f"Error logging failed: {str(log_error)}")
        finally:
            error_session.close()
    
    def create_order(self, data):
        try:
            new_order = Order(
                customer_id = data.get('userId'),
                total_amount = 0.0,
                status = 'NEW'
            )
            
            self.db.add(new_order)
            self.db.flush()
            
            total_amount = 0.0
            
            items_data = data.get('item', [])
            if isinstance(items_data, dict): 
                items_data = [items_data]
            
            for item_data in items_data:
                if 'item_id' not in item_data or 'price' not in item_data or 'quantity' not in item_data:
                    raise ValueError(f"{item_data.get("item_name", 'Item')} has missing required item fields (id, price, quantity)")

                # Get and validate quantity
                quantity = item_data.get('quantity')
                
                # Check if quantity is a number
                try:
                    quantity = int(quantity)
                except (ValueError, TypeError):
                    raise ValueError(f"Quantity for {item_data.get('item_name', 'Item')} must be a valid number")
                    
                # Check if quantity is positive
                if quantity <= 0:
                    raise ValueError(f"Quantity for {item_data.get('item_name', 'Item')} must be greater than zero")
                
                # Get and validate price
                try:
                    unit_price = float(item_data.get('price'))
                    if unit_price < 0:
                        raise ValueError(f"Price for {item_data.get('item_name', 'Item')} cannot be negative")
                except (ValueError, TypeError):
                    raise ValueError(f"Price for {item_data.get('item_name', 'Item')} must be a valid number")
                
                order_item_subtotal = quantity * unit_price
                
                order_item = Order_Item(
                    order_id = new_order.order_id,
                    product_id = item_data.get('item_id'),
                    product_name = item_data.get('item_name', 'Unknown Product'),
                    quantity = quantity,
                    unit_price = unit_price,
                    order_item_subtotal = order_item_subtotal
                )
                
                self.db.add(order_item)
                total_amount += order_item_subtotal
            
            new_order.total_amount = total_amount
            self.db.commit()
            return new_order.to_dict()
        except Exception as e:
            self.db.rollback()
            self._log_error(e)
            raise 
    
    #Get order based on order_id
    def get_order(self, order_id):
        try:
            user_order = db.session.scalar(db.select(Order).filter_by(order_id=order_id))
            # stmt = select(Order).filter_by(order_id=order_id)
            # user_order = db.session.execute(stmt)
            
            if not user_order:
                return None
            
            return user_order.to_dict()
        except Exception as e:
            self._log_error(e)
            raise
        
    def update_order_status(self, order_id, data):
        try:
            user_order = db.session.scalar(db.select(Order).filter_by(order_id=order_id))
            new_status = data.get('status')
            
            if not user_order:
                return None
            
            if new_status:
                user_order.status = new_status
                self.db.commit()
                return user_order.to_dict()
            else:
                raise ValueError("No status provided in update request")
            
        except Exception as e:
            self.db.rollback()
            self._log_error(e)
            raise
    
    #Get all orders of a particular user  
    def get_user_order(self, user_id):
        try:
            user_orders = self.db.scalars(db.select(Order).filter_by(customer_id=user_id)).all()
                        
            return [order.to_dict() for order in user_orders]          
        except Exception as e:
            self._log_error(e)
            raise