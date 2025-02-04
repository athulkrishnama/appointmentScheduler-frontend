import React from 'react';
import { motion } from 'framer-motion';
import { MdClose, MdAttachMoney, MdCreditCard } from 'react-icons/md';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, paymentMethod, setPaymentMethod }) => {
  const handlePaymentMethodClick = (method) => {
    setPaymentMethod(method);
  };

  return (
    <>
      {isOpen && (
        <motion.div
          className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className='bg-white rounded-lg p-5 w-[90vw] md:w-[30vw] shadow-lg'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold'>Confirmation</h2>
              <MdClose className='cursor-pointer' onClick={onClose} />
            </div>
            <p className='mb-4'>Are you sure you want to confirm? <br />Once confirmed, you will no longer have access to this chat and <br /> cannot request changes to the quotation.</p>
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Payment Method</label>
              <div className='flex justify-around'>
                <div
                  className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${paymentMethod === 'cash' ? 'bg-gray-200' : ''}`}
                  onClick={() => handlePaymentMethodClick('cash')}
                >
                  <MdAttachMoney className='text-green-500 mr-2' />
                  <span>Cash</span>
                </div>
                <div
                  className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${paymentMethod === 'online' ? 'bg-gray-200' : ''}`}
                  onClick={() => handlePaymentMethodClick('online')}
                >
                  <MdCreditCard className='text-blue-500 mr-2' />
                  <span>Online</span>
                </div>
              </div>
            </div>
            <div className='flex justify-end gap-3'>
              <button
                className='bg-gray-800 text-white py-2 px-4 rounded'
                onClick={() => onConfirm(paymentMethod)}
              >
                Confirm
              </button>
              <button
                className='bg-gray-300 text-black py-2 px-4 rounded'
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ConfirmationModal;
