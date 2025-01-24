import React, { useState } from "react";
import { motion } from "framer-motion";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "../../axios/axios";
import ReactLoading from "react-loading";
function PasswordChangeModal({ onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const passwordStrength = (password) => {
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (pattern.test(password)) {
      return true;
    }
    return false;
  };

  const validationSchema = Yup.object({
    currentPassword: Yup.string()
      .required("Current Password is required")
      .min(8, "Current Password must be at least 8 characters long")
      .max(15, "Current Password must be at most 15 characters long"),
    newPassword: Yup.string()
      .required("New Password is required")
      .min(8, "New Password must be at least 8 characters long")
      .max(15, "New Password must be at most 15 characters long")
      .test(
        "passwordStrength",
        "Password must have uppercase, lowercase, digit, and special character",
        passwordStrength
      ),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .min(8, "Confirm Password must be at least 8 characters long")
      .max(15, "Confirm Password must be at most 15 characters long")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  const handleSubmit = async (values) => {
    try {
        setIsLoading(true);
      const response = await axios.patch("/auth/updatePassword", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success(response.data.message,
        {
          onClose: () => {
            onClose();
          },
        }
      );
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }finally{
        setIsLoading(false)
    }
  };
  return (
    <div className="fixed h-screen w-screen top-0 left-0 bg-black bg-opacity-50 flex justify-center items-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-white w-[90vw] md:w-[30vw] rounded-3xl shadow-2xl p-5 relative"
      >
        <motion.button
          className="absolute top-5 right-5 text-red-500 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          onClick={onClose}
        >
          <IoCloseSharp size={24} />
        </motion.button>
        <h1 className="text-2xl text-center font-bold">Change Password</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <motion.div className="font-semibold">
              <div className="flex flex-col mb-3">
                <label htmlFor="currentPassword">Enter Current Password</label>
                <Field
                  type="password"
                  name="currentPassword"
                  className="border border-gray-400 rounded-md px-2 py-1 focus:outline-gray-400"
                />
                <ErrorMessage
                  name="currentPassword"
                  component="div"
                  className="text-red-600"
                />
              </div>
              <div className="flex flex-col mb-3">
                <label htmlFor="newPassword">Enter New Password</label>
                <Field
                  type="password"
                  name="newPassword"
                  className="border border-gray-400 rounded-md px-2 py-1 focus:outline-gray-400"
                />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red-600"
                />
              </div>
              <div className="flex flex-col mb-3">
                <label htmlFor="confirmPassword">Current Password</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="border border-gray-400 rounded-md px-2 py-1 focus:outline-gray-400"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-600"
                />
              </div>
              {!isLoading ? (
                <button
                  className="bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
                  type="submit"
                >
                  Change
                </button>
              ) : (
                <div className="flex justify-center">
                  <ReactLoading
                    type="cylon"
                    color="#000"
                    height={24}
                    width={24}
                  />
                </div>
              )}
            </motion.div>
          </Form>
        </Formik>
      </motion.div>
    </div>
  );
}

export default PasswordChangeModal;
