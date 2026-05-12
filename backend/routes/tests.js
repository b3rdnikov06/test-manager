const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// GET /tests
router.get('/', auth, (req, res) => {
    db.query('SELECT * FROM tests WHERE is_published = true', (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                error: 'Internal server error'
            });
        }

        res.json(results);
    });
});

// POST /tests
router.post('/', auth, checkRole('teacher'), (req, res) => {

    const { title, description, time_limit } = req.body;
    const author_id = req.user.id;

    const safeTitle = title?.trim();
    const safeDescription = description?.trim() || null;

    if (!title || title.trim() === '') {
        return res.status(400).json({
            error: 'Title is required'
        });
    }

    if (!time_limit) {
        return res.status(400).json({
            error: 'time_limit is required'
        });
    }

    if (time_limit < 5 || time_limit > 30) {
        return res.status(400).json({
            error: 'The test should take between 5 and 30 minutes to complete.'
        });
    }

    const checkTitleQuery = `
        SELECT id
        FROM tests
        WHERE title = ?
    `;

    db.query(checkTitleQuery, [title.trim()], (err, titleResult) => {

        if (err) {
            console.error(err);
    
            return res.status(500).json({
                error: 'Internal server error'
            });
        }
    
        if (titleResult.length > 0) {
            return res.status(400).json({
                error: 'Test with this title already exists'
            });
        }


        const query = `
            INSERT INTO tests (
            title,
            description,
            author_id,
            time_limit
            )
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            query,
            [safeTitle, safeDescription, author_id, time_limit],
            (err, result) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        error: 'Internal server error'
                    });
                }

                res.status(201).json({
                    message: 'Test created',
                    test_id: result.insertId
                });
            });
        }
    );
});

// POST /tests/:id/questions
router.post('/:id/questions', auth, checkRole('teacher'), (req, res) => {

    const test_id = req.params.id;
    const author_id = req.user.id;
    const { text, type } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({
            error: 'Question text is required'
        });
    }

    const allowedTypes = ['single', 'multiple', 'text'];

    if (!allowedTypes.includes(type)) {
        return res.status(400).json({
            error: 'Invalid question type'
        });
    }

    const testQuery = `
        SELECT 
            id,
            is_published
        FROM tests
        WHERE id = ? AND author_id = ?
    `;

    db.query(testQuery, [test_id, author_id], (err, testResult) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: 'Internal server error'
            });
        }

        if (testResult.length === 0) {
            return res.status(403).json({
                error: 'Test not found or access denied'
            });
        }

        const test = testResult[0];

        if (test.is_published) {
            return res.status(400).json({
                error: 'Cannot modify published test'
            });
        }

        const duplicateQuestionQuery = `
            SELECT id
            FROM questions
            WHERE test_id = ?
            AND text = ?
        `;

        db.query(
            duplicateQuestionQuery,
            [test_id, text.trim()],
            (err, duplicateResult) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: 'Internal server error'
                });
            }

            if (duplicateResult.length > 0) {
                return res.status(400).json({
                    error: 'Question already exists in this test'
                });
            }

            const orderQuery = `
                SELECT
                    COALESCE(MAX(order_index), 0) + 1
                    AS next_order
                FROM questions
                WHERE test_id = ?
            `;

            db.query(orderQuery, [test_id], (err, orderResult) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        error: 'Internal server error'
                    });
                }

                const order_index = orderResult[0].next_order;

                const insertQuery = `
                    INSERT INTO questions (
                        test_id,
                        text,
                        type,
                        order_index
                    )
                    VALUES (?, ?, ?, ?)
                `;

                db.query(
                    insertQuery,[test_id, text.trim(), type, order_index], (err, result) => {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            error: 'Internal server error'
                        });
                    }

                    res.status(201).json({
                        message: 'Question created',
                        question_id: result.insertId,
                        order_index
                    });
                });
            });
        });
    });
});

// PATCH /tests/:id/publish
router.patch('/:id/publish', auth, checkRole('teacher'), (req, res) => {

    const test_id = req.params.id;

    const teacher_id = req.user.id;

    const testQuery = `
        SELECT id, is_published
        FROM tests
        WHERE id = ?
        AND author_id = ?
    `;

    db.query(testQuery, [test_id, teacher_id], (err, testResult) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: 'Internal server error'
            });
        }

        if (testResult.length === 0) {
            return res.status(404).json({
                error: 'Test not found'
            });
        }

        const test = testResult[0];

        if (test.is_published) {
            return res.status(400).json({
                error: 'Test already published'
            });
        }

        const questionsQuery = `
            SELECT id, type
            FROM questions
            WHERE test_id = ?
        `;

        db.query(questionsQuery, [test_id], (err, questionsResult) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: 'Internal server error'
                });
            }

            if (questionsResult.length === 0) {
                return res.status(400).json({
                    error: 'Test must contain at least one question'
                });
            }

            validateQuestions(questionsResult);
        });
    });

    function validateQuestions(questions) {

        let hasError = false;

        let checkedQuestions = 0;

        for (const question of questions) {

            const answersQuery = `
                SELECT id, is_correct
                FROM answers
                WHERE question_id = ?
            `;

            db.query(answersQuery, [question.id], (err, answersResult) => {

                if (hasError) {
                    return;
                }

                if (err) {

                    hasError = true;

                    console.error(err);

                    return res.status(500).json({
                        error: 'Internal server error'
                    });
                }

                if (question.type === 'single') {

                    const correctAnswers =
                        answersResult.filter(a => a.is_correct);

                    if (correctAnswers.length !== 1) {

                        hasError = true;

                        return res.status(400).json({
                            error:
                                `Single question ${question.id} must have exactly one correct answer`
                        });
                    }
                }

                if (question.type === 'multiple') {

                    const correctAnswers =
                        answersResult.filter(a => a.is_correct);

                    if (correctAnswers.length < 1) {

                        hasError = true;

                        return res.status(400).json({
                            error:
                                `Multiple question ${question.id} must have at least one correct answer`
                        });
                    }
                }

                if (question.type === 'text') {

                    if (answersResult.length !== 1) {

                        hasError = true;

                        return res.status(400).json({
                            error:
                                `Text question ${question.id} must have exactly one answer`
                        });
                    }

                    if (!answersResult[0].is_correct) {

                        hasError = true;

                        return res.status(400).json({
                            error:
                                `Text question ${question.id} answer must be correct`
                        });
                    }
                }

                checkedQuestions++;

                if (
                    !hasError &&
                    checkedQuestions === questions.length
                ) {
                    publishTest();
                }
            });
        }
    }

    function publishTest() {

        const publishQuery = `
            UPDATE tests
            SET is_published = true
            WHERE id = ?
        `;

        db.query(publishQuery, [test_id], (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: 'Internal server error'
                });
            }

            res.json({
                message: 'Test published successfully'
            });
        });
    }
});

// GET tests/teacher
router.get('/teacher', auth, checkRole('teacher'), (req, res) => {

    const teacher_id = req.user.id;

    const query = `
        SELECT
            id,
            title,
            description,
            time_limit,
            attempts_limit,
            is_published,
            created_at
        FROM tests
        WHERE author_id = ?
        ORDER BY created_at DESC
    `;

    db.query(query, [teacher_id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: 'Internal server error'
            });
        }

        res.json(results);
    });
});

// GET /tests/:id/full
router.get('/:id/full', auth, checkRole('teacher'), (req, res) => {
    const test_id = req.params.id;

    const checkQuery = `
        SELECT id
        FROM tests
        WHERE id = ?
    `;

    db.query(checkQuery, [test_id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: 'Internal server error'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                error: 'Test not found'
            });
        }

        const query = `
            SELECT 
                q.id AS question_id,
                q.text AS question_text,
                q.type,
                a.id AS answer_id,
                a.text AS answer_text,
                a.is_correct
            FROM questions q
            LEFT OUTER JOIN answers a ON q.id = a.question_id
            WHERE q.test_id = ?
            ORDER BY q.order_index
        `;

        db.query(query, [test_id], (err, results) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: 'Internal server error'
                });
            }

            const questionsMap = {};

            results.forEach(row => {
                if (!questionsMap[row.question_id]) {
                    questionsMap[row.question_id] = {
                        id: row.question_id,
                        text: row.question_text,
                        type: row.type,
                        answers: []
                    };
                }

                if (row.answer_id) {
                    questionsMap[row.question_id].answers.push({
                        id: row.answer_id,
                        text: row.answer_text,
                        is_correct: row.is_correct
                    });
                }
            });

            const formatted = Object.values(questionsMap);

            res.json(formatted);
        });
    });
});

// PATCH /tests/:id
router.patch('/:id', auth, checkRole('teacher'), (req, res) => {

    const test_id = req.params.id;

    const teacher_id = req.user.id;

    const {
        title,
        description,
        time_limit
    } = req.body;

    const safeTitle = title?.trim();

    const safeDescription =
        description?.trim() || null;

    if (!safeTitle) {
        return res.status(400).json({
            error: 'Title is required'
        });
    }

    if (!time_limit) {
        return res.status(400).json({
            error: 'time_limit is required'
        });
    }

    if (time_limit < 5 || time_limit > 30) {
        return res.status(400).json({
            error: 'The test should take between 5 and 30 minutes to complete'
        });
    }

    const testQuery = `
        SELECT id
        FROM tests
        WHERE id = ?
        AND author_id = ?
    `;

    db.query(testQuery, [test_id, teacher_id], (err, testResult) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: 'Internal server error'
            });
        }

        if (testResult.length === 0) {
            return res.status(404).json({
                error: 'Test not found'
            });
        }

        const attemptsQuery = `
            SELECT id
            FROM attempts
            WHERE test_id = ?
            AND finished_at IS NULL
        `;

        db.query(attemptsQuery, [test_id], (err, attemptsResult) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: 'Internal server error'
                });
            }

            if (attemptsResult.length > 0) {
                return res.status(400).json({
                    error: 'Test with active attempts cannot be edited'
                });
            }

            const duplicateTitleQuery = `
                SELECT id
                FROM tests
                WHERE title = ?
                AND id != ?
            `;

            db.query(
                duplicateTitleQuery,
                [safeTitle, test_id],
                (err, duplicateResult) => {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            error: 'Internal server error'
                        });
                    }

                    if (duplicateResult.length > 0) {
                        return res.status(400).json({
                            error: 'Test with this title already exists'
                        });
                    }

                    const updateQuery = `
                        UPDATE tests
                        SET
                            title = ?,
                            description = ?,
                            time_limit = ?
                        WHERE id = ?
                    `;

                    db.query(
                        updateQuery,
                        [
                            safeTitle,
                            safeDescription,
                            time_limit,
                            test_id
                        ],
                        (err) => {

                            if (err) {
                                console.error(err);

                                return res.status(500).json({
                                    error: 'Internal server error'
                                });
                            }

                            res.json({
                                message: 'Test updated'
                            });
                        }
                    );
                }
            );
        });
    });
});

// DELETE /tests/:id
router.delete('/:id', auth, checkRole('teacher'), (req, res) => {

    const test_id = req.params.id;

    const teacher_id = req.user.id;

    const testQuery = `
        SELECT
            id,
            is_published
        FROM tests
        WHERE id = ?
        AND author_id = ?
    `;

    db.query(testQuery, [test_id, teacher_id], (err, testResult) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: 'Internal server error'
            });
        }

        if (testResult.length === 0) {
            return res.status(404).json({
                error: 'Test not found'
            });
        }

        const test = testResult[0];

        const attemptsQuery = `
            SELECT id
            FROM attempts
            WHERE test_id = ?
        `;

        db.query(attemptsQuery, [test_id], (err, attemptsResult) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: 'Internal server error'
                });
            }

            if (attemptsResult.length > 0) {
                return res.status(400).json({
                    error: 'Test with attempts cannot be deleted'
                });
            }

            deleteTest();
        });
    });

    function deleteTest() {

        const getQuestionsQuery = `
            SELECT id
            FROM questions
            WHERE test_id = ?
        `;

        db.query(getQuestionsQuery, [test_id], (err, questionsResult) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: 'Internal server error'
                });
            }

            const questionIds =
                questionsResult.map(q => q.id);

            if (questionIds.length === 0) {
                return deleteOnlyTest();
            }

            const deleteAnswersQuery = `
                DELETE FROM answers
                WHERE question_id IN (?)
            `;

            db.query(deleteAnswersQuery, [questionIds], (err) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        error: 'Internal server error'
                    });
                }

                const deleteQuestionsQuery = `
                    DELETE FROM questions
                    WHERE test_id = ?
                `;

                db.query(deleteQuestionsQuery, [test_id], (err) => {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            error: 'Internal server error'
                        });
                    }

                    deleteOnlyTest();
                });
            });
        });
    }

    function deleteOnlyTest() {

        const deleteTestQuery = `
            DELETE FROM tests
            WHERE id = ?
        `;

        db.query(deleteTestQuery, [test_id], (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: 'Internal server error'
                });
            }

            res.json({
                message: 'Test deleted'
            });
        });
    }
});

module.exports = router;