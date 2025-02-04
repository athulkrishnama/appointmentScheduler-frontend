import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdPending, MdCheckCircle, MdCancel, MdAccessTime } from 'react-icons/md'
import { FaCreditCard, FaMoneyBillAlt, FaRupeeSign } from 'react-icons/fa';
import CancelConfirmationModal from './CancelConfirmationModal'
import CompletionConfirmationModal from './CompletionConfirmationModal'

function AppointmentDetailsModal({ isOpen, onClose, appointment, onAppointmentCancel, onAppointmentComplete }) {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);

    if (!appointment) return null;

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.95,
            y: 20
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                duration: 0.5,
                bounce: 0.3
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 20,
            transition: {
                duration: 0.2
            }
        }
    }

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 0.5 },
        exit: { opacity: 0 }
    }

    const contentVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
    }

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
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 overflow-y-auto"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className="flex min-h-screen items-center justify-center px-4">
                        <motion.div
                            variants={backdropVariants}
                            className="fixed inset-0 bg-black"
                            onClick={onClose}
                        />

                        <motion.div
                            variants={modalVariants}
                            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative z-10"
                        >
                            <motion.div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
                                <motion.button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-500"
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </motion.button>
                            </motion.div>

                            <motion.div className="space-y-6">
                                <motion.div variants={contentVariants}>
                                    <h3 className="text-lg font-semibold mb-2">Client Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Name</p>
                                            <p className="font-medium">{appointment.client.fullname}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{appointment.client.phone}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm text-gray-500 mb-1">Status</p>
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(appointment.status)}
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-span-2 mt-4">
                                            <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                                            <div className="flex items-center space-x-2">
                                                {appointment.paymentMethod === 'online' ? (
                                                    <FaCreditCard className="text-blue-500" />
                                                ) : (
                                                    <FaMoneyBillAlt className="text-green-500" />
                                                )}
                                                <span className="text-gray-900">{appointment.paymentMethod.charAt(0).toUpperCase() + appointment.paymentMethod.slice(1)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div variants={contentVariants}>
                                    <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
                                    <div className="flex items-center space-x-2">
                                        <FaRupeeSign className="w-5 h-5 text-green-500" />
                                        <span className="text-sm text-gray-500">Amount:</span>
                                        <span className="font-medium">{appointment?.amount?.toFixed?.(2)}</span>
                                    </div>
                                </motion.div>

                                <motion.div variants={contentVariants}>
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
                                                <p className="font-medium">{appointment.endDate.split('T')[0]}</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                <motion.div variants={contentVariants}>
                                    <h3 className="text-lg font-semibold mb-2">Service Address</h3>
                                    <div className="space-y-2">
                                        <p className="font-medium">{appointment.address.fullName}</p>
                                        <p className="text-gray-600">
                                            {appointment.address.area}<br />
                                            {appointment.address.district}<br />
                                            {appointment.address.state} {appointment.address.pincode}
                                        </p>
                                    </div>
                                </motion.div>

                                {appointment.additionalDetails && appointment.additionalDetails.length > 0 && (
                                    <motion.div variants={contentVariants}>
                                        <h3 className="text-lg font-semibold mb-2">Additional Details</h3>
                                        <div className="space-y-2">
                                            {appointment.additionalDetails.map((detail, index) => (
                                                <div key={index} className="flex">
                                                    <p className="text-gray-500 w-1/3">{detail.fieldName}:</p>
                                                    <p className="font-medium">{detail.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {appointment.additionalNotes && (
                                    <motion.div variants={contentVariants}>
                                        <h3 className="text-lg font-semibold mb-2">Additional Notes</h3>
                                        <p className="text-gray-600">{appointment.additionalNotes}</p>
                                    </motion.div>
                                )}



                                    <motion.div variants={contentVariants} className="flex justify-end mt-6 space-x-4">
                                            <motion.button
                                                onClick={() => setShowCompleteModal(true)}
                                                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Mark as Completed
                                            </motion.button>
                                        {(appointment.status === 'pending' ) && (
                                            <motion.button
                                                onClick={() => setShowCancelModal(true)}
                                                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Cancel Appointment
                                            </motion.button>
                                        )}
                                    </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
            <CancelConfirmationModal 
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                appointmentId={appointment._id}
                onSuccess={() => {
                    if (onAppointmentCancel) onAppointmentCancel(appointment._id);
                    onClose();
                }}
            />
            <CompletionConfirmationModal 
                isOpen={showCompleteModal}
                onClose={() => setShowCompleteModal(false)}
                appointmentId={appointment._id}
                onSuccess={() => {
                    if (onAppointmentComplete) onAppointmentComplete(appointment._id);
                    setShowCompleteModal(false);
                    onClose();
                }}
            />
        </AnimatePresence>
    )
}

export default AppointmentDetailsModal
