import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose } from "react-icons/md";

function IgnoreModal({ isOpen, handleIgnore, handleClose, isLoading }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
        className="h-screen w-screen bg-black bg-opacity-50 absolute top-0 right-0 flex justify-center items-center"
        initial={{opacity:0}}
        animate={{opacity:1}}
        exit={{opacity:0}}
        >

          <motion.div
            className="bg-white p-4 rounded-xl relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <button onClick={handleClose} className="absolute top-1 right-1"><MdClose className="text-red-500 text-lg"/></button>
            <h3 className="text-xl font-semibold mb-3">Ignore Appointment</h3>
            <p>Are you sure want to ignore this appointment?</p>
            <div className="flex justify-between mt-5">
              <button
                className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                disabled={isLoading}
                className="px-2 py-1 rounded-md bg-gray-950 hover:bg-gray-800 text-white disabled:cursor-not-allowed disabled:bg-gray-600"
                onClick={handleIgnore}
              >
                {isLoading ? "loading..." : "Ignore"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default IgnoreModal;
