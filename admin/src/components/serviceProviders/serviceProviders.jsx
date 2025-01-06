import React, { useState } from 'react';
import { FaLock, FaUnlock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ServiceProviders = ({ providers, changeStatus }) => {
  const [confirmation, setConfirmation] = useState({ show: false, providerId: null, providerName: '', action: '' });

  const handleButtonClick = (providerId, name, action) => {
    setConfirmation({ show: true, providerId, providerName: name, action });
  };

  const setBlock = async (action) => {
    const response = await changeStatus(confirmation.providerId, action);
    if (response.success) {
      toast.success(`${confirmation.action} confirmed for ${confirmation.providerName}`);
    } else {
      toast.error('An error occurred while updating the status.');
    }
    setConfirmation({ show: false, providerId: null, providerName: '', action: '' });
  };

  if (!providers || providers.length === 0) {
    return <div className="text-center py-4 text-gray-500">No service providers available</div>;
  }

  return (
    <div className="w-full md:w-[60vw] mx-auto overflow-x-auto rounded-lg shadow-lg mt-12">
      <table className="min-w-full bg-gray-50 rounded-lg">
        <thead className="bg-gray-200 text-gray-800">
          <tr>
            <th className="py-3 px-2 md:px-6 text-left">Logo</th>
            <th className="py-3 px-2 md:px-6 text-left">Full Name</th>
            <th className="py-3 px-2 md:px-6 text-left">Email</th>
            <th className="py-3 px-2 md:px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((provider, index) => (
            <tr key={index} className="border-b border-gray-300 hover:bg-gray-100">
              <td className="py-4 px-2 md:px-6 text-gray-800">
                <img src={provider.serviceDetails.logo} alt="logo" className="w-20 h-20 rounded-md drop-shadow-2xl" />
              </td>
              <td className="py-4 px-2 md:px-6 text-gray-800">{provider.fullname}</td>
              <td className="py-4 px-2 md:px-6 text-gray-800">{provider.email}</td>
              <td className="py-4 px-2 md:px-6 flex">
                {provider.isActive ? (
                  <button
                    onClick={() => handleButtonClick(provider._id, provider.fullname, 'block')}
                    className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2 flex items-center"
                  >
                    <FaLock className="mr-2" /> Block
                  </button>
                ) : (
                  <button
                    onClick={() => handleButtonClick(provider._id, provider.fullname, 'unblock')}
                    className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  >
                    <FaUnlock className="mr-2" /> Unblock
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmation.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-medium text-gray-900">Confirm {confirmation.action} </h3>
            <p className="mt-2 text-sm text-gray-500">Are you sure you want to {confirmation.action.toLowerCase()} {confirmation.providerName}?</p>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
                onClick={() => setBlock(confirmation.action)}
              >
                Confirm
              </button>
              <button
                type="button"
                className="ml-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-black bg-white border border-black rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
                onClick={() => setConfirmation({ show: false, providerId: null, providerName: '', action: '' })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceProviders;