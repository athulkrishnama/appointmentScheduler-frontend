import React, { useState, useEffect } from 'react'
import CreateService from '../components/serviceManagement/CreateService'
import ListServiceTable from '../components/serviceManagement/ListServiceTable'
import axios from '../axios/axios'
import Pagination from '../components/pagination/Pagination'
function ServiceManagement() {
  const [showCreateService, setShowCreateService] = useState(false)
  const [services, setServices] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`/serviceProvider/services/?page=${page}`);
        setServices(response.data.services);
        setTotalPages(response.data.totalPage);

      } catch (error) {
        console.error('Error fetching services:', error);
      }
    }
    fetchServices();
  }, [page])

  const setUpdateData = (data) => {
    setServices(prevServices =>
      prevServices.map(service =>
        service._id === data._id ? data : service
      )
    );
  }
  const changeStatus = async (id, action) => {
    try {
      const response = await axios.patch(`/serviceProvider/updateServiceStatus/${id}`, { action });
      if (response.status === 200) {
        setServices(prevServices =>
          prevServices.map(service =>
            service._id === id ? { ...service, isActive: action === 'unlist' ? false : true } : service
          )
        );
      }
    } catch (error) {
      console.error('Error updating service status:', error);
    }
  }

  return (
    <div className='w-[90vw] md:w-[60vw] mx-auto mt-12'>
      <div className='flex justify-end'>
        <button className="bg-gray-800 text-gray-200 px-4 py-2 rounded hover:bg-gray-700 hover:text-white"
          onClick={() => setShowCreateService(true)}>Create Service</button>
        {showCreateService && <CreateService setShowCreateService={setShowCreateService} setServices={setServices} />}
      </div>
        <ListServiceTable services={services} changeStatus={changeStatus} setUpdateData={setUpdateData}/>
        <Pagination total={totalPages} current={page} setPage={setPage}/>
    </div>

  )
}

export default ServiceManagement
