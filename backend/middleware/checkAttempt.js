const db = require('../db');

module.exports = (req, res, next) => {
    const attempt_id = req.params.id;
    const user_id = req.user.id;

    const query = `
        SELECT * FROM attempts WHERE id = ?
    `;

    db.query(query, [attempt_id], (err, result) => {
        if (err) return res.status(500).json({ error: err });

        const attempt = result[0];

        if (!attempt) {
            return res.status(404).json({ error: 'Attempt not found' });
        }

        if (attempt.user_id !== user_id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        if (attempt.finished_at) {
            return res.status(400).json({ error: 'Test already completed' });
        }

        req.attempt = attempt;
        next();
    });
};