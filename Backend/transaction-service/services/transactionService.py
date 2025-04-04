from models.transactionModel import Transaction
from config.config import db

class TransactionService:
    @staticmethod
    def get_transactions():
        with db.session.begin():  # ✅ Ensures db session is properly bound
            return db.session.query(Transaction).all()

    @staticmethod
    def create_transaction(user_id, item_id, amount, status):
        new_transaction = Transaction(user_id=user_id, item_id=item_id, amount=amount, status=status)
        with db.session.begin():  # ✅ Ensures db session is properly bound
            db.session.add(new_transaction)
            db.session.commit()

        db.session.refresh(new_transaction)
        return new_transaction
