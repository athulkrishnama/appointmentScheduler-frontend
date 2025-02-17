import React from 'react'
import { delay, motion } from 'framer-motion'
function ListCoupon({ coupons, toggleStatus }) {
  const variants = {
    hidden: {
      opacity: 0,
      y: -20
    },
    visible: {
      opacity: 1,
      y: 0
    }
  }
  return (
    <div className='px-5'>
      <table className="w-full my-3  rounded-xl bg-white shadow-md">
        <thead>
          <motion.tr
            variants={variants}
            initial="hidden"
            animate="visible"
            className="bg-gray-50 text-gray-800 rounded-t-xl"
          >
            <th className="border-b border-gray-300 text-left px-4 py-5 rounded-tl-xl">Coupon Code</th>
            <th className="border-b border-gray-300 text-left px-4 py-5">Description</th>
            <th className="border-b border-gray-300 text-left px-4 py-5">Discount</th>
            <th className="border-b border-gray-300 text-left px-4 py-5">Minimum Amount</th>
            <th className="border-b border-gray-300 text-left px-4 py-5">Limit</th>
            <th className="border-b border-gray-300 text-left px-4 py-5">Used Count</th>
            <th className="border-b border-gray-300 text-left px-4 py-5">Max Discount</th>
            <th className="border-b border-gray-300 text-left px-4 py-5 rounded-tr-xl">Expiry Date</th>
            <th className="border-b border-gray-300 text-left px-4 py-5 rounded-tr-xl">Active</th>
          </motion.tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {coupons.map((coupon, index) => (
            <motion.tr
              key={coupon._id}
              variants={variants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="hover:bg-gray-100  rounded-lg"
            >
              <td className="py-5  border-gray-300 px-4 text-gray-800 w-[15%] rounded-bl-lg">{coupon.couponCode}</td>
              <td className="py-5  border-gray-300 px-4 text-gray-800 w-[20%]">{coupon.description}</td>
              <td className="py-5  border-gray-300 px-4 text-gray-800 w-[10%]">{coupon.discount}%</td>
              <td className="py-5  border-gray-300 px-4 text-gray-800 w-[15%]">₹{coupon.minAmount}</td>
              <td className="py-5  border-gray-300 px-4 text-gray-800 w-[8%]">{coupon.limit}</td>
              <td className="py-5  border-gray-300 px-4 text-gray-800 w-[12%]">{coupon.usedCount}</td>
              <td className="py-5  border-gray-300 px-4 text-gray-800 w-[12%]">{coupon.maxDiscount}</td>
              <td className="py-5  border-gray-300 px-4 text-gray-800 w-[15%] rounded-br-lg">
                {new Date(coupon.expiryDate).toLocaleDateString()}
              </td>
              <td className="py-5  border-gray-300 px-4 text-gray-800 w-[5%]">
                <button
                  className={`${coupon.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-800 hover:bg-gray-900'} py-1 px-4 rounded text-white font-black`}
                  onClick={() => toggleStatus(coupon._id, !coupon.isActive)}
                >
                  {coupon.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListCoupon
