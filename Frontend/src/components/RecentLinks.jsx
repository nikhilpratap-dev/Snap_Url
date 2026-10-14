import { useState } from "react";

const RecentLinks = ({ links, onClearHistory, onDeleteLink }) => {
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = async (id, shortUrl) => {
        try {
            await navigator.clipboard.writeText(shortUrl);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            const el = document.createElement("textarea");
            el.value = shortUrl;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    if (!links || links.length === 0) {
        return null;
    }

    return (
        <div className="w-full mt-10">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-base font-bold text-slate-200">Recent Short Links</h3>
                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-medium">
                        {links.length}
                    </span>
                </div>

                <button
                    onClick={onClearHistory}
                    className="text-xs text-slate-400 hover:text-rose-400 transition flex items-center space-x-1"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Clear All</span>
                </button>
            </div>

            <div className="space-y-2.5">
                {links.map((item) => (
                    <div
                        key={item.id}
                        className="p-3.5 sm:p-4 bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition group backdrop-blur-sm"
                    >
                        <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                                <a
                                    href={item.shortUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm sm:text-base font-bold text-indigo-400 hover:text-indigo-300 transition truncate"
                                >
                                    {item.shortUrl}
                                </a>
                                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Active
                                </span>
                            </div>

                            <p className="text-xs text-slate-400 truncate max-w-xl">
                                {item.originalUrl}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                            <button
                                onClick={() => handleCopy(item.id, item.shortUrl)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ${
                                    copiedId === item.id
                                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                        : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60"
                                }`}
                            >
                                {copiedId === item.id ? (
                                    <>
                                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>

                            <a
                                href={item.shortUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition border border-slate-700/60"
                                title="Open Link"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>

                            <button
                                onClick={() => onDeleteLink(item.id)}
                                className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                                title="Delete from history"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentLinks;

