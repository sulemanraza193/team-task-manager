const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { isAuthenticated } = require('../middleware/auth');

const {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    getTeamMembers
} = require('../controllers/taskController');

const { isAuthenticated } = require('../middlerware/auth');

// TASK ROUTES
router.get('/', isAuthenticated, getTasks);
router.post('/', isAuthenticated, createTask);
router.put('/:id', isAuthenticated, updateTask);
router.delete('/:id', isAuthenticated, deleteTask);

// TEAM MEMBERS ROUTE (controller version - CLEAN)
router.get('/members/:teamId', isAuthenticated, getTeamMembers);

module.exports = router;
