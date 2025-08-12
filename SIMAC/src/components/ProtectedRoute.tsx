import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element; allowedRoles: string[] }) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />;
    if (!allowedRoles.includes(user.type_user)) return <Navigate to="/" />;

    return children;
};

export default ProtectedRoute;
