import { useState, useEffect } from "react"
import Cropper from 'react-easy-crop'
import { motion } from 'framer-motion'
import { MdClose } from 'react-icons/md';

function Crop({ aspectRatio, image, onClose, onCrop }) {
  

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="absolute top-0 left-0  h-full w-full flex justify-center items-center bg-transparent z-50">
      crop
    </motion.div>
  )
}

export default Crop
