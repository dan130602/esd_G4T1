import traceback
import logging
from flask import request
from app import db
from app.models.payment_model import Payment, Payment_Error
from sqlalchemy import select

logger = logging.getLogger('paymet-service')

class PaymentService:
    def _log_error(self, exception):
        error_session = db.session
        try:
            error_log = Payment_Error(
                module="Payment",
                error_message=str(exception),
                traceback=traceback.format_exc()
            )
            error_session.add(error_log)
            error_session.commit()
        except Exception as log_error:
            '''Fallback if error logging itself fails'''
            # print(f"Error logging failed: {str(log_error)}")
            logger.error(f"Error logging failed: {str(log_error)}")
        finally:
            error_session.close()
    
    def get_payment_record(self, payment_id):
        try:
            payment_record = db.session.scalar(db.select(Payment).filter_by(payment_id=payment_id))
            if not payment_record:
                return None
        
            return payment_record.to_dict()
        except Exception as e:
            self._log_error(e)
            raise

        
