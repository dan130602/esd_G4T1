from flask import Flask
from config.config import db  
import os
from controllers.transactionController import transaction_bp 
import threading
from kafka.consumer import start_transaction_consumer

app = Flask(__name__)

# Configure database from config
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://user:password@transaction-db:5432/transaction_db" 
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize db with Flask app
db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(transaction_bp, url_prefix="/transactions", strict_slashes=False)

# consumer_thread = threading.Thread(target=start_transaction_consumer, daemon=True)
# consumer_thread.start()

@app.route("/")
def hello_world():
    return "Hello, World!"

def run_consumer():
    with app.app_context():
        start_transaction_consumer()

consumer_thread = threading.Thread(target=run_consumer, daemon=True)
consumer_thread.start()

if __name__ == "__main__":
    app.run(debug=True, port=3009, host="0.0.0.0")
