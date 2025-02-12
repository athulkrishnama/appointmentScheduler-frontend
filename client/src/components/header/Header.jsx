import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { setAccessToken, setName, setEmail, setPhoneNumber } from '../../store/userSlice/userSlice';
import logo from '../../assets/timelens.png';
import { useLocation } from 'react-router'
import BreadCrumbs from '../breadCrumbs/BreadCrumbs';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setAccessToken(''));
    dispatch(setName(''));
    dispatch(setEmail(''));
    dispatch(setPhoneNumber(''));
    window.location.href = '/login';
  };

  const location = useLocation();

  const isActive = (link) => {
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
    <div className='sticky top-0 left-0 right-0 z-40 w-full'>
      <motion.header
        className="bg-white text-black p-4 shadow-md "
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-12 md:h-16" />
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <div className="w-6 h-0.5 bg-gray-800 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-gray-800 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-gray-800"></div>
          </button>

          <nav className="hidden md:block flex-grow mx-4">
            <ul className="flex items-center justify-center space-x-4">
              {navigationLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className={`px-4 py-2 rounded-full transition-all duration-300 text-lg font-medium ${isActive(link.path)
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

          <div className="hidden md:block">
            {user.accessToken ? (
              <div className="flex items-center space-x-4">
                <span className="text-lg font-medium">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 cursor-pointer px-4 py-2 rounded-full hover:bg-red-50 transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <nav className="py-4">
                <ul className="flex flex-col space-y-2">
                  {navigationLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-2 rounded-lg transition-all duration-300 text-lg font-medium ${isActive(link.path)
                            ? 'bg-gray-900 text-white shadow-lg'
                            : 'text-gray-800 hover:bg-gray-100'
                          }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {user.accessToken ? (
                    <div className="flex flex-col space-y-3 items-center">
                      <span className="text-lg font-medium">{user.name}</span>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="w-full text-center px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-300"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-300"
                    >
                      Login
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      <BreadCrumbs />
    </div>
  );
}

export default Header;
