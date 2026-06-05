const pool = require('../config/db');
const { teamSchema, addMemberSchema } = require('../validators/teamValidator');

const getTeams = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT t.* FROM teams t
       JOIN team_members tm ON t.id = tm.team_id
       WHERE tm.user_id = $1`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const createTeam = async (req, res) => {
    const { error } = teamSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name } = req.body;
    try {
        const team = await pool.query(
            'INSERT INTO teams (name, creator_id) VALUES ($1, $2) RETURNING *',
            [name, req.user.id]
        );
        await pool.query(
            'INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)',
            [team.rows[0].id, req.user.id]
        );
        res.status(201).json(team.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const addMember = async (req, res) => {
    const { error } = addMemberSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email } = req.body;
    try {
        const user = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0)
            return res.status(404).json({ message: 'User not found' });

        await pool.query(
            'INSERT INTO team_members (team_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [req.params.id, user.rows[0].id]
        );
        res.json({ message: 'Member added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const deleteTeam = async (req, res) => {
    try {
        const team = await pool.query('SELECT * FROM teams WHERE id = $1', [req.params.id]);
        if (team.rows.length === 0)
            return res.status(404).json({ message: 'Team not found' });
        if (team.rows[0].creator_id !== req.user.id)
            return res.status(403).json({ message: 'Only the team creator can delete this team' });

        await pool.query('DELETE FROM teams WHERE id = $1', [req.params.id]);
        res.json({ message: 'Team deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { getTeams, createTeam, addMember, deleteTeam };