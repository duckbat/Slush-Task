-- Create the database
CREATE DATABASE "Slush-db";

-- Connect to the newly created database
\c "Slush-db";

-- Create the Users table
CREATE TABLE USERS (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the Posts table
CREATE TABLE POSTS (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert mock data into the Users table
INSERT INTO USERS (username, email, password) VALUES
('chicha', 'chicha@gmail.com', 'chicha'),
('test', 'test@gmail.com', 'test'),
('test', 'test@gmail.com', 'test');

-- Insert mock data into the Posts table
INSERT INTO POSTS (title, content, user_id) VALUES
('Chichan', 'I am Chichan', 1),
('Second Post', 'This is the content of the second post.', 2),
('Third Post', 'This is the content of the third post.', 3),
('Fourth Post', 'This is the content of the fourth post.', 1),
('Fifth Post', 'This is the content of the fifth post.', 2);