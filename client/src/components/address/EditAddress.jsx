import React from "react";
import { MdClose } from "react-icons/md";
import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormTextInput from "../form/FormTextInput";
function EditAddress({ onClose, handleSubmit, address }) {
  const initialValues = {
    name: address.fullName,
    area: address.area,
    district: address.district,
    state: address.state,
    pincode: address.pincode,
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters long")
      .max(15, "Name must be at most 15 characters long"),
    area: Yup.string()
      .required("Area is required")
      .min(3, "Area must be at least 3 characters long")
      .max(15, "Area must be at most 15 characters long"),
    district: Yup.string()
      .required("District is required")
      .min(3, "District must be at least 3 characters long")
      .max(15, "District must be at most 15 characters long"),
    state: Yup.string()
      .required("State is required")
      .min(3, "State must be at least 3 characters long")
      .max(15, "State must be at most 15 characters long"),
    pincode: Yup.string()
      .required("Pincode is required")
      .min(6, "Pincode must be at least 6 characters long")
      .max(6, "Pincode must be at most 6 characters long"),
  });
  return (
    <motion.div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
      <motion.div
        className="bg-white  rounded-3xl relative w-90 md:w-[30vw] p-5"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <MdClose
          className="absolute top-5 right-5 text-black cursor-pointer"
          size={24}
          onClick={onClose}
          aria-label="Close"
        />
        <h1 className="text-2xl text-center mt-5 font-black">Edit Address</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="px-16">
              <FormTextInput
                name="name"
                label="Enter Your Name"
                type="text"
                touched={touched.name}
                error={errors.name}
                placeholder="Enter Your Name"
              />
              <FormTextInput
                name="area"
                label="Enter Your Area"
                type="text"
                touched={touched.area}
                error={errors.area}
                placeholder="Enter Your Area"
              />
              <FormTextInput
                name="district"
                label="Enter Your District"
                type="text"
                touched={touched.district}
                error={errors.district}
                placeholder="Enter Your District"
              />
              <FormTextInput
                name="state"
                label="Enter Your State"
                type="text"
                touched={touched.state}
                error={errors.state}
                placeholder="Enter Your State"
              />
              <FormTextInput
                name="pincode"
                label="Enter Your Pincode"
                type="number"
                touched={touched.pincode}
                error={errors.pincode}
                placeholder="Enter Your Pincode"
              />
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit Address
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </motion.div>
  );
}

export default EditAddress;
