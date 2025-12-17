"use client";

import { Palette, Bell, Search, Menu } from "lucide-react";
import { useTheme, THEME_COLORS } from "./ThemeProvider";
import { useState } from "react";
import { useLayout } from "./LayoutContext";

export default function Navbar() {
    const { primaryColor, setPrimaryColor, themeMode, setThemeMode } = useTheme();
    const { toggleSidebar } = useLayout();
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);

    return (
        <header style={{
            height: "64px",
            borderBottom: "1px solid var(--border)",
            background: "var(--card)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1rem", // reduced padding for mobile
            position: "sticky",
            top: 0,
            zIndex: 40
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <button
                    className="btn btn-outline menu-trigger"
                    onClick={toggleSidebar}
                    style={{ padding: "0.5rem" }}
                >
                    <Menu size={20} />
                </button>

                {/* Left side: Search (Decoration) */}
                <div className="navbar-search" style={{ position: "relative", width: "300px" }}>
                    <Search size={18} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
                    <input
                        type="text"
                        placeholder="Search..."
                        style={{
                            height: "36px",
                            width: "100%",
                            paddingLeft: "36px",
                            paddingRight: "12px",
                            borderRadius: "20px",
                            border: "1px solid var(--border)",
                            background: "var(--background)",
                            fontSize: "0.875rem",
                            outline: "none"
                        }}
                    />
                </div>
            </div>

            {/* Right side: Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>

                {/* Theme Picker */}
                <div style={{ position: "relative" }}>
                    <button
                        onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                        className="btn btn-outline"
                        style={{ borderRadius: "50%", width: "36px", height: "36px", padding: 0 }}
                        title="Change Theme"
                    >
                        <Palette size={18} />
                    </button>

                    {isPaletteOpen && (
                        <>
                            <div
                                style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 49 }}
                                onClick={() => setIsPaletteOpen(false)}
                            />
                            <div className="card" style={{
                                position: "absolute",
                                top: "100%",
                                right: 0,
                                marginTop: "0.5rem",
                                padding: "1rem",
                                width: "200px",
                                zIndex: 50,
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "0.5rem",
                                animation: "fadeIn 0.2s ease-out"
                            }}>
                                <h4 style={{ width: "100%", fontSize: "0.75rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--muted-foreground)" }}>Theme Color</h4>
                                {THEME_COLORS.map((color) => (
                                    <button
                                        key={color.name}
                                        title={color.name}
                                        onClick={() => {
                                            setPrimaryColor(color.value);
                                            // setIsPaletteOpen(false); // Keep open to allow mode switch
                                        }}
                                        style={{
                                            width: "24px",
                                            height: "24px",
                                            borderRadius: "50%",
                                            background: color.value,
                                            border: primaryColor === color.value ? "2px solid var(--foreground)" : "2px solid transparent",
                                            cursor: "pointer",
                                            transition: "transform 0.1s"
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                    />
                                ))}

                                <div style={{ width: "100%", height: "1px", background: "var(--border)", margin: "0.5rem 0" }}></div>

                                <h4 style={{ width: "100%", fontSize: "0.75rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--muted-foreground)" }}>Mode</h4>
                                <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                                    {(['light', 'dark', 'system'] as const).map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() => setThemeMode(mode)}
                                            style={{
                                                flex: 1,
                                                padding: "0.25rem",
                                                fontSize: "0.75rem",
                                                borderRadius: "var(--radius)",
                                                border: "1px solid var(--border)",
                                                background: themeMode === mode ? "var(--secondary)" : "transparent",
                                                color: themeMode === mode ? "var(--foreground)" : "var(--muted-foreground)",
                                                cursor: "pointer",
                                                textTransform: "capitalize"
                                            }}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Notifications Mock */}
                <button
                    className="btn btn-outline"
                    style={{ borderRadius: "50%", width: "36px", height: "36px", padding: 0 }}
                >
                    <Bell size={18} />
                </button>

            </div>
        </header>
    );
}
