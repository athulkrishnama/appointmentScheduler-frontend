import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-tailwindcss-datepicker";
import serviceFrequency from "../../constants/serviceFrequency";
import { toast } from "react-toastify";
import axios from "../../axios/axios";
import AddAddress from "../address/AddAddress";
import EditAddress from '../address/EditAddress'
import { motion } from "framer-motion";
import { CiEdit } from "react-icons/ci";

function QuotationForm({ service }) {
  const [additionalDetails, setAdditionalDetails] = useState([]);
  const [error, setError] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);

  const navigate = useNavigate();
  const fetchAddresses = async () => {
    const response = await axios.get("/client/getAddresses");
    setAddresses(response.data.addresses);
    setSelectedAddress(response.data.addresses.length?response.data.addresses[0]._id:null);
  };

  useEffect(() => {
    if (service) {
      setAdditionalDetails(service.additionalDetails || []);
    }
  }, [service]);

  // fetching addresses
  useEffect(() => {
    fetchAddresses();
  }, []);

  const endDateCheck = (value) => {
    if (value < formik.values.date && formik.values.serviceFrequency !== serviceFrequency.once) {
      return false;
    }
    return true;
  };

  const formateDate = (date)=>{
    const newDate = [];
    newDate.push(date.getMonth()+1);
    newDate.push(date.getDate());
    newDate.push(date.getFullYear());
    return newDate.join("/");
    
  }

  const validationSchema = Yup.object({
    date: Yup.date().required("Date is required"),
    time: Yup.string().required("Time is required"),
    endDate: Yup.date()
      .required("End Date is required")
      .test(
        "endDateCheck",
        "End Date should be greater than Start Date",
        endDateCheck
      ),
    additionalNotes: Yup.string()
      .required("Additional notes are required")
      .min(20, "Additional notes should be at least 20 characters long")
      .max(200, "Additional notes should be at most 200 characters long"),
  });

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleAdditionalDetailsChange = (e, index) => {
    setAdditionalDetails((prev) => [
      ...prev.slice(0, index),
      { ...prev[index], value: e.target.value },
      ...prev.slice(index + 1),
    ]);
  };

  const handleSubmit = async (values) => {
    try {
      const allDetailsAdded = additionalDetails.every((detail) => detail.value);
      if (!allDetailsAdded) return setError("All fields here are required");
      if (!selectedAddress) return setError("Address is required");
      else setError("");

      const details = additionalDetails.map((detail) => {
        return {
          fieldName: detail.fieldName,
          fieldType: detail.fieldType,
          value: detail.value,
        };
      });

      

      const data = {
        date: formateDate(values.date),
        time: values.time,
        serviceFrequency: values.serviceFrequency,
        endDate: values.endDate.toLocaleDateString(),
        additionalNotes: values.additionalNotes,
        additionalDetails: details,
        address: selectedAddress,
        service: service._id,
      };
      const response = await axios.post("/client/serviceRequest", data);
      toast.success(response.data.message, {autoClose:1000,onClose:()=>navigate('/serviceRequests')});
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };
  const formik = useFormik({
    initialValues: {
      date: new Date(Date.now()),
      time: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleTimeString(
        "en-US",
        { hour: "2-digit", minute: "2-digit", hour12: false }
      ),
      serviceFrequency: serviceFrequency.once,
      endDate: new Date(Date.now()),
      additionalNotes: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  // handling address close
  const onAddAddressClose = () => {
    setIsAddressModalOpen(false);
  };

  const handleAddAddressSubmit = async (data) => {
    try {
      const response = await axios.post("/client/addAddress", data);
      setAddresses([...addresses, response.data.address]);
      toast.success(response.data.message);
      setIsAddressModalOpen(false);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  const onEditAddressClose = () => {
    setIsEditAddressModalOpen(false);
  };

  const handleEditAddressSubmit = async (data) => {
    try {

      const noChange = (data.name === addressToEdit.fullName && data.area === addressToEdit.area && data.district === addressToEdit.district && data.state === addressToEdit.state && data.pincode === addressToEdit.pincode)
      if(noChange) return toast.error("No change in address")
      const response = await axios.put("/client/editAddress", {...data, _id:addressToEdit._id});
      toast.success(response.data.message);
      setAddresses(addresses.map(address => address._id === addressToEdit._id ? response.data.address : address))
      setIsEditAddressModalOpen(false);
      setAddressToEdit(null);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  return (
    <div>
      <form action="" onSubmit={formik.handleSubmit}>
        <div className="flex  flex-wrap">
          <div className="w-full md:w-1/2  px-4 my-2">
            <label htmlFor="date" className="inline-block pb-2 text-gray-700">
              Select Date
            </label>
            <DatePicker
              asSingle={true}
              useRange={false}
              placeholder={formatDate(formik.values.date)}
              selected={formik.values.date}
              primaryColor="blue"
              onChange={(date) => formik.setFieldValue("date", date.startDate)}
              value={formik.values.date}
              minDate={new Date(Date.now())}
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col px-4 my-2">
            <label htmlFor="time" className="inline-block pb-2 text-gray-700">
              Select Time
            </label>
            <input
              type="time"
              name="time"
              id="time"
              className="border border-gray-400 rounded-md px-2 py-1"
              value={formik.values.time}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className="w-full md:w-1/2  flex-col px-4 my-2 hidden">
            <label htmlFor="time" className="inline-block pb-2 text-gray-700">
              Select Service Frequency
            </label>
            <select
              name="serviceFrequency"
              id="serviceFrequency"
              className="border border-gray-400 rounded-md px-2 py-1 bg-white"
              value={formik.values.serviceFrequency}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {Object.entries(serviceFrequency).map(([key, value]) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-1/2  px-4 my-2 hidden">
            <label htmlFor="date" className="inline-block pb-2 text-gray-700">
              Select Recurrance End Date
            </label>
            <DatePicker
              asSingle={true}
              useRange={false}
              placeholder={formatDate(formik.values.endDate)}
              selected={formik.values.endDate}
              primaryColor="blue"
              onChange={(date) =>
                formik.setFieldValue("endDate", date.startDate)
              }
              value={formik.values.endDate}
              minDate={new Date(Date.now())}
              disabled={
                formik.values.serviceFrequency === serviceFrequency.once
              }
            />
            {formik.errors.endDate && formik.touched.endDate && (
              <div className="text-red-500">{formik.errors.endDate}</div>
            )}
          </div>
          <div className="w-full md:w-full  px-4 my-2 flex flex-col">
            <label htmlFor="date" className="inline-block pb-2 text-gray-700">
              Additional Notes
            </label>

            <textarea
              rows={5}
              name="additionalNotes"
              className="focus:outline-none rounded-lg p-3 sh"
              value={formik.values.additionalNotes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            ></textarea>
            {formik.errors.additionalNotes && formik.touched.additionalNotes && (
              <div className="text-red-500">
                {formik.errors.additionalNotes}
              </div>
            )}
          </div>
        </div>

        <h3 className="px-4 my-2 text-lg">Select Address</h3>
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-black text-white hover:bg-gray-700 py-2 px-4 rounded"
            onClick={() => setIsAddressModalOpen(true)}
          >
            Add Address
          </button>
        </div>
        <div className="flex flex-wrap mt-4 gap-y-4">
          {addresses.map((address, index) => {
            return (
              <div
                className={`   w-full md:w-1/2  `}
                key={address._id}
                onClick={() => setSelectedAddress(address._id)}
              >
                <motion.div
                  className={`bg-white  mx-2 p-4 rounded-3xl ${
                    selectedAddress === address._id && "border border-black"
                  }`}
                  initial={{ x: 100 * (index % 2 ? 1 : -1) }}
                  animate={{ x: 0 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    type="button"
                    className="bg-black text-white hover:bg-gray-700  px-2 py-1 rounded flex gap-2 items-center mb-3"
                    onClick={()=>{
                      setIsEditAddressModalOpen(true)
                      setAddressToEdit(address)
                    }}
                  >
                    <CiEdit />
                    <span className="font-semibold">Edit</span>
                  </button>
                  <table className={` table-auto w-full    `}>
                    <tbody>
                      <tr>
                        <td className="pr-4 font-semibold">Name</td>
                        <td>{address.fullName}</td>
                      </tr>
                      <tr>
                        <td className="pr-4 font-semibold">Area</td>
                        <td>{address.area}</td>
                      </tr>
                      <tr>
                        <td className="pr-4 font-semibold">District</td>
                        <td>{address.district}</td>
                      </tr>
                      <tr>
                        <td className="pr-4 font-semibold">State</td>
                        <td>{address.state}</td>
                      </tr>
                      <tr>
                        <td className="pr-4 font-semibold">Pincode</td>
                        <td>{address.pincode}</td>
                      </tr>
                    </tbody>
                  </table>
                </motion.div>
              </div>
            );
          })}
        </div>
        <h4 className="text-2xl font-bold text-center my-10">
          Questions from Service Provider
        </h4>
        <div className="flex flex-wrap">
          {additionalDetails?.map((field, index) => {
            return (
              <div
                className="flex flex-col gap-2 w-full md:w-1/2 px-4"
                key={field._id}
              >
                <label htmlFor="">{field.fieldName}</label>
                <input
                  type={field.fieldType === "number" ? "number" : "text"}
                  className="focus:outline-none rounded-lg p-3 shadow-md"
                  name={field.fieldName}
                  value={additionalDetails[index].value}
                  onChange={(e) => handleAdditionalDetailsChange(e, index)}
                />
              </div>
            );
          })}
          <p className="text-red-500 text-center my-3 w-full">{error}</p>
        </div>
        <div className="flex justify-center pt-3">
          <button
            type="submit"
            className="bg-black text-white hover:bg-gray-700 py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
      {isAddressModalOpen && (
        <AddAddress
          onClose={onAddAddressClose}
          handleSubmit={handleAddAddressSubmit}
        />
      )}
      {
        isEditAddressModalOpen &&(
          <EditAddress
            address={addressToEdit}
            onClose={onEditAddressClose}
            handleSubmit={handleEditAddressSubmit}
          />
        )
      }
    </div>
  );
}

export default QuotationForm;
