import SignupForm from "../components/signup/SignupForm";
import OtpPage from "../components/signup/Otp";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Header  from "../components/signup/Header";
import ProtectedSignup from "../components/protectedComponents/ProtectedLogin";
function Signup() {
  const [isOtpSent, setOtpSent] = useState(false);
  return (
    <ProtectedSignup>
      <div className="min-h-screen flex flex-col bg-slate-100">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <AnimatePresence mode="wait">
            {!isOtpSent ? <SignupForm setOtpSent={setOtpSent} /> : <OtpPage />}
          </AnimatePresence>
        </div>
      </div>
    </ProtectedSignup>
  );
}

export default Signup;
