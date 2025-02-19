import React, { useState } from 'react'
import { AiFillNotification } from "react-icons/ai";
import { FaEnvelopeOpenText } from "react-icons/fa6";
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
function NotificationBar({ notifications }) {
    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => setIsOpen(!isOpen)

    const navigate = useNavigate()

    return (
        <div>
            <motion.div >
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97, rotate: 20 }}
                    onClick={toggle}
                >
                    <AiFillNotification className='text-2xl cursor-pointer' />
                </motion.div>
                {
                    <AnimatePresence mode='wait'>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -100 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -100 }}
                                className='absolute right-5 z-[50] w-96 h-96 bg-white shadow-2xl rounded-3xl p-4 overflow-y-hidden noScrollBar'
                            >
                                {
                                    notifications.map((notification) => {
                                        const message = notification.type === "text" ? `You have a message from ${notification.sender}` : `You have a quotation from ${notification.sender}`
                                        return (
                                            <motion.div
                                                onClick={() => navigate(`/serviceRequests/${notification.serviceRequest}`)}
                                                className='bg-gray-100 rounded-lg p-4 mb-4 hover:bg-gray-200 transition-all duration-300 cursor-pointer flex gap-3 items-center'
                                            >    <FaEnvelopeOpenText />
                                                {message}
                                            </motion.div>
                                        )
                                    })
                                }

                            </motion.div>
                        )}
                    </AnimatePresence>
                }

            </motion.div>
        </div>
    )
}

export default NotificationBar
