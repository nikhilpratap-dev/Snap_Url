import axiosInstance from "../utils/axiosInstance";

export const loginApi = async (credentials) => {
    const response = await axiosInstance.post("/api/auth/login", credentials);
    return response.data;
};

export const registerApi = async (userData) => {
    const response = await axiosInstance.post("/api/auth/register", userData);
    return response.data;
};

export const forgotPasswordApi = async (email) => {
    const response = await axiosInstance.post("/api/auth/forgot-Password", { email });
    return response.data;
};

export const resetPasswordApi = async (token, newPassword) => {
    const response = await axiosInstance.put(`/api/auth/reset-Password/${token}`, { newPassword });
    return response.data;
};

export const getMeApi = async () => {
    const response = await axiosInstance.get("/api/auth/me");
    return response.data;
};

export const logoutApi = async () => {
    const response = await axiosInstance.post("/api/auth/logOut");
    return response.data;
};

export const getMyLinksApi = async () => {
    const response = await axiosInstance.get("/api/create/my-links");
    return response.data;
};

export const deleteMyLinkApi = async (id) => {
    const response = await axiosInstance.delete(`/api/create/my-links/${id}`);
    return response.data;
};

