import React,{useEffect, useState} from 'react'
import {Line} from 'react-chartjs-2'
import axios from '../../axios/axios'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    plugins,
    CategoryScale,
    LinearScale
} from 'chart.js'

ChartJS.register(Title,Tooltip, Legend, LineElement,PointElement,plugins,CategoryScale,LinearScale)

function AppointmentChart({period}) {
    const [appointmentData , setAppointmentData] = useState([])
    const data = {
        "labels": Object.keys(appointmentData),
        datasets:[
            {
                label:"Appointments",
                data:Object.values(appointmentData)
            },

        ]
    }

    const option = {
        responsive:true,
        plugins:{
            legend:{position:"top"},
            title:{display:"true", text:"Appointments"}
        }
    }

    const fetchData = async()=>{
        const response = await axios.get(`/admin/appointments?period=${period}`)
        setAppointmentData(response.data.appointments)
    }

    useEffect(()=>{
        fetchData()
    },[period]) 
  return (
    <div className='w-full'>
      <Line data={data} options={option}/>
    </div>
  )
}

export default AppointmentChart
