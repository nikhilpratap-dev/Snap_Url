import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import UrlForm from "../components/UrlForm";
import RecentLinks from "../components/RecentLinks";
import Features from "../components/Features";
import Footer from "../components/Footer";

const LOCAL_STORAGE_KEY = "snapurl_recent_links";

const HomePage = () => {
    const [recentLinks, setRecentLinks] = useState(() => {
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recentLinks));
        } catch {
            // Local storage might be full or restricted
        }
    }, [recentLinks]);

    const handleLinkCreated = (newLink) => {
        setRecentLinks((prev) => {
            // Keep at most 10 recent links, prevent duplicate short links
            const filtered = prev.filter((item) => item.shortUrl !== newLink.shortUrl);
            return [newLink, ...filtered].slice(0, 10);
        });
    };

    const handleClearHistory = () => {
        setRecentLinks([]);
        try {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        } catch {
            //
        }
    };

    const handleDeleteLink = (id) => {
        setRecentLinks((prev) => prev.filter((item) => item.id !== id));
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
                <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-12 relative z-10 flex flex-col items-center">
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

                    {/* Recent Links History */}
                    <RecentLinks
                        links={recentLinks}
                        onClearHistory={handleClearHistory}
                        onDeleteLink={handleDeleteLink}
                    />

                    {/* Features Grid */}
                    <Features />
                </main>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default HomePage;