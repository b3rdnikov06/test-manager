INSERT INTO users (email, password_hash, role)
VALUES
('student1@test.com', 'hashhash1', 'student'),
('student2@test.com', 'hashhash2', 'student'),
('teacher1@test.com', 'hashhash3', 'teacher');

INSERT INTO tests (title, description, author_id, time_limit, attempts_limit, is_published)
VALUES
('Java Basics', 'Test for Java knowledge', 3, 30, 1, TRUE);

INSERT INTO questions (test_id, text, type, order_index)
VALUES
(1, 'What is Java?', 'single', 1),
(1, 'Select OOP principles', 'multiple', 2),
(1, 'Write main method signature', 'text', 3);

INSERT INTO answers (question_id, text, is_correct)
VALUES
(1, 'Programming language', TRUE),
(1, 'Database', FALSE),
(2, 'Encapsulation', TRUE),
(2, 'Inheritance', TRUE),
(2, 'HTML', FALSE),
(3, 'public static void main(String[] args)', TRUE);

INSERT INTO attempts (user_id, test_id)
VALUES
(1, 1);

INSERT INTO user_answers (attempt_id, question_id, answer_id, text_answer)
VALUES
(1, 1, 1, NULL),
(1, 2, 3, NULL),
(1, 2, 4, NULL),
(1, 3, NULL, 'public static void main(String[] args)');

INSERT INTO results (attempt_id, score, max_score)
VALUES
(1, 3, 3);

SELECT q.text, a.text, ua.text_answer
FROM user_answers ua
JOIN questions q ON ua.question_id = q.id
LEFT JOIN answers a ON ua.answer_id = a.id
WHERE ua.attempt_id = 1;