import SignupForm from "../components/signup/Signup";
import OtpPage from "../components/signup/Otp";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import logo from "../assets/timelens.png";
import ProtectedSignup from "../components/protectedComponents/ProtectedLogin";
function Signup() {
  const [isOtpSent, setOtpSent] = useState(false);
  return (
    <ProtectedSignup>

      <div className="h-screen flex flex-col bg-slate-100 gap-3 overflow-hidden">
        <motion.nav
          className="px-10  py-1 shadow-2xl rounded-3xl bg-white z-10"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.img src={logo} className="h-20" alt="logo" />
        </motion.nav>
        <AnimatePresence mode="wait">
          {!isOtpSent ? (
            <motion.div
              key="signup"
              className="flex-grow"
              exit={{ y: -1000 }}
              transition={{ duration: 0.4 }}
            >
              <SignupForm setOtpSent={setOtpSent} />
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              className="flex-grow"
              initial={{ opacity: 0, y: 1000 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <OtpPage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedSignup>
  );
}

export default Signup;
