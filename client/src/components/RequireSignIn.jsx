import React from 'react'
import { Navigate, useLocation } from 'react-router';

export const RequireSignIn = ({ children }) => {
    const location = useLocation();
    const token = sessionStorage.getItem('token')
    const success = token && token.length!==0 

    if (!success) {
        return <Navigate to={'/login'} state={{ from: location }}/>
    }
    return children;
}