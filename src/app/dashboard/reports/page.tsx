"use client";

import { useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import { Filter, Calendar, FileText, Download } from "lucide-react";

// Mock Data
const MONTHLY_DATA = [
    { name: 'Jan', profit: 4000, loss: 2400 },
    { name: 'Feb', profit: 3000, loss: 1398 },
    { name: 'Mar', profit: 9800, loss: 2000 },
    { name: 'Apr', profit: 2780, loss: 3908 },
    { name: 'May', profit: 1890, loss: 4800 },
    { name: 'Jun', profit: 2390, loss: 3800 },
    { name: 'Jul', profit: 3490, loss: 4300 },
];

const CATEGORY_DATA = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Home', value: 300 },
    { name: 'Books', value: 200 },
];

const CATEGORY_OPTIONS = [
    "All", "Electronics", "Clothing", "Home", "Books"
];

const PRODUCT_OPTIONS = [
    "All", "iPhone 13", "MacBook Pro", "T-Shirt Basic", "Coffee Table"
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ReportsPage() {
    const [reportType, setReportType] = useState('monthly'); // monthly, yearly
    const [selectedMonth, setSelectedMonth] = useState('June');
    const [selectedYear, setSelectedYear] = useState('2025');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [productFilter, setProductFilter] = useState('All');

    return (
        <div className="animate-fade-in reports-layout">

            {/* Left Sidebar Filter Panel */}
            <div className="card reports-sidebar">
                <div className="card-header" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Filter size={18} />
                    <h3 style={{ fontSize: "1rem", fontWeight: "600", margin: 0 }}>Filters</h3>
                </div>
                <div className="card-content" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem", overflowY: "auto" }}>

                    <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--muted-foreground)", marginBottom: "0.5rem" }}>REPORT TYPE</label>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <button
                                className={`btn ${reportType === 'monthly' ? 'btn-primary' : 'btn-outline'}`}
                                style={{ justifyContent: "flex-start", width: "100%" }}
                                onClick={() => setReportType('monthly')}
                            >
                                <FileText size={16} style={{ marginRight: "0.5rem" }} /> Monthly View
                            </button>
                            <button
                                className={`btn ${reportType === 'yearly' ? 'btn-primary' : 'btn-outline'}`}
                                style={{ justifyContent: "flex-start", width: "100%" }}
                                onClick={() => setReportType('yearly')}
                            >
                                <Calendar size={16} style={{ marginRight: "0.5rem" }} /> Financial Year
                            </button>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--muted-foreground)", marginBottom: "0.5rem" }}>TIME PERIOD</label>

                        {reportType === 'monthly' && (
                            <div style={{ marginBottom: "1rem" }}>
                                <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.25rem" }}>Month</label>
                                <select className="input" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                                    <option>January</option>
                                    <option>February</option>
                                    <option>March</option>
                                    <option>April</option>
                                    <option>May</option>
                                    <option>June</option>
                                    <option>July</option>
                                    <option>August</option>
                                    <option>September</option>
                                    <option>October</option>
                                    <option>November</option>
                                    <option>December</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.25rem" }}>Year</label>
                            <select className="input" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                <option>2025</option>
                                <option>2024</option>
                                <option>2023</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--muted-foreground)", marginBottom: "0.5rem" }}>DATA FILTERS</label>

                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.25rem" }}>Category</label>
                            <select className="input" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                                <option value="All">All Categories</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Home">Home</option>
                                <option value="Books">Books</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.25rem" }}>Product</label>
                            <select className="input" value={productFilter} onChange={(e) => setProductFilter(e.target.value)}>
                                <option value="All">All Products</option>
                                <option value="iPhone 13">iPhone 13</option>
                                <option value="MacBook Pro">MacBook Pro</option>
                                <option value="T-Shirt Basic">T-Shirt Basic</option>
                                <option value="Coffee Table">Coffee Table</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
                        <button className="btn btn-outline" style={{ width: "100%", gap: "0.5rem" }}>
                            <Download size={16} /> Export PDF
                        </button>
                    </div>

                </div>
            </div>

            {/* Main Content Area */}
            <div className="reports-content">
                <div style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: "700" }}>{reportType === 'monthly' ? 'Monthly Report' : 'Financial Year Report'}</h1>
                    <p style={{ color: "var(--muted-foreground)" }}>Overview of profit, loss, and expenses.</p>
                </div>

                {/* Summary Cards */}
                <div className="reports-summary-grid">
                    <div className="card" style={{ padding: "1.5rem" }}>
                        <div style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", marginBottom: "0.5rem" }}>Total Profit</div>
                        <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#10b981" }}>$24,500</div>
                    </div>
                    <div className="card" style={{ padding: "1.5rem" }}>
                        <div style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", marginBottom: "0.5rem" }}>Total Loss</div>
                        <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#ef4444" }}>$4,200</div>
                    </div>
                    <div className="card" style={{ padding: "1.5rem" }}>
                        <div style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", marginBottom: "0.5rem" }}>Net Revenue</div>
                        <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--primary)" }}>$20,300</div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="reports-charts-grid">

                    {/* Bar Chart: Profit vs Loss */}
                    <div className="card">
                        <div className="card-header">
                            <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>Profit & Loss Sessions</h3>
                        </div>
                        <div className="card-content" style={{ height: "300px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={MONTHLY_DATA}
                                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="Profit" />
                                    <Bar dataKey="loss" fill="#ef4444" radius={[4, 4, 0, 0]} name="Loss" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart: Categories or distribution */}
                    <div className="card">
                        <div className="card-header">
                            <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>Category Sales</h3>
                        </div>
                        <div className="card-content" style={{ height: "300px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={CATEGORY_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {CATEGORY_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
