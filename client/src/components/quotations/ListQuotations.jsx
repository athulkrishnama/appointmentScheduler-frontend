import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../../axios/axios";
import Pagination from "../pagination/Pagination";
import { useNavigate } from "react-router";

function ListQuotations() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [quotations, setQuotations] = useState([]);

  const limit = 5;
  const navigate = useNavigate();

  const fetchQuotations = async () => {
    try {
      const response = await axios.get(
        `/client/getServiceRequests/?page=${page}&limit=${limit}`
      );
      setTotalPages(response.data.totalPages);
      setQuotations(response.data.serviceRequests);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [page]);

  return (
    <div className="shadow-[10px_10px_100px_rgba(0,0,0,0.25)] p-3 md:p-5 rounded-2xl bg-white min-h-[50vh]">
      <h1 className="text-2xl md:text-3xl font-black text-center text-gray-800 mb-5">
        Your Service Requests
      </h1>

      <div className="w-full">
        {quotations.map((quotation, index) => (
          <motion.div
            key={quotation._id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
            className="md:hidden mb-4 bg-gray-50 rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm font-medium text-gray-900">
                #{limit * (page - 1) + index + 1}
              </div>
              <div className="text-sm text-gray-500">
                {typeof quotation.date.split("T")[0] === "string" &&
                  quotation.date.split("T")[0]}
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-500 uppercase">Service</div>
                <div className="font-medium">{quotation.service.serviceName}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase">Provider</div>
                <div className="font-medium">
                  {quotation.service.serviceProvider?.fullname}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <motion.button
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-sm"
                onClick={() => navigate(`/serviceRequestDetails/${quotation._id}`)}
              >
                View Details
              </motion.button>
            </div>
          </motion.div>
        ))}

        <motion.table
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full hidden md:table"
        >
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service Provider
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {quotations.map((quotation, index) => (
              <motion.tr
                key={quotation._id}
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
                <td className="px-6 py-4 whitespace-nowrap">
                  {limit * (page - 1) + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {quotation.service.serviceName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {quotation.service.serviceProvider?.fullname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {typeof quotation.date.split("T")[0] === "string" &&
                    quotation.date.split("T")[0]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <motion.button
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => navigate(`/serviceRequestDetails/${quotation._id}`)}
                  >
                    View Details
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>

      {quotations.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">No quotations found</p>
      ) : (
        <div className="mt-6">
          <Pagination current={page} setPage={setPage} total={totalPages} />
        </div>
      )}
    </div>
  );
}

export default ListQuotations;
