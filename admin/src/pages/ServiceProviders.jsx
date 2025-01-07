import React, { useEffect, useState } from 'react'
import ServiceProviderTable from '../components/serviceProviders/serviceProviders'
import Pagination from '../components/pagination/Pagination'
import axios from '../axios/axios'
function ServiceProviders() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const getProviders = async () => {
      try {
        const response = await axios.get(`/admin/service-providers?page=${page}`);
        setProviders(response.data.serviceProviders);
        setTotalPages(response.data.totalPage);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    }
    getProviders();
  }, [page]);


  const changeStatus = async (providerId, action) => {
    try {
      const response = await axios.patch(`/admin/updateServiceProviderStatus/${providerId}`, { action });
      if (response.data.success) {
        // update service provider list
        setProviders(prevProviders =>
          prevProviders.map(provider =>
            provider._id === providerId ? { ...provider, isActive: action === 'block' ? false : true } : provider
          )
        );
      }
      return response.data;
    }
    catch (error) {
      return { success: false, message: error.response.data.message };
    }
  }
  return (
    <div >
      <ServiceProviderTable providers={providers} changeStatus={changeStatus} />
      <div className='mt-4'>
        <Pagination total={totalPages} current={page} setPage={setPage} />
      </div>
    </div>
  )
}

export default ServiceProviders
