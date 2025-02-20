import React,{useEffect, useState} from 'react'
import Dashboard from '../components/dashboard/Dashboard'
import axios from '../axios/axios'
function Home() {
  const [data, setData] = useState([])

  const getData = async ()=>{
    try{
      const response = await axios.get('/serviceProvider/dashboard')
      console.log(response.data)
      setData(response.data)
    }catch(error){
      console.log(error)
    }
  }
  useEffect(()=>{
    getData()
  },[])
  return (
    <>
      <Dashboard charData={data} />
    </>
  )
}

export default Home
