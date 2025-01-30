import React,{useEffect, useState} from 'react'
import { motion } from 'framer-motion'
import axios from '../../axios/axios'
import ServiceTable from './ServiceTable'
import Pagination from '../pagination/Pagination'
import Filter from './Filter'

function ListServices() {
    const [services, setServices] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [filter, setFilter] = useState({
        category: [],
        serviceProvider: [],
        sortBy: '',
        search: ''
    })

    const getServices = async () => {
        try {
            const filterString = Object.entries(filter)
                .map(([key, value]) => `${key}=${value}`)
                .join('&');
            const response = await axios.get(`/client/services?page=${page}&${filterString}`);
            setServices(response.data.services);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    }

    useEffect(() => {
        getServices();
    }, [page, filter])
  return (
    <div className='bg-white px-3 md:px-16 py-8 rounded-3xl shadow-2xl h-full '>
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='md:w-[60vw] mx-auto flex flex-col mb-10'
    >
        <motion.h1 
        className='text-[3rem] font-bold text-center text-gray-800 '
        initial={{ opacity: 0 , y:-50}}
        animate={{ opacity: 1 , y:0}}
        >Services</motion.h1>

        <Filter filter={filter} setFilter={setFilter} />
        
        <ServiceTable services={services} />

        <div className="mt-5">
            <Pagination current={page} setPage={setPage} total={totalPages} />
        </div>
    </motion.div>
    </div>
  )
}

export default ListServices
