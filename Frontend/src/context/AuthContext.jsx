import { createContext, useContext, useState, useEffect } from "react";
import { loginApi, registerApi, logoutApi, getMeApi } from "../apis/auth-api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("snapurl_token"));
    const [loading, setLoading] = useState(true);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalTab, setAuthModalTab] = useState("login"); // 'login' | 'register' | 'forgot'

    // Load user on mount if token exists
    useEffect(() => {
        const restoreSession = async () => {
            if (token) {
                try {
                    const res = await getMeApi();
                    if (res?.data) {
                        setUser(res.data);
                    }
                } catch (err) {
                    // Token expired or invalid
                    console.warn("Session restore failed, switching to guest mode:", err.message);
                    localStorage.removeItem("snapurl_token");
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        restoreSession();

        const handleSessionExpired = () => {
            localStorage.removeItem("snapurl_token");
            setToken(null);
            setUser(null);
        };
        window.addEventListener("snapurl_session_expired", handleSessionExpired);
        return () => window.removeEventListener("snapurl_session_expired", handleSessionExpired);
    }, [token]);

    const login = async (email, password) => {
        const res = await loginApi({ email, password });
        const accessToken = res?.data?.accessToken;
        const loggedUser = res?.data?.user;

        if (accessToken) {
            localStorage.setItem("snapurl_token", accessToken);
            setToken(accessToken);
        }
        if (loggedUser) {
            setUser(loggedUser);
        }
        setAuthModalOpen(false);
        return res;
    };

    const register = async (name, email, password) => {
        const res = await registerApi({ name, email, password });
        return res;
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch (e) {
            // ignore network/server error on logout
        } finally {
            localStorage.removeItem("snapurl_token");
            setToken(null);
            setUser(null);
        }
    };

    const openAuthModal = (tab = "login") => {
        setAuthModalTab(tab);
        setAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setAuthModalOpen(false);
    };

    const value = {
        user,
        token,
        isGuest: !user,
        loading,
        login,
        register,
        logout,
        authModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

