import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/timelens.png";
import { NavLink } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Notification from "../notification/Notification";
import {
  setAccessToken,
  setName,
  setEmail,
  setPhoneNumber,
} from "../../store/userSlice/userSlice";
import BreadCrumbs from "../breadCrumbs/BreadCrumbs";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const links = [
    { linktext: "Dashboard", link: "" },
    { linktext: "Service Management", link: "serviceManagement" },
    { linktext: "Coupons", link: "coupons" },
    { linktext: "Service Requests", link: "serviceRequests" },
    { linktext: "Scheduled Appointments", link: "scheduledAppointments" },
    { linktext: "Service History", link: "service-history" },
    { linktext: "Reviews", link: "reviews" },
    { linktext: "Profile", link: "profile" },
  ];

  const handleLogout = () => {
    dispatch(setAccessToken(""));
    dispatch(setName(""));
    dispatch(setEmail(""));
    dispatch(setPhoneNumber(""));
  };

  return (
    <div className="sticky top-0 left-0 right-0 w-full">
      <motion.nav
        className="px-4 md:px-10 py-1 shadow-2xl  bg-white z-50"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-center">
          <motion.img src={logo} className="h-16 md:h-20" alt="logo" />
      
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="w-6 h-0.5 bg-gray-800 mb-1"></div>
            <div className="w-6 h-0.5 bg-gray-800 mb-1"></div>
            <div className="w-6 h-0.5 bg-gray-800"></div>
          </button>
          <div className="hidden md:flex gap-3 items-center">
            {links.map(({ linktext, link }) => (
              <NavLink
                key={link}
                to={link}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition-all duration-200 text-lg font-medium ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`
                }
              >
                {linktext}
              </NavLink>
            ))}
          </div>
          <div className="hidden md:flex gap-9 items-center">
            {user.accessToken ? (
              <>
                <Notification />
                <h3 className="hover:cursor-pointer">{user.name}</h3>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-2 py-4">
                {links.map(({ linktext, link }) => (
                  <NavLink
                    key={link}
                    to={link}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg transition-all duration-200 text-lg font-medium ${
                        isActive
                          ? "bg-gray-800 text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }`
                    }
                  >
                    {linktext}
                  </NavLink>
                ))}
                <div className="mt-4 flex flex-col gap-4 items-center">
                  {user.accessToken ? (
                    <>
                      <NotificationBar />
                      <h3 className="hover:cursor-pointer">{user.name}</h3>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <NavLink
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full text-center"
                    >
                      Login
                    </NavLink>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
        <BreadCrumbs />
    </div>
  );
}

export default Header;
