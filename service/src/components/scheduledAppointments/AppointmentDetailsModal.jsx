import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function AppointmentDetailsModal({ isOpen, onClose, appointment }) {
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
                                            <p className="text-sm text-gray-500">Client Name</p>
                                            <p className="font-medium">{appointment.client.fullname}</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div variants={contentVariants}>
                                    <h3 className="text-lg font-semibold mb-2">Schedule</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Date</p>
                                            <p className="font-medium">{appointment.date.split('T')[0]}</p>
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
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default AppointmentDetailsModal
