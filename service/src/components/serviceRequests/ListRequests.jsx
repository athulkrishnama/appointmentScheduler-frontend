import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../axios/axios';
import Pagination from '../pagination/Pagination';
import { useNavigate } from 'react-router';

function ListRequests() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [serviceRequests, setServiceRequests] = useState([]);

  const navigate = useNavigate();
  const limit = 3;

  const fetchServiceRequests = async () => {
    try {
      const response = await axios.get(`/serviceProvider/getServiceRequests?page=${page}&limit=${limit}`);
      setTotalPages(response.data.totalPages);
      setServiceRequests(response.data.serviceRequests);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchServiceRequests();
  }, [page]);

  return (
    <div className="h-full w-[90vw] md:w-[50vw] mx-auto my-8 md:my-24 shadow-[10px_10px_50px_rgb(0,0,0,0.4)] rounded-3xl bg-white px-3 md:px-5">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mt-5 mb-6">Your Service Requests</h1>
      
      <div className="hidden md:block w-full">
        <motion.table
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full rounded-lg"
        >
          <thead className="bg-gray-100">
            <tr className='rounded-tr-lg text-left'>
              <th className="px-6 py-4 whitespace-nowrap text-gray-500">Sl No</th>
              <th className="px-6 py-4 whitespace-nowrap text-gray-500">Client Name</th>
              <th className="px-6 py-4 whitespace-nowrap text-gray-500">Date</th>
              <th className="px-6 py-4 whitespace-nowrap text-gray-500">Requested Service</th>
              <th className="px-6 py-4 whitespace-nowrap text-gray-500">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {serviceRequests.map((request, index) => (
              <motion.tr
                key={request._id}
                variants={{
                  hidden: { opacity: 0, x: -20 * (index % 2 ? -1 : 1) },
                  visible: { opacity: 1, x: 0 },
                }}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.5, delay: 0.3 * (index + 1) }}
                className="hover:bg-gray-100"
              >
                <td className="px-6 py-4 whitespace-nowrap">{limit * (page - 1) + index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.client?.fullname}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.date.split('T')[0]}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.service?.serviceName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-black text-white px-4 py-2 rounded-md"
                    onClick={() => navigate(`/serviceRequests/${request._id}`)}
                  >
                    View Details
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>

      <div className="md:hidden space-y-4">
        {serviceRequests.map((request, index) => (
          <motion.div
            key={request._id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-100"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-gray-500">
                #{limit * (page - 1) + index + 1}
              </span>
              <span className="text-sm text-gray-500">
                {request.date.split('T')[0]}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div>
                <label className="text-xs text-gray-500">Client</label>
                <p className="font-medium text-gray-900">{request.client?.fullname}</p>
              </div>
              
              <div>
                <label className="text-xs text-gray-500">Service</label>
                <p className="font-medium text-gray-900">{request.service?.serviceName}</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-black text-white py-2 px-4 rounded-md text-sm font-medium"
              onClick={() => navigate(`/service-request-details/${request._id}`)}
            >
              View Details
            </motion.button>
          </motion.div>
        ))}
      </div>

      {serviceRequests.length === 0 ? (
        <p className='text-gray-500 text-center py-8'>No service requests found</p>
      ) : (
        <div className="py-6">
          <Pagination
            total={totalPages}
            current={page}
            setPage={setPage}
          />
        </div>
      )}
    </div>
  );
}

export default ListRequests;