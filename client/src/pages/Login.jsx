import Header from "../components/login/Header";
import LoginForm from "../components/login/LoginForm";
import ForgetPassword from "../components/login/ForgetPassword";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
function Login() {
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  return (
    <div className="h-screen flex flex-col bg-slate-100">
      <Header />
      <div className="flex-grow flex justify-center items-center">
        <AnimatePresence mode="wait">
          {!isForgetPassword ? <LoginForm setIsForgetPassword={setIsForgetPassword} /> : <ForgetPassword />}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Login;
