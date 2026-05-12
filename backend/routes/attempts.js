const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const checkAttempt = require('../middleware/checkAttempt');
const checkAttemptNotFinished = require('../middleware/checkAttemptNotFinished');

// GET /attempts/:id
router.get('/:id', auth, checkAttempt, checkAttemptNotFinished, (req, res) => {

    const attempt_id = req.params.id;

    const test_id = req.attempt.test_id;

    const testQuery = `
        SELECT
            id,
            title,
            description,
            time_limit
        FROM tests
        WHERE id = ?
    `;

    db.query(testQuery, [test_id], (err, testResult) => {

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

        const questionsQuery = `
            SELECT
                q.id AS question_id,
                q.text AS question_text,
                q.type,
                q.order_index,
                a.id AS answer_id,
                a.text AS answer_text
            FROM questions q
            LEFT JOIN answers a
                ON q.id = a.question_id
            WHERE q.test_id = ?
            ORDER BY q.order_index
        `;

        db.query(questionsQuery, [test_id], (err, results) => {

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
                        order_index: row.order_index,
                        answers: []
                    };
                }

                if (row.type !== 'text' && row.answer_id) {

                    questionsMap[row.question_id].answers.push({
                        id: row.answer_id,
                        text: row.answer_text
                    });
                }
            });

            const questions =
                Object.values(questionsMap);

            res.json({
                attempt_id,
                test: {
                    id: test.id,
                    title: test.title,
                    description: test.description,
                    time_limit: test.time_limit
                },
                questions
            });
        });
    });
});

// POST /attempts/start
router.post('/start', auth, (req, res) => {
    const user_id = req.user.id;
    const { test_id } = req.body;

    const testQuery = `
        SELECT id
        FROM tests
        WHERE id = ?
        AND is_published = true
    `;

    db.query(testQuery, [test_id], (err, publResult) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: 'Internal server error'
            });
        }

        if (publResult.length === 0) {
            return res.status(404).json({
                error: 'Test not found or not published'
            });
        }
    
        const checkQuery = `
            SELECT id
            FROM attempts
            WHERE user_id = ?
            AND test_id = ?
        `;

        db.query(checkQuery, [user_id, test_id], (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: 'Internal server error'
                });
            }
            
            if (result.length > 0) {
                return res.status(400).json({
                    error: 'You already started this test'
                });
            }

            const query = `
            INSERT INTO attempts (user_id, test_id, started_at)
            VALUES (?, ?, NOW())
            `;

            db.query(query, [user_id, test_id], (err, result) => {
                if(err) {
                    return res.status(500).json({ error: err })
                }

                res.json({
                    message: 'Attempt started',
                    attempt_id: result.insertId
                });
            });
        });
    });
});

// POST /attempts/:id/answer
router.post('/:id/answer', auth, checkAttempt, checkAttemptNotFinished, (req, res) => {
    const attempt_id = req.params.id;
    const { question_id, answer_id, text_answer } = req.body;
    const test_id = req.attempt.test_id;

    const safeAnswerId = answer_id ?? null;
    const safeText = text_answer?.trim() || null;

    if (!question_id) {
        return res.status(400).json({ error: 'question_id required' });
    }

    if (!answer_id && !text_answer) {
        return res.status(400).json({ error: 'Answer required' });
    }

    if (answer_id && text_answer) {
        return res.status(400).json({
            error: 'Choose answer OR text, not both'
        });
    }

    if (text_answer && text_answer.trim() === '') {
        return res.status(400).json({
            error: 'Text answer cannot be empty'
        });
    }

    const questionQuery = `
        SELECT id, type FROM questions
        WHERE id = ? AND test_id = ?
    `;

    db.query(questionQuery, [question_id, test_id], (err, qResult) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                error: 'Internal server error'
            });
        }

        if (qResult.length === 0) {
            return res.status(400).json({ error: 'Invalid question id' });
        }

        const question = qResult[0];

        if (question.type !== 'text' && text_answer) {
            return res.status(400).json({
                error: 'Text answer allowed only for text questions'
            });
        }

        if (question.type === 'text' && answer_id) {
            return res.status(400).json({
                error: 'Text question cannot use answer_id'
            });
        }

        if (question.type === 'text') {

            if (!text_answer) {
                return res.status(400).json({
                    error: 'Text answer required'
                });
            }
        
            const checkTextQuery = `
                SELECT id
                FROM user_answers
                WHERE attempt_id = ?
                AND question_id = ?
            `;
        
            return db.query(
                checkTextQuery,
                [attempt_id, question_id],
                (err, result) => {
        
                    if (err) {
                        console.error(err);
        
                        return res.status(500).json({
                            error: 'Internal server error'
                        });
                    }
        
                    if (result.length > 0) {
                        return res.status(400).json({
                            error: 'Text answer already submitted'
                        });
                    }
        
                    continueFlow();
                }
            );
        }

        if (question.type === 'single') {
            if (!answer_id) {
                return res.status(400).json({ error: 'Answer required' });
            }

            const checkSingleQuery = `
                SELECT id FROM user_answers
                WHERE attempt_id = ? AND question_id = ?
            `;

            return db.query(checkSingleQuery, [attempt_id, question_id], (err, result) => {
                if (err) {
                    console.error(err);
        
                    return res.status(500).json({
                        error: 'Internal server error'
                    });
                }

                if (result.length > 0) {
                    return res.status(400).json({
                        error: 'Only one answer allowed for single question'
                    });
                }

                continueFlow();
            });
        }

        continueFlow();

        function continueFlow() {

            if (answer_id) {
                const answerQuery = `
                    SELECT id FROM answers
                    WHERE id = ? AND question_id = ?
                `;

                return db.query(answerQuery, [answer_id, question_id], (err, aResult) => {
                    if (err) {
                        console.error(err);
            
                        return res.status(500).json({
                            error: 'Internal server error'
                        });
                    }

                    if (aResult.length === 0) {
                        return res.status(400).json({ error: 'Invalid answer id' });
                    }

                    insertAnswer();
                });
            }

            insertAnswer();
        }

        function insertAnswer() {
            const insertQuery = `
                INSERT INTO user_answers (attempt_id, question_id, answer_id, text_answer)
                VALUES (?, ?, ?, ?)
            `;

            db.query(insertQuery, [attempt_id, question_id, safeAnswerId, safeText], (err) => {

                if (err && err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({
                        error: 'Answer already submitted'
                    });
                }

                if (err) {
                    console.error(err);
        
                    return res.status(500).json({
                        error: 'Internal server error'
                    });
                }

                res.json({ message: 'Answer saved' });
            });
        }
    });
});

// POST /attempts/:id/submit
router.post('/:id/submit', auth, checkAttempt, (req, res) => {
    const attempt_id = req.params.id;

    const { finishAttempt } = require('../services/attemptService');

    finishAttempt(attempt_id, req.attempt.test_id, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (!result) {
            return res.status(400).json({
                error: 'Test already completed'
            });
        }

        res.json({
            message: 'Test completed',
            score: result.score,
            total: result.total,
            percentage: Math.round((result.score / result.total) * 100)
        });
    });
});

module.exports = router;