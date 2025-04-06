DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id VARCHAR(128) PRIMARY KEY,          
    email VARCHAR(255) UNIQUE NOT NULL,  
    full_name VARCHAR(255) NOT NULL,     
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--  Insert Users
INSERT INTO users (user_id, email, full_name) VALUES
('2SLYV14RkmUrdRvP4JQR0vED3N12','john@example.com', 'John Doe'),
('na63gIAVdkgCb9oDL7nim0UkfhO2','danielleong04@gmail.com', 'bob'),
('vn4sFpclG1Y6mu3OgSVamSPCZ7e2','danielleong05@gmail.com', 'bob')

