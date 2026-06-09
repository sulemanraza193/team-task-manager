const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const sessionConfig = require('./config/session');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/teams');
const taskRoutes = require('./routes/tasks');

const app = express();

app.set('trust proxy', 1); // ← add this for Railway

app.use(cors({
  origin: 'https://team-task-manager-k6ii.vercel.app',
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
