import React from "react";
import { Field } from "formik";
import { motion, AnimatePresence } from "framer-motion";
function FormTextInput({ touched, error, label, name, classes,inputClasses, ...props }) {
  const classNames = (props.type == 'file' ? "rounded-md px-2 py-1" : "border border-gray-400 rounded-md px-2 py-1") + " " + inputClasses
  return (
    <div className="flex flex-col  min-h-20">
      <label htmlFor={name}>{label}</label>
      <Field name={name} {...props} className={classNames}/>
      <AnimatePresence>
        {touched && error && <AnimatedErrorMessage classess={classes}>{error}</AnimatedErrorMessage>}
      </AnimatePresence>
    </div>
  );
}

function AnimatedErrorMessage({ children , classess} ) {
  const errorClass = "text-red-600 text-wrap " + classess;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={errorClass}
    >
      {children}
    </motion.div>
  );
}

export default FormTextInput;
