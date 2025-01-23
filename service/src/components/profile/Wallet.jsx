import React from 'react'
import { motion } from 'framer-motion'
function Wallet() {
  return (
    <motion.div
    key="wallet"
    initial={{ opacity: 0, x: 1000 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 1000 }}
    transition={{ duration: 0.5  }}
    className="absolute bg-white w-full h-full mx-2"
  >
    This is wallet
  </motion.div>
  )
}

export default Wallet
