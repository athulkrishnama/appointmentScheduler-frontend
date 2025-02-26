import React, { useEffect, useState } from "react";
import axios from "../../axios/axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import IgnoreModal from "./IgnoreModal";
import TakeActionModal from "./TakeActionModal";

function Report() {
  const [reports, setReports] = useState([]);
  const [isIgnoreModalOpen, setIgnoreModalOpen] = useState(false);
  const [isTakeActionModalOpen, setTakeActionModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReports = async () => {
    try {
      const response = await axios.get("/admin/reports");
      setReports(response.data.reports);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  const handleIgnoreModalOpen = (report) => {
    setSelectedReport(report);
    setIgnoreModalOpen(true);
  };

  const handleIgnore = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/admin/takeaction", {
        report: selectedReport._id,
        action: "ignore",
      });
      fetchReports()
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message ?? "Error while Ignoring");
      console.log(error);
    } finally {
      setIsLoading(false);
      setIgnoreModalOpen(false);
    }
  };

  const handleAction = async (action) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/admin/takeaction", {
        report: selectedReport._id,
        action,
      });
      fetchReports();
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message ?? "Error while taking action");
    } finally {
      setIsLoading(false);
      setTakeActionModalOpen(false);
    }
  };
  const handleTakeActionModalOpen = (report) => {
    setSelectedReport(report);
    setTakeActionModalOpen(true);
  };

  const tableVariant = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const rowVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  useEffect(() => {
    fetchReports();
  }, []);
  return (
    <div className=" w-full ">
      <div className="m-20 shadow-[0_35px_60px_15px_rgba(0,0,0,0.3)] rounded-2xl p-10 min-h-[80vh]">
        <h1 className="text-center text-3xl font-bold">Reports</h1>
        {reports.length ? (
          <table className="w-full   my-5 shadow-2xl rounded-2xl overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-xl text-left px-4 py-2">Client</th>
                <th className="text-xl text-left px-4 py-2">
                  Service Provider
                </th>
                <th className="text-xl text-left px-4 py-2">Service</th>
                <th className="text-xl text-left px-4 py-2">Reason</th>
                <th className="text-xl text-left px-4 py-2" colSpan={2}>
                  Actions
                </th>
              </tr>
            </thead>
            <motion.tbody
              className="divide-y"
              variants={tableVariant}
              initial="hidden"
              animate="show"
            >
              {reports.map((report) => (
                <motion.tr
                  className="hover:bg-gray-50 duration-100"
                  variants={rowVariant}
                >
                  <td className="px-4 py-6 text-left text-lg">
                    {report.client.fullname}
                  </td>
                  <td className="px-4 py-6 text-left text-lg">
                    {report.serviceProvider.fullname}
                  </td>
                  <td className="px-4 py-6 text-left text-lg">
                    {report.appointment.service.serviceName}
                  </td>
                  <td className="px-4 py-6 text-left text-lg">
                    {report.reason}
                  </td>
                  <td className="px-4 py-6 text-left text-lg">
                    <button
                      onClick={() => handleIgnoreModalOpen(report)}
                      className="bg-gray-600 px-4 py-1 rounded-md text-gray-50 hover:bg-gray-500 transition-colors duration-300"
                    >
                      Ignore
                    </button>
                  </td>
                  <td className="px-4 py-6 text-left text-lg">
                    <button
                      onClick={() => handleTakeActionModalOpen(report)}
                      className="bg-red-600 text-red-50 px-4 py-1 rounded-md hover:bg-red-500"
                    >
                      Take Action
                    </button>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        ) : (
          <h5>No reports to show</h5>
        )}
      </div>

      <IgnoreModal
        isOpen={isIgnoreModalOpen}
        handleIgnore={handleIgnore}
        handleClose={() => setIgnoreModalOpen(false)}
        isLoading={isLoading}
      />
      <TakeActionModal
        isOpen={isTakeActionModalOpen}
        handleAction={handleAction}
        handleClose={() => setTakeActionModalOpen(false)}
        isLoading={isLoading}
      />
    </div>
  );
}

export default Report;
