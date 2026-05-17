const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// POST questions/:id/answers
router.post('/:id/answers', auth, checkRole('teacher'), (req, res) => {

    const question_id = req.params.id;
    const teacher_id = req.user.id;
    const { text, is_correct } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({
            error: 'Answer text is required'
        });
    }

    if (typeof is_correct !== 'boolean') {
        return res.status(400).json({
            error: 'is_correct must be boolean'
        });
    }

    const questionQuery = `
        SELECT
            q.id,
            q.type,
            t.author_id,
            t.is_published
        FROM questions q
        JOIN tests t ON q.test_id = t.id
        WHERE q.id = ?
    `;

    db.query(questionQuery, [question_id], (err, questionResult) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: 'Internal server error'
            });
        }

        if (questionResult.length === 0) {
            return res.status(404).json({
                error: 'Question not found'
            });
        }

        const question = questionResult[0];

        if (question.author_id !== teacher_id) {
            return res.status(403).json({
                error: 'Access denied'
            });
        }

        if (question.is_published) {
            return res.status(400).json({
                error: 'Cannot modify published test'
            });
        }

        if (question.type === 'single' && is_correct) {

            const correctQuery = `
                SELECT id
                FROM answers
                WHERE question_id = ?
                AND is_correct = true
            `;

            return db.query(correctQuery, [question_id], (err, correctResult) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        error: 'Internal server error'
                    });
                }

                if (correctResult.length > 0) {
                    return res.status(400).json({
                        error: 'Single choice question can have only one correct answer'
                    });
                }

                insertAnswer();
            });
        }

        if (question.type === 'text') {

            if (!is_correct) {
                return res.status(400).json({
                    error: 'Text question answer must be correct'
                });
            }

            const textQuery = `
                SELECT id
                FROM answers
                WHERE question_id = ?
            `;

            return db.query(textQuery, [question_id], (err, textResult) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        error: 'Internal server error'
                    });
                }

                if (textResult.length > 0) {
                    return res.status(400).json({
                        error: 'Text question can have only one answer'
                    });
                }

                insertAnswer();
            });
        }

        insertAnswer();

        function insertAnswer() {

            const duplicateAnswerQuery = `
                SELECT id
                FROM answers
                WHERE question_id = ?
                AND text = ?
            `;

            db.query(
                duplicateAnswerQuery,
                [question_id, text.trim()],
                (err, duplicateResult) => {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            error: 'Internal server error'
                        });
                    }

                    if (duplicateResult.length > 0) {
                        return res.status(400).json({
                            error: 'Answer already exists for this question'
                        });
                    }

                    const insertQuery = `
                        INSERT INTO answers (
                            question_id,
                            text,
                            is_correct
                        )
                        VALUES (?, ?, ?)
                    `;

                    db.query(
                        insertQuery,
                        [question_id, text.trim(), is_correct],
                        (err, result) => {

                            if (err) {
                                console.error(err);

                                return res.status(500).json({
                                    error: 'Internal server error'
                                });
                            }

                            res.status(201).json({
                                message: 'Answer created',
                                answer_id: result.insertId
                            });
                        }
                    );
                }
            );
        }
    });
});

// PATCH /questions/:id
router.patch('/:id', auth, checkRole('teacher'), (req, res) => {

    const question_id = req.params.id;

    const teacher_id = req.user.id;

    const { text } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({
            error: 'Question text is required'
        });
    }

    const questionQuery = `
        SELECT
            q.id,
            q.test_id,
            t.author_id,
            t.is_published
        FROM questions q
        JOIN tests t ON q.test_id = t.id
        WHERE q.id = ?
    `;

    db.query(questionQuery, [question_id], (err, questionResult) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: 'Internal server error'
            });
        }

        if (questionResult.length === 0) {
            return res.status(404).json({
                error: 'Question not found'
            });
        }

        const question = questionResult[0];

        if (question.author_id !== teacher_id) {
            return res.status(403).json({
                error: 'Access denied'
            });
        }

        const activeAttemptQuery = `
            SELECT id
            FROM attempts
            WHERE test_id = ?
            AND finished_at IS NULL
        `;

        db.query(
            activeAttemptQuery,
            [question.test_id],
            (err, attemptResult) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        error: 'Internal server error'
                    });
                }

                if (attemptResult.length > 0) {
                    return res.status(400).json({
                        error: 'Cannot modify question while test attempt is active'
                    });
                }

                const duplicateQuery = `
                    SELECT id
                    FROM questions
                    WHERE test_id = ?
                    AND text = ?
                    AND id != ?
                `;

                db.query(
                    duplicateQuery,
                    [question.test_id, text.trim(), question_id],
                    (err, duplicateResult) => {

                        if (err) {
                            console.error(err);

                            return res.status(500).json({
                                error: 'Internal server error'
                            });
                        }

                        if (duplicateResult.length > 0) {
                            return res.status(400).json({
                                error: 'Question already exists'
                            });
                        }

                        updateQuestion();
                    }
                );
            }
        );

        function updateQuestion() {

            const updateQuery = `
                UPDATE questions
                SET text = ?
                WHERE id = ?
            `;

            db.query(
                updateQuery,
                [text.trim(), question_id],
                (err) => {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            error: 'Internal server error'
                        });
                    }

                    res.json({
                        message: 'Question updated'
                    });
                }
            );
        }
    });
});

