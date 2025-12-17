"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { LayoutProvider } from "@/components/LayoutContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <LayoutProvider>
            <div style={{ display: "flex", minHeight: "100vh", background: "var(--background)" }}>
                <Sidebar />
                <main className="main-content">
                    <Navbar />
                    <div style={{ padding: "2rem", overflowY: "auto", flex: 1 }}>
                        <div style={{ maxWidth: "100%", margin: "0" }}>
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </LayoutProvider>
    );
}
