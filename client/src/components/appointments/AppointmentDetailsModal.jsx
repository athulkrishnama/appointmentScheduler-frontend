import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CancelConfirmationModal from './CancelConfirmationModal'
import { MdPending, MdCheckCircle, MdCancel, MdAccessTime, MdAttachMoney, MdCreditCard } from 'react-icons/md'
import { FaRupeeSign } from 'react-icons/fa'

function AppointmentDetailsModal({ isOpen, onClose, appointment, onAppointmentCancel }) {
    if (!appointment) return null;
    const CANCELABLE_TIME = 30;

    const [showCancelModal, setShowCancelModal] = useState(false);

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


    const  isTimePassed = (storedTime) =>{
        const now = new Date();

        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
    

        const [storedHours, storedMinutes] = storedTime.split(":").map(Number);
    
        const currentTotalMinutes = currentHours * 60 + currentMinutes;
        const storedTotalMinutes = storedHours * 60 + storedMinutes;
    
        return (storedTotalMinutes - currentTotalMinutes) > CANCELABLE_TIME;
    }

    const isDayPassed = (date)=>{
        const newDate = new Date(date)
        const now = new Date();

        newDate.setHours(0,0,0,0);
        now.setHours(0,0,0,0);

        return newDate > now
    }

    const isCancellable = (date, time)=>{
        if(isDayPassed(date)) return false
        return !isTimePassed(time)
    }



    const getPaymentMethodIcon = (method) => {
        switch (method) {
            case 'cash':
                return <FaRupeeSign className="w-5 h-5 text-green-500" />;
            case 'online':
                return <MdCreditCard className="w-5 h-5 text-blue-500" />;
            default:
                return null;
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
                            <motion.div 
                                className="flex justify-between items-center mb-6"
                                variants={contentVariants}
                            >
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

                            <motion.div 
                                className="space-y-6"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1 },
                                    exit: { opacity: 0 }
                                }}
                            >
                                <motion.div variants={contentVariants}>
                                    <h3 className="text-lg font-semibold mb-2">Service Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Service Name</p>
                                            <p className="font-medium">{appointment.service.serviceName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Provider Name</p>
                                            <p className="font-medium">{appointment.serviceProvider.fullname}</p>
                                        </div>

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
                                                <p className="font-medium">{new Date(appointment.endDate).toLocaleDateString()}</p>
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

                                <motion.div variants={contentVariants}>
                                    <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
                                    <div className="flex items-center space-x-2">
                                        <FaRupeeSign className="w-5 h-5 text-green-500" />
                                        <span className="text-sm text-gray-500">Amount:</span>
                                        <span className="font-medium">{appointment?.amount?.toFixed?.(2)}</span>
                                    </div>
                                </motion.div>

                                <motion.div variants={contentVariants}>
                                    <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                                    <div className="flex items-center space-x-2">
                                        {getPaymentMethodIcon(appointment.paymentMethod)}
                                        <span className="font-medium">{appointment.paymentMethod}</span>
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

                                
                                    <motion.div variants={contentVariants} className="flex justify-end mt-6">
                                        <motion.button
                                            onClick={() => setShowCancelModal(true)}
                                            disabled={isCancellable(appointment.date, appointment.time)}
                                            // disabled={()=>isCancellable(appointment.date, appointment.time)}
                                            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 disabled:bg-red-300"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Cancel Appointment
                                        </motion.button>
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
        </AnimatePresence>
    )
}

export default AppointmentDetailsModal
