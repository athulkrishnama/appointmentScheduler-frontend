import React from 'react';
import { motion } from 'framer-motion';

function Message({ message }) {
  return (
    <motion.div
      className='bg-white shadow-md rounded-lg p-4 mb-4'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      <p className='text-black'>{message.message}</p>
    </motion.div>
  );
}

export default Message;
