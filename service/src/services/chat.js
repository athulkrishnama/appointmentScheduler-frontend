import BASE_URL from "../constants/baseurl";
import {io} from 'socket.io-client'
import store from '../store/store'

const SOCKET_URL = `${BASE_URL}/chat`;

const socket = io(SOCKET_URL,{
    autoConnect:false,
    auth:{
        token:store.getState().user.accessToken
    }
});

export default socket;