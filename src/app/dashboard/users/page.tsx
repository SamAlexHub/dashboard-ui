"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, X, ShieldAlert } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { User, UserRole } from "@/lib/auth";

export default function UsersPage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Initial Check
    useEffect(() => {
        const userCookie = Cookies.get("currentUser");
        if (userCookie) {
            const user = JSON.parse(userCookie);
            setCurrentUser(user);
            if (user.role === 'user') {
                router.push("/dashboard");
            }
        } else {
            router.push("/login");
        }
    }, [router]);

    // Mock Users
    const [users, setUsers] = useState<User[]>([
        { id: '1', name: 'Super Admin', email: 'super@example.com', role: 'superadmin' },
        { id: '2', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
        { id: '3', name: 'Regular User', email: 'user@example.com', role: 'user' },
        { id: '4', name: 'John Doe', email: 'john@example.com', role: 'user' },
        { id: '5', name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<Partial<User>>({});

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData(user);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this user?")) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } as User : u));
        } else {
            const newUser: User = {
                ...formData as User,
                id: (users.length + 1).toString()
            };
            setUsers([...users, newUser]);
        }
        closeModal();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({});
    };

    if (!currentUser || currentUser.role === 'user') return null;

    return (
        <div className="animate-fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem" }}>User Management</h1>
                    <p style={{ color: "var(--muted-foreground)" }}>Manage access and privileges.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                    <Plus size={18} style={{ marginRight: "0.5rem" }} />
                    Add User
                </button>
            </div>

            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600" }}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <span style={{ fontWeight: "500" }}>{user.name}</span>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className="badge" style={{
                                            backgroundColor: user.role === 'superadmin' ? '#7e22ce' : user.role === 'admin' ? '#4338ca' : '#e5e7eb',
                                            color: user.role === 'superadmin' ? 'white' : user.role === 'admin' ? 'white' : 'black',
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <button onClick={() => handleEdit(user)} className="btn btn-outline" style={{ padding: "0.25rem 0.5rem", height: "auto" }}>
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(user.id)} className="btn btn-destructive" style={{ padding: "0.25rem 0.5rem", height: "auto" }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50
                }}>
                    <div className="card" style={{ width: "100%", maxWidth: "500px", animation: "fadeIn 0.2s ease-out" }}>
                        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ fontSize: "1.25rem", fontWeight: "600" }}>{editingUser ? "Edit User" : "Add User"}</h3>
                            <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="card-content">
                            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500" }}>Full Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.name || ""}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500" }}>Email</label>
                                    <input
                                        type="email"
                                        className="input"
                                        value={formData.email || ""}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500" }}>Role</label>
                                    <select
                                        className="input"
                                        value={formData.role || "user"}
                                        onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                                        required
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                        <option value="superadmin">Super Admin</option>
                                    </select>
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
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
