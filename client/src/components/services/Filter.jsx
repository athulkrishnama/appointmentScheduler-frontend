import React, {useEffect, useState} from 'react'
import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion'
import axios from '../../axios/axios'
import Dropdown from './Dropdown'
import SortBy  from './SortBy'

const Filter = ({ filter, setFilter }) => {
    const [categories, setCategories] = useState([])
    const [serviceProviders, setServiceProviders] = useState([])


    const getFilterData = async () => {
        try{
            const res = await axios.get('/client/getFilterData')
            setCategories(res.data.categories)
            setServiceProviders(res.data.serviceProviders)
        }catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        getFilterData()
    }, [])
    return (
        <div className='flex justify-between gap-3  py-4 flex-wrap ' >
            <motion.div
                className='flex gap-5 text-xl items-center justify-between flex-grow md:flex-grow-0'
            >
                <Dropdown name='category' data={categories} setFilter={setFilter} />
                <Dropdown name='serviceProvider' data={serviceProviders} setFilter={setFilter} />
            </motion.div>
            <motion.div className="flex items-center border border-gray-900 p-2 rounded-2xl w-1/2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <FaSearch size={20} className="mr-2 text-gray-500" />
                <input
                    type="text"
                    value={filter.search}
                    onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                    placeholder="Search"
                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                />
            </motion.div>
            <motion.div>
                <SortBy setFilter={setFilter}/>
            </motion.div>
        </div>
    );
};

export default Filter
