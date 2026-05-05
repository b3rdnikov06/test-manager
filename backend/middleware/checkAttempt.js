const db = require('../db');

module.exports = (req, res, next) => {
    const attempt_id = req.params.id;
    const user_id = req.user.id;

    const query = `SELECT 
            a.*,
            t.time_limit
        FROM attempts a
        JOIN tests t ON a.test_id = t.id
        WHERE a.id = ?
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

        req.attempt = attempt;
        next();
    });
};