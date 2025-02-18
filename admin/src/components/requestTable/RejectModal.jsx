import React, { useState } from 'react'
import { motion } from 'framer-motion'
import REJECTION_REASONS from '../../constants/rejectionReason'

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
}

function RejectModal({ onClose, handleReject, isLoading }) {
    const [selectedReason, setSelectedReason] = useState(Object.values(REJECTION_REASONS)[0])

  return (
    <motion.div
      className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
    >
      <motion.div
        className="bg-white shadow-lg p-8 rounded-2xl"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
      >
        <h2 className="text-2xl font-bold mb-2">Reject Request</h2>
        <p className="mb-4">Are you sure you want to reject this request?</p>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Reason</label>
          <select value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)} className="w-full p-2 border border-gray-300 rounded">
            {Object.entries(REJECTION_REASONS).map(([_,reason]) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-end">
          <button
            className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="py-2 px-4 bg-gray-800 text-white rounded-lg"
            onClick={() => handleReject(selectedReason)}
          >
            {isLoading ? 'Rejecting...' : 'Reject'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RejectModal
