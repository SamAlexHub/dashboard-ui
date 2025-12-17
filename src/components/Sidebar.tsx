"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    Users,
    UserCircle,
    LogOut,
    Shield,
    BarChart2
} from "lucide-react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { User } from "@/lib/auth";

import { useLayout } from "./LayoutContext";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const { isSidebarOpen, closeSidebar } = useLayout();

    useEffect(() => {
        const userCookie = Cookies.get("currentUser");
        if (userCookie) {
            setUser(JSON.parse(userCookie));
        } else {
            router.push("/login");
        }
    }, [router]);

    const handleLogout = () => {
        Cookies.remove("currentUser");
        router.push("/login");
    };

    const isActive = (path: string) => pathname === path;

    const menuItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Inventory", href: "/dashboard/inventory", icon: Package },
        { name: "Reports", href: "/dashboard/reports", icon: BarChart2 },
        { name: "Users", href: "/dashboard/users", icon: Users, roles: ['admin', 'superadmin'] },
        { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
    ];

    if (!user) return null; // Or skeleton

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
                onClick={closeSidebar}
            />

            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div style={{ height: "64px", padding: "0 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "32px", height: "32px", background: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                        <Shield size={18} />
                    </div>
                    <span style={{ fontWeight: "700", fontSize: "1.125rem" }}>SteptoStore</span>
                </div>

                <nav style={{ flex: 1, padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {menuItems.map((item) => {
                        if (item.roles && !item.roles.includes(user.role)) return null;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeSidebar} // Close on nav
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.75rem",
                                    padding: "0.75rem 1rem",
                                    borderRadius: "var(--radius)",
                                    color: active ? "var(--primary)" : "var(--muted-foreground)",
                                    background: active ? "rgba(99, 102, 241, 0.1)" : "transparent",
                                    fontWeight: active ? 600 : 500,
                                    textDecoration: "none",
                                    transition: "all 0.2s"
                                }}
                            >
                                <item.icon size={20} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ padding: "1.5rem", borderTop: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontWeight: "600" }}>{user.name.charAt(0)}</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: "0.875rem", fontWeight: "600" }}>{user.name}</span>
                            <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", textTransform: "capitalize" }}>{user.role}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-outline"
                        style={{ width: "100%", justifyContent: "flex-start", gap: "0.75rem", border: "1px solid var(--border)" }}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
