import React, { useEffect, useState } from 'react'
import axios from '../../axios/axios'
import { motion } from 'framer-motion'

function ListAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/client/getAppointments')
      if (response.data.success) {
        setAppointments(response.data.appointments)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const animationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="w-[90vw] md:w-[50vw] mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-[35%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th className="w-[35%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
              <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="w-[5%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment, index) => (
              <motion.tr
                key={appointment._id}
                variants={animationVariants}
                initial="hidden"
                animate="visible"
       
                whileHover={{ 
                  scale: 1.01,
                  transition: { duration: 0.1 }
                }}
                className="hover:bg-gray-50"
              >
                <td className="w-[35%] px-6 py-4 whitespace-nowrap">
                  <div className=" font-medium text-gray-900">{appointment.service.serviceName}</div>
                </td>
                <td className="w-[35%] px-6 py-4 whitespace-nowrap">
                  <div className=" text-gray-900">{appointment.serviceProvider.fullname}</div>
                </td>
                <td className="w-[15%] px-6 py-4 whitespace-nowrap">
                  <div className=" text-gray-900">{appointment.date.split('T')[0]}</div>
                </td>
                <td className="w-[10%] px-6 py-4 whitespace-nowrap">
                  <div className=" text-gray-900">{appointment.time}</div>
                </td>
                <td className="w-[5%] px-6 py-4 whitespace-nowrap text-right  font-medium">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-black text-white hover:bg-gray-800 px-2 py-1 rounded-md transition-colors duration-200 shadow-sm text-bold w-full"
                  >
                    View
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-8 text-gray-500"
          >
            No appointments found
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default ListAppointments
