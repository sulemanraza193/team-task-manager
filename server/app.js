const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./src/config/passport'); // Adjust the path as needed
const sessionConfig = require('./src/config/session');
// Wrong - looking for wrong path
const errorHandler = require('./src/middleware/errorHandler'); // Adjust the path as needed

const authRoutes = require('./src/routes/auth');
const teamRoutes = require('./src/routes/team');
const taskRoutes = require('./src/routes/task');

const app = express();

const allowedOrigins = [
  'https://team-task-manager-k6ii.vercel.app',
  'https://team-task-manager-k6ii-git-main-sulemanraza193s-projects.vercel.app',
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
