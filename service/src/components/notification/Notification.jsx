import React, { useEffect, useState } from 'react'
import createSocket from '../../services/notifcation'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import NotificationBar from './NotificationBar'

function Notification() {
    const { accessToken } = useSelector((state) => state.user)
    const [notification, setNotification] = useState([])
    const [allNotifications, setAllNotifications] = useState([])

    const MAX_NOTIFICATIONS = 5;

    const navigate = useNavigate()
    useEffect(() => {
        const socket = createSocket()
        socket.connect()

        socket.on('newNotification', (data, callback) => {
            setTimeout(() => {
                const removeNotification = (id) => {
                    setNotification((prev) => prev.filter((noti) => noti.id !== id))
                }
                removeNotification(data.id)
            }, 10000)
            setNotification((prev) => [data, ...prev])
            setAllNotifications((prev) => [data, ...prev])
            callback(true)
        })
        return () => {
            socket.disconnect()
        }
    }, [accessToken])

    const handleNotificationClick = (notificationId, serviceRequest) => {
        navigate(`/serviceRequests/${serviceRequest}`)
        setNotification((prev) => prev.filter((noti) => noti.id !== notificationId))
    }
    return (
        <>
            <div className='absolute top-0 right-0 '>
                <AnimatePresence>
                    {notification.slice(0, MAX_NOTIFICATIONS).map((noti) => (
                        <motion.div key={noti.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className='bg-white p-4 rounded-lg shadow-lg mb-4'
                            onClick={() => handleNotificationClick(noti.id, noti.serviceRequest)}
                        >
                            <div className='text-lg font-semibold'>{`You got a message from ${noti.sender}`}</div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            <NotificationBar notifications={allNotifications} />
        </>
    )
}

export default Notification
