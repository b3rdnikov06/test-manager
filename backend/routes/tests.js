const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /tests
router.get('/', (req, res) => {
    db.query('SELECT * FROM tests', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json(results);
    });
});

// POST /tests
router.post('/', (req, res) => {
    const { title, description, author_id, time_limit } = req.body;

    const query = `
        INSERT INTO tests (title, description, author_id, time_limit)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [title, description, author_id, time_limit], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        res.json({ message: 'Test created', id: result.insertId });
    });
});

// GET /tests/:id/full
router.get('/:id/full', (req, res) => {
    const test_id = req.params.id;

    const query = `
        SELECT 
            q.id AS question_id,
            q.text AS question_text,
            q.type,
            a.id AS answer_id,
            a.text AS answer_text
        FROM questions q
        LEFT OUTER JOIN answers a ON q.id = a.question_id
        WHERE q.test_id = ?
        ORDER BY q.order_index
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
                    text: row.answer_text
                });
            }
        });

        const formatted = Object.values(questionsMap);

        res.json(formatted);
    });
});

module.exports = router;