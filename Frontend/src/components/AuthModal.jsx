import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { forgotPasswordApi, resendVerificationApi } from "../apis/auth-api";

const AuthModal = () => {
    const {
        authModalOpen,
        authModalTab,
        setAuthModalTab,
        closeAuthModal,
        login,
        register,
    } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    if (!authModalOpen) return null;

    const resetForm = () => {
        setError("");
        setSuccessMessage("");
        setShowPassword(false);
    };

    const handleTabChange = (tab) => {
        resetForm();
        setAuthModalTab(tab);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setLoading(true);

        try {
            if (authModalTab === "login") {
                await login(email, password);
                setName("");
                setEmail("");
                setPassword("");
                resetForm();
            } else if (authModalTab === "register") {
                await register(name, email, password);
                setSuccessMessage("Account created! Check your email to verify your account before logging in.");
            } else if (authModalTab === "forgot") {
                await forgotPasswordApi(email);
                setSuccessMessage("Password reset email sent! Check your inbox.");
            } else if (authModalTab === "resend") {
                await resendVerificationApi(email);
                setSuccessMessage("Verification link sent! Please check your email inbox (and spam folder).");
            }
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "An error occurred. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                onClick={closeAuthModal}
            ></div>

            {/* Modal Dialog */}
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden">
                {/* Top glow decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>

                {/* Close Button */}
                <button
                    onClick={closeAuthModal}
                    className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                    title="Close"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Tabs */}
                <div className="flex border-b border-slate-800 mb-6">
                    <button
                        onClick={() => handleTabChange("login")}
                        className={`pb-3 text-sm font-semibold transition border-b-2 mr-6 cursor-pointer ${
                            authModalTab === "login"
                                ? "border-indigo-500 text-indigo-400"
                                : "border-transparent text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => handleTabChange("register")}
                        className={`pb-3 text-sm font-semibold transition border-b-2 mr-6 cursor-pointer ${
                            authModalTab === "register"
                                ? "border-indigo-500 text-indigo-400"
                                : "border-transparent text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        Create Account
                    </button>
                    {authModalTab === "forgot" && (
                        <button
                            className="pb-3 text-sm font-semibold border-b-2 border-indigo-500 text-indigo-400 cursor-default"
                        >
                            Reset Password
                        </button>
                    )}
                    {authModalTab === "resend" && (
                        <button
                            className="pb-3 text-sm font-semibold border-b-2 border-indigo-500 text-indigo-400 cursor-default"
                        >
                            Resend Verification
                        </button>
                    )}
                </div>

                {/* Heading */}
                <div className="mb-5">
                    <h2 className="text-xl font-bold text-white">
                        {authModalTab === "login" && "Welcome back to SnapURL"}
                        {authModalTab === "register" && "Create your SnapURL account"}
                        {authModalTab === "forgot" && "Recover your password"}
                        {authModalTab === "resend" && "Resend Verification Email"}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                        {authModalTab === "login" && "Sign in to access your cloud-saved links and track click analytics."}
                        {authModalTab === "register" && "Create a free account to manage shortened links across any device."}
                        {authModalTab === "forgot" && "Enter your email address and we'll send a password reset link."}
                        {authModalTab === "resend" && "Didn't receive or need a new verification link? Enter your email below."}
                    </p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                        <div className="flex items-start space-x-2">
                            <svg className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="flex-1 font-medium">{error}</span>
                        </div>
                        {error.toLowerCase().includes("verify") && (
                            <div className="mt-2.5 pt-2 border-t border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                <span className="text-[11px] text-slate-300">Verification link failed or expired?</span>
                                <button
                                    type="button"
                                    onClick={() => handleTabChange("resend")}
                                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline cursor-pointer text-left sm:text-right"
                                >
                                    Resend Verification Link →
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                        <div className="flex items-start space-x-2">
                            <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="flex-1 font-medium">{successMessage}</span>
                        </div>
                        {authModalTab === "register" && (
                            <div className="mt-2.5 pt-2 border-t border-emerald-500/20 flex items-center justify-between">
                                <span className="text-[11px] text-slate-300">Email didn't arrive?</span>
                                <button
                                    type="button"
                                    onClick={() => handleTabChange("resend")}
                                    className="text-xs font-semibold text-emerald-300 hover:text-emerald-100 underline cursor-pointer"
                                >
                                    Resend Link
                                </button>
                            </div>
                        )}
                        {authModalTab === "resend" && (
                            <div className="mt-2.5 pt-2 border-t border-emerald-500/20 flex items-center justify-between">
                                <span className="text-[11px] text-slate-300">Ready to sign in?</span>
                                <button
                                    type="button"
                                    onClick={() => handleTabChange("login")}
                                    className="text-xs font-semibold text-emerald-300 hover:text-emerald-100 underline cursor-pointer"
                                >
                                    Go to Sign In →
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {authModalTab === "register" && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                        />
                    </div>

                    {authModalTab !== "forgot" && authModalTab !== "resend" && (
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-semibold text-slate-300">
                                    Password
                                </label>
                                {authModalTab === "login" && (
                                    <button
                                        type="button"
                                        onClick={() => handleTabChange("forgot")}
                                        className="text-xs text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                                    >
                                        Forgot?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition cursor-pointer"
                                    title={showPassword ? "Hide password" : "Show password"}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {authModalTab === "register" && (
                                <p className="text-[11px] text-slate-500 mt-1">
                                    Must contain at least 8 characters with 1 uppercase letter and 1 number.
                                </p>
                            )}
                        </div>
                    )}

                    {authModalTab === "login" && (
                        <div className="flex justify-end pt-0.5">
                            <button
                                type="button"
                                onClick={() => handleTabChange("resend")}
                                className="text-xs text-slate-400 hover:text-indigo-300 transition cursor-pointer"
                            >
                                Didn't receive verification email?
                            </button>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 font-semibold text-sm text-white shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <span>
                                {authModalTab === "login" && "Sign In"}
                                {authModalTab === "register" && "Create Free Account"}
                                {authModalTab === "forgot" && "Send Reset Link"}
                                {authModalTab === "resend" && "Resend Verification Email"}
                            </span>
                        )}
                    </button>

                    {/* Back to sign in link for forgot / resend tabs */}
                    {(authModalTab === "forgot" || authModalTab === "resend") && (
                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={() => handleTabChange("login")}
                                className="text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer flex items-center justify-center space-x-1 mx-auto"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span>Back to Sign In</span>
                            </button>
                        </div>
                    )}
                </form>

                {/* Divider */}
                <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-800"></div>
                    </div>
                    <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-slate-500 bg-slate-900 px-2">
                        Or
                    </div>
                </div>

                {/* Continue as Guest Button (Requested Feature!) */}
                <button
                    type="button"
                    onClick={closeAuthModal}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Continue as Guest (No sign up required)</span>
                </button>
            </div>
        </div>
    );
};

export default AuthModal;

