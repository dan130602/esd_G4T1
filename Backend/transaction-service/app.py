from flask import Flask
from config.config import db  
import os
from controllers.transactionController import transaction_bp 

app = Flask(__name__)

# Configure database from config
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize db with Flask app
db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(transaction_bp, url_prefix="/transactions", strict_slashes=False)

@app.route("/")
def hello_world():
    return "Hello, World!"

if __name__ == "__main__":
    app.run(debug=True, port=3009, host="0.0.0.0")
