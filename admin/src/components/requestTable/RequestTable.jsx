import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../../axios/axios";
import { toast } from "react-toastify";
import { removeRequest } from "../../store/requestSlice/requestSlice";
import { useDispatch } from "react-redux";
import DocumentModal from "./DocumentModal";
import AcceptModal from "./AcceptModal";
import RejectModal from "./RejectModal";

const RequestTable = ({ requests }) => {
  const [confirmation, setConfirmation] = useState({
    show: false,
    requestId: null,
  });

  const [rejectModal, setRejectModal] = useState({
    show: false,
    requestId: null,
  });

  const [document, setDocument] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const handleAccept = (requestId) => {
    setConfirmation({ show: true, requestId });
  };

  const confirmAccept = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch("/admin/updateRequestStatus", {
        id: confirmation.requestId,
        status: "accepted",
      });
      if (response.data.success) {
        dispatch(removeRequest(confirmation.requestId));
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      setConfirmation({ show: false, requestId: null });
    } catch (error) {
      setConfirmation({ show: false, requestId: null });
      console.error("There was an error updating the status:", error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }finally{
      setIsLoading(false);
    }
  };

  const handleRejectModal = (requestId) => {
    setRejectModal({ show: true, requestId });
  };

  const handleRejectModalClose = () => {
    setRejectModal({ show: false, requestId: null });
  };

  const handleReject = async (reason) =>{
    try {
      setIsLoading(true);
      const response = await axios.patch("/admin/updateRequestStatus", {
        id: rejectModal.requestId,
        status: "rejected",
        reason
      })
      if (response.data.success) {
        dispatch(removeRequest(rejectModal.requestId));
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      setRejectModal({ show: false, requestId: null });
    } catch (error) {
      setRejectModal({ show: false, requestId: null });
      console.error("There was an error updating the status:", error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }finally{
      setIsLoading(false);
    }
  }

  const cancelConfirmation = () => {
    setConfirmation({ show: false, requestId: null });
  };

  if (!requests || requests.items.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">No pending requests</div>
    );
  }

  const closeDocumentModal = () => {
    setDocument(null);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-[90vw] md:w-[60vw] mx-auto overflow-x-auto rounded-lg shadow-lg mt-12 mb-3"
    >
      <table className="w-full bg-white rounded-lg">
        <thead className="bg-gray-200 text-black">
          <tr>
            <th className="py-3 px-6 text-left">Company Logo</th>
            <th className="py-3 px-6 text-left">Company Name</th>
            <th className="py-3 px-6 text-left">Description</th>
            <th className="py-3 px-6 text-left">Request Date</th>
            <th className="py-3 px-6 text-left">View Document</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.items.map((request, index) => (
            <tr
              key={request._id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-4 px-6 text-black">
                <img
                  src={request.serviceDetails.logo}
                  alt="Company Logo"
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </td>
              <td className="py-4 px-6 text-black">{request.fullname}</td>
              <td className="py-4 px-6 text-black">
                {request.serviceDetails.description}
              </td>
              <td className="py-4 px-6 text-black">
                {new Date(request.createdAt).toLocaleDateString()}
              </td>
              <td className="py-4 px-6 text-black">
                <button
                  className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setDocument(request.serviceDetails.document)}
                >
                  View
                </button>
              </td>
              <td className="py-4 px-6  h-full">
                <div className="flex ">
                  <button
                    onClick={() => handleAccept(request._id)}
                    className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectModal(request._id)}
                    className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmation.show && (
        <AcceptModal
          confirmAccept={confirmAccept}
          cancelConfirmation={cancelConfirmation}
          isLoading={isLoading}
        />
      )}
      {
        rejectModal.show && (
          <RejectModal onClose={handleRejectModalClose} handleReject={handleReject} isLoading={isLoading}/>
        )
      }

      {document && (
            <DocumentModal src={document} onClose={closeDocumentModal} />
      )}
    </motion.div>
  );
};

export default RequestTable;
