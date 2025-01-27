import React from 'react';
import { motion } from 'framer-motion';

function Quotation({ message }) {
  const { amountBreakdown } = message.message;

  return (
    <motion.div
      className='bg-white shadow-lg rounded-lg p-5 mb-4'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className='text-black text-xl font-bold mb-4'>Quotation Details</h2>
      <table className='w-full border-collapse'>
        <thead>
          <tr className='border-b'>
            <th className='p-2 text-left'>Description</th>
            <th className='p-2 text-left'>Amount</th>
          </tr>
        </thead>
        <tbody>
          {amountBreakdown.map((item, index) => (
            <tr key={index} className='border-b hover:bg-gray-100'>
              <td className='p-2'>{item.description}</td>
              <td className='p-2 flex items-center'>
                ₹ {item.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='mt-4 text-black font-semibold'>
        Total: ₹ {amountBreakdown.reduce((acc, item) => acc + item.amount, 0).toFixed(2)}
      </div>
    </motion.div>
  );
}

export default Quotation;
