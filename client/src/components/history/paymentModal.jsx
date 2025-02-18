import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdClose, MdLocalOffer, MdPayment, MdPerson, MdDateRange, MdShoppingCart } from "react-icons/md";
import axios from "../../axios/axios";
import {toast} from 'react-toastify'
import {useRazorpay} from 'react-razorpay'
import store from '../../store/store'

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};



function PaymentModal({ onClose, appointment }) {
  const [coupons, setCoupons] = useState([]);
  const [inputData, setInputData] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const {error, Razorpay} = useRazorpay()

  const userData = {
    name:store.getState().user.name,
    email:store.getState().user.email,
    phone:store.getState().user.phone
  }

  const applyCoupon = () => {
    setAppliedCoupon(null)
   const selectedCoupon = coupons.find((coupon) => coupon.couponCode === inputData);
   if(appointment.amount < selectedCoupon.minAmount){
    return toast.error(`Minium amount to apply this coupon is ${selectedCoupon.minAmount}`)
   }
   
   setAppliedCoupon(selectedCoupon)
   setInputData('')
  }

  const couponDiscount = (coupon) => {
    const discount = (coupon.discount / 100) * appointment.amount;
    return coupon.maxDiscount > discount ? discount : coupon.maxDiscount;
  }

  const paymentSuccessHandler = async (data) => {
    try {
      const response = await axios.post("/client/verifyPayment", { ...data, appointmentId: appointment._id, paymentStatus: true })
      toast.success(response.data.message)
      onClose() 
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }finally{
      setIsLoading(false)
    }
  }

  const handlePayment = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post("/client/createRazorPayOrder", { appointmentId: appointment._id, couponId: appliedCoupon?._id });
      const options  = {
        key:import.meta.env.VITE_RAZORPAY_KEY_ID,
        name:"Timelens",
        description:"Payment for Service",
        prefill:userData,
        order_id: response.data.order.id,
        retry: {
          enabled:false
        },
        handler:paymentSuccessHandler,
        theme:{
          color:"#000000"
        }
      }
      const rzpay = new Razorpay(options)
      rzpay.open()
      rzpay.on('payment.failed',async (response) => {
        try{
          const res = await axios.post("/client/verifyPayment", { ...response, appointmentId: appointment._id, paymentStatus: false })
          toast.error(res.data.message)
        }catch(error){
          toast.error(error.response.data.message)
          console.log(error)
        }finally{
          onClose()
          setIsLoading(false)
        }
      })
    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error);
      setIsLoading(false)
    }
  };

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(`/client/getCoupons/${appointment.serviceProvider._id}`);
        setCoupons(response.data.coupons);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCoupons();
  }, [appointment]);


  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
      className="fixed inset-0 bg-black/30 flex justify-center items-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        className="bg-white w-full md:w-[50vw] max-h-[80vh] rounded-xl shadow-xl l noscrollBar"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="bg-black text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold tracking-wide flex items-center gap-2">
            <MdPayment className="text-2xl" />
            Payment Details
          </h2>
          <motion.button
            whileHover={{ rotate: 90 }}
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <MdClose size={20} />
          </motion.button>
        </div>

        <div className="p-4 space-y-4 flex flex-col md:flex-row gap-3 noscrollBar">
          <div className="flex-grow">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                { icon: <MdShoppingCart />, label: "Service", value: appointment.service.serviceName },
                { icon: <MdPerson />, label: "Provider", value: appointment?.serviceProvider?.fullname },
                { icon: <MdDateRange />, label: "Serviced Date", value: new Date(appointment.date).toLocaleDateString() }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:shadow-md transition-shadow mb-3"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="flex-grow">
            <div className="space-y-2">
              <p className="text-xl font-bold tracking-wider">Apply Coupon</p>
              <div className="flex w-full gap-3 flex-wrap">
                <input value={inputData} onChange={(e) => setInputData(e.target.value.toUpperCase())} type="text" placeholder="Enter coupon code" className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus-visible:outline-none" />
                <button onClick={applyCoupon} className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
                  APPLY
                </button>
              </div>
            </div>

            <div className="space-y-2 mt-3">
              <p className="text-xl font-bold tracking-wider">Available Coupons</p>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                {coupons.map((coupon) => (
                  <motion.div
                    key={coupon._id}
                    variants={itemVariants}
                    className="flex items-center gap-3 p-5 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
                    onClick={() => setInputData(coupon.couponCode)}
                  >
                    <span className="text-3xl text-green-500">
                      <MdLocalOffer />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Coupon Code</p>
                      <p className="font-medium text-lg">{coupon.couponCode}</p>
                      <p className="text-sm text-gray-500 mt-1">{coupon.description}</p>
                    </div>
                    <div className="flex-none">
                      <p className="text-sm text-gray-500">Discount</p>
                      <p className="font-medium text-lg">{coupon.discount}%</p>
                    </div>
                    <div className="flex-none">
                      <p className="text-sm text-gray-500">Min Purchase</p>
                      <p className="font-medium text-lg">₹{coupon.minAmount}</p>
                    </div>
                    <div className="flex-none">
                      <p className="text-sm text-gray-500">Max Discount</p>
                      <p className="font-medium text-lg">₹{coupon.maxDiscount}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 mt-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className={`text-2xl font-bold ${appliedCoupon && 'line-through'}`}>₹{appointment.amount}</p>
            </div>
            <AnimatePresence mode="wait">
            {appliedCoupon && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.3 }}
                className="flex flex-grow flex-col md:flex-row gap-5 justify-between items-start md:items-center"
              >
              <div>
                <p className="text-sm text-gray-500">Coupon Discount</p>
                <p className="text-2xl font-bold text-green-500">₹{couponDiscount(appliedCoupon)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Final Amount</p>
                <p className="text-3xl font-bold">₹{appointment.amount - couponDiscount(appliedCoupon)}</p>
              </div>
              </motion.div>
            )}
            </AnimatePresence>

            <motion.button
              onClick={handlePayment}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <MdPayment />
              {isLoading ? 'Processing...' : 'Pay Now'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PaymentModal;