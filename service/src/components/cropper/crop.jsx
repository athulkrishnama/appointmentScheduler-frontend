import { useRef } from "react"
import { motion } from 'framer-motion'
import Cropper from 'react-cropper'
import { MdClose } from 'react-icons/md';
import "cropperjs/dist/cropper.css";

function Crop({ aspectRatio, image, onClose, setImage }) {
  const cropperRef = useRef(null);
  const handleCrop = () => {
    const canvas = cropperRef.current.cropper.getCroppedCanvas();
    const blob = canvas.toBlob((blob) => {
      setImage(blob);
    }, 'image/jpeg');
    onClose();
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="fixed top-0 left-0  h-full w-full flex justify-center items-center bg-transparent z-50">
      <div className="p-5 bg-white rounded-3xl shadow-2xl relative">
        <MdClose className="absolute top-5 right-5 text-red-500 cursor-pointer" size={24} onClick={onClose} aria-label="Close" />
        <h1 className="text-2xl text-center w-[90vw] md:w-[40vw]">Crop Your Image</h1>
        <Cropper
          ref={cropperRef}
          src={URL.createObjectURL(image)}
          guides={true}
          preview=".image-preview"
          aspectRatio={aspectRatio}
          viewMode={1}
          background={true}
          className="w-[90vw] md:w-[40vw] h-[50vh] mt-5"
        />
        <div className="flex justify-center"><button type="button" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4" onClick={handleCrop}>Crop</button></div>
      </div>
    </motion.div>
  )
}

export default Crop
