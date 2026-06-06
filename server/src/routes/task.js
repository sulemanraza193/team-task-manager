const express = require('express');
const router = express.Router();
const { 
    getTasks, 
    createTask, 
    updateTask, 
    deleteTask, 
    getTeamMembers 
} = require('../controllers/taskController');
const { isAuthenticated } = require('../middlerware/auth');

router.get('/', isAuthenticated, getTasks);
router.post('/', isAuthenticated, createTask);
router.put('/:id', isAuthenticated, updateTask);
router.delete('/:id', isAuthenticated, deleteTask);
// GET /tasks/members/:teamId - get team members for dropdown
router.get('/members/:teamId', isAuthenticated, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT u.id, u.username, u.email 
       FROM users u
       JOIN team_members tm ON u.id = tm.user_id
       WHERE tm.team_id = $1`,
            [req.params.teamId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

const { getTasks, createTask, updateTask, deleteTask, getTeamMembers } = require('../controllers/taskController');

router.get('/members/:teamId', isAuthenticated, getTeamMembers);

module.exports = router;
