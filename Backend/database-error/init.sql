DROP TABLE IF EXISTS errors;

--  Errors Table
CREATE TABLE errors (
    error_id SERIAL PRIMARY KEY,          
    transaction_id BIGINT NOT NULL,              
    error_message TEXT NOT NULL,           
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO errors (transaction_id, error_message) VALUES
(1001, 'Payment failed due to insufficient funds.'),
(1002, 'Transaction timeout while processing refund.'),
(1003, 'Invalid card details provided.');
