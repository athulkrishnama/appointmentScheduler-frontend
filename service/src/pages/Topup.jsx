import React,{useEffect, useState} from 'react'
import Header from '../components/signup/Header'
import { useParams } from 'react-router'
import axios from '../axios/axios'
import { toast } from 'react-toastify'
import Error from '../components/TopupToken/Error'
import TopupWallet from '../components/TopupToken/TopupWallet'

function Topup() {
  const { token } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [error, setError] = useState(false);

  const getData = async ()=>{
    try{
        setIsLoading(true);
        const response = await axios.get(`/serviceProvider/topupWallet/${token}`)
        setData(response.data)
        setIsLoading(false);
    }catch(error){
        setIsLoading(false);    
        setError(error.response.data);
        // toast.error(error.response.data.message)
    }
  }
  useEffect(()=>{
    getData()
  },[])

  return (
    <div>
      <Header />
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <Error error={error} />
      ) : (
        <TopupWallet wallet={data.wallet} serviceProvider={data.serviceProvider} token={token} />
      )}
    </div>
  )
  
}

export default Topup
