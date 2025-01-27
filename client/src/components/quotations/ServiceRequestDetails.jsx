import React from 'react';
import { motion } from 'framer-motion';

function ServiceRequestDetails({ serviceRequest }) {
  const animationVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

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
          <motion.tr 
            variants={animationVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className='border-b'
          >
            <td className='p-2 font-semibold'>Client Name:</td>
            <td className='p-2'>{serviceRequest.client.fullname}</td>
          </motion.tr>
          <motion.tr 
            variants={animationVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className='border-b'
          >
            <td className='p-2 font-semibold'>Service:</td>
            <td className='p-2'>{serviceRequest.service.serviceName}</td>
          </motion.tr>
          <motion.tr 
            variants={animationVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className='border-b'
          >
            <td className='p-2 font-semibold'>Service Provider :</td>
            <td className='p-2'>{serviceRequest.service.serviceProvider.fullname}</td>
          </motion.tr>
          <motion.tr 
            variants={animationVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className='border-b'
          >
            <td className='p-2 font-semibold'>Date:</td>
            <td className='p-2'>{serviceRequest.date}</td>
          </motion.tr>
          <motion.tr 
            variants={animationVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className='border-b'
          >
            <td className='p-2 font-semibold'>Time:</td>
            <td className='p-2'>{serviceRequest.time}</td>
          </motion.tr>
          <motion.tr 
            variants={animationVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
            className='border-b'
          >
            <td className='p-2 font-semibold'>Notes:</td>
            <td className='p-2'>{serviceRequest.additionalNotes}</td>
          </motion.tr>
          <motion.tr 
            variants={animationVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
            className='border-b'
          >
            <td className='p-2 font-semibold'>Address:</td>
            <td className='p-2'>
              {serviceRequest.address?.fullName}, {serviceRequest.address?.area}, 
              {serviceRequest.address?.district}, {serviceRequest.address?.state}, 
              {serviceRequest.address?.pincode}
            </td>
          </motion.tr>
          {serviceRequest.additionalDetails?.map((detail, index) => (
            <motion.tr 
              key={index}
              variants={animationVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 + index * 0.1 }}
              className='border-b'
            >
              <td className='p-2 font-semibold'>{detail.fieldName}:</td>
              <td className='p-2'>{detail.value}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

export default ServiceRequestDetails;
