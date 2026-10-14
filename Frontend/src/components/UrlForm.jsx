import { useState } from "react";
import QRCode from "qrcode";
import { short_url_api } from "../apis/shortUrl-api";

const UrlForm = ({ onLinkCreated }) => {
    const [url, setUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [qrDataUrl, setQrDataUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [showQr, setShowQr] = useState(false);

    // Smart URL normalizer: adds https:// if missing
    const normalizeUrl = (input) => {
        const trimmed = input.trim();
        if (!trimmed) return "";
        if (!/^https?:\/\//i.test(trimmed)) {
            return `https://${trimmed}`;
        }
        return trimmed;
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                setUrl(text.trim());
                setError("");
            }
        } catch {
            // Clipboard access might be blocked by browser permission
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setCopied(false);
        setShowQr(false);

        const targetUrl = normalizeUrl(url);

        if (!targetUrl) {
            setError("Please enter a valid URL to shorten.");
            return;
        }

        try {
            setLoading(true);
            const result = await short_url_api(targetUrl);
            setShortUrl(result);

            // Generate local QR code base64 image
            try {
                const qrImage = await QRCode.toDataURL(result, {
                    width: 320,
                    margin: 2,
                    color: {
                        dark: "#0f172a",
                        light: "#ffffff",
                    },
                    errorCorrectionLevel: "M",
                });
                setQrDataUrl(qrImage);
            } catch (qrErr) {
                console.error("QR Code generation error:", qrErr);
            }

            // Notify parent to add to local history
            if (onLinkCreated) {
                onLinkCreated({
                    id: Date.now().toString(),
                    shortUrl: result,
                    originalUrl: targetUrl,
                    createdAt: new Date().toISOString(),
                });
            }
        } catch (err) {
            console.error("Shorten error:", err);
            const serverMessage = err.response?.data?.message || err.message || "Failed to shorten URL. Please try again.";
            setError(serverMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!shortUrl) return;
        try {
            await navigator.clipboard.writeText(shortUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Fallback for older browsers
            const el = document.createElement("textarea");
            el.value = shortUrl;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleDownloadQr = () => {
        if (!qrDataUrl) return;
        const link = document.createElement("a");
        link.href = qrDataUrl;
        link.download = `short-url-qr-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full">
            {/* Shortener Card */}
            <div className="relative group">
                {/* Subtle Glow Behind the Card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500 pointer-events-none"></div>

                <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label htmlFor="url-input" className="block text-sm font-semibold text-slate-300">
                            Enter long URL
                        </label>

                        {/* Input Box with Action Buttons */}
                        <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                </div>

                                <input
                                    id="url-input"
                                    type="text"
                                    value={url}
                                    onChange={(e) => {
                                        setUrl(e.target.value);
                                        if (error) setError("");
                                    }}
                                    placeholder="https://example.com/very/long/unwieldy/link..."
                                    className="w-full pl-11 pr-24 py-3.5 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-slate-100 placeholder-slate-500 text-sm sm:text-base outline-none transition-all duration-200"
                                    required
                                />

                                {/* Paste / Clear Buttons inside the input */}
                                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center space-x-1">
                                    {url ? (
                                        <button
                                            type="button"
                                            onClick={() => setUrl("")}
                                            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
                                            title="Clear text"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handlePaste}
                                            className="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-indigo-300 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition flex items-center space-x-1"
                                            title="Paste from clipboard"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <span className="hidden xs:inline">Paste</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-white transition-all duration-200 flex items-center justify-center space-x-2 shrink-0 ${
                                    loading
                                        ? "bg-indigo-600/60 cursor-not-allowed"
                                        : "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] shadow-lg shadow-indigo-600/30"
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Shortening...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <span>Shorten URL</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Error Banner */}
                    {error && (
                        <div className="mt-4 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-3 text-rose-300 text-sm animate-in fade-in duration-200">
                            <svg className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="flex-1 font-medium">{error}</span>
                            <button onClick={() => setError("")} className="text-rose-400 hover:text-rose-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Success Shortened Link Result */}
                    {shortUrl && !error && (
                        <div className="mt-6 pt-6 border-t border-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                    <span>Shortened Link Ready</span>
                                </span>
                                <span className="text-xs text-slate-400">Click to test or copy</span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-2 bg-slate-950/90 border border-indigo-500/30 rounded-xl">
                                {/* Shortened URL display */}
                                <div className="flex-1 flex items-center px-3 py-2 space-x-2.5 overflow-hidden">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        readOnly
                                        value={shortUrl}
                                        className="bg-transparent text-indigo-300 font-semibold text-sm sm:text-base outline-none w-full truncate select-all"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-2 p-1">
                                    {/* Copy Button */}
                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-1.5 ${
                                            copied
                                                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                                                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                                        }`}
                                    >
                                        {copied ? (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Visit Link Button */}
                                    <a
                                        href={shortUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition border border-slate-700/60"
                                        title="Open in new tab"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>

                                    {/* QR Code Toggle Button */}
                                    <button
                                        type="button"
                                        onClick={() => setShowQr(!showQr)}
                                        className={`p-2.5 rounded-lg transition border ${
                                            showQr 
                                                ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300" 
                                                : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700/60"
                                        }`}
                                        title={showQr ? "Hide QR Code" : "Show QR Code"}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Collapsible QR Code Card (100% Offline & Instant) */}
                            {showQr && (
                                <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center gap-5 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="bg-white p-3 rounded-xl shadow-lg shadow-black/40 shrink-0">
                                        {qrDataUrl ? (
                                            <img
                                                src={qrDataUrl}
                                                alt="Short URL QR Code"
                                                className="w-36 h-36 block rounded"
                                            />
                                        ) : (
                                            <div className="w-36 h-36 flex items-center justify-center text-slate-500 text-xs">
                                                Generating...
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 text-center sm:text-left space-y-2.5">
                                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                            <h4 className="text-sm font-bold text-slate-200">Instant QR Code</h4>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            Scan this code with any phone camera to instantly open your shortened link.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleDownloadQr}
                                            disabled={!qrDataUrl}
                                            className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm cursor-pointer disabled:opacity-50"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            <span>Download PNG</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UrlForm;