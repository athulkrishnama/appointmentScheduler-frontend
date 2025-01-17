import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { setAccessToken, setName, setEmail, setPhoneNumber } from '../../store/userSlice/userSlice';
import logo from '../../assets/timelens.png';

function Header() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(setAccessToken(''));
    dispatch(setName(''));
    dispatch(setEmail(''));
    dispatch(setPhoneNumber(''));
    window.location.href = '/login';
    // Additional logout logic if needed
  };

  return (
    <motion.header 
      className="bg-white text-black p-4 flex flex-col md:flex-row justify-between items-center shadow-md mb-5"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="logo mb-4 md:mb-0">
        <img src={logo} alt="Logo" className="h-16" />
      </div>
      <nav className="navigation flex-grow">
        <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 justify-center ">
          <li>
            <Link to="/" className="hover:text-gray-600 text-lg font-medium">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/services" className="hover:text-gray-600 text-lg font-medium">
              Services
            </Link>
          </li>
          <li>
            <Link to="/quotes" className="hover:text-gray-600 text-lg font-medium">
              Quotes
            </Link>
          </li>
          <li>
            <Link to="/yourServices" className="hover:text-gray-600 text-lg font-medium">
              Your Services
            </Link>
          </li>
          <li>
            <Link to="/history" className="hover:text-gray-600 text-lg font-medium">
              History
            </Link>
          </li>
          <li>
            <Link to="/recurringServices" className="hover:text-gray-600 text-lg font-medium">
              Recurring Services
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:text-gray-600 text-lg font-medium">
              Profile
            </Link>
          </li>
        </ul>
      </nav>
      <div className="ml-auto">
        {user.accessToken ? (
          <div className="flex items-center space-x-4">
            <span className="text-lg font-medium">{user.name}</span>
            <div className="text-red-600 hover:text-red-800 cursor-pointer" onClick={handleLogout}>
              Logout
            </div>
          </div>
        ) : (
          <div className="hover:text-gray-600">
            <Link to="/login">
              Login
            </Link>
          </div>
        )}
      </div>
    </motion.header>
  );
}

export default Header;
