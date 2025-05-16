import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from '../../store/auth.store';

export const RequireSignIn = ({ children }) => {
    const { isAuth } = useAuthStore();
    const location = useLocation();

    if (!isAuth) {
        return <Navigate to={'/login'} state={{ from: location }} replace/>
    }
    return children;
}