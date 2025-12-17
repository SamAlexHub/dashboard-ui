"use client";

import { useState, useEffect } from "react";
import {
    Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, X,
    Filter, Download, Package, AlertTriangle, CheckCircle, Smartphone, Shirt, Home as HomeIcon
} from "lucide-react";

interface InventoryItem {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Lower count for better card fitting
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<InventoryItem>>({});

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/inventory');
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            } else {
                console.error("Failed to fetch inventory");
            }
        } catch (error) {
            console.error("Error fetching inventory:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filtering logic
    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
        const matchesStatus = statusFilter === "All" || item.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    // Stats
    const totalProducts = items.length;
    const lowStock = items.filter(i => i.status === 'Low Stock').length;
    const outOfStock = items.filter(i => i.status === 'Out of Stock').length;
    const totalValue = items.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);

    const handleEdit = (item: InventoryItem) => {
        setEditingItem(item);
        setFormData(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this item?")) {
            try {
                const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    setItems(items.filter(item => item.id !== id));
                } else {
                    alert("Failed to delete item");
                }
            } catch (e) {
                console.error(e);
                alert("Error deleting item");
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                // Update
                const res = await fetch(`/api/inventory/${editingItem.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (res.ok) {
                    const updatedItem = await res.json();
                    setItems(items.map(item => item.id === editingItem.id ? updatedItem : item));
                }
            } else {
                // Create
                const res = await fetch('/api/inventory', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (res.ok) {
                    const newItem = await res.json();
                    setItems([newItem, ...items]);
                }
            }
            closeModal();
        } catch (e) {
            console.error(e);
            alert("Failed to save product");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({});
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Electronics': return <Smartphone size={16} />;
            case 'Clothing': return <Shirt size={16} />;
            case 'Home': return <HomeIcon size={16} />;
            default: return <Package size={16} />;
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem" }}>Inventory</h1>
                    <p style={{ color: "var(--muted-foreground)" }}>Manage your products and stock.</p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="btn btn-outline">
                        <Download size={18} style={{ marginRight: "0.5rem" }} />
                        Export
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                        <Plus size={18} style={{ marginRight: "0.5rem" }} />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                <StatsCard title="Total Products" value={totalProducts.toString()} icon={Package} color="var(--primary)" />
                <StatsCard title="Total Value" value={`$${totalValue.toLocaleString('en-US')}`} icon={Search} color="#10b981" />
                <StatsCard title="Low Stock" value={lowStock.toString()} icon={AlertTriangle} color="#f59e0b" />
                <StatsCard title="Out of Stock" value={outOfStock.toString()} icon={X} color="#ef4444" />
            </div>

            <div className="card" style={{ marginBottom: "2rem" }}>
                {/* Toolbar */}
                <div className="card-header" style={{ padding: "1rem 1.5rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", flex: 1, gap: "1rem", minWidth: "300px" }}>
                        <div style={{ position: "relative", flex: 1 }}>
                            <Search size={18} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="input"
                                style={{ paddingLeft: "36px" }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div style={{ position: "relative", width: "150px" }}>
                            <select
                                className="input"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                style={{ appearance: "none", cursor: "pointer" }}
                            >
                                <option value="All">All Categories</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Home">Home</option>
                            </select>
                            <Filter size={14} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--muted-foreground)" }} />
                        </div>
                        <div style={{ position: "relative", width: "150px" }}>
                            <select
                                className="input"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{ appearance: "none", cursor: "pointer" }}
                            >
                                <option value="All">All Status</option>
                                <option value="In Stock">In Stock</option>
                                <option value="Low Stock">Low Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                            </select>
                            <Filter size={14} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--muted-foreground)" }} />
                        </div>
                    </div>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: "80px" }}>ID</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item) => (
                                    <tr key={item.id}>
                                        <td style={{ color: "var(--muted-foreground)" }}>#{item.id}</td>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <div style={{
                                                    width: "40px", height: "40px", borderRadius: "8px",
                                                    background: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center",
                                                    color: "var(--muted-foreground)"
                                                }}>
                                                    {getCategoryIcon(item.category)}
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                    <span style={{ fontWeight: "600" }}>{item.name}</span>
                                                    <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>SKU-{(item.id + 1000).toString()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{
                                                display: "inline-flex", alignItems: "center", gap: "0.25rem",
                                                background: "var(--accent)", padding: "0.125rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "500"
                                            }}>
                                                {item.category}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: "600" }}>${item.price.toLocaleString('en-US')}</td>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                <div style={{ width: "60px", height: "4px", background: "var(--secondary)", borderRadius: "2px", overflow: "hidden" }}>
                                                    <div style={{
                                                        width: `${Math.min(item.stock, 100)}%`, height: "100%",
                                                        background: item.stock < 10 ? "#ef4444" : "var(--primary)"
                                                    }} />
                                                </div>
                                                <span style={{ fontSize: "0.875rem" }}>{item.stock}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                                                <button onClick={() => handleEdit(item)} className="btn btn-outline" style={{ width: "32px", height: "32px", padding: 0 }} title="Edit">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="btn btn-outline" style={{ width: "32px", height: "32px", padding: 0, color: "var(--destructive)", borderColor: "var(--destructive)" }} title="Delete">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: "center", padding: "4rem 2rem" }}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", color: "var(--muted-foreground)" }}>
                                            <Package size={48} style={{ opacity: 0.2 }} />
                                            <p>No products found matching your filters.</p>
                                            <button className="btn btn-outline" onClick={() => { setSearchTerm(""); setCategoryFilter("All"); setStatusFilter("All"); }}>
                                                Clear Filters
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} entries
                    </span>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                            className="btn btn-outline"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            style={{ padding: "0.5rem" }}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {/* Page Numbers Mock */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0 0.5rem" }}>
                            <span style={{ fontSize: "0.875rem", fontWeight: "600" }}>{currentPage}</span>
                            <span style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>/ {totalPages || 1}</span>
                        </div>
                        <button
                            className="btn btn-outline"
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            style={{ padding: "0.5rem" }}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
                    backdropFilter: "blur(4px)"
                }} onClick={closeModal}>
                    <div className="card" style={{ width: "100%", maxWidth: "500px", animation: "fadeIn 0.2s ease-out" }} onClick={e => e.stopPropagation()}>
                        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ fontSize: "1.25rem", fontWeight: "600" }}>{editingItem ? "Edit Product" : "Add Product"}</h3>
                            <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="card-content">
                            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500" }}>Product Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.name || ""}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="e.g. Wireless Headset"
                                    />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500" }}>Category</label>
                                        <select
                                            className="input"
                                            value={formData.category || ""}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            required
                                        >
                                            <option value="">Select...</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Clothing">Clothing</option>
                                            <option value="Home">Home</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500" }}>Price ($)</label>
                                        <input
                                            type="number"
                                            className="input"
                                            value={formData.price || ""}
                                            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                            required
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500" }}>Stock Quantity</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={formData.stock || ""}
                                        onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                                        required
                                        min="0"
                                    />
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                                    <button type="button" onClick={closeModal} className="btn btn-secondary">Cancel</button>
                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
    return (
        <div className="card" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
                width: "48px", height: "48px", borderRadius: "12px",
                background: `color-mix(in srgb, ${color} 15%, transparent)`,
                color: color,
                display: "flex", alignItems: "center", justifyContent: "center"
            }}>
                <Icon size={24} />
            </div>
            <div>
                <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", fontWeight: "500" }}>{title}</p>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "700", lineHeight: 1 }}>{value}</h3>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const getStyles = () => {
        switch (status) {
            case 'In Stock': return {
                bg: '#dcfce7', color: '#166534', icon: CheckCircle
            };
            case 'Low Stock': return {
                bg: '#fef9c3', color: '#854d0e', icon: AlertTriangle
            };
            case 'Out of Stock': return {
                bg: '#fee2e2', color: '#991b1b', icon: X
            };
            default: return {
                bg: 'var(--secondary)', color: 'var(--foreground)', icon: Package
            };
        }
    }
    const style = getStyles();
    const Icon = style.icon;

    return (
        <span className="badge" style={{
            backgroundColor: style.bg,
            color: style.color,
            border: 'none',
            display: "inline-flex",
            gap: "0.25rem",
            padding: "0.25rem 0.5rem"
        }}>
            <Icon size={12} />
            {status}
        </span>
    );
}