// DELETE /questions/:id
router.delete('/:id', auth, checkRole('teacher'), (req, res) => {

    const question_id = req.params.id;

    const teacher_id = req.user.id;

    const questionQuery = `
        SELECT
            q.id,
            q.test_id,
            t.author_id,
            t.is_published
        FROM questions q
        JOIN tests t ON q.test_id = t.id
        WHERE q.id = ?
    `;

    db.query(questionQuery, [question_id], (err, questionResult) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: 'Internal server error'
            });
        }

        if (questionResult.length === 0) {
            return res.status(404).json({
                error: 'Question not found'
            });
        }

        const question = questionResult[0];

        if (question.author_id !== teacher_id) {
            return res.status(403).json({
                error: 'Access denied'
            });
        }

        if (question.is_published) {
            return res.status(400).json({
                error: 'Published test cannot be edited'
            });
        }

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM questions
            WHERE test_id = ?
        `;

        db.query(countQuery, [question.test_id], (err, countResult) => {

            if (err) {
                console.error(err);
        
                return res.status(500).json({
                    error: 'Internal server error'
                });
            }
        
            if (countResult[0].total <= 1) {
                return res.status(400).json({
                    error: 'Cannot delete the last question from the test. Delete the whole test instead.'
                });
            }
        
            const deleteAnswersQuery = `
                DELETE FROM answers
                WHERE question_id = ?
            `;

            db.query(deleteAnswersQuery, [question_id], (err) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        error: 'Internal server error'
                    });
                }

                const deleteQuestionQuery = `
                    DELETE FROM questions
                    WHERE id = ?
                `;

                db.query(deleteQuestionQuery, [question_id], (err) => {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            error: 'Internal server error'
                        });
                    }

                    res.json({
                        message: 'Question deleted'
                    });
                });
            });
        });
    });
});

// DELETE /questions/answers/:id
router.delete(
    '/answers/:id',
    auth,
    checkRole('teacher'),
    (req, res) => {

        const answer_id =
            req.params.id;

        const teacher_id =
            req.user.id;

        const answerQuery = `
            SELECT
                a.id,
                q.id AS question_id,
                t.author_id,
                t.is_published
            FROM answers a
            JOIN questions q
                ON a.question_id = q.id
            JOIN tests t
                ON q.test_id = t.id
            WHERE a.id = ?
        `;

        db.query(
            answerQuery,
            [answer_id],
            (err, answerResult) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        error:
                            'Internal server error'
                    });
                }

                if (
                    answerResult.length === 0
                ) {
                    return res.status(404).json({
                        error:
                            'Answer not found'
                    });
                }

                const answer =
                    answerResult[0];

                if (
                    answer.author_id !==
                    teacher_id
                ) {
                    return res.status(403).json({
                        error:
                            'Access denied'
                    });
                }

                if (
                    answer.is_published
                ) {
                    return res.status(400).json({
                        error:
                            'Published test cannot be edited'
                    });
                }

                const deleteQuery = `
                    DELETE FROM answers
                    WHERE id = ?
                `;

                db.query(
                    deleteQuery,
                    [answer_id],
                    (err) => {

                        if (err) {
                            console.error(err);

                            return res.status(500).json({
                                error:
                                    'Internal server error'
                            });
                        }

                        res.json({
                            message:
                                'Answer deleted'
                        });
                    }
                );
            }
        );
    }
);

module.exports = router;