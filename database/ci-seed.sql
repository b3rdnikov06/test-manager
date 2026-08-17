INSERT INTO users
    (id, first_name, last_name, email, password_hash, role)
VALUES
    (1, 'Test', 'Test',
     'testtest@mail.ru',
     '$2b$10$cP7b30JHuad141LQ5NYdH.ng9f40KLxBee8/OKMwRcjdsPqO4hriO',
     'teacher');

INSERT INTO tests
    (id, title, description, author_id, time_limit, attempts_limit, is_published)
VALUES
    (1, 'Test Results', 'Test Results', 1, 5, 1, TRUE),
    (10, 'Первый', 'Первый', 1, 5, 1, TRUE);

INSERT INTO questions
    (id, test_id, text, type, order_index)
VALUES
    (16, 10, 'Сколько ног', 'single', 1),
    (17, 10, 'Сколько рук', 'single', 2),
    (18, 10, 'Сколько глаз', 'single', 3),
    (19, 10, 'Сколько ушей', 'single', 4),
    (20, 10, 'Сколько языков', 'single', 5);

INSERT INTO answers
    (id, question_id, text, is_correct)
VALUES
    (31, 16, 'Две', TRUE),
    (32, 16, 'Одна', FALSE),

    (33, 17, 'Две', TRUE),
    (34, 17, 'Одна', FALSE),

    (35, 18, 'Два', TRUE),
    (36, 18, 'Один', FALSE),

    (37, 19, 'Два', TRUE),
    (38, 19, 'Одно', FALSE),

    (39, 20, 'Два', FALSE),
    (40, 20, 'Один', TRUE);

ALTER TABLE users AUTO_INCREMENT = 2;
ALTER TABLE tests AUTO_INCREMENT = 11;
ALTER TABLE questions AUTO_INCREMENT = 21;
ALTER TABLE answers AUTO_INCREMENT = 41;