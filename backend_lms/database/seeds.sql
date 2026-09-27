-- Seed data for testing and development
USE mysql_db;

-- 1. Insert Initial Users
-- Password for all is '123456' hashed with bcrypt: $2b$10$epRz0H3qLzG8O/E/d4eZgehR0h5u5mD2aP/x6p1z9z0yV3u5gH2S6
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'Admin User', 'admin@library.com', '$2b$10$epRz0H3qLzG8O/E/d4eZgehR0h5u5mD2aP/x6p1z9z0yV3u5gH2S6', 'admin'),
(2, 'Jane Reader', 'jane@example.com', '$2b$10$epRz0H3qLzG8O/E/d4eZgehR0h5u5mD2aP/x6p1z9z0yV3u5gH2S6', 'user')
ON DUPLICATE KEY UPDATE id=id;

-- 2. Insert Initial Books
INSERT INTO books (id, name, author, isbn, quantity, available, image, added_by, genre, summary, price) VALUES
(1, 'Clean Code', 'Robert C. Martin', '978-0132350884', 5, 5, NULL, 1, 'Software Engineering', 'A Handbook of Agile Software Craftsmanship', 35.00),
(2, 'The Pragmatic Programmer', 'Andrew Hunt, David Thomas', '978-0201616224', 3, 3, NULL, 1, 'Computer Science', 'Your Journey to Mastery', 42.50),
(3, 'Designing Data-Intensive Applications', 'Martin Kleppmann', '978-1449373320', 2, 2, NULL, 1, 'Distributed Systems', 'The Big Ideas Behind Reliable, Scalable, and Maintainable Systems', 45.00),
(4, 'Introduction to Algorithms', 'Thomas H. Cormen', '978-0262033848', 4, 4, NULL, 1, 'Algorithms', 'Comprehensive textbook on modern computer algorithms', 60.00)
ON DUPLICATE KEY UPDATE id=id;
