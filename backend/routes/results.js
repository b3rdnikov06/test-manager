const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const checkAttempt = require('../middleware/checkAttempt');

// GET /results/:attempt_id
router.get('/:id', auth, checkAttempt, (req, res) => {

    if (!req.attempt.finished_at) {
        return res.status(400).json({
            error: 'Test not completed yet'
        });
    }

    const attempt_id = req.params.id;
    const test_id = req.attempt.test_id;

    const query = `
        SELECT 
            q.id AS question_id,
            q.text AS question_text,
            q.type,
            a.id AS answer_id,
            a.text AS answer_text,
            a.is_correct,
            ua.answer_id AS selected,
            ua.text_answer
        FROM questions q
        LEFT JOIN answers a ON q.id = a.question_id
        LEFT JOIN user_answers ua 
            ON ua.answer_id = a.id 
            AND ua.attempt_id = ?
        WHERE q.test_id = ?
        ORDER BY q.id
    `;

    db.query(query, [attempt_id, test_id], (err, results) => {
        if (err) return res.status(500).json({ error: err });

        const questionsMap = {};

        results.forEach(row => {
            if (!questionsMap[row.question_id]) {
                questionsMap[row.question_id] = {
                    question_id: row.question_id,
                    question_text: row.question_text,
                    type: row.type,
                    answers: [],
                    text_answer: row.text_answer || null
                };
            }

            if (row.answer_id) {
                questionsMap[row.question_id].answers.push({
                    answer_id: row.answer_id,
                    text: row.answer_text,
                    is_correct: row.is_correct,
                    selected: row.selected !== null
                });
            }
        });

        const questions = Object.values(questionsMap);

        const resultQuery = `
            SELECT score, max_score
            FROM results
            WHERE attempt_id = ?
        `;

        db.query(resultQuery, [attempt_id], (err, resultData) => {
            if (err) return res.status(500).json({ error: err });

            if (resultData.length === 0) {
                return res.status(404).json({ error: 'Result not found' });
            }

            const { score, max_score } = resultData[0];

            res.json({
                attempt_id,
                test_id,
                score,
                total: max_score,
                percentage: max_score
                    ? Math.round((score / max_score) * 100)
                    : 0,
                questions
            });
        });
    });
});

module.exports = router;