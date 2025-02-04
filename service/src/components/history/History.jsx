import React, { useEffect, useState } from 'react';
import axios from '../../axios/axios';
import Pagination from '../pagination/Pagination';
import { motion } from 'framer-motion';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import { MdCheckCircle, MdError, MdRefresh } from 'react-icons/md';

const animationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function History() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const LIMIT = 5;

  useEffect(() => {
    fetchAppointments();
  }, [page]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`/serviceProvider/getCompletedAppointments?page=${page}&limit=${LIMIT}`);
      if (response.data.success) {
        setAppointments(response.data.appointments);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <MdCheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <MdRefresh className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <MdError className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };


  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setIsModalOpen(false);
  };

  return (
    <div className="w-[90vw] md:w-[50vw] mx-auto px-5 py-8 flex-grow shadow-2xl rounded-2xl">
      <h2 className="text-2xl text-center font-bold mb-4">Service History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment, index) => (
                  <motion.tr
                    key={appointment._id}
                    variants={animationVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    className={` ${appointment.status === 'completed' ? 'bg-gray-50 hover:bg-gray-200' : 'bg-red-50 hover:bg-red-100'} transition-colors duration-200`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{appointment.client.fullname}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{new Date(appointment.date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getPaymentStatusIcon(appointment.paymentStatus)}
                        <span className="text-gray-900">{appointment.paymentStatus.charAt(0).toUpperCase() + appointment.paymentStatus.slice(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 focus:outline-none"
                        onClick={() => handleViewDetails(appointment)}
                      >
                        View Details
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="block md:hidden">
            {appointments.map((appointment, index) => (
              <motion.div
                key={appointment._id}
                variants={animationVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                className={`p-4 mb-4 ${appointment.status === 'completed' ? 'bg-gray-50 hover:bg-gray-200' : 'bg-red-50 hover:bg-red-100'} rounded-lg shadow-md transition-colors duration-200`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{appointment.client.fullname}</h3>
                  <span className="text-gray-500 text-sm">{new Date(appointment.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-900">{appointment.time}</span>
                  <div className="flex items-center space-x-2">
                    {getPaymentStatusIcon(appointment.paymentStatus)}
                    <span className="text-gray-900">{appointment.paymentStatus.charAt(0).toUpperCase() + appointment.paymentStatus.slice(1)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-900">{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 focus:outline-none"
                    onClick={() => handleViewDetails(appointment)}
                  >
                    View Details
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      <div className='py-3'>
          <Pagination current={page} total={totalPages} setPage={setPage} />
      </div>
      {selectedAppointment && (
        <AppointmentDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          appointment={selectedAppointment}
        />
      )}
    </div>
  );
}

export default History;
