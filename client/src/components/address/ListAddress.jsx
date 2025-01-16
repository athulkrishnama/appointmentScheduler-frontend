import React, {useState} from "react";
import { CiEdit } from "react-icons/ci";
import axios from '../../axios/axios'
import {toast} from 'react-toastify'
import EditAddress from "./EditAddress";

function ListAddress({ addresses, setAddresses }) {
    const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
    const [addressToEdit, setAddressToEdit] = useState(null);


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
    <div className="w-full flex flex-wrap overflow-y-scroll max-h-[30vh] address mt-2">
      {addresses.map((address) => (
        <div
          className="bg-blue-50 px-8 py-8 rounded-3xl  w-full  mx-4 my-4"
          key={address._id}
        >
          <button
            type="button"
            className="bg-black text-white hover:bg-gray-700  px-2 py-1 rounded flex gap-2 items-center mb-3"
            onClick={() => {
              setIsEditAddressModalOpen(true);
              setAddressToEdit(address);
            }}
          >
            <CiEdit />
            <span className="font-semibold">Edit</span>
          </button>
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
      {
        isEditAddressModalOpen && (
          <EditAddress
            onClose={onEditAddressClose}
            handleSubmit={handleEditAddressSubmit}
            address={addressToEdit}
          />
        )
      }
    </div>
  );
}

export default ListAddress;
