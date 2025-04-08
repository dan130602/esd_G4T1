-- Drop tables if they exist (to avoid errors)

DROP TABLE IF EXISTS items;

DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS orders;
 -- Drop ENUM if it exists
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS payment_items;
DROP TABLE IF EXISTS supplier_returns;


CREATE TYPE return_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');


--  Items Table
CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,          
    item_name VARCHAR(255) NOT NULL,               
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity >= 0)
);



-- 'order' table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(10) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    modified TIMESTAMP NOT NULL DEFAULT NOW()
);


-- 'order_item' table with foreign key reference to 'order'
CREATE TABLE order_item (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE ON UPDATE CASCADE,
    quantity INTEGER NOT NULL,
    item_price NUMERIC(10, 2) NOT NULL,
    order_item_subtotal NUMERIC(10, 2) NOT NULL,
    refund boolean DEFAULT false,
    FOREIGN KEY (item_id) REFERENCES items(item_id)
);

-- Payment table
CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    user_id VARCHAR(128) NOT NULL,
    amount FLOAT NOT NULL,
    refunded_amount FLOAT NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'SGD',
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed, partially_refunded, refunded
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
    item_id VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    item_price FLOAT NOT NULL,
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
    user_id VARCHAR(128) NOT NULL,
    state_of_good VARCHAR(50) NOT NULL, 
    return_status VARCHAR(20) DEFAULT 'PENDING', 
    reason TEXT NULL, 
    quantity INTEGER NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE
);

-- Users Table
CREATE TABLE users (
    user_id VARCHAR(128) PRIMARY KEY,  -- Use Firebase UID
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on order_id in order_item table for faster lookups
CREATE INDEX idx_order_item_order_id ON order_item(order_id);



--  Insert Items
INSERT INTO items (item_name, price, quantity) VALUES
('Laptop', 1000.00, 5),
('Smartphone', 500.00, 10),
('Headphones', 150.00, 20);



-- Insert test orders
INSERT INTO orders (user_id, total_amount, status, created, modified)
VALUES 
    ('2SLYV14RkmUrdRvP4JQR0vED3N12', 1150.00, 'NEW', NOW(), NOW()),
    ('2SLYV14RkmUrdRvP4JQR0vED3N12', 800.00, 'PAID', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),
    ('na63gIAVdkgCb9oDL7nim0UkfhO2', 300.00, 'PROCESSING', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
    ('vn4sFpclG1Y6mu3OgSVamSPCZ7e2', 500.00, 'SHIPPED', NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 days'),
    ('vn4sFpclG1Y6mu3OgSVamSPCZ7e2', 1000.00, 'DELIVERED', NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days');

-- Insert order items for each order
-- Order 1: Customer 1's new order
INSERT INTO order_item (item_id, item_name, order_id, quantity, item_price, order_item_subtotal, refund)
VALUES 
    (1, 'Laptop', 1, 1, 1000.00, 1000.00, false),
    (3, 'Headphones', 1, 1, 150.00, 150.00, false);

-- Order 2: Customer 1's paid order
INSERT INTO order_item (item_id, item_name, order_id, quantity, item_price, order_item_subtotal, refund)
VALUES 
    (2, 'Smartphone', 2, 1, 500.00, 500.00, false),
    (3, 'Headphones', 2, 2, 150.00, 300.00, false);

-- -- Order 3: Customer 2's processing order
-- INSERT INTO order_item (item_id, item_name, order_id, quantity, item_price, order_item_subtotal)
-- VALUES 
--     (3, 'Headphones', 2, 2, 150.00, 300.00);

-- Order 4: Customer 3's shipped order
INSERT INTO order_item (item_id, item_name, order_id, quantity, item_price, order_item_subtotal, refund)
VALUES 
    (2, 'Smartphone', 3, 1, 500.00, 500.00, false);

-- Order 5: Customer 3's delivered order
INSERT INTO order_item (item_id, item_name, order_id, quantity, item_price, order_item_subtotal, refund)
VALUES 
    (1, 'Laptop', 3, 1, 1000.00, 1000.00, false);

-- order 5: 
INSERT INTO order_item (item_id, item_name, order_id, quantity, item_price, order_item_subtotal, refund)
VALUES 
    (1, 'Laptop', 5, 2, 1000.00, 1000.00, false);

INSERT INTO order_item (item_id, item_name, order_id, quantity, item_price, order_item_subtotal, refund)
VALUES 
    (2, 'Smartphone', 4, 1, 500.00, 500.00, false);


-- Payment table testing data
INSERT INTO payment (
    order_id,
    user_id,
    amount,
    refunded_amount,
    currency,
    status,
    payment_method,
    stripe_payment_intent_id,
    stripe_session_id,
    created_at,
    updated_at
) VALUES (
    12345,                                      -- Order ID
    'vn4sFpclG1Y6mu3OgSVamSPCZ7e2',             -- Customer ID
    20.00,                                      -- Amount
    0.00,
    'SGD',                                      -- Currency (Singapore Dollar)
    'completed',                                -- Status
    'card',                                     -- Payment method
    'pi_3R8GaPRv5FH5Wskn0R3YD9jb',             -- Example Stripe payment intent ID
    'cs_test_a1hBmqLchUGkj9Fqx2JDwHyZ7aLCmhBXeU02t2py1Ees8LBqaTvnJtQD', -- Example Stripe session ID
    CURRENT_TIMESTAMP - INTERVAL '2 days',      -- Created 2 days ago
    CURRENT_TIMESTAMP - INTERVAL '2 days'       -- Updated at the same time initially
);


INSERT INTO supplier_returns (order_id, item_id, user_id, state_of_good, return_status, reason, quantity, created_at, updated_at)
VALUES
    (1, 1, 'na63gIAVdkgCb9oDL7nim0UkfhO2', 'new', 'PENDING', NULL, 1, '2025-03-01 10:00:00', '2025-03-01 10:00:00'),
    (1, 2, 'na63gIAVdkgCb9oDL7nim0UkfhO2', 'used', 'PENDING', NULL, 2, '2025-03-02 12:30:00', '2025-03-02 12:30:00'),
    (1, 3, 'na63gIAVdkgCb9oDL7nim0UkfhO2', 'damaged', 'REJECTED', 'Item is heavily damaged and not eligible for return.', 1, '2025-03-03 14:00:00', '2025-03-05 09:15:00');