const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// POST /auth/register
router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email' });
    }

    const validRoles = ['student', 'teacher'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
        INSERT INTO users (email, password_hash, role)
        VALUES (?, ?, ?)
    `;

    db.query (query, [email, hashedPassword, role ], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: err });
        }

        res.json({ message: 'User created'});
    });
});

// POST auth/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE  email = ?`;

    db.query(query, [email], async (err, result) => {
        if (err) return res.status(500).json({ error: err});

        const user = result[0];

        if (!user) {
            return res.status(401).json({ error: 'User not found' })
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Wrong password'});
        }

        const token = jwt.sign(
            { 
                id: user.id, 
                role: user.role,
                version: user.token_version
            },
            'secret_key',
            { expiresIn: '1h' }
        );
        res.json({ token })
    });
});

// POST /auth/logout
router.post('/logout', auth, (req, res) => {
    const user_id = req.user.id;

    const query = `
        UPDATE users 
        SET token_version = token_version + 1
        WHERE id = ?
    `;

    db.query(query, [user_id], (err) => {
        if (err) return res.status(500).json({ error: err });

        res.json({ message: 'Logged out' });
    });
});

module.exports = router;