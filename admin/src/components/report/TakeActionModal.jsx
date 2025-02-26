import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose } from "react-icons/md";

function TakeActionModal({ isOpen, handleClose, handleAction, isLoading }) {
  const handleClick = (action) => {
    handleAction(action);
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-0 right-0 h-screen w-screen bg-black bg-opacity-30 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="bg-white px-4 py-8 rounded-lg shadow-xl relative w-[20vw]"
          >
            <button className="absolute top-1 right-1" onClick={handleClose}>
              <MdClose className="text-red-500 text-2xl" />
            </button>
            <h1 className="text-2xl text-center font-medium text-gray-800">
              Select Action
            </h1>
            <div className="flex justify-between mt-5">
              <button
                onClick={() => handleClick("warn")}
                disabled={isLoading}
                className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors duration-300 disabled:cursor-not-allowed"
              >
                Send Warning Mail{" "}
              </button>
              <button
                onClick={() => handleClick("block")}
                disabled={isLoading}
                className="px-3 py-2 rounded-md bg-black hover:bg-gray-800 text-white font-bold disabled:cursor-not-allowed disabled:bg-gray-500"
              >
                Block Service Provider
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TakeActionModal;
