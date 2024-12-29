import {motion} from 'framer-motion'
function ForgetPassword() {
  return (
    <motion.div key="forget"
        className='bg-white p-16 rounded-3xl shadow-2xl'
    >
        <h1 className='text-2xl font-bold text-center text-blue-800'>Forget Password</h1>
    </motion.div>
  )
}

export default ForgetPassword
