import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Loading from './student/Loading';

interface ProtectedRouteProps {
    roles?: string[]; // Array of allowed roles, e.g., ['student', 'educator', 'admin']
}

const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
    const { isLoggedIn, userData, isAuthLoading } = useAppContext();

    if (isAuthLoading) {
        return <Loading />;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (roles && userData?.role && !roles.includes(userData.role)) {
        // Redirect to legitimate dashboard based on actual role
        if (userData.role === 'educator') return <Navigate to="/educator" replace />;
        if (userData.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
