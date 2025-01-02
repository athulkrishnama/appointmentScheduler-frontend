import { useState } from "react"
import Cropper from 'react-easy-crop'
import { motion } from 'framer-motion'
import { MdClose } from 'react-icons/md';
import { getCroppedImage, createImage } from './cropHelpers'

function Crop({ aspectRatio, image, onClose, onCrop }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Function to generate cropped image and send to parent
  const handleApplyCrop = async () => {
    const croppedImage = await getCroppedImage(image, croppedAreaPixels);
    onCrop(croppedImage); 
    onClose(); 
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="absolute top-0 left-0  h-full w-full flex justify-center items-center bg-transparent z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-[40vw] h-[30vw] p-7 bg-white flex flex-col relative  shadow-2xl rounded-3xl"
      >
        <MdClose className="absolute top-2 right-2 text-red-500 cursor-pointer" size={24} onClick={onClose} />
        <motion.div>
          <h5 className="text-center text-lg font-semibold my-3">Crop image</h5>
        </motion.div>
        <div
          className="p-5 h-full bg-white object-contain relative"
        >

          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            cropSize={{ width: 300, height: 300 }}
          />
        </div>
        <button type="button" className="mt-4 bg-black text-white py-2 px-4 rounded" onClick={handleApplyCrop}>Apply Crop</button>
      </motion.div>
    </motion.div>
  )
}

export default Crop
