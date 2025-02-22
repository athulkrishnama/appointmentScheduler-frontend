import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router";
import { TbReportAnalytics } from "react-icons/tb";
import axios from "../../axios/axios";

Chart.register(...registerables);

function Dashboard({}) {
  const [period, setPeriod] = useState('weekly');
  const [charData, setCharData] = useState([])

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

  const getData = async ()=>{
    try{
      const response = await axios.get(`/serviceProvider/dashboard?period=${period}`)
      console.log(response.data)
      setCharData(response.data.data)
    }catch(error){
      console.log(error)
    }
  }
  useEffect(()=>{
    getData()
  },[period])

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-10 mx-auto p-4 w-[90vw] md:w-[60vw] h-[80vh] rounded-2xl shadow-2xl"
    >
      <h1 className="text-4xl my-5 font-black text-center text-gray-800">Dashboard</h1>
      <div className="flex justify-between">
        <div>
          <select onChange={(e) => setPeriod(e.target.value)} name="" id="" className="my-5 p-2 text-xl flex items-center gap-2 rounded-lg  font-bold">
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <Link to="/salesReport" className="my-5 p-2 text-xl flex items-center gap-2 rounded-lg bg-gray-800 text-white font-bold"><TbReportAnalytics />Sales Report</Link>
      </div>
      <motion.div>
        <Bar data={data} options={options} />
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;
