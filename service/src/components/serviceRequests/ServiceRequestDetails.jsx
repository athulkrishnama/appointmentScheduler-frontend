import React from 'react';
import { motion } from 'framer-motion';

function ServiceRequestDetails({ serviceRequest }) {
    console.log(serviceRequest)
  if (!Object.keys(serviceRequest).length) {
    return <div>Loading...</div>;
  }

  const animationVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=" mx-auto my-5 p-6 bg-white shadow-lg rounded-lg mt-10"
    >
      <h1 className="text-2xl font-bold mb-4">Service Request Details</h1>
      <table className="w-full">
        <tbody>
          <motion.tr variants={animationVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="text-lg">
            <td className="pr-4"><strong>Service:</strong></td>
            <td>{serviceRequest.service.serviceName}</td>
          </motion.tr>
          <motion.tr variants={animationVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="text-lg">
            <td className="pr-4"><strong>Client:</strong></td>
            <td>{serviceRequest.client.fullname}</td>
          </motion.tr>
          <motion.tr variants={animationVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="text-lg">
            <td className="pr-4"><strong>Date:</strong></td>
            <td>{new Date(serviceRequest.date).toLocaleDateString()}</td>
          </motion.tr>
          <motion.tr variants={animationVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }} className="text-lg">
            <td className="pr-4"><strong>Time:</strong></td>
            <td>{serviceRequest.time}</td>
          </motion.tr>
          <motion.tr variants={animationVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }} className="text-lg">
            <td className="pr-4"><strong>Is Recurring:</strong></td>
            <td>{serviceRequest.serviceFrequency !== 'Once' ? 'Yes' : 'No'}</td>
          </motion.tr>
          {serviceRequest.recurringEndDate && (
            <motion.tr variants={animationVariants} initial="hidden" animate="visible" transition={{ delay: 0.6 }} className="text-lg">
              <td className="pr-4"><strong>Recurring End Date:</strong></td>
              <td>{new Date(serviceRequest.recurringEndDate).toLocaleDateString()}</td>
            </motion.tr>
          )}
          <motion.tr variants={animationVariants} initial="hidden" animate="visible" transition={{ delay: 0.7 }} className="text-lg">
            <td className="pr-4"><strong>Additional Notes:</strong></td>
            <td>{serviceRequest.additionalNotes}</td>
          </motion.tr>
          <motion.tr variants={animationVariants} initial="hidden" animate="visible" transition={{ delay: 0.8 }} className="text-lg">
            <td className="pr-4"><strong>Address:</strong></td>
            <td>
              {serviceRequest.address?.fullName}, {serviceRequest.address?.area}, 
              {serviceRequest.address?.district}, {serviceRequest.address?.state}, 
              {serviceRequest.address?.pincode}
            </td>
          </motion.tr>
        </tbody>
      </table>
      <h2 className="text-xl font-semibold mt-6">Additional Information</h2>
      <table className="w-full mt-2">
        <tbody>
          {serviceRequest.additionalDetails.map((detail, index) => (
            <motion.tr key={index} variants={animationVariants} initial="hidden" animate="visible" transition={{ delay: 0.8 + index * 0.1 }} className="text-lg">
              <td className="pr-4"><strong>{detail.fieldName}:</strong></td>
              <td>{detail.value}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

export default ServiceRequestDetails;
