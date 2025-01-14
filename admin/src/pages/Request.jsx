import React, { useEffect, useState } from 'react';
import axios from '../axios/axios';
import { setRequests } from '../store/requestSlice/requestSlice';
import { useDispatch, useSelector } from 'react-redux';
import RequestTable from '../components/requestTable/RequestTable';
import Pagination from '../components/pagination/Pagination';

function Request() {
  const dispatch = useDispatch();
  const requests = useSelector(state => state.requests);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const getRequests = async () => {
    try {
      const response = await axios.get(`/admin/serviceProviderRequests/?page=${page}`);
      dispatch(setRequests(response.data.requests));
      setTotalPages(response.data.totalPage);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRequests();

  }, [page]);



  return (
    <div className='flex-grow flex flex-col pt-16'>
      <h1 className='text-4xl font-bold text-center text-black'>Service Provider's Registration Request</h1>
      {loading ? (
        <div className='text-center py-4'>Loading...</div>
      ) : (
        <>
        <RequestTable requests={requests}  />
        
        {requests.items.length > 0 && <Pagination total={totalPages} current={page} setPage={setPage} />}
        </>
      )}
    </div>
  );
}

export default Request;
