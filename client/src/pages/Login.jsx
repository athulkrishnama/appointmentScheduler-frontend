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
        <AnimatePresence mode="popLayout">
        {!isForgetPassword ? (
          <motion.div
            key="loginForm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
          >
            <LoginForm setIsForgetPassword={setIsForgetPassword} />
          </motion.div>
        ) : (
          <motion.div
            key="forgetPassword"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
          >
            <ForgetPassword setIsForgetPassword={setIsForgetPassword} />
          </motion.div>
        )}
      </AnimatePresence>
        </div>
      </div>
    </ProtectedLogin>
  );
}

export default Login;
