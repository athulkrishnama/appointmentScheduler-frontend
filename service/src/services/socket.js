import BASE_URL from "../constants/baseurl";
import {io} from 'socket.io-client'

const SOCKET_URL = BASE_URL;

const socket = io(SOCKET_URL,{
    autoConnect:false
});

export default socket;