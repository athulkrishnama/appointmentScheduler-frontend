import React from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { setAccessToken, setName, setEmail, setPhoneNumber } from '../../store/userSlice/userSlice';
import logo from '../../assets/timelens.png';
import {useLocation} from 'react-router'

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

  const location = useLocation();

  const isActive = (link) => {
    console.log(link, location.pathname, location.pathname === link);
    return location.pathname === link;
  };

  const navigationLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/services', label: 'Services' },
    { path: '/serviceRequests', label: 'Service Requests' },
    { path: '/yourAppointments', label: 'Your Appointments' },
    { path: '/history', label: 'History' },
    { path: '/recurringServices', label: 'Recurring Services' },
    { path: '/profile', label: 'Profile' }
  ];

  return (
    <motion.header 
      className="bg-white text-black p-4 flex flex-col md:flex-row justify-between items-center shadow-md mb-5 sticky top-0 left-0 right-0 z-50 w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="logo mb-4 md:mb-0">
        <img src={logo} alt="Logo" className="h-16" />
      </div>
      <nav className="navigation flex-grow">
        <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 justify-center ">
          {navigationLinks.map((link, index) => (
            <li key={index}>
              <Link 
                to={link.path} 
                className={`px-4 py-2 rounded-full transition-all duration-300 text-lg font-medium ${
                  isActive(link.path) 
                    ? 'bg-gray-900 text-white shadow-lg' 
                    : 'text-gray-800 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
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
