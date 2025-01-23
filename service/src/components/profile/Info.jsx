import React, { useRef, useState } from "react";
import axios from "../../axios/axios";
import { motion } from "framer-motion";
import Cropper from "../cropper/crop";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
function Info({ user, setUser }) {
  const inputRef = useRef(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const validFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validFileTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPEG, PNG, or JPG file.");
      return;
    } else if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
    }
    setIsCropperOpen(true);
  };

  const handleChangeImage = async (file) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("logo", file);
      const response = await axios.patch(
        "/serviceProvider/updateLogo",
        formData
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setUser(response.data.user);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <motion.div
      key="info"
      initial={{ opacity: 0, x: -1000 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0, x: -1000 }}
      className="absolute bg-white w-full h-full mx-2 my-2 rounded-2xl p-5 flex flex-col md:flex-row"
    >
      <div className="w-full md:w-1/2 flex flex-col px-24">
        <img src={user?.serviceDetails?.logo} alt="" className="rounded-2xl" />
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleImageChange}
        />
        {!isLoading ? (
          <button
            className="bg-black text-white px-3 py-2 rounded-lg mt-2 font-bold hover:bg-gray-800"
            onClick={() => inputRef.current.click()}
          >
            Change Logo
          </button>
        ) : (
          <div className="flex justify-center">
              <ReactLoading type="bars" color="#000" />
          </div>
        )}

        {isCropperOpen && (
          <Cropper
            aspectRatio={1}
            onClose={() => setIsCropperOpen(false)}
            setImage={handleChangeImage}
            image={inputRef.current.files[0]}
          />
        )}
      </div>
      <div className="px-4 py-2 w-1/2">
        <table className="border-spacing-y-4 border-separate text-left">
          <tbody>
            <tr className="">
              <th className="w-1/2">Name:</th>
              <td className="w-1/2">{user?.fullname}</td>
            </tr>
            <tr className="">
              <th className="w-1/2">Email:</th>
              <td className="w-1/2">{user?.email}</td>
            </tr>
            <tr className="">
              <th className="w-1/2 align-top">Description:</th>
              <td className="w-1/2 text-justify">
                {user?.serviceDetails?.description}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex gap-3">
          <button className="bg-gray-800 text-white px-3 py-2 rounded-lg mt-2 font-bold hover:bg-gray-700">
            Update Profile
          </button>
          <button className="bg-gray-800 text-white px-3 py-2 rounded-lg mt-2 font-bold hover:bg-gray-700">
            Change Password
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Info;
