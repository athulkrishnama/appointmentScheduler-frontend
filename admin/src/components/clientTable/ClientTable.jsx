import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { FaLock, FaUnlock } from 'react-icons/fa';

const ClientTable = ({ clients , changeStatus}) => {
  const [confirmation, setConfirmation] = useState({ show: false, clientId: null, clientName: '', action: '' });

  const handleButtonClick = (clientId, name, action) => {
    setConfirmation({ show: true, clientId: clientId, clientName: name, action });
  };

  const setBlock = async(action) => {
    const response = await changeStatus(confirmation.clientId, action);
    if(response.success){
    toast.success(`${confirmation.action}  confirmed for  ${confirmation.clientName}`);
    }else{
      toast.error("An error occurred while updating the status.");
    }
    setConfirmation({ show: false, clientId: null, clientName: '', action: '' });
  };



  if (!clients || clients.length === 0) {
    return <div className="text-center py-4 text-gray-500">No clients available</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full md:w-[60vw] mx-auto overflow-x-auto rounded-lg shadow-lg mt-12"
    >
      <table className="min-w-full bg-gray-50 rounded-lg">
        <thead className="bg-gray-200 text-gray-800">
          <tr>
            <th className="py-3 px-2 md:px-6 text-left">Full Name</th>
            <th className="py-3 px-2 md:px-6 text-left">Email</th>
            <th className="py-3 px-2 md:px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <motion.tr 
              key={index} 
              className="border-b border-gray-300 hover:bg-gray-100"
            >
              <td className="py-4 px-2 md:px-6 text-gray-800">{client.fullname}</td>
              <td className="py-4 px-2 md:px-6 text-gray-800">{client.email}</td>
              <td className="py-4 px-2 md:px-6 flex">
                {client.isActive ? (
                  <button 
                    onClick={() => handleButtonClick(client._id, client.fullname, 'block')}
                    className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2 flex items-center"
                  >
                    <FaLock className="mr-2" /> Block
                  </button>
                ) : (
                  <button 
                    onClick={() => handleButtonClick(client._id, client.fullname, 'unblock')}
                    className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  >
                    <FaUnlock className="mr-2" /> Unblock
                  </button>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {confirmation.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-medium text-gray-900">Confirm {confirmation.action} </h3>
            <p className="mt-2 text-sm text-gray-500">Are you sure you want to {confirmation.action.toLowerCase()} {confirmation.clientName}?</p>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
                onClick={()=>setBlock(confirmation.action)}
              >
                Confirm
              </button>
              <button
                type="button"
                className="ml-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-black bg-white border border-black rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
                onClick={()=>setBlock(confirmation.action)}
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

export default ClientTable;
