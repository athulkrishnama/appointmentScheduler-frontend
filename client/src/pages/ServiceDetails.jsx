import React,{useEffect, useState} from 'react'
import { useParams , useNavigate} from 'react-router'
import axios from '../axios/axios'
import { toast } from 'react-toastify'
import {motion} from 'framer-motion'
import store from '../store/store'
import QuotationForm from '../components/serviceDetails/QuotationForm'

function ServiceDatails() {
  const [service, setService] = useState({})
  const { id } = useParams()
  
  const navigate = useNavigate()
  const getServiceDetails = async () => {
    try {
      const res = await axios.get(`/client/service/${id}`)
      setService(res.data.service)
    } catch (error) {
      toast.error(error.response.data.message)
      navigate('/services')
      console.log(error)
    }
  }

  useEffect(()=>{
    getServiceDetails()
  },[])
  return (
    <motion.div
      className='bg-white px-3 md:px-16 py-8   w-[90vw] md:w-[60vw] mx-auto flex justify-center flex-col gap-5'
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
      <div className=" bg-slate-100 rounded-3xl shadow-lg shadow-neutral-300 p-5">
        <h5 className='text-3xl text-gray-700 font-bold text-center'>Request a Quote</h5>
        {
          store.getState().user?.email ? <QuotationForm service={service} /> : <h3 className='text-center text-lg text-gray-500 mt-10'>Please login to request a quote</h3>
        }
      </div>
    </motion.div>
  )
}

export default ServiceDatails
