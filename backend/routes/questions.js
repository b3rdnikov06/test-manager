const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// POST /questions
router.post('/', auth, checkRole('teacher'), (req, res) => {
    const { test_id, text, type, order_index } = req.body;

    const query = `
        INSERT INTO questions (test_id, text, type, order_index)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [test_id, text, type, order_index], (err, result) => {
        if (err) {
            return res.status(500).json({error: err});
        }

        res.json({ message: 'Question added', id: result.insertID });
    });
});

// POST /questions/:id/answers
router.post('/:id/answers', auth, checkRole('teacher'), (req, res) => {
    const question_id = req.params.id;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Answers must be an array' });
    }

    const questionQuery = `SELECT type FROM questions WHERE id = ?`;

    db.query(questionQuery, [question_id], (err, questionResult) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        const questionType = questionResult[0].type;

        const correctCount = answers.filter(a => a.is_correct).length;

        if (questionType === 'single' && correctCount > 1) {
            return res.status(400).json({
                error: 'Single question can have only one correct answer'
            });
        }

        const values = answers.map(a => [question_id, a.text, a.is_correct]);

        const insertQuery = `
            INSERT INTO answers (question_id, text, is_correct)
            VALUES ?
        `;

        db.query(insertQuery, [values], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({
                        error: 'Duplicate answer'
                    });
                }

                return res.status(500).json({ error: err });
            }

            res.json({
                message: 'Answers added',
                inserted: result.affectedRows
            });
        });
    });
});

// GET /questions/:test_id - - - - - - только для ПРЕПОДОВ И АДМИНОВ
router.get('/:test_id', auth, checkRole('teacher'), (req, res) => {
    const test_id = req.params.test_id;

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
        ORDER BY q.id
    `;
    db.query(query, [test_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
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

module.exports = router;