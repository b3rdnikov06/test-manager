DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS user_answers;
DROP TABLE IF EXISTS attempts;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS tests;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher') NOT NULL,
    ALTER TABLE users ADD token_version INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    author_id INT NOT NULL,
    time_limit INT NOT NULL CHECK (time_limit BETWEEN 10 AND 60),
    attempts_limit INT NOT NULL DEFAULT 1 CHECK (attempts_limit > 0),
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT NOT NULL,
    text TEXT NOT NULL,
    type ENUM('single', 'multiple', 'text') NOT NULL,
    order_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	
    FOREIGN KEY (test_id) REFERENCES tests(id),
    
    UNIQUE (test_id, order_index)
);

CREATE TABLE answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    text VARCHAR(255) NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (question_id) REFERENCES questions(id),
    
    UNIQUE (question_id, text)
);

CREATE TABLE attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    test_id INT NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (test_id) REFERENCES tests(id)
);

CREATE TABLE user_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attempt_id INT NOT NULL,
    question_id INT NOT NULL,
    answer_id INT NULL,
    text_answer TEXT NULL,

    FOREIGN KEY (attempt_id) REFERENCES attempts(id),
    FOREIGN KEY (question_id) REFERENCES questions(id),
    FOREIGN KEY (answer_id) REFERENCES answers(id),
    
    UNIQUE (attempt_id, question_id, answer_id)
);

CREATE TABLE results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attempt_id INT NOT NULL UNIQUE,
    score INT NOT NULL,
    max_score INT NOT NULL,

    FOREIGN KEY (attempt_id) REFERENCES attempts(id)
);

