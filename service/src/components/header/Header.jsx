import React from "react";
import { motion } from "framer-motion";
import logo from "../../assets/timelens.png";
import { Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  setAccessToken,
  setName,
  setEmail,
  setPhoneNumber,
} from "../../store/userSlice/userSlice";
function Header() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const links = [
    { linktext: "Dashboard", link: "dashboard" },
    { linktext: "Service Management", link: "service-management" },
    { linktext: "Coupons", link: "coupons" },
    { linktext: "Quotations", link: "quotations" },
    { linktext: "Schedule Services", link: "schedule-services" },
    { linktext: "Service History", link: "service-history" },
    { linktext: "Reviews", link: "reviews" },
  ];

  const handleLogout = () => {
    dispatch(setAccessToken(""));
    dispatch(setName(""));
    dispatch(setEmail(""));
    dispatch(setPhoneNumber(""));
  };
  return (
    <motion.nav
      className="px-10 py-1 shadow-2xl rounded-3xl bg-white z-10 flex justify-between"
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.img src={logo} className="h-20" alt="logo" />
      <div className="flex gap-3 items-center ">
        {links.map(({ linktext, link }) => (
          <Link to={link} className="hover:text-gray-600 text-lg font-medium">
            {linktext}
          </Link>
        ))}
      </div>
      <div className="flex gap-9 items-center">
        {user.accessToken ? (
          <>
            <h3 className="hover:cursor-pointer">{user.name}</h3>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </Link>
        )}
      </div>
    </motion.nav>
  );
}

export default Header;
