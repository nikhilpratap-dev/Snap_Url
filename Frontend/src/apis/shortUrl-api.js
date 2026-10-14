import axiosInstance from "../utils/axiosInstance";

export const short_url_api = async (url) => {
    const { data } = await axiosInstance.post("/api/create", { url });
    // Support both string response ("http://localhost:3000/xyz") and JSON response ({ shortUrl: "..." })
    if (typeof data === "string") {
        return data;
    }
    return data.shortUrl || data.url || data;
};