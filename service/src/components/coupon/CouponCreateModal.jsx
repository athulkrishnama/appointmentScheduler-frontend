import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { IoCloseSharp } from 'react-icons/io5';
import * as Yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import axios from '../../axios/axios'
import { toast } from 'react-toastify'

function CouponCreateModal({ onClose }) {

    const dateConverter = (date) => {
        let [month, day, year]= new Date(date).toLocaleDateString().split('/')
        if(day < 10) day = `0${day}`
        if(month < 10) month = `0${month}`
        return `${year}-${month}-${day}`
    }
    const initialValues = {
        couponCode: '',
        description: '',
        discount: 0,
        minAmount: 0,
        maxDiscount: 0,
        limit: 0,
        expiryDate: dateConverter(Date.now())
    }

    const checkSpace = (value) => {
        if (value.includes(' ')) {
            return false
        }
        return true
    }

    const validationSchema = Yup.object({
        couponCode: Yup.string().required('Coupon code is required').min(3, 'Coupon code must be at least 3 characters long').max(15, 'Coupon code must be at most 15 characters long').test('no-space', 'Coupon code cannot contain spaces', checkSpace),
        description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters long').max(50, 'Description must be at most 50 characters long'),
        discount: Yup.number().required('Discount is required').integer("Discount must be an integer").min(0, 'Discount should be between 0 and 99').max(99, 'Discount should be between 0 and 99'),
        minAmount: Yup.number().required('Minimum amount is required').min(0, 'Minimum amount should be greater than 0'),
        maxDiscount: Yup.number().required('Maximum discount is required').min(0, 'Maximum discount should be greater than 0'),
        limit: Yup.number().required('Limit is required').min(0, 'Limit should be greater than or equal to 0'),
        expiryDate: Yup.date().required('Expiry date is required').min(new Date(), 'Expiry date should be in the future')
    })

    const handleSubmit = async (values) => {
        try {
            console.log("form data", values)
            if(isNaN(values.discount)) toast.error("discount must be a number")
            const response = await axios.post('/serviceProvider/addCoupon', values)
            toast.success(response.data.message)
            onClose()
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}  
            className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl p-5 w-[90vw] md:w-[30vw] max-h-[80vh] flex flex-col gap-4 overflow-x-hidden relative noScrollBar"
            >
                <IoCloseSharp
                    className="absolute top-5 right-5 text-red-500 cursor-pointer"
                    size={24}
                    onClick={onClose}
                    aria-label="Close"
                />
                <h1 className="text-3xl font-bold text-center text-black tracking-wider">CREATE COUPON</h1>
                <div className="flex w-full bg-white rounded-lg p-2  mt-3">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({setFieldValue, setErrors})=>(
                        <Form className="w-full flex flex-col gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-2"
                            >
                                <label htmlFor="couponCode">Coupon Code:</label>
                                <Field
                                    type="text"
                                    id="couponCode"
                                    name="couponCode"
                                    className="border border-gray-300 rounded-md p-2 focus:outline-gray-400"
                                    onChange={(e)=>setFieldValue('couponCode', e.target.value.toUpperCase())}
                                />
                                <ErrorMessage name="couponCode" component="div" className="text-red-500" />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-2"
                            >
                                <label htmlFor="discount">Discount Percentage:</label>
                                <Field
                                    type="number"
                                    id="discount"
                                    name="discount"
                                    className="border border-gray-300 rounded-md p-2 focus:outline-gray-400"
                                    onChange={(e)=>(isNaN(e.target.value) || e.target.value > 100 || e.target.value < 0) ? toast.error('Discount should be between 0 and 99'):setFieldValue('discount', e.target.value)}
                                />
                                <ErrorMessage name="discount" component="div" className="text-red-500" />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-2"
                            >
                                <label htmlFor="description">Description:</label>
                                <Field
                                    type="text"
                                    id="description"
                                    name="description"
                                    className="border border-gray-300 rounded-md p-2 focus:outline-gray-400"
                                />
                                <ErrorMessage name="description" component="div" className="text-red-500" />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-2"
                            >
                                <label htmlFor="minAmount">Minimum Purchase Amount:</label>
                                <Field
                                    type="number"
                                    id="minAmount"
                                    name="minAmount"
                                    className="border border-gray-300 rounded-md p-2 focus:outline-gray-400"
                                />  
                                <ErrorMessage name="minAmount" component="div" className="text-red-500" />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-2"
                            >
                                <label htmlFor="maxDiscount">Maximum Discount:</label>
                                <Field
                                    type="number"
                                    id="maxDiscount"
                                    name="maxDiscount"
                                    className="border border-gray-300 rounded-md p-2 focus:outline-gray-400"
                                />  
                                <ErrorMessage name="maxDiscount" component="div" className="text-red-500" />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-2"
                            >
                                <label htmlFor="limit">Limit:</label>
                                <Field
                                    type="number"
                                    id="limit"
                                    name="limit"
                                    className="border border-gray-300 rounded-md p-2 focus:outline-gray-400"
                                />  
                                <ErrorMessage name="limit" component="div" className="text-red-500" />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-2"
                            >
                                <label htmlFor="limit">Expiry Date:</label>
                                <Field
                                    type="date"
                                    id="expiryDate"
                                    name="expiryDate"
                                    className="border border-gray-300 rounded-md p-2 focus:outline-gray-400"
                                />  
                                <ErrorMessage name="expiryDate" component="div" className="text-red-500" />
                            </motion.div>
                            <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg" type="submit">Create Coupon</button>
                        </Form>
                        )}
                    </Formik>
                </div>
               
            </motion.div>

        </motion.div>
    )
}

export default CouponCreateModal
