import React, { useEffect } from 'react'
import axios from '../axios/axios'
import ClientTable from '../components/clientTable/ClientTable'
import { useDispatch, useSelector } from 'react-redux';
import {setClients, updateStatus} from '../store/cliientSlice/clientSlic'
import Pagination from '../components/pagination/Pagination'
import { useState } from 'react';

function Clients() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const clients = useSelector(state => state.clients);
  const dispatch = useDispatch();
  useEffect(() => {
    const getClients = async () => {
      try {
        const response = await axios.get(`/admin/clients?page=${page}`);
        dispatch(setClients(response.data.clients));
        setTotalPages(response.data.totalPage);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    getClients();
  }, [page]);

  const changeStatus = async (clientId, action) => {
    try {
      const response = await axios.patch(`/admin/updateClientStatus/${clientId}`, { action });
      dispatch(updateStatus({ id:clientId, status:action }));
      return response.data;
    }
    catch (error) {
      return { success: false, message: error.response.data.message };
    }
  }
  return (
    <div className='flex  flex-col flex-grow pt-16'>
      <h1 className='text-center text-4xl font-black '>Clients</h1>
      <ClientTable clients={clients.items} setPage={setPage} changeStatus={changeStatus} />
      <div className='flex justify-center my-5'>
      <Pagination total={totalPages} current={page} setPage={setPage} /></div>
    </div>
  )
}

export default Clients
