import SignupForm from "../components/signup/Signup";
import OtpPage from "../components/signup/Otp";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import logo from "../assets/timelens.png";
function Signup() {
  const [isOtpSent, setOtpSent] = useState(false);
  return (
    <div className="h-screen flex flex-col bg-slate-100 gap-3 ">
      <motion.nav
        className="px-10  py-1 shadow-2xl rounded-3xl bg-white"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.img src={logo} className="h-20" alt="logo" />
      </motion.nav>
      <AnimatePresence>
        {!isOtpSent ? (
          <motion.div
          className="flex-grow">
            <SignupForm setOtpSent={setOtpSent} />
          </motion.div>
        ) : (
          <motion.div
          className="flex-grow">
            <OtpPage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Signup;
