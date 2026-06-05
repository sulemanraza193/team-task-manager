const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db');

const sessionConfig = {
    store: process.env.NODE_ENV === 'production'
        ? new pgSession({ pool, tableName: 'session' })
        : new session.MemoryStore(),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true, // ← add this
    cookie: {
        httpOnly: true,
        secure: false, // ← must be false in development
        sameSite: 'lax', // ← add this
        maxAge: 1000 * 60 * 60 * 24,
    },
};

module.exports = sessionConfig;