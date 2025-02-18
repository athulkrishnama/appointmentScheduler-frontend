import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../axios/axios';
import { toast } from 'react-toastify';

function CompletionConfirmationModal({ isOpen, onClose, appointmentId, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleComplete = async () => {
        try {
            setIsLoading(true);
            const response = await axios.patch(`/serviceProvider/markAsCompleted/${appointmentId}`);
            if (response.data.success) {
                toast.success('Appointment marked as completed successfully');
                 onSuccess();
            }
        } catch (error) {
            console.error('Error completing appointment:', error);
            onSuccess();
            toast.error(error.response?.data?.message || 'Error marking appointment as completed');
        }finally{
            setIsLoading(false);
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
                type: "spring",
                duration: 0.3,
                bounce: 0.4
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.95,
            transition: {
                duration: 0.2
            }
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
                            <h3 className="text-lg font-semibold mb-4">Mark Appointment as Completed</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to mark this appointment as completed? This action cannot be undone.
                            </p>
                            
                            <div className="flex justify-end space-x-4">
                                <motion.button
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={handleComplete}
                                    className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isLoading ? 'Loading...' : 'Complete'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default CompletionConfirmationModal;
