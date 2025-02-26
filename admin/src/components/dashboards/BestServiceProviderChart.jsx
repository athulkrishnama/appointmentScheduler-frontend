import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, plugins } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend, plugins);
import axios from "../../axios/axios";

function BestServiceProviderChart() {
  const [serviceProviderData, setServiceProviderData] = useState({});

  const data = {
    labels: Object.keys(serviceProviderData),
    datasets: [
      {
        label: "Service Providers",
        data: Object.values(serviceProviderData),
        backgroundColor:[
            "rgba(123, 45, 200, 0.75)",
            "rgba(250, 130, 20, 0.92)",
            "rgba(80, 170, 220, 0.67)",
            "rgba(30, 90, 180, 0.85)",
            "rgba(240, 60, 150, 0.78)",
            "rgba(60, 200, 80, 0.94)",
            "rgba(190, 40, 220, 0.66)",
            "rgba(10, 150, 90, 0.73)",
            "rgba(140, 30, 250, 0.81)",
            "rgba(210, 180, 50, 0.88)"
          ]
      },
    ],
  };

  const options = {
          responsive:true,
          plugins:{
              legend:{position:"top"},
              title:{display:"true", text:"Appointments"}
          }
      }
  const fetchData = async () => {
    const response = await axios.get("/admin/getBestServiceProviders");
    setServiceProviderData(response.data.serviceProviders);
  };
  useEffect(() => {
    fetchData()
  }, []);
  return (
    <div className="w-1/2 mx-auto">
      <h1 className="text-3xl font-bold text-center my-8">
        Best Perform Services
      </h1>
      <Doughnut data={data} options={options} />
    </div>
  );
}

export default BestServiceProviderChart;
