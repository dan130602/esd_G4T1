-- Drop tables if they exist (to avoid errors)
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS transaction_status;  -- Drop ENUM if it exists

-- Create ENUM type for transaction status
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');

--  Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,          
    email VARCHAR(255) UNIQUE NOT NULL,  
    full_name VARCHAR(255) NOT NULL,     
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--  Items Table
CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,          
    item_name VARCHAR(255) NOT NULL,               
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity >= 0)
);

--  Transactions Table
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,      
    user_id BIGINT NOT NULL,                    
    item_id BIGINT NOT NULL,                     
    amount DECIMAL(10,2) NOT NULL,            
    status transaction_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE
);

--  Insert Users
INSERT INTO users (email, full_name) VALUES
('john@example.com', 'John Doe'),
('jane@example.com', 'Jane Smith'),
('alice@example.com', 'Alice Johnson');

--  Insert Items
INSERT INTO items (item_name, price, quantity) VALUES
('Laptop', 1000.00, 5),
('Smartphone', 500.00, 10),
('Headphones', 150.00, 20);

--  Insert Transactions
INSERT INTO transactions (user_id, item_id, amount, status) VALUES
(1, 2, 500.00, 'completed'),  -- John buys a Smartphone
(2, 3, 150.00, 'completed'),  -- Jane buys Headphones
(3, 1, 1000.00, 'failed');    -- Alice's Laptop purchase fails
