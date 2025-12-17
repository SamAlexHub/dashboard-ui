"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { login, UserRole } from "@/lib/auth";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const user = await login(email);
            if (user) {
                Cookies.set("currentUser", JSON.stringify(user));
                // Redirect based on role
                router.push("/dashboard");
            } else {
                setError("Invalid email. Try super@example.com, admin@example.com, or user@example.com");
            }
        } catch (err) {
            setError("An error occurred during login.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, var(--background) 0%, var(--secondary) 100%)"
        }}>
            <div className="card" style={{ width: "100%", maxWidth: "400px", border: "1px solid var(--border)", background: "var(--card)" }}>
                <div className="card-header" style={{ textAlign: "center", paddingBottom: "0.5rem" }}>
                    <div style={{
                        width: "48px",
                        height: "48px",
                        background: "var(--primary)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1.5rem auto",
                        color: "white"
                    }}>
                        <ShieldCheck size={24} />
                    </div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem" }}>Welcome Back</h1>
                    <p style={{ color: "var(--muted-foreground)" }}>Sign in to access your dashboard</p>
                </div>

                <div className="card-content">
                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                        <div style={{ position: "relative" }}>
                            <Mail size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="input"
                                style={{ paddingLeft: "40px" }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ position: "relative" }}>
                            <Lock size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
                            <input
                                type="password"
                                placeholder="Password"
                                className="input"
                                style={{ paddingLeft: "40px" }}
                                defaultValue="password" // Mock password
                            />
                        </div>

                        {error && <div style={{ color: "var(--destructive)", fontSize: "0.875rem", textAlign: "center" }}>{error}</div>}

                        <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem", height: "44px" }} disabled={loading}>
                            {loading ? "Signing in..." : (
                                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    Sign In <ArrowRight size={16} />
                                </span>
                            )}
                        </button>

                        <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "var(--muted-foreground)", textAlign: "center" }}>
                            <p>Demo Accounts:</p>
                            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "0.25rem", flexWrap: "wrap" }}>
                                <code style={{ background: "var(--muted)", padding: "2px 6px", borderRadius: "4px" }}>super@example.com</code>
                                <code style={{ background: "var(--muted)", padding: "2px 6px", borderRadius: "4px" }}>admin@example.com</code>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
