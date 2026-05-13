const db = require('../db');

module.exports = (req, res, next) => {

    const test_id = req.params.id;

    const teacher_id = req.user.id;

    const query = `
        SELECT id, is_published
        FROM tests
        WHERE id = ?
        AND author_id = ?
    `;

    db.query(query, [test_id, teacher_id], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: 'Internal server error'
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                error: 'Test not found'
            });
        }

        const test = result[0];

        if (test.is_published) {
            return res.status(400).json({
                error: 'Test already published'
            });
        }

        req.test = test;

        next();
    });
};