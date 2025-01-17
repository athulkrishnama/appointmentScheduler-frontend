import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import axios from "../../axios/axios";
import { toast } from "react-toastify";
import EditAddress from "./EditAddress";
import { AiOutlineDelete } from "react-icons/ai";
import { motion } from "framer-motion";
import {RiDeleteBinLine,RiCloseLine} from 'react-icons/ri'
function ListAddress({ addresses, setAddresses }) {
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedAddressToDelete, setSelectedAddressToDelete] = useState(null);

  const onEditAddressClose = () => {
    setIsEditAddressModalOpen(false);
  };

  const handleEditAddressSubmit = async (data) => {
    try {
      const noChange =
        data.name === addressToEdit.fullName &&
        data.area === addressToEdit.area &&
        data.district === addressToEdit.district &&
        data.state === addressToEdit.state &&
        data.pincode === addressToEdit.pincode;
      if (noChange) return toast.error("No change in address");
      const response = await axios.put("/client/editAddress", {
        ...data,
        _id: addressToEdit._id,
      });
      toast.success(response.data.message);
      setAddresses(
        addresses.map((address) =>
          address._id === addressToEdit._id ? response.data.address : address
        )
      );
      setIsEditAddressModalOpen(false);
      setAddressToEdit(null);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  const deleteAddress = async () => {
    try {
      const response = await axios.delete(`/client/deleteAddress/${selectedAddressToDelete}`);
      toast.success(response.data.message);
      setAddresses(addresses.filter((address) => address._id !== selectedAddressToDelete));
      setSelectedAddressToDelete(null)
      setIsConfirmationModalOpen(false)
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  const deleteAddressModalOpen = () => {
    setIsConfirmationModalOpen(true);

  };
  return (
    <div className="w-full flex flex-wrap overflow-y-scroll max-h-[30vh] address mt-2">
      {addresses.map((address) => (
        <div
          className="bg-blue-50 px-8 py-8 rounded-3xl  w-full  mx-4 my-4"
          key={address._id}
        >
          <div className="flex justify-between items-center mb-3 ">
            <button
              type="button"
              className="bg-black text-white hover:bg-gray-700  px-2 py-1 rounded flex gap-2 items-center "
              onClick={() => {
                setIsEditAddressModalOpen(true);
                setAddressToEdit(address);
              }}
            >
              <CiEdit />
              <span className="font-semibold">Edit</span>
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={()=>{
                deleteAddressModalOpen(address._id)
                setSelectedAddressToDelete(address._id)
              }}
            >
              <AiOutlineDelete
                color="red"
                className="text-2xl "
                style={{ strokeWidth: 0.5 }}
              />
            </motion.button>
          </div>
          <table className="table-auto w-full">
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
        </div>
      ))}
      {isEditAddressModalOpen && (
        <EditAddress
          onClose={onEditAddressClose}
          handleSubmit={handleEditAddressSubmit}
          address={addressToEdit}
        />
      )}
      {
        isConfirmationModalOpen &&
        <motion.div
          className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-4 shadow-2xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <h1 className="text-2xl font-bold">Delete Address</h1>
            <p className="text-lg">Are you sure you want to delete this address?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={()=>deleteAddress()}
              >
                <RiDeleteBinLine className="inline-block" />
                Confirm
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={()=>setIsConfirmationModalOpen(false)}
              >
                <RiCloseLine className="inline-block" />
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      }
    </div>
  );
}

export default ListAddress;
