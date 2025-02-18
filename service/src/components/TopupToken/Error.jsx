import React from 'react'
import {MdErrorOutline, MdWarning} from 'react-icons/md'
import {motion} from 'framer-motion'

function Error({error}) {
  return (
    <motion.div
      initial={{opacity: 0, y: 40, scale: 0.9}}
      animate={{opacity: 1, y:0, scale: 1}}
      exit={{opacity: 0, y: 40, scale: 0.9}}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-white bg-opacity-50" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          <div className="flex items-center justify-center">
            <MdWarning className="text-6xl text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold mt-4 text-center">Error </h1>
          <p className="text-lg mt-2 font-bold text-center">{error.message}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default Error
