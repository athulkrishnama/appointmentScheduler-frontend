import {io} from 'socket.io-client'
import BASE_URL from '../constants/baseurl'

const SOCKET_URL = `${BASE_URL}/chat`;

const socket = io(SOCKET_URL,{
    autoConnect:false
});

export default socket;