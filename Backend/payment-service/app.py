from app import createApp
from app.logging_config import setup_logging

logger = setup_logging('payment-service')
app = createApp()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)