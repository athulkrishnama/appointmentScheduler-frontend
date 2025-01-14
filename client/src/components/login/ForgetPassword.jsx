import {motion} from 'framer-motion'
import {useFormik} from 'formik'
import * as Yup from 'yup'
function ForgetPassword() {
  
  return (
    <motion.div key="forget"
        className='bg-white p-16 rounded-3xl shadow-2xl'
        initial={{ opacity: 0 , y:-500}}
        animate={{ opacity: 1 , y:0}}
    >
        <h1 className='text-2xl font-black text-center text-gray-800'>Forget Password</h1>

    </motion.div>
  )
}

export default ForgetPassword
