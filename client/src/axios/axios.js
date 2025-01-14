import axios from "axios";
import BASE_URL from "../constants/baseurl";
import store from "../store/store";
import { setAccessToken, setName, setEmail, setPhoneNumber } from "../store/userSlice/userSlice";
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
  (error) => Promise.reject(error)
);

let isBlockedToastActive = false;

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 400 &&
      error.response.data.message === "User is blocked."
    ) {
      if (!isBlockedToastActive) {
        isBlockedToastActive = true; 
        toast.error(error.response.data.message, {
          autoClose: 1000,
          onClose: () => {
            
            store.dispatch(setAccessToken(""));
            store.dispatch(setName(""));
            store.dispatch(setEmail(""));
            store.dispatch(setPhoneNumber(""));
            window.location.href = "/login";
            isBlockedToastActive = false; 
          },
        });
      }
      return;
    }

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await instance.get(`${BASE_URL}/auth/refresh-token`);
        const newAccessToken = response.data.accessToken;

        store.dispatch(setAccessToken(newAccessToken));
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
