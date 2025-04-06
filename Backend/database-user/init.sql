DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id VARCHAR(128) PRIMARY KEY,          
    email VARCHAR(255) UNIQUE NOT NULL,  
    full_name VARCHAR(255) NOT NULL,     
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--  Insert Users
INSERT INTO users (user_id, email, full_name) VALUES
('2SLYV14RkmUrdRvP4JQR0vED3N12','john@example.com', 'John Doe')
