import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import axios from "../../axios/axios";
import ReactLoading from "react-loading";
import * as Yup from "yup";
function ForgetPassword({ setIsForgetPassword }) {
  const [email, setEmail] = useState("");
  const [time, setTime] = useState(60);
    const [intervalId, setIntervalId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const formVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        stiffness: 100,
        damping: 10,
      },
    },
    exit: {
      opacity: 0,
      y: -50,
    },
  };

  const emailInitialValues = {
    email: "",
  };

  const otpIntialValues = {
    otp: "",
  };

  const passwordInitialValues = {
    password: "",
    confirmPassword: "",
  };

  const emailValidationSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
  });

  const passwordStrength = (password) => {
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (pattern.test(password)) {
      return true;
    }
    return false;
  };
  const passwordValidationSchema = Yup.object({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password will have atleast 8 characteres")
      .test(
        "passwordStrength",
        "Password must contain atleast 1 uppercase, 1 lowercase, 1 number and 1 special character",
        passwordStrength
      ),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const otpValidationSchema = Yup.object({
    otp: Yup.string()
      .required("OTP is required")
      .min(6, "OTP will have 6 characters")
      .max(6, "OTP will have 6 characters"),
  });

  const startInterval = () => {
    setTime(60);
    const id = setInterval(() => {
      setTime((prev) =>{
        if (prev === 0) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setIntervalId(id);
  }

  const handleSubmitEmail = async (values) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/auth/forgetPasswordOtp", values);
      if (response.status === 200) {
        toast.success(response.data.message);
        setCurrentStep(2);
        startInterval();
        setEmail(values.email);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleOtpSubmit = async (values) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "/auth/verifyForgetPasswordOtp",
        values
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setCurrentStep(3);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (values) => {
    try {
      setIsLoading(true);
      const response = await axios.patch("/auth/resetPassword", {
        password: values.password,
        email: email,
      });
      if (response.status === 200) {
        toast.success(response.data.message, {
          onClose: () => setIsForgetPassword(false),
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/auth/resendForgetPasswordOtp");
      if (response.status === 200) {
        toast.success(response.data.message);
        clearInterval(intervalId);
        startInterval();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <motion.div
      key="forgetpassword"
      className="bg-white w-[90vw] md:w-[25vw]  mt-5 rounded-3xl shadow-2xl flex flex-col justify-center items-center p-5"
    >
      <h1 className="text-3xl font-bold text-center">Forget Password</h1>
      <div className="h-[20vh] flex items-center w-full ">
        <AnimatePresence mode="popLayout">
          {currentStep === 1 && (
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              key="email"
              className="w-full"
            >
              <Formik
                initialValues={emailInitialValues}
                validationSchema={emailValidationSchema}
                onSubmit={handleSubmitEmail}
              >
                <Form>
                  <div className="flex flex-col">
                    <label htmlFor="email">Enter Your Email</label>
                    <Field
                      type="email"
                      name="email"
                      className="border border-gray-400 rounded-md px-2 py-1 focus:outline-gray-400 w-full"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-1 mt-3 rounded-lg font-bold disabled:bg-gray-300"
                    disabled={isLoading}
                  >
                    Sent OTP
                  </button>
                </Form>
              </Formik>
            </motion.div>
          )}
          {currentStep === 2 && (
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              key="otp"
              className="w-full"
            >
              <Formik
                initialValues={otpIntialValues}
                validationSchema={otpValidationSchema}
                onSubmit={handleOtpSubmit}
              >
                <Form>
                  <div className="flex flex-col">
                    <label htmlFor="otp">Enter OTP</label>
                    <Field
                      type="number"
                      name="otp"
                      className="border border-gray-400 rounded-md px-2 py-1 focus:outline-gray-400 w-full"
                    />
                    <ErrorMessage
                      name="otp"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div
                    className="flex justify-between mt-3"
                    
                  >
                    <p>
                      OTP expires in <span className={`${time<10 ? "text-red-500":"text-black"}`}>{time}</span> 
                    </p>
                    <p onClick={resendOtp} className="font-semibold cursor-pointer">resend otp</p>
                  </div>
                  <button
                    type="submit"
                    className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-1 mt-3 rounded-lg font-bold disabled:bg-gray-500"
                    disabled={isLoading || time <= 0}
                  >
                    Verify OTP
                  </button>
                </Form>
              </Formik>
            </motion.div>
          )}
          {currentStep === 3 && (
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              key="password"
              className="w-full"
            >
              <Formik
                initialValues={passwordInitialValues}
                validationSchema={passwordValidationSchema}
                onSubmit={handlePasswordSubmit}
              >
                <Form>
                  <div className="flex flex-col">
                    <label htmlFor="password">Enter New Password</label>
                    <Field
                      type="password"
                      name="password"
                      className="border border-gray-400 rounded-md px-2 py-1 focus:outline-gray-400 w-full"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      className="border border-gray-400 rounded-md px-2 py-1 focus:outline-gray-400 w-full"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-1 mt-3 rounded-lg font-bold disable:bg-gray-500"
                  >
                    Reset Password
                  </button>
                </Form>
              </Formik>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="h-10 py-3">
        {isLoading && <ReactLoading type="cylon" color="#222" />}
      </div>
    </motion.div>
  );
}

export default ForgetPassword;
