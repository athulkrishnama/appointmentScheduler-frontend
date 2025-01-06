import axios from "axios";
import BASE_URL from "../constants/baseurl";
import  store  from '../store/store';
import { setAccessToken } from '../store/userSlice/userSlice';
import { useNavigate } from 'react-router';
import { toast } from "react-toastify";

const instance = axios.create({ baseURL: BASE_URL, withCredentials: true });

instance.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().user.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if(error.response && error.response.status === 400 && error.response.data.message === 'User is blocked.'){ 
      toast.error(error.response.data.message,{
        onClose: () => {
          store.dispatch(setAccessToken(''));
          store.dispatch(setName(''));
          store.dispatch(setEmail(''));
          store.dispatch(setPhoneNumber(''));
          window.location.href = '/login';
        },
        autoClose:1000
      });
    }
    console.log(error);
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("refreshing token");
      try {
        const response = await instance.get(`${BASE_URL}/auth/refresh-token`);
        const newAccessToken = response.data.accessToken;

        store.dispatch(setAccessToken(newAccessToken));
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
