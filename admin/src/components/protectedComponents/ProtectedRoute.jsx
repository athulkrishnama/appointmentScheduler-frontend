import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Navigate } from 'react-router';

const ProtectedRoute = ({ children }) => {
    const accessToken = useSelector((state) => state.user.accessToken);

    return (
        <>
            {accessToken ? children : <Navigate to="/login" />}
        </>
    );
};

export default ProtectedRoute;