import { Navigate } from 'react-router-dom';
import useAuth from '../context/useAuth';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-gray-500 text-lg">Loading...</div>
        </div>
    );

    if (!user) return <Navigate to="/login" />;

    return children;
};

export default ProtectedRoute;