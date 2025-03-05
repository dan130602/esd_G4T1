from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()

def createApp():
    app = Flask(__name__)
    
    #Commerce db config
    db_user = os.getenv('commerce_db_user', 'user')
    db_password = os.getenv('commerce_db_password', 'hidden')
    db_host = os.getenv('dbHost', 'localhost')  
    db_port = os.getenv('commerce_db_port', '5433')
    db_name = os.getenv('commerce_db_name', 'commerce_db')
    
    # Error db config
    error_db_user = os.getenv('error_db_user', 'user')
    error_db_password = os.getenv('error_db_password', 'hidden')
    error_db_host = os.getenv('dbHost', 'localhost')  
    error_db_port = os.getenv('error_db_port', '5434')  
    error_db_name = os.getenv('error_db_name', 'error_db')
    
    # Build the database URIs
    commerce_db_uri = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    error_db_uri = f"postgresql://{error_db_user}:{error_db_password}@{error_db_host}:{error_db_port}/{error_db_name}"
    
    # Configure the Flask app with both databases
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = commerce_db_uri  # Primary database
    app.config['SQLALCHEMY_BINDS'] = {
        'error_db': error_db_uri  # Secondary database for error logging
    }
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize the database with the app
    db.init_app(app)
    
    from app.routes.order_routes import order_bp
    
    # Register blueprints
    app.register_blueprint(order_bp, url_prefix='/api/order')
    
    # Create database tables
    with app.app_context():
        try:
            db.create_all()
            app.logger.info('Database tables created successfully')
        except Exception as e:
            app.logger.error(f'Error creating database tables: {e}')
    
    return app