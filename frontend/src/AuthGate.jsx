import { useState } from "react";
import "./AuthGate.css";

function AuthGate({ onAuthenticated }) {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const endpoint = isLogin
                ? "/api/auth/login"
                : "/api/auth/register";

            const body = isLogin
                ? { email, password }
                : { name, email, password };

            const response = await fetch(
                `http://localhost:8080${endpoint}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(body),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Authentication failed."
                );
            }

            onAuthenticated(data.user);
        } catch (err) {
            setError(
                err.message ||
                "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1>SigmaGPT</h1>

                <p className="auth-subtitle">
                    {isLogin
                        ? "Welcome back! Log in to continue."
                        : "Create an account to get started."}
                </p>

                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoComplete="name"
                    />
                )}

                <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    maxLength={128}
                    autoComplete={
                        isLogin ? "current-password" : "new-password"
                    }
                />

                {error && (
                    <p className="auth-error">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Please wait..."
                        : isLogin
                        ? "Log In"
                        : "Create Account"}
                </button>

                <p className="auth-switch">
                    {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}

                    <button
                        type="button"
                        className="auth-switch-button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                        }}
                    >
                        {isLogin ? "Sign Up" : "Log In"}
                    </button>
                </p>
            </form>
        </div>
    );
}

export default AuthGate;