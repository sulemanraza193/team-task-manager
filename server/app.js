const express = require('express');
const cors = require('cors');
const session = require('express-session');

const passport = require('./src/config/passport');
const sessionConfig = require('./src/config/session');
const errorHandler = require('./src/middleware/errorHandler');

const authRoutes = require('./src/routes/auth');
const teamRoutes = require('./src/routes/team');
const taskRoutes = require('./src/routes/task');

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/teams', teamRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.json({ message: '✅ API is running' });
});

app.use(errorHandler);

module.exports = app;
