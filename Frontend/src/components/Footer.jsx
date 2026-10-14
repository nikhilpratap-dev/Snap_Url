const Footer = () => {
    return (
        <footer className="mt-20 border-t border-slate-900 bg-slate-950/60 py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-300">SnapURL</span>
                    <span>•</span>
                    <span>Open-source URL Shortener</span>
                </div>

                <div className="flex items-center space-x-3">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">React 19</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Tailwind CSS</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Express</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Node.js</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">MongoDB</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

