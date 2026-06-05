import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const Dashboard = () => {
    const [teams, setTeams] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [newTeamName, setNewTeamName] = useState('');
    const [memberEmail, setMemberEmail] = useState('');
    const [filterAssignee, setFilterAssignee] = useState('');
    const [teamMembers, setTeamMembers] = useState([]);  // ← added
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeams();
    }, []);

    // ← updated to also fetch members
    useEffect(() => {
        if (selectedTeam) {
            fetchTasks();
            fetchTeamMembers();
        }
    }, [selectedTeam]);

    const fetchTeams = async () => {
        try {
            const res = await api.get('/teams');
            setTeams(res.data);
            if (res.data.length > 0) setSelectedTeam(res.data[0]);
        } catch (err) {
            console.error('Failed to fetch teams:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTasks = async () => {
        try {
            const params = {};
            if (selectedTeam) params.team_id = selectedTeam.id;
            if (filterAssignee) params.assigned_to = filterAssignee;
            const res = await api.get('/tasks', { params });
            setTasks(res.data);
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
        }
    };

    // ← added
    const fetchTeamMembers = async () => {
        try {
            const res = await api.get(`/tasks/members/${selectedTeam.id}`);
            setTeamMembers(res.data);
        } catch (err) {
            console.error('Failed to fetch members:', err);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        if (!newTeamName.trim()) return;
        try {
            const res = await api.post('/teams', { name: newTeamName });
            setTeams([...teams, res.data]);
            setNewTeamName('');
            setSelectedTeam(res.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create team');
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!memberEmail.trim() || !selectedTeam) return;
        try {
            await api.post(`/teams/${selectedTeam.id}/members`, { email: memberEmail });
            setMemberEmail('');
            fetchTeamMembers(); // ← refresh members after adding
            alert('Member added successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add member');
        }
    };

    const handleDeleteTeam = async (teamId) => {
        if (!window.confirm('Are you sure you want to delete this team?')) return;
        try {
            await api.delete(`/teams/${teamId}`);
            const updated = teams.filter(t => t.id !== teamId);
            setTeams(updated);
            setSelectedTeam(updated[0] || null);
            setTasks([]);
            setTeamMembers([]); // ← clear members
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete team');
        }
    };

    const handleTaskSaved = () => {
        fetchTasks();
        setShowTaskModal(false);
        setEditingTask(null);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowTaskModal(true);
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await api.delete(`/tasks/${taskId}`);
            setTasks(tasks.filter(t => t.id !== taskId));
        } catch (err) {
            alert('Failed to delete task');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-gray-500 text-lg">Loading...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Sidebar - Teams */}
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-white rounded-2xl shadow p-4">
                        <h2 className="text-lg font-bold text-gray-700 mb-3">Teams</h2>

                        <ul className="space-y-2 mb-4">
                            {teams.map(team => (
                                <li
                                    key={team.id}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition ${selectedTeam?.id === team.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
                                        }`}
                                    onClick={() => setSelectedTeam(team)}
                                >
                                    <span>🏷 {team.name}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteTeam(team.id); }}
                                        className="text-xs hover:text-red-400 ml-2"
                                    >
                                        ✕
                                    </button>
                                </li>
                            ))}
                            {teams.length === 0 && (
                                <p className="text-sm text-gray-400">No teams yet</p>
                            )}
                        </ul>

                        <form onSubmit={handleCreateTeam} className="space-y-2">
                            <input
                                type="text"
                                value={newTeamName}
                                onChange={e => setNewTeamName(e.target.value)}
                                placeholder="New team name"
                                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                            >
                                + Create Team
                            </button>
                        </form>
                    </div>

                    {/* Add Member */}
                    {selectedTeam && (
                        <div className="bg-white rounded-2xl shadow p-4">
                            <h2 className="text-lg font-bold text-gray-700 mb-3">Add Member</h2>

                            {/* ← Show current members list */}
                            {teamMembers.length > 0 && (
                                <ul className="mb-3 space-y-1">
                                    {teamMembers.map(member => (
                                        <li key={member.id} className="text-xs text-gray-500 flex items-center gap-1">
                                            <span>👤</span> {member.username} ({member.email})
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <form onSubmit={handleAddMember} className="space-y-2">
                                <input
                                    type="email"
                                    value={memberEmail}
                                    onChange={e => setMemberEmail(e.target.value)}
                                    placeholder="Member email"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-green-600 text-white py-1.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                                >
                                    + Add Member
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Main - Tasks */}
                <div className="md:col-span-3 space-y-4">
                    <div className="bg-white rounded-2xl shadow p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-700">
                                {selectedTeam ? `📋 ${selectedTeam.name} Tasks` : 'Tasks'}
                            </h2>
                            {selectedTeam && (
                                <button
                                    onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
                                    className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                                >
                                    + New Task
                                </button>
                            )}
                        </div>

                        {/* ← Updated Filter with dropdown */}
                        <div className="flex gap-2 mb-4">
                            <select
                                value={filterAssignee}
                                onChange={e => setFilterAssignee(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">All Members</option>
                                {teamMembers.map(member => (
                                    <option key={member.id} value={member.id}>
                                        {member.username}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={fetchTasks}
                                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition"
                            >
                                Filter
                            </button>
                            <button
                                onClick={() => { setFilterAssignee(''); fetchTasks(); }}
                                className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition"
                            >
                                Clear
                            </button>
                        </div>

                        {/* Task List */}
                        {tasks.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">
                                No tasks yet. Create one!
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {tasks.map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onEdit={handleEditTask}
                                        onDelete={handleDeleteTask}
                                        members={teamMembers}  // ← added
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Task Modal */}
            {showTaskModal && (
                <TaskModal
                    task={editingTask}
                    teamId={selectedTeam?.id}
                    onSaved={handleTaskSaved}
                    onClose={() => { setShowTaskModal(false); setEditingTask(null); }}
                />
            )}
        </div>
    );
};

export default Dashboard;