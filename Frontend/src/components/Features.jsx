const Features = () => {
    const features = [
        {
            icon: (
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: "Lightning Fast Redirects",
            description: "High-performance MongoDB indexing guarantees near-zero latency when forwarding visitors.",
        },
        {
            icon: (
                <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: "Safe & Spam-Protected",
            description: "Automated Joi validation blocks malicious protocols, while rate limiting prevents abuse.",
        },
        {
            icon: (
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
            ),
            title: "Instant QR Generation",
            description: "Share on posters, slides, or mobile devices with instant auto-generated QR codes.",
        },
    ];

    return (
        <section className="mt-16 sm:mt-24 w-full">
            <div className="text-center mb-10 space-y-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    Built for speed, simplicity, and scale
                </h3>
                <p className="text-sm text-slate-400 max-w-lg mx-auto">
                    Everything you need to create clean, reliable, and trackable links without unwanted bloat.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {features.map((item, idx) => (
                    <div
                        key={idx}
                        className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
                    >
                        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-4">
                            {item.icon}
                        </div>
                        <h4 className="text-base font-bold text-slate-100 mb-1.5">{item.title}</h4>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;

