DROP TABLE IF EXISTS transactions;
DROP TYPE IF EXISTS transaction_status; 

CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,      
    user_id BIGINT NOT NULL,                    
    item_id BIGINT NOT NULL,                     
    amount DECIMAL(10,2) NOT NULL,            
    status transaction_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--  Insert Transactions
INSERT INTO transactions (user_id, item_id, amount, status) VALUES
(1, 2, 500.00, 'completed'),  -- John buys a Smartphone
(2, 3, 150.00, 'completed'),  -- Jane buys Headphones
(3, 1, 1000.00, 'failed');    -- Alice's Laptop purchase fails