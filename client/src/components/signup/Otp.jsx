import { motion } from "framer-motion";
import { useState } from "react";
import  axios  from "../../axios/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
function Otp() {
  const [time, setTime] = useState(60);
  const [otp, setOtp] = useState();

  const navigate = useNavigate();
  const handleOtpChange = (e) => {
    const otp = e.target.value;
    if (otp < 1000000) setOtp(otp);
  };
  setTimeout(() => {
    if (time > 0) {
      setTime(time - 1);
    }
  }, 1000);
  const handleSubmit = async () => {
    try {
        console.log('submitting')
      const response = await axios.post("/auth/verify-otp", {
        otp,
      });

      //   redirecting to login page if otp verfication is scucess
      if (response.status === 200) {
        toast.success("OTP verified successfully", {
          onClose: () => {
            navigate("/login");
          },
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setOtp("");
    }
  };

  const resendOtp = () => {};
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
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-200 disabled:cursor-default hover:cursor-pointer "
          disabled={time === 0}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </motion.div>
    </div>
  );
}

export default Otp;
