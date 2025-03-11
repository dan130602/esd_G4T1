DROP TABLE IF EXISTS errors;
DROP TABLE IF EXISTS "order_error_log";
DROP TABLE IF EXISTS payment_error_log;

--  Errors Table
CREATE TABLE errors (
    error_id SERIAL PRIMARY KEY,          
    transaction_id BIGINT NOT NULL,              
    error_message TEXT NOT NULL,           
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_error_logs (
    error_id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT NOW(),
    module VARCHAR(100),
    error_message TEXT,
    traceback TEXT
);

-- Payment_Error table
CREATE TABLE payment_error_logs (
    error_id SERIAL PRIMARY KEY,
    payment_id INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    module VARCHAR(100),
    error_message TEXT,
    traceback TEXT,
    event_type VARCHAR(100),
    event_id VARCHAR(100),
    additional_info TEXT
);

INSERT INTO errors (transaction_id, error_message) VALUES
(1001, 'Payment failed due to insufficient funds.'),
(1002, 'Transaction timeout while processing refund.'),
(1003, 'Invalid card details provided.');
