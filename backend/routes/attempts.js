const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const checkAttempt = require('../middleware/checkAttempt');

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
            return res.status(500).json({ error: err });
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
router.post('/:id/answer', auth, checkAttempt, (req, res) => {
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
        if (err) return res.status(500).json({ error: err });

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
                if (err) return res.status(500).json({ error: err });

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
                    if (err) return res.status(500).json({ error: err });

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
                    return res.status(500).json({ error: err });
                }

                res.json({ message: 'Answer saved' });
            });
        }
    });
});

// POST /attempts/:id/submit
router.post('/:id/submit', auth, checkAttempt, (req, res) => {
    const attempt_id = req.params.id;
    const user_id = req.user.id;

    const checkQuery = `
        SELECT * FROM attempts 
        WHERE id = ? AND user_id = ?
    `;

    db.query(checkQuery, [attempt_id, user_id], (err, checkResult) => {
        if (err) return res.status(500).json({ error: err });

        if (checkResult.length === 0) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const query = `
            SELECT 
                q.id AS question_id,
                q.type,
                a.id AS answer_id,
                a.text AS answer_text,
                a.is_correct,
                ua.answer_id AS selected
            FROM questions q
            LEFT JOIN answers a ON q.id = a.question_id
            LEFT JOIN user_answers ua 
                ON ua.answer_id = a.id 
                AND ua.attempt_id = ?
            WHERE q.test_id = (
                SELECT test_id FROM attempts WHERE id = ?
            )
        `;

        const textQuery = `
            SELECT question_id, text_answer
            FROM user_answers
            WHERE attempt_id = ? AND text_answer IS NOT NULL
        `;

        db.query(query, [attempt_id, attempt_id], (err, results) => {
            if (err) return res.status(500).json({ error: err });

            db.query(textQuery, [attempt_id], (err, textResults) => {
                if (err) return res.status(500).json({ error: err });

                const questionsMap = {};

                results.forEach(row => {
                    if (!questionsMap[row.question_id]) {
                        questionsMap[row.question_id] = {
                            type: row.type,
                            answers: [],
                            text_answer: null,
                            correct_text: null
                        };
                    }

                    if (row.type === 'text' && row.is_correct) {
                        questionsMap[row.question_id].correct_text = row.answer_text;
                    }

                    if (row.answer_id) {
                        questionsMap[row.question_id].answers.push({
                            is_correct: row.is_correct,
                            selected: !!row.selected
                        });
                    }
                });

                textResults.forEach(row => {
                    if (questionsMap[row.question_id]) {
                        questionsMap[row.question_id].text_answer = row.text_answer;
                    }
                });

                let score = 0;
                const total = Object.keys(questionsMap).length;

                Object.values(questionsMap).forEach(question => {
                    let isCorrect = true;

                    if (question.type !== 'text') {
                        question.answers.forEach(answer => {
                            if (answer.is_correct && !answer.selected) isCorrect = false;
                            if (!answer.is_correct && answer.selected) isCorrect = false;
                        });
                    }

                    if (question.type === 'text') {
                        const user = (question.text_answer || '').trim().toLowerCase();
                        const correct = (question.correct_text || '').trim().toLowerCase();

                        if (user !== correct) isCorrect = false;
                    }

                    if (isCorrect) score++;
                });

                const finishQuery = `
                    UPDATE attempts 
                    SET finished_at = NOW()
                    WHERE id = ?
                `;

                db.query(finishQuery, [attempt_id]);

                const resultQuery = `
                    INSERT INTO results (attempt_id, score, max_score)
                    VALUES (?, ?, ?)
                `;

                db.query(resultQuery, [attempt_id, score, total]);

                res.json({
                    message: 'Test completed',
                    score,
                    total,
                    percentage: Math.round((score / total) * 100)
                });
            });
        });
    });
});

module.exports = router;