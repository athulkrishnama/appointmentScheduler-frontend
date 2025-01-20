import { motion, AnimatePresence } from "framer-motion";
import * as Yup from "yup";
import { useState } from "react";
import { Field, ErrorMessage } from "formik";
import FormikWrapper from "./FormikWrapper";
import { toast } from "react-toastify";
import axios from "../../axios/axios";
import ReactLoading from "react-loading";
function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [time, setTime] = useState(60);
  const [intervelId, setIntervelId] = useState(null);
  const emailSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Enter a valid email"),
  });

  const otpSchema = Yup.object().shape({
    otp: Yup.string()
      .required("Enter a valid otp")
      .min(6, "Enter a valid otp")
      .max(6, "Enter a valid otp"),
  });

  const passwordStrengthCheck = (password) => {
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(pattern.test(password)){
      return true;
    }
    return false;
  }

  const passwordSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min("8", "password will have atleast 8 characteres")
      .test("password-strength", "Password must have uppercase, lowercase, digit, and special character", passwordStrengthCheck),

    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match")
  });

  const handlePasswordSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const response = await axios.patch("/auth/resetPassword", {
        email,
        password:values.password,
      });
      if (response.status === 200) {
        toast.success(response.data.message,{
          autoClose: 1000,
          onClose: () => {
            window.location.href = "/login";
          }
        });
      }
    } catch (error) {
      setIsSubmitting(false);
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleEmailSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post("/auth/forgetPasswordOtp", {
        email: values.email,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        setEmail(values.email);
        setCurrentStep(2);
        setTime(60);
        const newIntervel = setInterval(() => {
          setTime((prev) => {
            if (prev > 0) {
              return prev - 1;
            } else {
              clearInterval(newIntervel);
              return 0;
            }
          });
        }, 1000);
        setIntervelId(newIntervel);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (values) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post("/auth/verifyForgetPasswordOtp", {
        email,
        otp: values.otp,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        setCurrentStep(3);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.get("/auth/resendForgetPasswordOtp");
      toast.success(response.data.message);
      setIsSubmitting(false);
      clearInterval(intervelId);
      setTime(60);
      const newIntervel = setInterval(() => {
        setTime((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            clearInterval(newIntervel);
            return 0;
          }
        });
      }, 1000);
      setIntervelId(newIntervel);
    } catch (error) {
      setIsSubmitting(false);
      toast.error(error.response.data.message);
    } finally {
      isSubmitting(false);
    }
  };

  console.log("reloading");
  return (
    <motion.div
      key="forget"
      className="bg-white p-16 rounded-3xl shadow-2xl w-[90vw] md:w-[30vw] h-[80vh] md:h-[40vh] flex flex-col justify-center items-stretch"
      initial={{ opacity: 0, y: -500 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-black text-center text-gray-800">
        Forget Password
      </h1>
      <div className="my-10 h-3/4">
        <AnimatePresence mode="popLayout">
          {currentStep === 1 && (
            <motion.div
              key={"email"}
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
            >
              <label htmlFor="email">Enter the email</label>
              <FormikWrapper
                initialValues={{ email: "" }}
                validationSchema={emailSchema}
                onSubmit={handleEmailSubmit}
              >
                <Field
                  type="text"
                  name="email"
                  placeholder="Enter your email"
                  className="focus-visible:outline-none border border-gray-600 w-full py-2 px-4 rounded-lg mt-2"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-700"
                />
                <button
                  type="submit"
                  className="bg-black text-white py-2 px-4 rounded-lg mt-4 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  Sent OTP
                </button>
              </FormikWrapper>
            </motion.div>
          )}
          {currentStep === 2 && (
            <motion.div
              key={"otp"}
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
            >
              <label htmlFor="otp">Enter the otp</label>
              <FormikWrapper
                initialValues={{ otp: "" }}
                validationSchema={otpSchema}
                onSubmit={handleVerifyOtp}
              >
                <Field
                  type="number"
                  name="otp"
                  placeholder="Enter your otp"
                  max="999999"
                  className="focus-visible:outline-none border border-gray-600 w-full py-2 px-4 rounded-lg mt-2"
                />
                <ErrorMessage
                  name="otp"
                  component="div"
                  className="text-red-700"
                />
                <div className="flex justify-between">
                  <p className="my-2 text-center flex items-center justify-center">
                    Time left:
                    <motion.span
                      className={`${
                        time < 10 ? "text-red-700" : "text-black"
                      } inline-block `}
                      animate={{ scale: time > 0 ? [1, 1.05, 1] : 1 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                    >
                      {time}
                    </motion.span>
                  </p>
                  <p
                    className="text-gray-700 hover:text-gray-500 cursor-pointer"
                    onClick={resendOtp}
                  >
                    resend otp
                  </p>
                </div>
                <button
                  type="submit"
                  className="bg-black text-white py-2 px-4 rounded-lg mt-4 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  disabled={time === 0 || isSubmitting}
                >
                  Verify OTP
                </button>
              </FormikWrapper>
            </motion.div>
          )}
          {currentStep === 3 && (
            <motion.div
              key={"password"}
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
            >
              <label htmlFor="password">Enter the password</label>
              <FormikWrapper
                initialValues={{ password: "", confirmPassword: "" }}
                validationSchema={passwordSchema}
                onSubmit={handlePasswordSubmit}
              >
                <div className="my-2">
                  <Field
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="focus-visible:outline-none border border-gray-600 w-full py-2 px-4 rounded-lg mt-2"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-700"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword">
                    Type you password again
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className="focus-visible:outline-none border border-gray-600 w-full py-2 px-4 rounded-lg mt-2"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-700"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-black text-white py-2 px-4 rounded-lg mt-4 hover:bg-gray-700"
                >
                  Reset Password
                </button>
              </FormikWrapper>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="h-[5rem]">
          <AnimatePresence>
            {isSubmitting && (
              <motion.div
                className="flex justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <ReactLoading type="cylon" color="black" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default ForgetPassword;
