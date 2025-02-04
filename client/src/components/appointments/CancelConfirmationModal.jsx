import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../axios/axios';
import { toast } from 'react-toastify';

function CancelConfirmationModal({ isOpen, onClose, appointmentId, onSuccess }) {
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCancel = async () => {
        try {
            setIsLoading(true);
            if(reason.trim().length === 0){
                return toast.error('Reason is required');
            }
            const response = await axios.patch(`/client/cancelAppointment/${appointmentId}`, { reason });
            if (response.data.success) {
                toast.success('Appointment cancelled successfully');
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", duration: 0.5, bounce: 0.3 }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 20,
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black"
                            onClick={onClose}
                        />
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative z-10"
                        >
                            <h3 className="text-xl font-bold mb-4">Cancel Appointment</h3>
                            <p className="text-gray-600 mb-4">Are you sure you want to cancel this appointment? This action cannot be undone.</p>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for cancellation
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                    rows="3"
                                    placeholder="Please provide a reason for cancellation"
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <motion.button
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={isLoading}
                                >
                                    Keep Appointment
                                </motion.button>
                                <motion.button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Cancelling...' : 'Confirm Cancel'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default CancelConfirmationModal;
