import { motion } from "framer-motion";
import { Formik, Form , Field} from "formik";
import * as Yup from "yup";
import FormTextInput from "../form/FormTextInput";
import { useState, useRef } from "react";
import axios from "../../axios/axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import placeholderImage  from '../../assets/imagePlaceholder.png'
import Cropper from '../cropper/crop'

function SignupForm({ setOtpSent }) {
  const [passwordStrengthClass, setPasswordStrengthClass] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagetoCrop, setImagetoCrop] = useState(null)
  const [logo, setLogo] = useState()
  const [showCropper, setShowCropper] = useState(false)

  const imageRef = useRef(null);
  const navigate = useNavigate()
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirm: "",
    description: "",
    phone: "",
  };

  const validateName = function (username) {
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

  const phoneRegex = /^(?:\(\d{3}\)\s?|\d{3}[-.\s]?)\d{3}[-.\s]?\d{4}$/;

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Company Name must be at least 3 characters")
      .max("15", "Company Name must be at most 15 characters")
      .test("validate-name", validateName),
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min("8", "password must have atleast 8 characteres")
      .test("password strength", passwordStrength),
    confirm: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
    description: Yup.string()
      .required("Description is required")
      .min("20", "Description must be at least 20 characters"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(phoneRegex, "Enter a valid phone number"),
    
  });

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post("/auth/signup", {
        ...values,
        fullname: values.name,
        serviceDetails: { description: values.description },
        role: "service",
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
  
  const handleImageChange = (event)=>{
    const file = event.target.files[0];

      // Check file size and format
    if (file) {
      const isValidSize = file.size <= 2 * 1024 * 1024;
      const isValidFormat = ["image/jpeg", "image/png"].includes(file.type); 
  
      if (isValidSize && isValidFormat) {
        // setCropperVisible(true); 
        // setLogo(event.target.files[0]) 
        const reader = new FileReader();
        reader.onload = () => setLogo(reader.result); // Load the image
        reader.readAsDataURL(file);
        setShowCropper(true)
      } else {
        toast.error("Invalid file. Please upload a valid image.");
      }
    }
  }

    const onClose = () => {
      setShowCropper(false)
      setLogo(null)
      imageRef.current.value = ""

    }

    const onCrop = async (imageBlob) => {
 
    
      // Set the cropped image for preview
      setImagetoCrop(imageBlob);
    }
  return (
    <motion.div className="bg-white px-16 py-6 rounded-3xl shadow-2xl w-[90vw] md:w-[30vw] my-8">
      <h1 className="text-3xl font-black text-blue-800 mb-4">Service Provider Signup</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ touched, errors }) => (
          <Form className="flex flex-col gap-1">

            <img src={imagetoCrop? URL.createObjectURL(imagetoCrop) : placeholderImage} alt="" />
            <input type="file" name="logo" ref={imageRef}   onChange={handleImageChange} className="hidden"/>
            <button className="bg-blue-700 text-white py-2 rounded-md hover:bg-blue-600" onClick={() => imageRef.current.click()}>Add Logo</button>
            { showCropper && <Cropper aspectRatio={1} image={logo} onClose={onClose} onCrop={onCrop}/>}
            <FormTextInput
              label="Company Name"
              name="name"
              touched={touched.name}
              error={errors.name}
            />
            <FormTextInput
              label="Email"
              name="email"
              touched={touched.email}
              error={errors.email}
            />
            <FormTextInput
              label="Description"
              name="description"
              touched={touched.description}
              error={errors.description}
            />
            <FormTextInput
              label="Phone Number"
              name="phone"
              touched={touched.phone}
              error={errors.phone}
            />
            <FormTextInput
              label="Password"
              name="password"
              touched={touched.password}
              error={errors.password}
              type="password"
              classes={passwordStrengthClass}
            />
            <FormTextInput
              label="Confirm Password"
              name="confirm"
              touched={touched.confirm}
              error={errors.confirm}
              type="password"
            />
            <button
              type="submit"
              className="bg-blue-700 text-white py-2 rounded-md hover:bg-blue-600"
              disabled={isSubmitting}
            >
              Signup
            </button>
            <div className="flex justify-center h-10">
              {isSubmitting && <ReactLoading type="bars" color="#3b82f6" />}
            </div>

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
  );
}

export default SignupForm;
