import BASE_URL from '../constants/baseurl'
import {io} from 'socket.io-client'
import store from '../store/store'

const SOCKET_URL = `${BASE_URL}/notifications`;

const createSocket = ()=>{
    const socket = io(SOCKET_URL,{
        autoConnect:false,
        auth:{
            token:store.getState().user.accessToken
        }
    });
    return socket;
}


export default createSocket;