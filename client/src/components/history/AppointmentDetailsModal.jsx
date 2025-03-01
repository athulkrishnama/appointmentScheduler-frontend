import React,{useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdPending, MdCheckCircle, MdCancel, MdAccessTime, MdCheckCircle as MdCheckCircleIcon, MdError, MdRefresh } from 'react-icons/md';
import { FaRupeeSign, FaUser, FaUserShield } from 'react-icons/fa';
import Invoice from '../invoice/Invoice';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import axios from '../../axios/axios';
import ReportModal from './ReportModal'
import {toast} from 'react-toastify'

const AppointmentDetailsModal = ({ isOpen, onClose, appointment }) => {
  const [isReportModalOpen, setReportModalOpen] = useState(false);

  if (!appointment) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", duration: 0.5, bounce: 0.3 } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <MdPending className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <MdCheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <MdCancel className="w-5 h-5 text-red-500" />;
      case 'completed':
        return <MdAccessTime className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return '';
    }
  };

  const getPaymentStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <MdCheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <MdRefresh className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <MdError className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const handleInvoiceDownload = async () => {
    try{
      const serviceRequest = await axios.get(`/client/getServiceRequest/${appointment.serviceRequest}`);
      const doc = <Invoice appointment={appointment} serviceRequest={serviceRequest.data.serviceRequest} />;
      const blob = await pdf(doc).toBlob();
      saveAs(blob, 'invoice.pdf');
    }catch(error){
      console.log(error);
    }
  };

  const handleReportModalOpen = ()=>{
    setReportModalOpen(true);
  }

  const handleReportModalClose = ()=>{
    setReportModalOpen(false);
  }

  const handleReport = async(reason)=>{
    try {
      const response = await axios.post("/client/report", {reason, appointment:appointment._id, serviceProvider:appointment.serviceProvider._id})
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response?.data?.message)
    }finally{
      handleReportModalClose()
    }
  }
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-40 overflow-y-auto" initial="hidden" animate="visible" exit="exit">
          <div className="flex min-h-screen items-center justify-center px-4">
            <motion.div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
            <motion.div variants={modalVariants} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Service Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{appointment.serviceProvider.fullname}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{appointment.serviceProvider.phone}</p>
                    </div>
                    <div className="">
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(appointment.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span>
                      </div>
                    </div>
                    {
                      appointment.status === 'cancelled' &&
                      <div className=''>
                        <p className='text-gray-500'>Cancelled By:</p>
                        <div className='flex items-center space-x-2'>
                          <p className='flex gap-2 items-center'>{appointment.cancelledBy === 'client' ? <><FaUser /> Client</> : <><FaUserShield /> ServiceProvider</>}</p>
                        </div>
                      </div>
                    }
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Schedule</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">{appointment.time}</p>
                    </div>
                    {appointment.serviceFrequency && (
                      <div>
                        <p className="text-sm text-gray-500">Frequency</p>
                        <p className="font-medium">{appointment.serviceFrequency}</p>
                      </div>
                    )}
                    {appointment.endDate && (
                      <div>
                        <p className="text-sm text-gray-500">End Date</p>
                        <p className="font-medium">{new Date(appointment.endDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Service Address</h3>
                  <div className="space-y-2">
                    <p className="font-medium">{appointment.address.fullName}</p>
                    <p className="text-gray-600">{appointment.address.area}<br />{appointment.address.district}<br />{appointment.address.state} {appointment.address.pincode}</p>
                  </div>
                </div>
                {appointment.additionalDetails && appointment.additionalDetails.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Additional Details</h3>
                    <div className="space-y-2">
                      {appointment.additionalDetails.map((detail, index) => (
                        <div key={index} className="flex">
                          <p className="text-gray-500 w-1/3">{detail.fieldName}:</p>
                          <p className="font-medium">{detail.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {appointment.additionalNotes && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Additional Notes</h3>
                    <p className="text-gray-600">{appointment.additionalNotes}</p>
                  </div>
                )}
                {appointment.status === 'cancelled' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Cancellation Reason</h3>
                    <p className="font-medium text-red-600">{appointment.cancellationReason}</p>
                  </div>
                )}
                <div className='grid grid-cols-2 gap-4'>
                  {appointment.status === 'completed' && (
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold mb-2">Payment Status</h3>
                      {getPaymentStatusIcon(appointment.paymentStatus)}
                      <span className="font-medium text-gray-900">{appointment.paymentStatus.charAt(0).toUpperCase() + appointment.paymentStatus.slice(1)}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Payment Method:</span>
                    <span className="font-medium">{appointment.paymentMethod.charAt(0).toUpperCase() + appointment.paymentMethod.slice(1)}</span>
                  </div>
                </div>
               
                {
                  appointment.coupon && (
                    <div className='grid grid-cols-2 gap-4'>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Coupon:</span>
                        <span className="font-medium">{appointment.coupon?.couponCode}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Discount:</span>
                        <span className="font-medium">₹{appointment.couponDiscount}</span>
                      </div>
                    </div>
                  )
                }
                 <div className='grid grid-cols-2 gap-4'>
                  <div className="flex justify-center gap-4 flex-col space-x-2">
                    <div className='flex gap-2'>
                      <FaRupeeSign className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-500">Amount:</span>
                      <span className="font-medium">₹{appointment?.amount?.toFixed?.(2)}</span>
                    </div>
                    {
                      appointment.couponDiscount &&
                      <div>
                        <span>Final Amount: </span>
                        <span>₹{appointment?.finalAmount.toFixed(2)}</span>
                      </div>
                    }
                  </div>
                  <div className='flex items-center space-x-2'>
                    <button onClick={handleInvoiceDownload} className='bg-black text-white px-4 py-2 rounded'>Download Invoice</button>
                  </div>
                </div>
                {
                  appointment.status === 'completed' &&(
                    <div>
                      <p className='text-gray-500'>Not satisfied with service? <span onClick={handleReportModalOpen} className='text-red-600 cursor-pointer '>Report </span></p>
                    </div>
                  )
                }
              </div>
            </motion.div>
          </div>
          {
            isReportModalOpen && <ReportModal onClose={handleReportModalClose} onConfirm={handleReport}/>
          }
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppointmentDetailsModal;
