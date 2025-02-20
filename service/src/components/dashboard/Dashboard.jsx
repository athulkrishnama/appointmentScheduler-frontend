import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router";
import { TbReportAnalytics } from "react-icons/tb";

Chart.register(...registerables);

function Dashboard({charData}) {
//   const chartRef = useRef<Chart | null>(null);

  const data = {
    labels: Object.keys(charData),
    datasets: [
      {
        label: "Appointments",
        data: Object.values(charData),
        borderRadius: 10,
        hoverBackgroundColor: "rgba(0,0,0,0.9)",
        backgroundColor: "rgb(0,0,0,)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    
  };

//   useEffect(() => {
//     return () => {
//       if (chartRef.current) {
//         chartRef.current.destroy();
//       }
//     };
//   }, []);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-10 mx-auto p-4 w-[90vw] md:w-[60vw] h-[80vh] rounded-2xl shadow-2xl"
    >
      <h1 className="text-4xl my-5 font-black text-center text-gray-800">Dashboard</h1>
      <div className="flex justify-end">
        <Link to="/salesReport" className="my-5 p-2 text-xl flex items-center gap-2 rounded-lg bg-gray-800 text-white font-bold"><TbReportAnalytics />Sales Report</Link>
      </div>
      <motion.div>
        <Bar data={data} options={options} />
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;
