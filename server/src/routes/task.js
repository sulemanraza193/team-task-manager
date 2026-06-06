const express = require('express');
const router = express.Router();

// Combined all controller imports into one clean block
const {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    getTeamMembers
} = require('../controllers/taskController');

// Corrected the single import for authentication middleware
const { isAuthenticated } = require('../middleware/auth');

// TASK ROUTES
router.get('/', isAuthenticated, getTasks);
router.post('/', isAuthenticated, createTask);
router.put('/:id', isAuthenticated, updateTask);
router.delete('/:id', isAuthenticated, deleteTask);

// TEAM MEMBERS ROUTE
router.get('/members/:teamId', isAuthenticated, getTeamMembers);

module.exports = router;
