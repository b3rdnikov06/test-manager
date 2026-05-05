const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const checkAttempt = require('../middleware/checkAttempt');
const checkAttemptNotFinished = require('../middleware/checkAttemptNotFinished');

// POST /attempts/start
router.post('/start', auth, (req, res) => {
    const user_id = req.user.id;
    const { test_id } = req.body;
    
    const checkQuery = `
    SELECT * FROM attempts 
    WHERE user_id = ? AND test_id = ?
    `;

    db.query(checkQuery, [user_id, test_id], (err, result) => {
        if (result.length > 0) {
            return res.status(400).json({
                error: 'You already started this test'
            });
        }
        if (err) {
            console.error(err);

            return res.status(500).json({
                error: 'Internal server error'
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

// POST /attempts/:id/answer
router.post('/:id/answer', auth, checkAttempt, checkAttemptNotFinished, (req, res) => {
    const attempt_id = req.params.id;
    const { question_id, answer_id, text_answer } = req.body;
    const test_id = req.attempt.test_id;

    const safeAnswerId = answer_id ?? null;
    const safeText = text_answer ?? null;

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

        if (question.type === 'text') {
            if (!text_answer) {
                return res.status(400).json({ error: 'Text answer required' });
            }
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