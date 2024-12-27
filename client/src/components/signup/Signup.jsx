import { motion } from "framer-motion";
import logo from "../../assets/timelens.png";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormTextInput from "../form/FormTextInput";
import { useState } from "react";
import axios from "../../axios/axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
function Signup({ setOtpSent }) {
  const [passwordStrengthClass, setPasswordStrengthClass] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // regext for mobile number
  const phoneRegex = /^(?:\(\d{3}\)\s?|\d{3}[-.\s]?)\d{3}[-.\s]?\d{4}$/;
  // custom validation for password strength check
  const passwordStrength = function (password) {
    // regex for checking password strength
    const strongPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const mediumPattern = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password) {
      return this.createError({ message: "Password is required" });
    } else if (strongPattern.test(password)) {
      return true;
    } else if (mediumPattern.test(password)) {
      setPasswordStrengthClass("text-yellow-400");
      return this.createError({
        message:
          "Password strength is medium. Add special characters or uppercase letters.",
      });
    } else {
      setPasswordStrengthClass("text-red-600");
      return this.createError({
        message:
          "Password must have uppercase, lowercase, digit, and special character",
      });
    }
  };

  const validateUsername = function (username) {
    const usernameRegex = /^[a-zA-Z0-9_ ]+$/;
    if (!username) {
      return this.createError({ message: "Fullname is required" });
    } else if (!usernameRegex.test(username)) {
      return this.createError({
        message: "Fullname must not contain special characters",
      });
    } else {
      return true;
    }
  };
  // formik validation schema
  const validationSchema = Yup.object().shape({
    fullname: Yup.string()
      .min("3", "Name must be at least 3 characters")
      .max("15", "Name must not exceed 15 characters")
      .test("validate-username", validateUsername),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(phoneRegex, "Invalid phone number"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .test("password-strength", passwordStrength),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  // formik initial values
  const initialValues = {
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post("/auth/signup", {
        ...values,
        role: "client",
      });
      console.log("response");
      if (response.status === 200) {
        toast.success(response.data.message);
        setOtpSent(true);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setIsSubmitting(false);
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (

      <div className="flex flex-col items-center justify-center h-full">
        <motion.div
          className="shadow-2xl mx-8 md:mx-0 md:px-16 px-5 py-20 rounded-2xl bg-white max-w-[90vw] md:max-w-[30vw]"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
        >
          <h2 className="text-5xl font-black text-blue-700 mb-8 text-center ">
            Create Your Account
          </h2>
          <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="flex flex-col gap-4">
                <FormTextInput
                  touched={touched.fullname}
                  name={"fullname"}
                  error={errors.fullname}
                  label="Full Name"
                />
                <FormTextInput
                  touched={touched.email}
                  name={"email"}
                  error={errors.email}
                  label="Email"
                />
                <FormTextInput
                  touched={touched.phone}
                  name={"phone"}
                  error={errors.phone}
                  label="Phone Number"
                />
                <FormTextInput
                  touched={touched.password}
                  name={"password"}
                  error={errors.password}
                  label="Password"
                  type="password"
                  classes={passwordStrengthClass}
                />
                <FormTextInput
                  touched={touched.confirmPassword}
                  name={"confirmPassword"}
                  error={errors.confirmPassword}
                  label="Confirm Password"
                  type="password"
                />
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-200 transition-colors disabled:hover:bg-blue-200"
                >
                  Create Account
                </button>
                <p>
                  Already have account{" "}
                  <span
                    className="text-blue-800 font-semibold hover:cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    login
                  </span>
                </p>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
  );
}

export default Signup;
