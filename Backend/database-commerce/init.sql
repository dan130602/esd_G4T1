-- Drop tables if they exist (to avoid errors)
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS orders;
DROP TYPE IF EXISTS transaction_status;  -- Drop ENUM if it exists
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS payment_items;
DROP TABLE IF EXISTS supplier_returns;

-- Create ENUM type for transaction status
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE return_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
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

-- 'order' table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(10) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    modified TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- 'order_item' table with foreign key reference to 'order'
CREATE TABLE order_item (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE ON UPDATE CASCADE,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    order_item_subtotal NUMERIC(10, 2) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES items(item_id)
);

-- Payment table
CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    amount FLOAT NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'SGD',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50),
    stripe_payment_intent_id VARCHAR(100),
    stripe_session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PaymentItem table
CREATE TABLE payment_items (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER NOT NULL,
    product_id VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price FLOAT NOT NULL,
    total_price FLOAT NOT NULL,
    stripe_price_id VARCHAR(100),
    stripe_product_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payment(payment_id)
);

CREATE TABLE supplier_returns (
    return_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    state_of_good VARCHAR(50) NOT NULL, 
    return_status VARCHAR(20) DEFAULT 'PENDING', 
    reason TEXT NULL, 
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create index on order_id in order_item table for faster lookups
CREATE INDEX idx_order_item_order_id ON order_item(order_id);

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

-- Insert test orders
INSERT INTO orders (user_id, total_amount, status, created, modified)
VALUES 
    (1, 1150.00, 'NEW', NOW(), NOW()),
    (1, 800.00, 'PAID', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),
    (2, 300.00, 'PROCESSING', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
    (3, 500.00, 'SHIPPED', NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 days'),
    (3, 1000.00, 'DELIVERED', NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days');

-- Insert order items for each order
-- Order 1: Customer 1's new order
INSERT INTO order_item (product_id, product_name, order_id, quantity, unit_price, order_item_subtotal)
VALUES 
    (1, 'Laptop', 1, 1, 1000.00, 1000.00),
    (3, 'Headphones', 1, 1, 150.00, 150.00);

-- Order 2: Customer 1's paid order
INSERT INTO order_item (product_id, product_name, order_id, quantity, unit_price, order_item_subtotal)
VALUES 
    (2, 'Smartphone', 2, 1, 500.00, 500.00),
    (3, 'Headphones', 2, 2, 150.00, 300.00);

-- Order 3: Customer 2's processing order
INSERT INTO order_item (product_id, product_name, order_id, quantity, unit_price, order_item_subtotal)
VALUES 
    (3, 'Headphones', 2, 2, 150.00, 300.00);

-- Order 4: Customer 3's shipped order
INSERT INTO order_item (product_id, product_name, order_id, quantity, unit_price, order_item_subtotal)
VALUES 
    (2, 'Smartphone', 3, 1, 500.00, 500.00);

-- Order 5: Customer 3's delivered order
INSERT INTO "order_item" (product_id, product_name, order_id, quantity, unit_price, order_item_subtotal)
VALUES 
    (1, 'Laptop', 3, 1, 1000.00, 1000.00);

-- Payment table testing data
INSERT INTO payment (
    order_id,
    customer_id,
    amount,
    currency,
    status,
    payment_method,
    stripe_payment_intent_id,
    stripe_session_id,
    created_at,
    updated_at
) VALUES (
    12345,                                      -- Order ID
    789,                                        -- Customer ID
    99.99,                                      -- Amount
    'SGD',                                      -- Currency (Singapore Dollar)
    'completed',                                -- Status
    'card',                                     -- Payment method
    'pi_3NMqXYLkdIwFu2yK1AFBhDi0',             -- Example Stripe payment intent ID
    'cs_test_a1hBmqLchUGkj9Fqx2JDwHyZ7aLCmhBXeU02t2py1Ees8LBqaTvnJtQD', -- Example Stripe session ID
    CURRENT_TIMESTAMP - INTERVAL '2 days',      -- Created 2 days ago
    CURRENT_TIMESTAMP - INTERVAL '2 days'       -- Updated at the same time initially
);


INSERT INTO supplier_returns (order_id, item_id, user_id, state_of_good, return_status, reason, created_at, updated_at)
VALUES
    (1, 1, 2, 'new', 'PENDING', NULL, '2025-03-01 10:00:00', '2025-03-01 10:00:00'),
    (1, 2, 2, 'used', 'PENDING', NULL, '2025-03-02 12:30:00', '2025-03-02 12:30:00'),
    (1, 3, 2, 'damaged', 'REJECTED', 'Item is heavily damaged and not eligible for return.', '2025-03-03 14:00:00', '2025-03-05 09:15:00')