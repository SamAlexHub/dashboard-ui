"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeColor = {
    name: string;
    value: string;
};

export const THEME_COLORS: ThemeColor[] = [
    { name: "Indigo", value: "#6366f1" },
    { name: "Emerald", value: "#10b981" },
    { name: "Violet", value: "#8b5cf6" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Orange", value: "#f97316" },
    { name: "Cyan", value: "#06b6d4" },
];

interface ThemeContextType {
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
    themeMode: 'light' | 'dark' | 'system';
    setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [primaryColor, setPrimaryColor] = useState(THEME_COLORS[0].value);
    const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load saved settings
        const savedColor = localStorage.getItem("theme-primary");
        const savedMode = localStorage.getItem("theme-mode") as 'light' | 'dark' | 'system';

        if (savedColor) setPrimaryColor(savedColor);
        if (savedMode) setThemeMode(savedMode);

        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        document.documentElement.style.setProperty("--primary", primaryColor);
        document.documentElement.style.setProperty("--ring", primaryColor);
        localStorage.setItem("theme-primary", primaryColor);
    }, [primaryColor, mounted]);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        localStorage.setItem("theme-mode", themeMode);

        if (themeMode === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.remove('light', 'dark');
            root.classList.add(systemTheme);
            return;
        }

        root.classList.remove('light', 'dark');
        root.classList.add(themeMode);
    }, [themeMode, mounted]);

    return (
        <ThemeContext.Provider value={{ primaryColor, setPrimaryColor, themeMode, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
