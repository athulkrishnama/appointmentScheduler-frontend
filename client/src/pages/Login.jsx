import Header from "../components/login/Header";
import LoginForm from "../components/login/LoginForm";
import ForgetPassword from "../components/login/ForgetPassword";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ProtectedLogin from "../components/protectedComponents/ProtectedLogin";
function Login() {
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  return (
    <ProtectedLogin>
      <div className="h-screen flex flex-col bg-slate-100">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <AnimatePresence mode="wait">
            {!isForgetPassword ? <LoginForm setIsForgetPassword={setIsForgetPassword} /> : <ForgetPassword />}
          </AnimatePresence>
        </div>
      </div>
    </ProtectedLogin>
  );
}

export default Login;
