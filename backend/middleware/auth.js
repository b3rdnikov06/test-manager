const jwt = require('jsonwebtoken');
const db = require('../db');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'No token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, 'secret_key');

        const query = `SELECT token_version FROM users WHERE id = ?`;

        db.query(query, [decoded.id], (err, result) => {
            if (err) return res.status(500).json({ error: err });

            if (result.length === 0) {
                return res.status(401).json({ error: 'User not found' });
            }

            if (result[0].token_version !== decoded.version) {
                return res.status(401).json({ error: 'Token expired' });
            }

            req.user = decoded;
            next();
        });

    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
};