import React, { useEffect, useState } from 'react'
import axios from '../../axios/axios'
import { motion } from 'framer-motion'
import AppointmentDetailsModal from './AppointmentDetailsModal'
import Pagination from '../pagination/Pagination'

function ListAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const LIMIT = 5;

  useEffect(() => {
    fetchAppointments()
  }, [page])

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`/client/getAppointments?page=${page}&limit=${LIMIT}`)
      if (response.data.success) {
        setAppointments(response.data.appointments)
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedAppointment(null)
  }

  const handleCancelAppointment = async (id) => {
    setAppointments(appointments.filter(appointment => appointment._id !== id))
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
        <table className="min-w-full divide-y divide-gray-200 hidden md:table">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ">Actions</th>
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
                className={` cursor-pointer ${appointment.status === 'cancelled' ? "bg-red-100 hover:bg-red-200" : "hover:bg-gray-100"}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{appointment.service.serviceName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">{appointment.serviceProvider.fullname}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">{appointment.date.split('T')[0]}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">{appointment.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md transition-colors duration-200 shadow-sm text-sm font-medium"
                    onClick={() => handleViewDetails(appointment)}
                  >
                    View Details
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        <div className="md:hidden">
          {appointments.map((appointment, index) => (
            <motion.div
              key={appointment._id}
              variants={animationVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              className="p-4 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-lg mb-1">
                    {appointment.service.serviceName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {appointment.serviceProvider.fullname}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Date:</span>
                  <span>{appointment.date.split('T')[0]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Time:</span>
                  <span>{appointment.time}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-black text-white hover:bg-gray-800 py-2 px-4 rounded-md transition-colors duration-200 shadow-sm text-sm font-medium"
                onClick={() => handleViewDetails(appointment)}
              >
                View Details
              </motion.button>
            </motion.div>
          ))}
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No appointments found
          </div>
        ) : (
          <div className='py-5'>
            <Pagination total={totalPages} current={page} setPage={setPage} />
          </div>
        )}
      </motion.div>

      <AppointmentDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        appointment={selectedAppointment}
        onAppointmentCancel={handleCancelAppointment}
      />
    </div>
  )
}

export default ListAppointments
