import os
from dotenv import load_dotenv

load_dotenv()

class Config: 
    ORCHESTRATOR_SERVICE_URL = os.getenv('ORCHESTRATOR_SERVICE_URL', 'http://orchestrator-service:5004')
    
    STRIPE_API_KEY = os.getenv('STRIPE_API_KEY', 'sk_test_yourTestKeyHere')
    STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET', 'whsec_yourTestKeyHere')
    
    #Commerce db config
    COMMERCE_DB_USER = os.getenv('commerce_db_user', 'user')
    COMMERCE_DB_USER_PASSWORD = os.getenv('commerce_db_password', 'password')
    COMMERCE_DB_USER_HOST = os.getenv('commerce_dbHost', 'commerce-db')  
    COMMERCE_DB_USER_PORT = os.getenv('commerce_db_port', '5432')
    COMMERCE_DB_USER_NAME = os.getenv('commerce_db_name', 'commerce_db')
    
    # Error db config
    ERROR_DB_USER = os.getenv('error_db_user', 'user')
    ERROR_DB_PASSWORD= os.getenv('error_db_password', 'password')
    ERROR_DB_HOST = os.getenv('dbHost', 'error-db')  
    ERROR_DB_PORT = os.getenv('error_db_port', '5432')  
    ERROR_DB_NAME = os.getenv('error_db_name', 'error_db')
    
    # Build the database URIs
    SQLALCHEMY_DATABASE_URI = f"postgresql://{COMMERCE_DB_USER}:{COMMERCE_DB_USER_PASSWORD}@{COMMERCE_DB_USER_HOST}:{COMMERCE_DB_USER_PORT}/{COMMERCE_DB_USER_NAME}"
    print(SQLALCHEMY_DATABASE_URI)
    SQLALCHEMY_BINDS = {'error_db': f"postgresql://{ERROR_DB_USER}:{ERROR_DB_PASSWORD}@{ERROR_DB_HOST}:{ERROR_DB_PORT}/{ERROR_DB_NAME}"}
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Kafka Configuration
    KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
    KAFKA_CLIENT_ID = os.getenv('KAFKA_CLIENT_ID', 'payment-service')
    
    # Define whether to use Kafka or HTTP for inter-service communication
    USE_MESSAGING = os.getenv('USE_MESSAGING', 'False').lower() in ('true', '1', 't')
