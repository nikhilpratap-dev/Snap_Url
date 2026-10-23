import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import UrlForm from "../components/UrlForm";
import RecentLinks from "../components/RecentLinks";
import Features from "../components/Features";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../context/AuthContext";
import { getMyLinksApi, deleteMyLinkApi } from "../apis/auth-api";

const LOCAL_STORAGE_KEY = "snapurl_recent_links";

const HomePage = () => {
    const { user, isGuest, openAuthModal } = useAuth();

    // Local state for guests
    const [localLinks, setLocalLinks] = useState(() => {
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Cloud links for logged-in user
    const [cloudLinks, setCloudLinks] = useState([]);
    const [loadingLinks, setLoadingLinks] = useState(false);

    // Save guest links in local storage
    useEffect(() => {
        if (isGuest) {
            try {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localLinks));
            } catch {
                // Ignore storage limits
            }
        }
    }, [localLinks, isGuest]);

    // Fetch cloud links when user logs in
    useEffect(() => {
        const fetchUserLinks = async () => {
            if (user) {
                setLoadingLinks(true);
                try {
                    const res = await getMyLinksApi();
                    if (res?.data) {
                        setCloudLinks(res.data);
                    }
                } catch (err) {
                    console.error("Failed to load user links:", err);
                } finally {
                    setLoadingLinks(false);
                }
            }
        };
        fetchUserLinks();
    }, [user]);

    const handleLinkCreated = (newLink) => {
        if (user) {
            setCloudLinks((prev) => [
                {
                    id: newLink.id || Date.now().toString(),
                    shortUrl: newLink.shortUrl,
                    originalUrl: newLink.originalUrl,
                    clicks: 0,
                    createdAt: newLink.createdAt || new Date().toISOString(),
                },
                ...prev.filter((item) => item.shortUrl !== newLink.shortUrl),
            ]);
        } else {
            setLocalLinks((prev) => {
                const filtered = prev.filter((item) => item.shortUrl !== newLink.shortUrl);
                return [newLink, ...filtered].slice(0, 10);
            });
        }
    };

    const handleClearHistory = () => {
        if (isGuest) {
            setLocalLinks([]);
            try {
                localStorage.removeItem(LOCAL_STORAGE_KEY);
            } catch {
                //
            }
        } else {
            // For logged in users, just clear local view or reload
            setCloudLinks([]);
        }
    };

    const handleDeleteLink = async (id) => {
        if (user) {
            try {
                await deleteMyLinkApi(id);
                setCloudLinks((prev) => prev.filter((item) => item.id !== id));
            } catch (err) {
                console.error("Delete failed:", err);
            }
        } else {
            setLocalLinks((prev) => prev.filter((item) => item.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
            {/* Background Gradient Mesh Orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden -z-0">
                <div className="absolute top-[-100px] left-1/4 w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[120px]"></div>
                <div className="absolute top-[-50px] right-1/4 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[120px]"></div>
                <div className="absolute top-[200px] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-cyan-500/10 rounded-full blur-[140px]"></div>
            </div>

            <div>
                {/* Navbar */}
                <Navbar />

                {/* Main Content Area */}
                <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12 relative z-10 flex flex-col items-center">
                    {/* Guest Mode Callout Banner */}
                    {isGuest && (
                        <div className="w-full max-w-2xl mb-8 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/60 border border-indigo-500/20 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                            <div className="flex items-center space-x-2.5 text-slate-300">
                                <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </span>
                                <span>
                                    <strong>Guest Mode Active:</strong> Shorten unlimited links instantly with zero signup.
                                </span>
                            </div>
                            <button
                                onClick={() => openAuthModal("register")}
                                className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold transition shadow-sm"
                            >
                                Free Sign Up to Sync Links
                            </button>
                        </div>
                    )}

                    {/* Hero Badge */}
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 mb-6 shadow-sm">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        <span className="text-xs font-semibold text-slate-300">
                            Smart & Secure URL Shortening
                        </span>
                    </div>

                    {/* Headline */}
                    <div className="text-center max-w-2xl mx-auto space-y-4 mb-10">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                            Shorten Links. <br />
                            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                                Share Anywhere.
                            </span>
                        </h1>
                        <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
                            Transform long, messy URLs into clean, memorable, and secure links with instant QR codes and built-in protection.
                        </p>
                    </div>

                    {/* Main URL Form Component */}
                    <UrlForm onLinkCreated={handleLinkCreated} />

                    {/* Links History */}
                    <RecentLinks
                        links={user ? cloudLinks : localLinks}
                        isCloudSynced={!!user}
                        onClearHistory={handleClearHistory}
                        onDeleteLink={handleDeleteLink}
                    />

                    {/* Features Grid */}
                    <Features />
                </main>
            </div>

            {/* Auth Modal */}
            <AuthModal />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default HomePage;
