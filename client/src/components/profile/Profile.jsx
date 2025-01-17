import React, { useState, useEffect } from "react";
import axios from "../../axios/axios";
import { useDispatch } from "react-redux";
import {
  setName,
  setEmail,
  setPhoneNumber,
} from "../../store/userSlice/userSlice";
import ListAddress from "../address/ListAddress";
import AddAddress from "../address/AddAddress";
import { toast } from "react-toastify";
import { MdModeEditOutline } from "react-icons/md";
import UpdateProfile from "./UpdateProfile";
function Profile() {
  const [user, setUser] = useState({});
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] =
    useState(false);

  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      const res = await axios.get("/client");
      const addresses = await axios.get("/client/getAddresses");
      setAddresses(addresses.data.addresses);
      setUser(res.data.user);
      dispatch(setName(res.data.user.fullname));
      dispatch(setEmail(res.data.user.email));
      dispatch(setPhoneNumber(res.data.user.phone));
    } catch (error) {
      console.log(error);
    }
  };

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

  const onUpdateProfileClose = () => {
    setIsUpdateProfileModalOpen(false);
  };

  const handleUpdateProfile = async (data) => {
    try {
      if (data.fullname === user.fullname && data.phone === user.phone) {
        return toast.error("No changes applied");
      }
      const response = await axios.put("/client/updateProfile", data);
      toast.success(response.data.message);
      setIsUpdateProfileModalOpen(false);
      setUser(prev => ({...prev, ...data}))
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white p-8 rounded-3xl shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-center">User Profile</h2>
        <div className="flex w-[90vw] md:w-[40vw] max-h-[50vh] overflow-y-auto items-center flex-col md:flex-row">
          <div className="flex flex-col w-full items-start">
            <table className=" ">
              <tbody>
                <tr>
                  <td className="text-leftpx-4 py-2  font-semibold">Name:</td>
                  <td className="px-4 py-2">{user.fullname}</td>
                </tr>
                <tr>
                  <td className="text-leftpx-4 py-2  font-semibold">Email:</td>
                  <td className="px-4 py-2">{user.email}</td>
                </tr>
                <tr>
                  <td className="text-leftpx-4 py-2  font-semibold">
                    Phone Number:
                  </td>
                  <td className="px-4 py-2">
                    {user.phone || "no phone number"}
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={() => setIsUpdateProfileModalOpen(true)}
              className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded mt-4 flex items-center gap-2"
            >
              <MdModeEditOutline />
              Update Profile
            </button>
          </div>
          <div className="flex flex-col  items-end w-full">
            <button
              className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => setIsAddressModalOpen(true)}
            >
              Add Address
            </button>

            <ListAddress addresses={addresses} setAddresses={setAddresses} />
          </div>
        </div>
      </div>
      {isAddressModalOpen && (
        <AddAddress
          onClose={onAddAddressClose}
          handleSubmit={handleAddAddressSubmit}
        />
      )}
      {isUpdateProfileModalOpen && (
        <UpdateProfile
          onClose={onUpdateProfileClose}
          handleSubmit={handleUpdateProfile}
          data={{ fullname: user.fullname, phone: user.phone }}
        />
      )}
    </div>
  );
}

export default Profile;
