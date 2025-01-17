import React from "react";
import { IoClose } from "react-icons/io5";
import FormTextInput from "../form/FormTextInput";
import { Formik, Form } from "formik";
import {motion} from 'framer-motion'
import * as Yup from 'yup'
function UpdateProfile({ onClose, handleSubmit , data}) {
    const initialValues = {
        fullname: data.fullname,
        phone: data.phone
    }

    const validationSchema = Yup.object({
        fullname: Yup.string()
            .required("Name is required")
            .min(3, "Name must be at least 3 characters long")
            .max(15, "Name must be at most 15 characters long"),
        phone: Yup.string()
            .required("Phone Number is required")
            .min(10, "Phone Number must be at least 10 characters long")
            .max(10, "Phone Number must be at most 10 characters long"),
    })
  return (
    <div className="fixed top-0 right-0 bg-black bg-opacity-50 w-screen h-screen flex justify-center items-center">
      <motion.div
       initial={{scale: 0}}
       animate={{scale: 1}}
       className="relative p-5 bg-white  rounded-2xl w-[90vw] md:w-[20vw]">
        <motion.div
            className="absolute top-1 right-1"
            whileHover={{scale: 1.1}}
            whileTap={{scale:0.95}}
        >
            <IoClose
              color="red"
              size={24}
              onClick={onClose}
              
            />
        </motion.div>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {
                ({errors, touched})=>(
                    <Form>
                        <FormTextInput
                            label={"Name"}
                            name={"fullname"}
                            error={errors.fullname}
                            placeholder={"Enter Your Name"}
                            touched={touched.fullname}
                        /> 
                        <FormTextInput
                            label={"Phone Number"}
                            name={"phone"}
                            error={errors.phone}
                            placeholder={"Enter Your Phone Number"}
                            touched={touched.phone}
                            type={"number"}
                        /> 
                        <button type="submit" className="bg-black text-white px-2 py-1 rounded-md hover:bg-gray-700">Update</button>
                    </Form>
                )
            }
        </Formik>
      </motion.div>
    </div>
  );
}

export default UpdateProfile;
