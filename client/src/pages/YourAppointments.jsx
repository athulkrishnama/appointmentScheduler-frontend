import React from 'react'
import ListAppointments from '../components/appointments/ListAppointments'

function YourAppointments() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-gray-900 mb-8 text-center ">Your Appointments</h1>
          <ListAppointments />
        </div>
      </div>
    </div>
  )
}

export default YourAppointments
