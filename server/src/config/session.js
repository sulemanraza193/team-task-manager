const sessionConfig = {
    store: process.env.NODE_ENV === 'production'
        ? new pgSession({ pool, tableName: 'session' })
        : new session.MemoryStore(),

    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,

    proxy: true,

    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // ✅ auto fix
        sameSite: 'none', // ✅ REQUIRED for Vercel ↔ Railway
        maxAge: 1000 * 60 * 60 * 24,
    },
};

module.exports = sessionConfig;
