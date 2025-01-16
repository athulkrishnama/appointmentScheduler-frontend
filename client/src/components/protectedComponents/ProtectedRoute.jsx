import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const ProtectedLogin = ({ children }) => {
    const navigate = useNavigate();
    const accessToken = useSelector((state) => state.user.accessToken);
    React.useEffect(() => {
        if (!accessToken) {
            navigate('/login');
        }
    }, [accessToken, navigate]);

    return accessToken ? children : null;
};

export default ProtectedLogin;