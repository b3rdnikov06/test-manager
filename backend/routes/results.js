const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// GET /results/:attempt_id
router.get('/:id', auth, (req, res) => {

    const attempt_id = req.params.id;

    const accessQuery = `
        SELECT
            a.id,
            a.user_id,
            a.test_id,
            a.finished_at,
            t.title
        FROM attempts a
        JOIN tests t ON a.test_id = t.id
        WHERE a.id = ?
    `;

    db.query(accessQuery, [attempt_id], (err, accessResult) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: 'Internal server error'
            });
        }

        if (accessResult.length === 0) {
            return res.status(404).json({
                error: 'Attempt not found'
            });
        }

        const attempt = accessResult[0];

        if (
            req.user.role !== 'teacher' &&
            req.user.id !== attempt.user_id
        ) {
            return res.status(403).json({
                error: 'Access denied'
            });
        }

        if (!attempt.finished_at) {
            return res.status(400).json({
                error: 'Test not completed yet'
            });
        }

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
            LEFT JOIN answers a
                ON q.id = a.question_id
            LEFT JOIN user_answers ua
                ON ua.answer_id = a.id
                AND ua.attempt_id = ?
            WHERE q.test_id = ?
            ORDER BY q.order_index
        `;

        db.query(query, [attempt_id, attempt.test_id], (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: 'Internal server error'
                });
            }

            const textQuery = `
                SELECT question_id, text_answer
                FROM user_answers
                WHERE attempt_id = ?
                AND text_answer IS NOT NULL
            `;

            db.query(textQuery, [attempt_id], (err, textResults) => {

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
                            question_id: row.question_id,
                            question_text: row.question_text,
                            type: row.type,
                            answers: []
                        };

                        if (row.type === 'text') {
                            questionsMap[row.question_id]
                                .text_answer = null;
                        }
                    }

                    if (row.answer_id) {

                        const answer = {
                            answer_id: row.answer_id,
                            text: row.answer_text,
                            is_correct: row.is_correct
                        };

                        if (row.type !== 'text') {
                            answer.selected =
                                row.selected !== null;
                        }

                        questionsMap[row.question_id]
                            .answers.push(answer);
                    }
                });

                textResults.forEach(row => {

                    if (
                        questionsMap[row.question_id] &&
                        questionsMap[row.question_id].type === 'text'
                    ) {
                        questionsMap[row.question_id]
                            .text_answer = row.text_answer;
                    }
                });

                const questions =
                    Object.values(questionsMap);

                const resultQuery = `
                    SELECT score, max_score
                    FROM results
                    WHERE attempt_id = ?
                `;

                db.query(resultQuery, [attempt_id], (err, resultData) => {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            error: 'Internal server error'
                        });
                    }

                    if (resultData.length === 0) {
                        return res.status(404).json({
                            error: 'Result not found'
                        });
                    }

                    const {
                        score,
                        max_score
                    } = resultData[0];

                    res.json({
                        attempt_id,
                        user_id: attempt.user_id,
                        test_id: attempt.test_id,
                        title: attempt.title,
                        score,
                        total: max_score,
                        percentage: max_score
                            ? Math.round(
                                (score / max_score) * 100
                            )
                            : 0,
                        questions
                    });
                });
            });
        });
    });
});

// GET /results/tests/:id
router.get('/tests/:id', auth, checkRole('teacher'), (req, res) => {

    const test_id = req.params.id;

    const testQuery = `
        SELECT
            id,
            title
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

        const resultsQuery = `
            SELECT
                a.id AS attempt_id,
                a.user_id,
                a.started_at,
                a.finished_at,
                r.score,
                r.max_score
            FROM attempts a
            JOIN results r
                ON a.id = r.attempt_id
            WHERE a.test_id = ?
            ORDER BY a.started_at DESC
        `;

        db.query(resultsQuery, [test_id], (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: 'Internal server error'
                });
            }

            const formattedResults = results.map(result => ({

                attempt_id: result.attempt_id,

                user_id: result.user_id,

                started_at: result.started_at,

                finished_at: result.finished_at,

                score: result.score,

                total: result.max_score,

                percentage: result.max_score
                    ? Math.round(
                        (result.score / result.max_score) * 100
                    )
                    : 0
            }));

            res.json({
                test_id: test.id,
                title: test.title,
                attempts: formattedResults
            });
        });
    });
});

// GET /results/student/:id
router.get('/student/:id', auth, (req, res) => {

    const user_id = req.params.id;

    if (
        req.user.role !== 'teacher' &&
        req.user.id != user_id
    ) {
        return res.status(403).json({
            error: 'Access denied'
        });
    }

    const userQuery = `
        SELECT id, email, role
        FROM users
        WHERE id = ?
    `;

    db.query(userQuery, [user_id], (err, userResult) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: 'Internal server error'
            });
        }

        if (userResult.length === 0) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        const user = userResult[0];

        const resultsQuery = `
            SELECT
                a.id AS attempt_id,
                t.id AS test_id,
                t.title,
                a.started_at,
                a.finished_at,
                r.score,
                r.max_score
            FROM attempts a
            JOIN tests t
                ON a.test_id = t.id
            JOIN results r
                ON a.id = r.attempt_id
            WHERE a.user_id = ?
            ORDER BY a.started_at DESC
        `;

        db.query(resultsQuery, [user_id], (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error: 'Internal server error'
                });
            }

            const formattedResults = results.map(result => {

                let duration_minutes = null;

                if (
                    result.started_at &&
                    result.finished_at
                ) {
                    duration_minutes = Math.round(
                        (
                            new Date(result.finished_at) -
                            new Date(result.started_at)
                        ) / (1000 * 60)
                    );
                }

                return {

                    attempt_id: result.attempt_id,

                    test_id: result.test_id,

                    title: result.title,

                    started_at: result.started_at,

                    finished_at: result.finished_at,

                    duration_minutes,

                    score: result.score,

                    total: result.max_score,

                    percentage: result.max_score
                        ? Math.round(
                            (result.score / result.max_score) * 100
                        )
                        : 0
                };
            });

            res.json({

                user_id: user.id,

                email: user.email,

                role: user.role,

                attempts: formattedResults
            });
        });
    });
});

module.exports = router;