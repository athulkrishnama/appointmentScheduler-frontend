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
import {useNavigate} from 'react-router'
function Header() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const links = [
    { linktext: "Dashboard", link: "" },
    { linktext: "Service Providers", link: "serviceProviders" },
    { linktext: "Requests", link: "requests" },
    { linktext: "Clients", link: "clients" },
    { linktext: "Categories", link: "categories" }
  ]

  const handleLogout = () => {
    dispatch(setAccessToken(""));
    dispatch(setName(""));
    dispatch(setEmail(""));
    dispatch(setPhoneNumber(""));
    navigate('/login')

  };
  return (
    <motion.nav
      className="px-10 py-1 shadow-2xl rounded-3xl bg-white z-10 flex justify-between"
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-4xl font-bold text-gray-800 tracking-tight my-4">Admin Panel</h1>
      <div className="flex gap-3 items-center ">
        {links.map(({ linktext, link }) => (
          <Link to={link} className="hover:text-gray-600 text-lg font-medium">
            {linktext}
          </Link>
        ))}
      </div>
      <div className="flex gap-9 items-center">
       
            <h3 className="hover:cursor-pointer">{user.name}</h3>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
      </div>
    </motion.nav>
  );
}

export default Header;