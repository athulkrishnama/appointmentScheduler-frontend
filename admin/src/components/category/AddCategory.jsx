import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import axios from '../../axios/axios';
import {toast} from 'react-toastify'
function AddCategory({ setShowAddCategoryModal,setCategories }) {
  const formik = useFormik({
    initialValues: {
      categoryName: '',
      categoryDescription: '',
    },
    validationSchema: Yup.object({
      categoryName: Yup.string()
        .min(3, 'Must be 3 characters or more')
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      categoryDescription: Yup.string()
        .min(20, 'Must be 20 characters or more')
        .max(200, 'Must be 200 characters or less')
        .required('Required'),
    }),
    onSubmit: async(values) => {
      try {
        const response = await axios.post('/admin/addCategory', {...values});
        if (response.status === 200) {
          toast.success(response.data.message);
          setShowAddCategoryModal(false);
          setCategories(prevCategories => [...prevCategories, response.data.category])
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },
  });


  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-30 flex justify-center items-center">
      <motion.form
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        onSubmit={formik.handleSubmit}
        className="bg-white p-6 rounded-lg w-11/12 max-w-md shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add Category</h2>
        <input
          type="text"
          name="categoryName"
          placeholder="Category Name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.categoryName}
          className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-100 text-gray-900"
        />
        {formik.touched.categoryName && formik.errors.categoryName ? (
          <div className="text-red-500 text-sm mb-2">{formik.errors.categoryName}</div>
        ) : null}
        <textarea
          name="categoryDescription"
          placeholder="Category Description"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.categoryDescription}
          className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-100 text-gray-900 h-24"
        />
        {formik.touched.categoryDescription && formik.errors.categoryDescription ? (
          <div className="text-red-500 text-sm mb-2">{formik.errors.categoryDescription}</div>
        ) : null}
        <button type="submit" className="bg-black text-white px-4 py-2 rounded mr-2">Add Category</button>
        <button type="button" onClick={() => setShowAddCategoryModal(false)} className="bg-white text-black px-4 py-2 rounded border border-gray-700">Cancel</button>
      </motion.form>
    </div>
  );
}

export default AddCategory;
