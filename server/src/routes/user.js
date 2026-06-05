// routes/user.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const pool = require("../db"); // PostgreSQL pool

// middleware to verify token
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

// GET USER PROFILE
router.get("/profile", auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            "SELECT id, name, email FROM users WHERE id = $1",
            [userId]
        );

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;