const bcrypt = require('bcrypt');
const passport = require('passport');
const pool = require('../config/db');
const { registerSchema, loginSchema } = require('../validators/authValidator');

const register = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, email, password } = req.body;
    try {
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0)
            return res.status(409).json({ message: 'Email already registered' });

        const password_hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, password_hash]
        );

        res.status(201).json({ message: 'Registered successfully', user: result.rows[0] });
    } catch (err) {
        console.error('❌ Register error:', err.message); // ← add this
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const login = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info.message });

        req.logIn(user, (err) => {
            if (err) return next(err);
            res.json({
                message: 'Logged in successfully',
                user: { id: user.id, username: user.username, email: user.email },
            });
        });
    })(req, res, next);
};

const logout = (req, res) => {
    req.logout(() => {
        res.json({ message: 'Logged out successfully' });
    });
};

const getMe = (req, res) => {
    if (!req.isAuthenticated())
        return res.status(401).json({ message: 'Not logged in' });
    const { id, username, email } = req.user;
    res.json({ user: { id, username, email } });
};

module.exports = { register, login, logout, getMe };