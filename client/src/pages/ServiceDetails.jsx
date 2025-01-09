import React,{useEffect, useState} from 'react'
import { useParams } from 'react-router'
import axios from '../axios/axios'
import { toast } from 'react-toastify'
import {motion} from 'framer-motion'

function ServiceDatails() {
  const [service, setService] = useState({})
  const { id } = useParams()
  const getServiceDetails = async () => {
    try {
      const res = await axios.get(`/client/service/${id}`)
      setService(res.data.service)
    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error)
    }
  }

  useEffect(()=>{
    getServiceDetails()
  },[])
  return (
    <motion.div
      className='bg-white px-16 py-8   w-[90vw] md:w-[60vw] mx-auto flex justify-center flex-col gap-5'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className='text-4xl font-black text-center'>{service.serviceName}</h1>
      <img src={service.image} alt="" className='rounded-3xl shadow-2xl' />
      <p className='text-center'>{service.serviceDescription}</p>
      <div className='flex gap-3  items-center'>
        <h4>Provided  By: </h4>
        <img src={service.serviceProvider?.serviceDetails?.logo} className='h-8 rounded-lg' alt="" />
        <p>{service.serviceProvider?.fullname}</p>
      </div>
    </motion.div>
  )
}

export default ServiceDatails
