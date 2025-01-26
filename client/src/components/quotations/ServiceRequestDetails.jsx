import React from 'react';
import { motion } from 'framer-motion';

function ServiceRequestDetails({ serviceRequest }) {
  if (!Object.keys(serviceRequest).length) {
    return <div>Loading...</div>;
  }
  return (
    <motion.div
      className='bg-white shadow-lg rounded-lg p-6 mb-4'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className='text-black text-xl font-bold mb-4'>Service Request Details</h2>
      <table className='w-full border-collapse'>
        <tbody>
          <tr className='border-b'>
            <td className='p-2 font-semibold'>Client Name:</td>
            <td className='p-2'>{serviceRequest.client.fullname}</td>
          </tr>
          <tr className='border-b'>
            <td className='p-2 font-semibold'>Service:</td>
            <td className='p-2'>{serviceRequest.service.serviceName}</td>
          </tr>
          <tr className='border-b'>
            <td className='p-2 font-semibold'>Date:</td>
            <td className='p-2'>{serviceRequest.date}</td>
          </tr>
          <tr className='border-b'>
            <td className='p-2 font-semibold'>Time:</td>
            <td className='p-2'>{serviceRequest.time}</td>
          </tr>
          <tr className='border-b'>
            <td className='p-2 font-semibold'>Notes:</td>
            <td className='p-2'>{serviceRequest.additionalNotes}</td>
          </tr>
        </tbody>
      </table>
    </motion.div>
  );
}

export default ServiceRequestDetails;
