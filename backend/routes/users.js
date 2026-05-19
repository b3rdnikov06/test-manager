const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

// PUT /users/profile
router.put('/profile', auth, (req, res) => {

    const {
        first_name,
        last_name,
        avatar
    } = req.body;

    if (
        !first_name ||
        !last_name
    ) {
        return res.status(400).json({
            error: 'First name and last name are required'
        });
    }

    if (first_name.trim().length < 2) {
        return res.status(400).json({
            error: 'First name is too short'
        });
    }

    if (last_name.trim().length < 2) {
        return res.status(400).json({
            error: 'Last name is too short'
        });
    }

    const query = `
        UPDATE users
        SET
            first_name = ?,
            last_name = ?,
            avatar = ?
        WHERE id = ?
    `;

    db.query(
        query,
        [
            first_name.trim(),
            last_name.trim(),
            avatar || null,
            req.user.id
        ],
        (err) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    error: 'Internal server error'
                });
            }

            const token = jwt.sign(
                {
                    id: req.user.id,
                    role: req.user.role,
                    version: req.user.version,
            
                    first_name: first_name.trim(),
                    last_name: last_name.trim(),
                    avatar,
                    email: req.user.email
                },
                'secret_key',
                { expiresIn: '1h' }
            );
            
            res.json({
                message: 'Profile updated',
                token
            });
        }
    );
});

// PUT /users/password
router.put('/password', auth, async (req, res) => {

    const {
        current_password,
        new_password,
        confirm_password
    } = req.body;

    if (
        !current_password ||
        !new_password ||
        !confirm_password
    ) {
        return res.status(400).json({
            error: 'All fields are required'
        });
    }

    if (new_password.length < 8) {
        return res.status(400).json({
            error: 'Password must contain at least 8 characters'
        });
    }

    if (new_password !== confirm_password) {
        return res.status(400).json({
            error: 'Passwords do not match'
        });
    }

    const query = `
        SELECT password_hash
        FROM users
        WHERE id = ?
    `;

    db.query(
        query,
        [req.user.id],
        async (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    error: 'Internal server error'
                });
            }

            const user = result[0];

            const isMatch =
                await bcrypt.compare(
                    current_password,
                    user.password_hash
                );

            if (!isMatch) {
                return res.status(400).json({
                    error: 'Current password is incorrect'
                });
            }

            const hashedPassword =
                await bcrypt.hash(
                    new_password,
                    10
                );

            const updateQuery = `
                UPDATE users
                SET
                    password_hash = ?,
                    token_version = token_version + 1
                WHERE id = ?
            `;

            db.query(
                updateQuery,
                [
                    hashedPassword,
                    req.user.id
                ],
                (err) => {

                    if (err) {

                        console.error(err);

                        return res.status(500).json({
                            error: 'Internal server error'
                        });
                    }

                    const token = jwt.sign(
                        {
                            id: req.user.id,
                            role: req.user.role,
                            version: req.user.version + 1,
                    
                            first_name: req.user.first_name,
                            last_name: req.user.last_name,
                            avatar: req.user.avatar,
                            email: req.user.email
                        },
                        'secret_key',
                        { expiresIn: '1h' }
                    );
                    
                    res.json({
                        message: 'Password updated',
                        token
                    });
                }
            );
        }
    );
});

module.exports = router;