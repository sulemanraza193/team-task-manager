const express = require('express');
const router = express.Router();
const { getTeams, createTeam, addMember, deleteTeam } = require('../controllers/teamController');
const { isAuthenticated } = require('../middlerware/auth');

router.get('/', isAuthenticated, getTeams);
router.post('/', isAuthenticated, createTeam);
router.post('/:id/members', isAuthenticated, addMember);
router.delete('/:id', isAuthenticated, deleteTeam);

module.exports = router;