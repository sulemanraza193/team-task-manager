const pool = require('../config/db');
const { taskSchema, updateTaskSchema } = require('../validators/taskValidator');

const getTasks = async (req, res) => {
    const { team_id, assigned_to } = req.query;
    try {
        let query = 'SELECT * FROM tasks WHERE 1=1';
        const params = [];

        if (team_id) { params.push(team_id); query += ` AND team_id = $${params.length}`; }
        if (assigned_to) { params.push(assigned_to); query += ` AND assigned_to = $${params.length}`; }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const createTask = async (req, res) => {
    const { error } = taskSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, description, status, due_date, team_id, assigned_to } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO tasks (title, description, status, due_date, team_id, assigned_to, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [title, description, status, due_date, team_id, assigned_to, req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const updateTask = async (req, res) => {
    const { error } = updateTaskSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, description, status, due_date, assigned_to } = req.body;
    try {
        const result = await pool.query(
            `UPDATE tasks SET title=$1, description=$2, status=$3, due_date=$4, assigned_to=$5
       WHERE id=$6 RETURNING *`,
            [title, description, status, due_date, assigned_to, req.params.id]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ message: 'Task not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
const getTeamMembers = async (req, res) => {
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
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getTeamMembers };

