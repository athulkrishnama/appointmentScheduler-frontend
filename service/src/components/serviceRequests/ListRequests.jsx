import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../axios/axios';
import Pagination from '../pagination/Pagination';

function ListRequests() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [serviceRequests, setServiceRequests] = useState([]);
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
    <div className="h-full w-[90vw] md:w-[50vw] mx-auto my-24 shadow-[10px_10px_50px_rgb(0,0,0,0.4)] rounded-3xl bg-white px-5">
      <h1 className="text-3xl font-bold text-center text-gray-800 mt-5">Your Service Requests</h1>
      <motion.table
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full mt-5 rounded-lg"
      >
        <thead className="bg-gray-100 ">
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
                  onClick={() => console.log(`View details of ${request.service?.serviceName}`)}
                >
                  View Details
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
      <Pagination
        total={totalPages}
        current={page}
        setPage={setPage}
      />
    </div>
  );
}

export default ListRequests;