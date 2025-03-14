import logging
import os

def setup_logging(service_name):
    """
    Set up basic logging configuration for a microservice.
    
    Args:
        service_name: Name of the service (e.g., 'payment', 'order', 'shop')
    
    Returns:
        A configured logger object
    """
    # Make sure log format includes the service name
    log_format = f'%(asctime)s - {service_name} - %(levelname)s - %(message)s'
    
    # Configure the root logger
    logging.basicConfig(
        level=logging.INFO,
        format=log_format,
        handlers=[
            logging.StreamHandler()  # Output to console
        ]
    )
    
    # Create and return a logger for the service
    logger = logging.getLogger(service_name)
    logger.info(f"{service_name} service logging initialized")
    return logger