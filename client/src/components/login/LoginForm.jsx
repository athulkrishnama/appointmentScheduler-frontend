import React, { useState } from "react";
import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import FormTextInput from "../form/FormTextInput";
import * as Yup from "yup";
import ReactLoading from "react-loading";
import axios from "../../axios/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import {GoogleLogin} from '@react-oauth/google'
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux';
import { setAccessToken } from '../../store/userSlice/userSlice';

function LoginForm({ setIsForgetPassword }) {
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
        ...values,
      });
      if (response.status === 200) {
        dispatch(setAccessToken(response.data.accessToken));
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

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setIsSubmitting(true);
      const decodedData = jwtDecode(credentialResponse.credential);
      console.log(decodedData);
      const { email} = decodedData;
      const response = await axios.post("/auth/login", {
        email
      });
      if (response.status === 200) {
        dispatch(setAccessToken(response.data.accessToken));
        toast.success(response.data.message, {
          onClose: () => {
            navigate("/");
          },
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setIsSubmitting(false);
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = (error) => {
    console.log(error);
    toast.error("Google login failed");
  };
  return (
    <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{}}
    className="bg-white px-20 py-10 rounded-3xl shadow-2xl w-[90vw] md:w-[30vw]">
      <h1 className="text-center font-black text-blue-700 text-3xl">Login</h1>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ errors, touched }) => (
          <Form className="flex flex-col gap-4">
            <FormTextInput
              touched={touched.email}
              error={errors.email}
              label="Email"
              name="email"
            />
            <FormTextInput
              touched={touched.password}
              error={errors.password}
              label="Password"
              name="password"
              type="password"
            />
            <div className="flex justify-between">
              <p>
                Dont have an account?{" "}
                <span className="text-blue-700 hover:cursor-pointer" onClick={()=>navigate("/signup")}>
                  signup
                </span>
              </p>
              <p className="text-blue-700 hover:cursor-pointer" onClick={()=>setIsForgetPassword(true)}>
                forget password
              </p>
            </div>
            <button
              type="submit"
              className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isSubmitting}
            >
              Login
            </button>
            <div className="flex justify-center"><GoogleLogin onSuccess={handleGoogleLogin} onError={handleGoogleError}/></div>
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
