import React, { useState } from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReactLoading from "react-loading";
import { IoCloseSharp } from "react-icons/io5";
import axios from '../../axios/axios'
import {toast} from 'react-toastify'
function UpdateProfileModal({ onClose, handleUpdateProfile, data }) {
  const [isLoading, setIsLoading] = useState(false);
  const initialValues = {
    fullname: data.fullname,
    email: data.email,
    phone: data.phone,
    description: data.serviceDetails.description,
  };

  const validationSchema = Yup.object({
    fullname: Yup.string()
      .required("Company name is required")
      .min(3, "Company name must have atleast 3 characters")
      .max(15, "Company name must have less than 15 characters"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .required("Phone number is required")
      .min(10, "Phone number must have 10 digits")
      .max(10, "Phone number must have 10 digits"),
    description: Yup.string()
      .required("Description is required")
      .min(15, "Description must have atleast 15 characters")
      .max(200, "Description must have less than 200 characters"),
  });

  const handleSubmit = async (values) => {
    try {

      if(data.fullname === values.fullname && data.email === values.email && data.phone === values.phone && data.serviceDetails.description === values.description){
        return toast.error("No changes applied")
      }

      setIsLoading(true);
      const response = await axios.put("/serviceProvider/updateServiceProviderDetails", values);
      if (response.status === 200) {
        toast.success(response.data.message);
        handleUpdateProfile(response.data.user);
        onClose();
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-white p-5 rounded-3xl shadow-2xl relative w-[90vw] md:w-[30vw]"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={onClose}
          className="absolute top-5 right-5 text-red-500 cursor-pointer"
        >
          <IoCloseSharp size={24} />
        </motion.button>
        <h1 className="text-2xl text-center font-black">Update Profile</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <motion.div>
              <motion.div className="flex flex-col min-h-20 w-full  p-2">
                <label htmlFor="fullname"> Company Name</label>
                <Field
                  type="text"
                  name="fullname"
                  className="border border-gray-400 rounded-md px-2 py-1 focus:outline-gray-400"
                />
                <ErrorMessage
                  name="fullname"
                  component={"div"}
                  className="text-red-600"
                />
              </motion.div>

              <motion.div className="flex flex-col min-h-20 w-full  p-2">
                <label htmlFor="fullname">Email </label>
                <Field
                  type="text"
                  name="email"
                  className="border border-gray-400 rounded-md px-2 py-1 focus:outline-gray-400"
                />
                <ErrorMessage
                  name="email"
                  component={"div"}
                  className="text-red-600"
                />
              </motion.div>
              <motion.div className="flex flex-col min-h-20 w-full  p-2">
                <label htmlFor="phone">Phone Number</label>
                <Field
                  type="text"
                  name="phone"
                  className="border border-gray-400 rounded-md px-2 py-1 focus:outline-gray-400"
                />
                <ErrorMessage
                  name="phone"
                  component={"div"}
                  className="text-red-600"
                />
              </motion.div>
              <motion.div className="flex flex-col min-h-20 w-full  p-2">
                <label htmlFor="description">Description</label>
                <Field
                  type="text"
                  as="textarea"
                  rows={4}
                  name="description"
                  className="border border-gray-400 rounded-md px-2 py-1 focus:outline-gray-400"
                />
                <ErrorMessage
                  name="description"
                  component={"div"}
                  className="text-red-600"
                />
              </motion.div>
              {!isLoading ? (
                <button type="submit" className="bg-gray-900 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-700">
                  Update
                </button>
              ) : (
                <div className="flex justify-center">
                    <ReactLoading type='cylon' color='#111' />
                </div>
              )}
            </motion.div>
          </Form>
        </Formik>
      </motion.div>
    </div>
  );
}

export default UpdateProfileModal;
