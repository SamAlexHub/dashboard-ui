"use client";

import { Users, Package, DollarSign, TrendingUp } from "lucide-react";

export default function DashboardPage() {
    const stats = [
        { title: "Total Users", value: "1,234", change: "+12%", icon: Users, color: "#6366f1" },
        { title: "Total Inventory", value: "456", change: "+5%", icon: Package, color: "#8b5cf6" },
        { title: "Revenue", value: "$12,345", change: "+18%", icon: DollarSign, color: "#10b981" },
        { title: "Growth", value: "+24%", change: "+2%", icon: TrendingUp, color: "#f59e0b" },
    ];

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem" }}>Dashboard</h1>
                <p style={{ color: "var(--muted-foreground)" }}>Overview of your management system.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
                {stats.map((stat, i) => (
                    <div key={i} className="card">
                        <div className="card-content" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <p style={{ fontSize: "0.875rem", fontWeight: "500", color: "var(--muted-foreground)" }}>{stat.title}</p>
                                <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginTop: "0.25rem" }}>{stat.value}</h3>
                                <p style={{ fontSize: "0.75rem", color: "#10b981", marginTop: "0.25rem", display: "flex", alignItems: "center" }}>
                                    <TrendingUp size={12} style={{ marginRight: "4px" }} />
                                    {stat.change} from last month
                                </p>
                            </div>
                            <div style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "12px",
                                background: `${stat.color}20`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: stat.color
                            }}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>Recent Activity</h3>
                </div>
                <div className="card-content">
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Action</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i}>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "600" }}>
                                                    U{i}
                                                </div>
                                                <span style={{ fontWeight: "500" }}>User {i}</span>
                                            </div>
                                        </td>
                                        <td>Update inventory item #{100 + i}</td>
                                        <td style={{ color: "var(--muted-foreground)" }}>Oct 25, 2023</td>
                                        <td>
                                            <span className="badge badge-default" style={{ background: i % 2 === 0 ? "#10b981" : "var(--primary)" }}>
                                                {i % 2 === 0 ? "Completed" : "In Progress"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
