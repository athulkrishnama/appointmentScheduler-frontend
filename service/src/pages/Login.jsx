import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Header from "../components/signup/Header";
import ProtectedLogin from "../components/protectedComponents/ProtectedLogin";
import LoginForm from "../components/login/LoginForm";
import ForgetPassword from "../components/login/ForgetPassword";
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
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, y: 500, scale: 0.9 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <LoginForm setIsForgetPassword={setIsForgetPassword} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0, y: -500 }}
                transition={{ duration: 0.5, type: "spring" }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
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
