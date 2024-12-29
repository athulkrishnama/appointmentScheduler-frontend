import axios from "axios";
import BASE_URL from "../constants/baseurl";
import  store  from '../store/store';
import { setAccessToken } from '../store/userSlice/userSlice';
import { useNavigate } from 'react-router';

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
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = store.getState().user.refreshToken;
        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });
        const newAccessToken = response.data.accessToken;

        store.dispatch(setAccessToken(newAccessToken));
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        const navigate = useNavigate();
        navigate('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
