import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaUnlock, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import FormTextInput from '../form/FormTextInput';

const CategoryTable = ({ categories, changeStatus, updateCategory , }) => {

  const [confirmation, setConfirmation] = useState({ show: false, categoryId: null, categoryName: '', action: '' });
  const [editModal, setEditModal] = useState({ show: false, category: null });

  const handleButtonClick = (categoryId, name, action) => {
    setConfirmation({ show: true, categoryId, categoryName: name, action });
  };

  const confirmAction = async () => {
    changeStatus(confirmation.categoryId, confirmation.action);
    setConfirmation({ show: false, categoryId: null, categoryName: '', action: '' });
  };

  const cancelConfirmation = () => {
    setConfirmation({ show: false, categoryId: null, categoryName: '', action: '' });
  };

  const handleEditClick = (category) => {
    setEditModal({ show: true, category });
  };

  const closeEditModal = () => {
    setEditModal({ show: false, category: null });
  };

  const EditCategorySchema = Yup.object().shape({
    categoryName: Yup.string()
    .required('Category Name is required')
    .min(5, 'Category Name must be at least 5 characters')
    .max(15, 'Category Name must be at most 15 characters'),
    categoryDescription: Yup.string().
    required('Category Description is required')
    .min(20, 'Category Description must be at least 20 characters')
    .max(200, 'Category Description must be at most 200 characters')
  });

  const handleEditSubmit = async (values) => {
    try {
      const response = await updateCategory(editModal.category._id, values);
      if (response.status === 200) {
        toast.success(response.data.message);
        closeEditModal();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full md:w-[60vw] mx-auto overflow-x-auto rounded-lg shadow-lg mt-12"
    >
      <table className="min-w-full bg-gray-50 rounded-lg">
        <thead className="bg-gray-200 text-gray-800">
          <tr>
            <th className="py-3 px-2 md:px-6 text-left">Category Name</th>
            <th className="py-3 px-2 md:px-6 text-left">Description</th>
            <th className="py-3 px-2 md:px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr 
              key={category.id} 
              className="border-b border-gray-300 hover:bg-gray-100"
            >
              <td className="py-4 px-2 md:px-6 text-gray-800">{category.categoryName}</td>
              <td className="py-4 px-2 md:px-6 text-gray-800">{category.categoryDescription}</td>
              <td className="py-4 px-2 md:px-6 flex">
                {category.isActive ? (
                  <button
                    onClick={() => handleButtonClick(category._id, category.categoryName, 'block')}
                    className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2 flex items-center"
                  >
                    <FaLock className="mr-2" /> Block
                  </button>
                ) : (
                  <button
                    onClick={() => handleButtonClick(category._id, category.categoryName, 'unblock')}
                    className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  >
                    <FaUnlock className="mr-2" /> Unblock
                  </button>
                )}
                <button
                  onClick={() => handleEditClick(category)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2 flex items-center"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmation.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-medium text-gray-900">Confirm {confirmation.action} </h3>
            <p className="mt-2 text-sm text-gray-500">Are you sure you want to {confirmation.action.toLowerCase()} {confirmation.categoryName}?</p>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
                onClick={confirmAction}
              >
                Confirm
              </button>
              <button
                type="button"
                className="ml-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-black bg-white border border-black rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
                onClick={cancelConfirmation}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editModal.show && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md shadow-lg">
            <h3 className="text-lg font-medium text-gray-900">Edit Category</h3>
            <Formik
              initialValues={{
                categoryName: editModal.category.categoryName,
                categoryDescription: editModal.category.categoryDescription,
              }}
              validationSchema={EditCategorySchema}
              onSubmit={handleEditSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="mt-4">
                    <FormTextInput
                      label="Category Name"
                      name="categoryName"
                      touched={touched.categoryName}
                      error={errors.categoryName}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mt-4">
                    <FormTextInput
                      label="Category Description"
                      name="categoryDescription"
                      touched={touched.categoryDescription}
                      error={errors.categoryDescription}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="bg-black text-white px-4 py-2 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="bg-white text-black px-4 py-2 rounded border border-gray-700"
                      onClick={closeEditModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CategoryTable;