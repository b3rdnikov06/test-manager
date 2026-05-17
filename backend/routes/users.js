const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// GET /users/students
router.get(
    '/students',
    auth,
    checkRole('teacher'),
    (req, res) => {

        const query = `
            SELECT
                id,
                email
            FROM users
            WHERE role = 'student'
            ORDER BY id
        `;

        db.query(query, (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    error:
                        'Internal server error'
                });
            }

            res.json(results);
        });
    }
);

module.exports = router;