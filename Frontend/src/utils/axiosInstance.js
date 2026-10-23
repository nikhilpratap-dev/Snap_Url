import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true,
});

// Automatically inject JWT Bearer token if user is logged in
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("snapurl_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
