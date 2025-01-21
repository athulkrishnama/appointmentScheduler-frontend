import { motion } from "framer-motion";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import FormTextInput from "../form/FormTextInput";
import { useState, useRef } from "react";
import axios from "../../axios/axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import placeholderImage from "../../assets/placeholder.png";
import Cropper from "../cropper/crop";

function SignupForm({ setOtpSent }) {
  const [passwordStrengthClass, setPasswordStrengthClass] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState(null);
  const [documentImage, setDocumentImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageType, setImageType] = useState('')
  

  const inputRef = useRef(null);
  const documentInputRef = useRef(null);

  const navigate = useNavigate();
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

      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }
      if (!image) {
        toast.error("Logo is required");
        return;
      }
      if(!documentImage) {
        toast.error("Document is required")
        return
      }
      formData.append("logo", image);
      formData.append('document', documentImage)
      formData.append("role", "service");
      formData.append("fullname", values.name);
      formData.append(
        "serviceDetails",
        JSON.stringify({ description: values.description })
      );

      const response = await axios.post("/auth/signup", formData);

      if (response.status === 200) {
        toast.success(response.data.message);
        setOtpSent(true);
      }
    } catch (error) {
      console.error("Error: ", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  // close cropper
  const onClose = () => {
    setShowCropper(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("handelign iamge");
    const validFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validFileTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPEG, PNG, or JPG file.");
      return;
    } else if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }
    setImageType('logo')
    setShowCropper(true);
    
  };

  const handleDocumentChange = async (e) => {
    const file = e.target.files[0];
    const validFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validFileTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPEG, PNG, or JPG file.");
      return;
    } else if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }
    setImageType('document')
    setShowCropper(true);
  }

  return (
    <motion.div className="bg-white px-6 md:px-16 py-6 rounded-3xl shadow-2xl w-[90vw] md:w-[60vw] my-8">
      <h1 className="text-3xl font-black text-blue-800 mb-4">
        Service Provider Signup
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ touched, errors }) => (
          <Form className="flex  flex-wrap">
            <div className="w-full md:w-1/2 aspect-square">
              <img
                src={image ? URL.createObjectURL(image) : placeholderImage}
                alt=""
                className="w-full rounded-md mx-auto aspect-square"
              />
              {showCropper && (
                <Cropper
                  image={imageType === 'logo' ?inputRef.current.files[0]: documentInputRef.current.files[0]}
                  onClose={onClose}
                  setImage={imageType === 'logo' ? setImage: setDocumentImage}
                  aspectRatio={imageType === 'logo' ? 1 : 4/5}
                />
              )}
              <input
                type="file"
                onChange={handleImageChange}
                ref={inputRef}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => inputRef.current.click()}
                className="bg-blue-700 w-full text-white py-2 rounded-md hover:bg-blue-600 my-2"
              >
                Upload Logo
              </button>
            </div>
            <div className="w-full md:w-1/2 px-3">
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
            </div>
            <div className="w-full my-3 flex justify-center flex-col items-center">
              <img
                src={
                  documentImage
                    ? URL.createObjectURL(documentImage)
                    : placeholderImage
                }
                alt=""
                className="w-full h-[40vh] object-scale-down"
              />
              <input type="file" ref={documentInputRef} className="hidden" onChange={handleDocumentChange}/>
              <button className="bg-blue-700 px-3 text-white py-2 rounded-md hover:bg-blue-600 my-2"
                type="button"
                onClick={() => documentInputRef.current.click()}
              >
                Add Document
              </button>
            </div>
            <div className="w-full flex flex-col items-center">
              <button
                type="submit"
                className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                disabled={isSubmitting}
              >
                Signup
              </button>
              <div className="flex justify-center h-16">
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
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}

export default SignupForm;
