import React, { useState } from "react";
import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ReactLoading from "react-loading";
import axios from "../../axios/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import {
  setAccessToken,
  setName,
  setEmail,
  setPhoneNumber,
} from "../../store/userSlice/userSlice";
import FormTextInput from "../form/FormTextInput";
function LoginForm({setIsForgetPassword}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Enter a valid email"),
    password: Yup.string()
      .required("Password is required")
      .min("8", "password will have atleast 8 characteres"),
  });
  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post("/auth/login", {
        ...values,role:'service'
      });
      if (response.status === 200) {
        const { accessToken, user } = response.data;
        dispatch(setAccessToken(accessToken));
        dispatch(setName(user.name));
        dispatch(setEmail(user.email));
        dispatch(setPhoneNumber(user.phone));
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
  
      <motion.div
        className="bg-white px-20 py-10 rounded-3xl shadow-2xl w-[90vw] md:w-[30vw]"
      >
        <h1 className="text-3xl font-black text-blue-700 text-center">Service Provider Login</h1>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col gap-1">
              <FormTextInput
                name="email"
                label="Email"
                touched={touched.email}
                error={errors.email}
              />
              <FormTextInput
                name="password"
                label="Password"
                touched={touched.password}
                error={errors.password}
                type="password"
              />
              <button
                type="submit"
                className="bg-blue-700 text-white rounded-md px-2 py-1 hover:bg-blue-500"
              >
                Login
              </button>
              <div className="flex justify-between">
                <p>Don't have an account?<span className="text-blue-700 hover:cursor-pointer" onClick={() => navigate("/signup")}>signup</span></p>
                <p className="text-blue-700 hover:cursor-pointer" onClick={() => setIsForgetPassword(true)}>forgetpassword</p>
              </div>
              <div className="h-12 flex justify-center">
                {isSubmitting && <ReactLoading type="bars" color="#3b82f6" />}
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    
  );
}

export default LoginForm;
