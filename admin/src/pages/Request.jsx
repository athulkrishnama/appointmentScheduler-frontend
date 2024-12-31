import React, { useEffect, useState } from 'react';
import axios from '../axios/axios';
import { setRequests } from '../store/requestSlice/requestSlice';
import { useDispatch, useSelector } from 'react-redux';
import RequestTable from '../components/requestTable/RequestTable';

function Request() {
  const dispatch = useDispatch();
  const requests = useSelector(state => state.requests);
  const [loading, setLoading] = useState(true);

  const getRequests = async () => {
    try {
      const response = await axios.get('/admin/serviceProviderRequests');
      dispatch(setRequests(response.data.requests));
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);



  return (
    <div className='flex-grow flex flex-col pt-5'>
      <h1 className='text-4xl font-bold text-center text-black'>Service Provider's Registration Request</h1>
      {loading ? (
        <div className='text-center py-4'>Loading...</div>
      ) : (
        <RequestTable requests={requests}  />
      )}
    </div>
  );
}

export default Request;
