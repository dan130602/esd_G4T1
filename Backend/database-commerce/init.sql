-- Drop tables if they exist (to avoid errors)
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS "order_item";
DROP TABLE IF EXISTS "order";
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

-- 'order' table
CREATE TABLE "order" (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(10) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    modified TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 'order_item' table with foreign key reference to 'order'
CREATE TABLE "order_item" (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    order_id INTEGER NOT NULL REFERENCES "order"("order_id") ON DELETE CASCADE ON UPDATE CASCADE,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    order_item_subtotal NUMERIC(10, 2) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES items(item_id)
);

-- Create index on order_id in order_item table for faster lookups
CREATE INDEX idx_order_item_order_id ON "order_item"("order_id");

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
INSERT INTO "order" (customer_id, total_amount, status, created, modified)
VALUES 
    (1, 1150.00, 'NEW', NOW(), NOW()),
    (1, 800.00, 'PAID', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),
    (2, 300.00, 'PROCESSING', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
    (3, 500.00, 'SHIPPED', NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 days'),
    (3, 1000.00, 'DELIVERED', NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days');

-- Insert order items for each order
-- Order 1: Customer 1's new order
INSERT INTO "order_item" (product_id, product_name, order_id, quantity, unit_price, order_item_subtotal)
VALUES 
    (1, 'Laptop', 1, 1, 1000.00, 1000.00),
    (3, 'Headphones', 1, 1, 150.00, 150.00);

-- Order 2: Customer 1's paid order
INSERT INTO "order_item" (product_id, product_name, order_id, quantity, unit_price, order_item_subtotal)
VALUES 
    (2, 'Smartphone', 2, 1, 500.00, 500.00),
    (3, 'Headphones', 2, 2, 150.00, 300.00);

-- Order 3: Customer 2's processing order
INSERT INTO "order_item" (product_id, product_name, order_id, quantity, unit_price, order_item_subtotal)
VALUES 
    (3, 'Headphones', 2, 2, 150.00, 300.00);

-- Order 4: Customer 3's shipped order
INSERT INTO "order_item" (product_id, product_name, order_id, quantity, unit_price, order_item_subtotal)
VALUES 
    (2, 'Smartphone', 3, 1, 500.00, 500.00);

-- Order 5: Customer 3's delivered order
INSERT INTO "order_item" (product_id, product_name, order_id, quantity, unit_price, order_item_subtotal)
VALUES 
    (1, 'Laptop', 3, 1, 1000.00, 1000.00);