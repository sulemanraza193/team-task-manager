import useAuth from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
            <h1 className="text-xl font-bold tracking-wide">🗂 Team Task Manager</h1>
            {user && (
                <div className="flex items-center gap-4">
                    <span className="text-sm">👋 Hello, <strong>{user.username}</strong></span>
                    <button
                        onClick={handleLogout}
                        className="bg-white text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-blue-50 transition"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;