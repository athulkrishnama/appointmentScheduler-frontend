import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../../axios/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import ReactLoading from 'react-loading'
function Otp() {
  const [time, setTime] = useState(60);
  const [otp, setOtp] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleOtpChange = (e) => {
    const otp = e.target.value;
    if (otp < 1000000) setOtp(otp);
  };

  useEffect(() => {
    if (time > 0) {
      const timeout = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timeout); // Clear timeout to prevent overlapping
    }
  }, [time]);
  const handleSubmit = async () => {
    try {
      if(otp < 100000) return setError("Enter valid OTP");
      else setError("")
      setIsSubmitting(true);
      const response = await axios.post("/auth/verify-otp", {
        otp,
      });

      //   redirecting to login page if otp verfication is scucess
      if (response.status === 200) {
        toast.success("OTP verified successfully", {
          onClose: () => {
            navigate("/login");
          },
          autoClose:500  
        });
      }
      setIsSubmitting(false)
    } catch (error) {
      toast.error(error.response.data.message);
      setOtp("");
      isSubmitting(false);
    }finally{
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.get("/auth/resend-otp");
      toast.success(response.data.message);
      setIsSubmitting(false);
      setTime(60);
    } catch (error) {
      setIsSubmitting(false);
      toast.error(error.response.data.message);
    }finally{
      isSubmitting(false)
    }
  };
  return (
    <div className=" flex justify-center  items-center h-full ">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-[-10rem] flex flex-col  bg-white px-16 py-8 rounded-2xl shadow-lg w-[80vw] md:w-[20vw]"
      >
        <h1 className="text-center text-blue-700 font-extrabold text-4xl mb-8">
          Enter OTP
        </h1>
        <input
          type="number"
          placeholder="Enter OTP"
          className="border border-gray-400 rounded-md px-2 py-1 appearance-none focus-visible:outline-gray-200 mb-2"
          value={otp}
          onChange={handleOtpChange}
        />
        <div className="mb-2 flex justify-between">
          <p className={time < 10 ? "text-red-600" : "text-blue-600"}>
            Time left : <span>{time}</span>
          </p>
          <p className="text-blue-600 hover:cursor-pointer" onClick={resendOtp}>
            Resend OTP
          </p>
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <div className="flex justify-center h-16">{isSubmitting && <ReactLoading type="bars" color="#3b82f6" height="4rem"/> }</div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-200 disabled:cursor-default hover:cursor-pointer "
          disabled={time === 0 || isSubmitting}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </motion.div>
    </div>
  );
}

export default Otp;
