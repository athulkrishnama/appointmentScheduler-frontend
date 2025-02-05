import React, { useEffect, useState } from 'react'
import axios from '../../axios/axios'
import { motion } from 'framer-motion'
import AppointmentDetailsModal from './AppointmentDetailsModal'
import Pagination from '../pagination/Pagination'
import { FaRupeeSign } from 'react-icons/fa'

function ListAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const LIMIT = 5;

  useEffect(() => {
    fetchAppointments()
  }, [currentPage])

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`/serviceProvider/getAppointments?page=${currentPage}&limit=${LIMIT}`)
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


  const handleAppointmentCancel = (appointmentId) => {
    setAppointments(appointments.filter(appointment => appointment._id !== appointmentId))
    fetchAppointments();
  };

  const handleAppointmentComplete = (appointmentId) => {
    setAppointments(appointments.filter(appointment => appointment._id !== appointmentId))
    fetchAppointments();
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
    <div className='w-[92vw] md:w-[60vw] mx-auto mt-6 md:mt-10 px-4 md:px-0'>
      <h1 className='text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6'>Scheduled Appointments</h1>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-[30%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="w-[30%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="w-[5%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment, index) => (
                <motion.tr
                  key={appointment._id}
                  onClick={() => setSelectedAppointment(appointment)}
                  variants={{
                    hidden:{opacity:0,y:-20},
                    visible:{opacity:1,y:0}
                  }}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className={`cursor-pointer hover:bg-gray-100`}
                >
                  <td className="w-[30%] px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{appointment.service.serviceName}</div>
                  </td>
                  <td className="w-[30%] px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{appointment.client.fullname}</div>
                  </td>
                  <td className="w-[15%] px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{new Date(appointment.date).toLocaleDateString()}</div>
                  </td>
                  <td className="w-[10%] px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{appointment.time}</div>
                  </td>
                  <td className="w-[10%] px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">₹{appointment?.amount?.toFixed?.(2)}</div>
                  </td>
                  <td className="w-[5%] px-6 py-4 whitespace-nowrap text-right font-medium">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-black text-white hover:bg-gray-800 px-2 py-1 rounded-md transition-colors duration-200 shadow-sm text-bold w-full"
                      onClick={() => handleViewDetails(appointment)}
                    >
                      View
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

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
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900">{appointment.service.serviceName}</h3>
                  <p className="text-sm text-gray-600">{appointment.client.fullname}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-black text-white px-3 py-1 rounded-md text-sm"
                  onClick={() => handleViewDetails(appointment)}
                >
                  View
                </motion.button>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(appointment.date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {appointment.time}
                </div>
                <div className="flex items-center">
                  <FaRupeeSign className="w-4 h-4 mr-1 text-green-500" />
                  {appointment?.amount?.toFixed?.(2)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {appointments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No appointments found
          </div>
        )}

        <div className='py-4'>
          <Pagination total={totalPages} current={currentPage} setPage={setCurrentPage} />
        </div>

      </motion.div>

      <AppointmentDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={selectedAppointment}
        onAppointmentCancel={handleAppointmentCancel}
        onAppointmentComplete={handleAppointmentComplete}
      />
    </div>
  )
}

export default ListAppointments
