import React from "react";
import { MdCloseFullscreen } from "react-icons/md";
import { motion } from "framer-motion";
function DocumentModal({ src, onClose }) {
  return (
    <div className="fixed h-screen w-screen top-0 left-0 bg-black bg-opacity-50 flex justify-center items-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="h-3/4 relative bg-white rounded-lg">
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="absolute top-5 right-5 text-3xl text-red-700"
          onClick={onClose}
        >
          <MdCloseFullscreen />
        </motion.button>
        <img src={src} alt="" className="h-full" />
      </motion.div>
    </div>
  );
}

export default DocumentModal;
