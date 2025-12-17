"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { User } from "@/lib/auth";
import { UserCircle, Mail, Shield, MapPin, Calendar, Camera, Edit3 } from "lucide-react";

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userCookie = Cookies.get("currentUser");
        if (userCookie) {
            setUser(JSON.parse(userCookie));
        }
    }, []);

    if (!user) return null;

    return (
        <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
            {/* Cover Image */}
            <div style={{
                height: "200px",
                background: "linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%)",
                borderRadius: "var(--radius)",
                position: "relative",
                marginBottom: "5rem"
            }}>
                <button className="btn" style={{
                    position: "absolute", top: "1rem", right: "1rem",
                    background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", color: "white", border: "none"
                }}>
                    <Camera size={18} style={{ marginRight: "0.5rem" }} /> Change Cover
                </button>

                {/* Profile Card Overlay */}
                <div style={{
                    position: "absolute",
                    bottom: "-4rem",
                    left: "2rem",
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "1.5rem"
                }}>
                    <div style={{
                        width: "128px",
                        height: "128px",
                        borderRadius: "50%",
                        border: "5px solid var(--card)",
                        background: "var(--card)",
                        position: "relative"
                    }}>
                        <div style={{
                            width: "100%", height: "100%", borderRadius: "50%",
                            background: "var(--secondary)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "3rem", fontWeight: "700", color: "var(--foreground)"
                        }}>
                            {user.name.charAt(0)}
                        </div>
                        <button style={{
                            position: "absolute", bottom: "0", right: "0",
                            background: "var(--primary)", color: "white",
                            border: "none", borderRadius: "50%", width: "32px", height: "32px",
                            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                        }}>
                            <Edit3 size={14} />
                        </button>
                    </div>

                    <div style={{ paddingBottom: "1rem" }}>
                        <h1 style={{ fontSize: "2rem", fontWeight: "700", lineHeight: 1.2 }}>{user.name}</h1>
                        <p style={{ color: "var(--muted-foreground)", fontWeight: "500" }}>{user.role} • SteptoStore Member</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>

                {/* Left Column: Info & Bio */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {/* Personal Info */}
                    <div className="card">
                        <div className="card-header">
                            <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>Personal Information</h3>
                        </div>
                        <div className="card-content" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <div>
                                    <label style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginBottom: "0.25rem", display: "block" }}>Full Name</label>
                                    <div style={{ fontWeight: "500" }}>{user.name}</div>
                                </div>
                                <div>
                                    <label style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginBottom: "0.25rem", display: "block" }}>Display Name</label>
                                    <div style={{ fontWeight: "500" }}>{user.name}</div>
                                </div>
                                <div>
                                    <label style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginBottom: "0.25rem", display: "block" }}>Email Address</label>
                                    <div style={{ fontWeight: "500" }}>{user.email}</div>
                                </div>
                                <div>
                                    <label style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginBottom: "0.25rem", display: "block" }}>Phone</label>
                                    <div style={{ fontWeight: "500" }}>+1 (555) 123-4567</div>
                                </div>
                                <div>
                                    <label style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginBottom: "0.25rem", display: "block" }}>Location</label>
                                    <div style={{ fontWeight: "500" }}>New York, USA</div>
                                </div>
                                <div>
                                    <label style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginBottom: "0.25rem", display: "block" }}>Timezone</label>
                                    <div style={{ fontWeight: "500" }}>EST (UTC-5)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio / About */}
                    <div className="card">
                        <div className="card-header">
                            <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>About Me</h3>
                        </div>
                        <div className="card-content">
                            <p style={{ color: "var(--muted-foreground)", lineHeight: 1.6 }}>
                                Experienced {user.role} with a passion for building scalable web applications.
                                Dedicated to maintaining high code quality and improving user experience.
                                Currently managing the SteptoStore inventory system.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings & Account */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {/* Account Settings */}
                    <div className="card">
                        <div className="card-header">
                            <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>Account Security</h3>
                        </div>
                        <div className="card-content">
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <div style={{ padding: "0.5rem", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", borderRadius: "8px" }}>
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: "500" }}>Password</div>
                                        <div style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>Last changed 30 days ago</div>
                                    </div>
                                </div>
                                <button className="btn btn-outline" style={{ fontSize: "0.75rem" }}>Change</button>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <div style={{ padding: "0.5rem", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", borderRadius: "8px" }}>
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: "500" }}>2-Factor Auth</div>
                                        <div style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>Enabled</div>
                                    </div>
                                </div>
                                <button className="btn btn-outline" style={{ fontSize: "0.75rem" }}>Configure</button>
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="card">
                        <div className="card-header">
                            <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>Preferences</h3>
                        </div>
                        <div className="card-content">
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                                    <span style={{ fontWeight: "500" }}>Email Notifications</span>
                                    <input type="checkbox" defaultChecked style={{ accentColor: "var(--primary)" }} />
                                </label>
                                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                                    <span style={{ fontWeight: "500" }}>Marketing Emails</span>
                                    <input type="checkbox" style={{ accentColor: "var(--primary)" }} />
                                </label>
                                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                                    <span style={{ fontWeight: "500" }}>Public Profile</span>
                                    <input type="checkbox" defaultChecked style={{ accentColor: "var(--primary)" }} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
