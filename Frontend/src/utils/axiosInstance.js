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

// Automatic token refresh interceptor on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest?._retry) {
            const url = originalRequest?.url || "";
            // Do not attempt refresh on auth endpoints themselves
            if (
                url.includes("/api/auth/login") ||
                url.includes("/api/auth/register") ||
                url.includes("/api/auth/refresh-Token")
            ) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post(
                    `${axiosInstance.defaults.baseURL}/api/auth/refresh-Token`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = data?.data?.accessToken;
                if (newAccessToken) {
                    localStorage.setItem("snapurl_token", newAccessToken);
                    axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    processQueue(null, newAccessToken);
                    return axiosInstance(originalRequest);
                }
            } catch (refreshErr) {
                processQueue(refreshErr, null);
                localStorage.removeItem("snapurl_token");
                window.dispatchEvent(new Event("snapurl_session_expired"));
                return Promise.reject(refreshErr);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
