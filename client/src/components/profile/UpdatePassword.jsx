import React from "react";
import { MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
function UpdatePassword({ onClose, handleSubmit }) {
  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  const passwordStrengthCheck = (password) => {
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
        "passwordStrengthCcheck",
        "Password must have uppercase, lowercase, digit, and special character",
        passwordStrengthCheck
      ),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .min(8, "Confirm Password must be at least 8 characters long")
      .max(15, "Confirm Password must be at most 15 characters long")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });
  return (
    <div className="fixed top-0 left-0 bg-black bg-opacity-50 w-screen h-screen flex justify-center items-center">
      <div className="bg-white w-[90vw] md:w-[25vw] relative rounded-2xl py-5 px-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="absolute top-2 right-2 text-red-500 cursor-pointer"
        >
          <MdClose onClick={onClose} size={24} aria-label="Close" />
        </motion.button>
        <h1 className="text-2xl text-center font-semibold">Change Password</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="flex flex-col justify-stretch">
            <div>
              <label htmlFor="currentPassword">
                Enter your current password
              </label>
              <Field
                name="currentPassword"
                type="password"
                className="border border-gray-400 rounded-md px-2 py-1 w-full focus-visible:outline-none"
              />
              <div className="h-[1.5rem]">
                <ErrorMessage
                  name="currentPassword"
                  component={"div"}
                  className="text-red-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="newPassword">Enter your new password</label>
              <Field
                name="newPassword"
                type="password"
                className="border border-gray-400 rounded-md px-2 py-1 w-full focus-visible:outline-none"
              />
              <div className="h-[1.5rem]">
                <ErrorMessage
                  name="newPassword"
                  component={"div"}
                  className="text-red-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm new password</label>
              <Field
                name="confirmPassword"
                type="password"
                className="border border-gray-400 rounded-md px-2 py-1 w-full focus-visible:outline-none"
              />
              <div className="h-[1.5rem]">
                <ErrorMessage
                  name="confirmPassword"
                  component={"div"}
                  className="text-red-500"
                />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.95 }}
              className="text-white bg-black hover:bg-gray-900 rounded-md py-2"
              type="submit"
            >
              Change Password
            </motion.button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default UpdatePassword;
