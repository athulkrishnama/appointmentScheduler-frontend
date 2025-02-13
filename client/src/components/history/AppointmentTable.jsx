import React, { useEffect, useState } from 'react';
import axios from '../../axios/axios';
import Pagination from '../pagination/Pagination';
import { motion } from 'framer-motion';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import PaymentModal from './paymentModal';
import { useRazorpay } from 'react-razorpay';
import store from '../../store/store'
import { toast } from 'react-toastify';

const animationVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

function AppointmentTable() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const { error, isLoading, Razorpay } = useRazorpay();

  const userData = {
    name: store.getState().user.name,
    email: store.getState().user.email,
    phone: store.getState().user.phone
  }

  const LIMIT = 5;

  useEffect(() => {
    fetchAppointments();
  }, [page]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`/client/getCompletedAppointments?page=${page}&limit=${LIMIT}`);
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

  const renderPaymentButton = (status) => {
    switch (status) {
      case 'completed':
        return "Paid"
      case 'pending':
        return "Pay"
      case 'failed':
        return "Retry"
      default:
        return null;
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const paymentModalOpen = (appointment) => {
    setSelectedAppointment(appointment);
    setIsPaymentModalOpen(true);
  }

  const closePaymentModal = () => {
    fetchAppointments()
    setIsPaymentModalOpen(false);
    setSelectedAppointment(null);
  }

  const paymentSuccessHandler = async (data, appointment) => {
    try {
      const response = await axios.post("/client/verifyRazorpayPayment", { ...data, appointmentId: appointment._id, paymentStatus: true })
      toast.success(response.data.message)
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    } finally {
      fetchAppointments()
    }
  }

  const retryPayment = async (appointment) => {
    try {
      const response = await axios.post("/client/retryPaymentCreateOrder", { appointmentId: appointment._id })
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        name: "Timelens",
        description: "Retrying Payment",
        prefill: userData,
        order_id: response.data.order.id,
        retry: {
          enabled: false
        },
        handler: (data) => paymentSuccessHandler(data, appointment),
        theme: {
          color: "#000000"
        }
      }
      const rzpay = new Razorpay(options)
      rzpay.open()
      rzpay.on('payment.failed', async (response) => {
        try {
          const res = await axios.post("/client/verifyRazorpayPayment", { ...response, appointmentId: appointment._id, paymentStatus: false })
          toast.error(res.data.message)
        } catch (error) {
          toast.error(error.response.data.message)
          console.log(error)
        } finally {
          fetchAppointments()
        }
      })
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className="w-[90vw] md:w-[50vw] mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200 hidden md:table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                    className={`cursor-pointer ${appointment.status === 'cancelled' ? "bg-red-100 hover:bg-red-200" : "hover:bg-gray-100"}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{appointment.service.serviceName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{new Date(appointment.date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{appointment.status}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">₹{!appointment.couponDiscount ? appointment?.amount?.toFixed?.(2) : appointment?.finalAmount?.toFixed?.(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 focus:outline-none disabled:bg-gray-600"
                        disabled={appointment.status === 'cancelled' || appointment.paymentStatus === 'completed'}
                        onClick={() => appointment.paymentStatus === 'pending' ? paymentModalOpen(appointment) : retryPayment(appointment)}
                      >
                        {renderPaymentButton(appointment.paymentStatus)}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => handleViewDetails(appointment)} className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none">
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            <div className="block md:hidden">
              {appointments.map((appointment, index) => (
                <motion.div
                  key={appointment._id}
                  variants={animationVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 mb-4 ${appointment.status === 'cancelled' ? "bg-red-100 hover:bg-red-200" : "bg-gray-50 hover:bg-gray-100"} rounded-lg shadow-md transition-colors duration-200`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{appointment.service.serviceName}</h3>
                    <span className="text-gray-500 text-sm">{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-900">{appointment.status}</span>
                    <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 focus:outline-none" disabled={appointment.status === 'cancelled' || appointment.paymentStatus === 'completed'}
                      onClick={() => appointment.paymentStatus === 'pending' ? paymentModalOpen(appointment) : retryPayment(appointment)}

                    >
                      {renderPaymentButton(appointment.paymentStatus)}
                    </button>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-900">Amount:</span>
                    <span className="font-medium">₹{appointment.paymentStatus === 'pending' ? appointment?.amount?.toFixed?.(2) : appointment?.finalAmount?.toFixed?.(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
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
          </>
        )}
      </motion.div>
      {totalPages > 1 && (
        <div className="py-5">
          <Pagination current={page} total={totalPages} setPage={setPage} />
        </div>
      )}
      {selectedAppointment && (
        <AppointmentDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          appointment={selectedAppointment}
          onAppointmentCancel={() => { }}
          onAppointmentComplete={() => { }}
        />
      )}
      {
        isPaymentModalOpen &&
        <PaymentModal
          onClose={closePaymentModal}
          appointment={selectedAppointment}
        />
      }
    </div>
  );
}

export default AppointmentTable;