import React from 'react'
import {motion} from 'framer-motion'
import {TiWarning} from 'react-icons/ti'
import axios from '../../axios/axios'
import { toast } from 'react-toastify'
import {useRazorpay} from 'react-razorpay'
import { useNavigate } from 'react-router'

function TopupWallet({wallet, serviceProvider, token}) {

    const {error, isLoading, Razorpay} = useRazorpay()

    const navigate = useNavigate()

    const paymentSuccessHandler = async (data, amount) => {
        try {
            const res = await axios.post("/serviceProvider/verifyTopupPayment", { ...data, token: token, amount })
            toast.success(res.data.message,{
                onClose: () => {
                    navigate('/login', {replace:true})
                }
            })
        } catch (error) {
            toast.error(error.response.data.message)
            console.log(error)
        }
    }
    const handlePayment = async () => {
        try {
            const response = await axios.post("/serviceProvider/topupWallet",
                {
                    token: token,
                    serviceProviderId: serviceProvider._id
                }
            )

            const options  = {
                key:import.meta.env.VITE_RAZORPAY_KEY_ID,
                name:"Timelens",
                description:"Topup Wallet",
                order_id: response.data.order.id,
                retry: {
                    enabled:false
                },
                prefill: {
                    name: serviceProvider.fullname,
                    email: serviceProvider.email,
                    contact: serviceProvider.phone
                },
                handler:(data)=>paymentSuccessHandler(data, response.data.order.amount),
                theme:{
                    color:"#000000"
                }
            }
            const rzpay = new Razorpay(options)
            rzpay.open()
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
        
        
    }
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl shadow-2xl p-5 md:p-10 w-[90vw] md:w-[50vw] mx-auto mt-10 flex flex-col items-center"
    >
      <h1 className="text-3xl font-black text-center">
        <strong>Wallet Topup</strong> <TiWarning className="inline-block text-red-500" />
      </h1>
      <p className="text-red-500 text-left mt-5">
        <span className="text-lg ">
          Dear <strong>{serviceProvider.fullname}</strong>,<br />
          your wallet is <strong>due</strong> with <strong>₹{-wallet.balance}</strong>.<br />
          In order to continue using our services, please <strong>topup</strong> your wallet.
        </span>
      </p>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handlePayment}
        className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded mt-5"
      >
        Topup Now
      </motion.button>
    </motion.div>
  )
}

export default TopupWallet
