from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def createApp():
    app = Flask(__name__)
    CORS(app)
    
    from app.config import Config
    app.config.from_object(Config)
        
    # Initialize the database with the app
    db.init_app(app)
    
    # Register blueprints
    from app.routes.payment_routes import payment_bp
    app.register_blueprint(payment_bp, url_prefix='/api/payment')
    
    # Create database tables
    with app.app_context():
        try:
            db.create_all()
            app.logger.info('Database tables created successfully')
        except Exception as e:
            app.logger.error(f'Error creating database tables: {e}')
    
    return app


