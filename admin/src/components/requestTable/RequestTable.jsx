import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from '../../axios/axios';
import { toast } from 'react-toastify';
import {removeRequest} from '../../store/requestSlice/requestSlice';
import { useDispatch } from 'react-redux';
const RequestTable = ({ requests,  }) => {
  const [confirmation, setConfirmation] = useState({ show: false, requestId: null, status: '' });

  const dispatch = useDispatch();
  const handleButtonClick = (requestId, status) => {
    setConfirmation({ show: true, requestId, status });
  };

  const confirmStatusChange = async () => {
    try {
      const response = await axios.patch('/admin/updateRequestStatus', { id: confirmation.requestId, status: confirmation.status });
      console.log(response.data.message);
      if (response.data.success) {
        dispatch(removeRequest(confirmation.requestId));
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message); 
      }
      setConfirmation({ show: false, requestId: null, status: '' });
    } catch (error) {
      setConfirmation({ show: false, requestId: null, status: '' });
      console.error('There was an error updating the status:', error);
      toast.error(error.response?.data?.message || 'An unexpected error occurred.'); 
    }
  };

  const cancelConfirmation = () => {
    setConfirmation({ show: false, requestId: null, status: '' });
  };

  if (!requests || requests.items.length === 0) {
    return <div className="text-center py-4 text-gray-500">No pending requests</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-[90vw] md:w-[60vw] mx-auto overflow-x-auto rounded-lg shadow-lg mt-12"
    >
      <table className="w-full bg-white rounded-lg">
        <thead className="bg-gray-200 text-black">
          <tr>
            
            <th className="py-3 px-6 text-left">Company Logo</th>
            <th className="py-3 px-6 text-left">Company Name</th>
            <th className="py-3 px-6 text-left">Description</th>
            <th className="py-3 px-6 text-left">Request Date</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.items.map((request, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-4 px-6 text-black">
                <img 
                  src={request.serviceDetails.logo} 
                  alt="Company Logo" 
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </td>
              <td className="py-4 px-6 text-black">{request.fullname}</td>
              <td className="py-4 px-6 text-black">{request.serviceDetails.description}</td>
              <td className="py-4 px-6 text-black">{new Date(request.createdAt).toLocaleDateString()}</td>
              <td className="py-4 px-6  h-full">
                <button 
                  onClick={() => handleButtonClick(request._id, 'accepted')}
                  className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Accept
                </button>
                <button 
                  onClick={() => handleButtonClick(request._id, 'rejected')}
                  className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmation.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-medium text-gray-900">Confirm {confirmation.status.toLowerCase()} Request</h3>
            <p className="mt-2 text-sm text-gray-500">Are you sure you want to {confirmation.status.toLowerCase()} this request?</p>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
                onClick={confirmStatusChange}
              >
                Confirm
              </button>
              <button
                type="button"
                className="ml-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-black bg-white border border-black rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
                onClick={cancelConfirmation}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RequestTable;
