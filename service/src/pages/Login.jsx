import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Header from "../components/signup/Header";
import ProtectedLogin from "../components/protectedComponents/ProtectedLogin";
import LoginForm from "../components/login/LoginForm";
function Login() {
  return (
    <ProtectedLogin>
      <div className="h-screen flex flex-col bg-slate-100">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <AnimatePresence mode="wait">
            <LoginForm />
          </AnimatePresence>
        </div>
      </div>
    </ProtectedLogin>
  );
}

export default Login;
