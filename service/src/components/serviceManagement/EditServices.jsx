import React, { useState, useRef , useEffect} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Formik, Form , Field} from 'formik'
import FormTextInput from '../form/FormTextInput';
import * as Yup from 'yup';
import Cropper from '../cropper/crop';
import { toast } from 'react-toastify';
import defaultBanner from '../../assets/defaultBanner.png'
import { MdClose, MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import axios from '../../axios/axios';

function EditService({ setEditModalClose, service,setUpdateData }) {
  const [showCrop, setShowCrop] = useState(false)
  const [image, setImage] = useState(null)
  const [additionlDetails, setAdditionalDetails] = useState(service.additionalDetails)
  const [newField , setNewField] = useState({
    fieldName: '',
    fieldType: 'number'
  })
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/admin/categories/?limit=all');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const inputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const validFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validFileTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPEG, PNG, or JPG file.");
      return;
    } else if (file.size > 8 * 1024 * 1024) {
      toast.error("Image size should be less than 8MB");
      return;
    }
    setShowCrop(true)
  }
  const initialValues = {
    serviceName: service.serviceName,
    serviceDescription: service.serviceDescription,
    category: service.category
  }

  const validationSchema = Yup.object({
    serviceName: Yup.string()
      .required('Service Name is required')
      .min(3, 'Must be 3 characters or more')
      .max(15, 'Must be 15 characters or less'),
    serviceDescription: Yup.string()
      .required('Service Description is required')
      .min(20, 'Must be 20 characters or more')
      .max(800, 'Must be 800 characters or less'),
    category: Yup.string()
      .required('Category is required')
  })

  const onClose = () => {
    setShowCrop(false)
  }

  const handleNewFieldChange = (e) => {
    setNewField({
      ...newField,
      [e.target.name]: e.target.value
    })
  }

  const addNewField = () => {
    if (newField.fieldName === '' || newField.fieldType === '') return toast.error("All fields are required")
    const existingFieldNames = additionlDetails.some(detail => detail.fieldName === newField.fieldName)
    if (existingFieldNames) return toast.error("Field name already exists")
    setAdditionalDetails([...additionlDetails, newField])
    setNewField({
      fieldName: '',
      fieldType: 'number'
    })
  }

  const deleteField = (index) => {
    setAdditionalDetails(additionlDetails.filter((detail, i) => i !== index))
  }

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData()
      
      if(image)formData.append('image', image)
      formData.append('serviceName', values.serviceName)
      formData.append('serviceDescription', values.serviceDescription)
      formData.append('additionalDetails', JSON.stringify(additionlDetails))
      formData.append('category', values.category)
      const response = await axios.put(`/serviceProvider/updateService/${service._id}`, formData)
      if (response.status === 200) {
        toast.success(response.data.message)
        setEditModalClose(false)
        setUpdateData(response.data.updatedData)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const handleEditClick = (details) => {
    setNewField(details)
    setIsEditing(true)
  }

  const updateField = () => {
    const existingFieldNames = additionlDetails.some(detail => detail.fieldName === newField.fieldName)
    if (existingFieldNames) return toast.error("Field name already exists")
    setAdditionalDetails(additionlDetails.map(detail => detail.fieldName === newField.fieldName ? newField : detail))
    setIsEditing(false)
    setnewField({
      fieldName: '',
      fieldType: 'number'
    })
  }
  return (
    <div>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-lg w-[80vw] md:w-[70vw] relative overflow-y-auto max-h-[80vh]"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <button onClick={() => setEditModalClose(false)} className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 z-10">
            <MdClose size={24} />
          </button>
          <h2 className="text-3xl font-bold mb-4 text-center">Edit Service</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {
              ({ touched, errors }) => (
                <Form>
                  <div className='flex gap-3'>

                    <div className='w-[90%] md:w-[80%]'>
                      <FormTextInput label="Service Name" name="serviceName" touched={touched.serviceName} error={errors.serviceName} />
                      <FormTextInput label="Service Description" name="serviceDescription" touched={touched.serviceDescription} error={errors.serviceDescription} inputClasses={'h-[8rem]'} />
                      <Field as="select" name="category" className="bg-white border border-gray-300 p-2 rounded focus-visible:bottom-3 focus-visible:border-gray-600 focus-visible:outline-none w-full mt-4">
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id} className="bg-white ">
                            {category.categoryName}
                          </option>
                        ))}
                      </Field>
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                        >
                          {errors.category && touched.category && <p className="text-red-600 text-sm">{errors.category}</p>}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                        
                    <div className='w-[90%] md:w-[80%] flex flex-col items-center border border-gray-300 p-4 rounded-2xl'>
                      <img src={image ? URL.createObjectURL(image) : service.image} alt="" className='rounded aspect-[3/1] w-full' />
                      <input type="file" className='hidden' onChange={handleImageChange} ref={inputRef} />
                      <button type="button" onClick={() => inputRef.current.click()} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 mt-4">Select Image</button>
                    </div>
                  </div>
                  {showCrop &&
                    <div>
                      <Cropper
                        aspectRatio={12 / 4}
                        onClose={onClose}
                        image={inputRef.current.files[0]}
                        setImage={setImage}
                      />
                    </div>
                  }
                  <h3 className='text-2xl font-bold text-center my-8 '>Additional Details Needed From Client</h3>
                  <div className='flex gap-3 my-4 items-end justify-center'>
                    <div className='flex flex-col gap-2 w-1/3'>
                      <label htmlFor="" className="">Field Name</label>
                      <input name='fieldName' value={newField.fieldName} onChange={handleNewFieldChange} type="text" placeholder='Enter your field name' className='border border-gray-300 p-2 rounded focus-visible:bottom-3 focus-visible:border-gray-600 focus-visible:outline-none' />
                    </div>
                    <div className='flex flex-col gap-2 w-1/3'>
                      <label htmlFor="" className=''>Field Type</label>
                      <select name='fieldType' value={newField.fieldType} onChange={handleNewFieldChange}  id="" className='border border-gray-300 p-1 rounded focus-visible:border-gray-600 focus-visible:outline-none'>
                        <option  value="string">Text</option>
                        <option value="number">Number</option>
                      </select>
                    </div>
                    <button type='button' onClick={isEditing ? updateField : addNewField} className="bg-black text-white px-6 py-1 rounded hover:bg-gray-800">{isEditing ? 'Update' : 'Add'}</button>
                  </div>
                  <div className='w-[90%] md:w-[80%] mx-auto'>
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg mt-4">
                      <thead>
                        <tr className="bg-gray-100 text-left">
                          <th className="py-2 px-4 border-b border-r w-[60%]">Field Name</th>
                          <th className="py-2 px-4 border-b border-r w-[20%]">Field Type</th>
                          <th className="py-2 px-4 border-b w-[10%]">Edit</th>
                          <th className="py-2 px-4 border-b w-[10%]">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {additionlDetails.map((detail, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b border-r w-[60%]">{detail.fieldName}</td>
                            <td className="py-2 px-4 border-b border-r w-[20%]">{detail.fieldType}</td>
                            <td className="py-2 px-4 border-b border-r w-[10%]">
                              <button type='button' className="text-gray-500 hover:text-gray-700 " onClick={() => handleEditClick(detail)}><MdEdit size={20} /></button>
                            </td>
                            <td className="py-2 px-4 border-b">
                              <button type='button' className="text-red-500 hover:text-red-700 " onClick={() => deleteField(index)}><MdDelete size={20} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className='flex justify-center mt-3'><button type='submit' className="bg-black text-white px-6 py-1 rounded hover:bg-gray-800">Create</button></div>
                </Form>
              )
            }
          </Formik>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default EditService
