import React, { useState, useEffect } from 'react'
import ListCoupon from './ListCoupon'
import AddCoupon from './CouponCreateModal'
import { motion } from 'framer-motion'
import axios from '../../axios/axios'
import { toast } from 'react-toastify'
import Pagination from '../pagination/Pagination'

function CouponPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [coupons , setCoupons] = useState([])
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const LIMIT = 5;

    const fetchCoupons = async()=>{
      try {
        const response = await axios.get(`/serviceProvider/getCoupons/?page=${page}&limit=${LIMIT}`)
        setCoupons(response.data.coupons)
        toast.success(response.data.message)
        setTotalPages(response.data.totalPages)
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
      }

    }

    const toggleStatus = async (couponId, status) => {
      try {
        const response = await axios.patch(`/serviceProvider/toggleCouponStatus/${couponId}`, { status });
        fetchCoupons()
        toast.success(response.data.message)
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
      }
    }

    const onAddCouponModalClose = () => {
      fetchCoupons();
      setIsModalOpen(false);
    };

    useEffect(()=>{
        fetchCoupons()
    },[page])
    const variants = {
      hidden: { opacity: 0, x: 20, y: 20 },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
      },
    }
    return (
      <motion.div className='w-[90vw] md:w-[60vw] mx-auto shadow-[5px_15px_40px_rgba(0,0,0,0.2)] mt-5 p-5 rounded-3xl h-[75vh] '
        variants={variants}
        initial='hidden'
        animate='visible'
      >
        <h1 className='text-3xl font-bold text-center text-black'>Coupons</h1>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className='bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-md font-bold'
          onClick={() => setIsModalOpen(true)}
        >
          Add Coupon
        </motion.button>
        {isModalOpen && (
          <AddCoupon onClose={onAddCouponModalClose} />
        )}
        <ListCoupon coupons={coupons} toggleStatus={toggleStatus}/>
        {totalPages > 1 && <Pagination current={page} setPage={setPage} total={totalPages} />}
      </motion.div>
    )
  }
  
  export default CouponPage