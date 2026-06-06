const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const sessionConfig = require('./config/session');
// Wrong - looking for wrong path
const errorHandler = require('./middlerware/errorHandler');

const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/team');
const taskRoutes = require('./routes/task');

const app = express();

// CORS must be first
app.use(cors({
    origin: 'http://localhost:5173',
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

app.get('/', (req, res) => res.json({ message: '✅ API is running' }));

app.use(errorHandler);

module.exports = app;
