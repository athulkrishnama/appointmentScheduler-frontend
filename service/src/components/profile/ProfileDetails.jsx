import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Info from "./Info";
import Wallet from "./Wallet";
import axios from "../../axios/axios";
function ProfileDetails() {
  const [type, setType] = useState("info");
  const [user, setUser] = useState({});
  const fetchData = async () => {
    try {
      const response = await axios.get("/serviceProvider/getServiceProviderDetails");
      setUser(response.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="flex flex-col w-full h-[80vh] justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-100 rounded-2xl shadow-2xl p-5 w-[90vw] md:w-[60vw] h-[80vh] md:h-[80vh] flex flex-col gap-4 overflow-x-hidden"
      >
        <div>
          <h1 className="text-3xl text-center font-black">Profile Page</h1>
          <div className="flex w-full bg-white rounded-lg p-2 shadow-2xl mt-3">
            <h1
              className={`w-1/2 text-center  rounded-lg  font-bold  py-3 transition duration-300 ease-in-out cursor-pointer ${
                type === "info" && "text-white bg-gray-800"
              }`}
              onClick={() => setType("info")}
            >
              Info
            </h1>
            <h1
              className={`w-1/2 text-center  rounded-lg  font-bold  py-3 transition duration-300 ease-in-out cursor-pointer ${
                type === "wallet" && "text-white bg-gray-800"
              }`}
              onClick={() => setType("wallet")}
            >
              Wallet
            </h1>
          </div>
        </div>
        <div className="w-full h-full flex justify-center items-center overflow-x-hidden relative">
          <AnimatePresence>
            {type === "info" ? <Info user={user} setUser={setUser} /> : <Wallet />}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default ProfileDetails;
