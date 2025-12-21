import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { statsApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
    summary: {
        totalBooks: number;
        availableBooks: number;
        borrowedBooks: number;
        totalAuthors: number;
        totalUsers: number;
        activeBorrows: number;
        overdueCount: number;
    };
    recentActivity: Array<{
        id: string;
        borrowedAt: string;
        dueDate: string;
        book: {
            id: string;
            title: string;
            isbn: string;
        };
        user: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    overdueBooks: Array<{
        id: string;
        dueDate: string;
        book: {
            id: string;
            title: string;
        };
        user: {
            id: string;
            name: string;
            email: string;
        };
    }>;
}

const Home: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
        // Auto-refresh every 30 seconds for real-time feel
        const interval = setInterval(loadStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadStats = async () => {
        try {
            const res = await statsApi.getDashboard();
            setStats(res.data);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, color, subtitle }: { title: string; value: number; icon: string; color: string; subtitle?: string }) => (
        <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p className="stat-title">{title}</p>
                    <h2 className="stat-value" style={{ color }}>{value}</h2>
                    {subtitle && <p className="stat-subtitle">{subtitle}</p>}
                </div>
                <div className="stat-icon" style={{ background: color }}>{icon}</div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="loading"><div className="spinner"></div></div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            {/* Modern Header */}
            <header className="dashboard-header">
                <div className="container" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1 style={{ margin: 0, color: 'white', fontSize: '1.75rem', fontWeight: '700' }}>
                            📚 Library Dashboard
                        </h1>
                        <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                            Welcome back, {user?.name}!
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onClick={() => navigate('/manage')} className="btn btn-light">
                            📖 Manage Library
                        </button>
                        <button onClick={logout} className="btn btn-outline-light">Logout</button>
                    </div>
                </div>
            </header>

            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
                {/* Stats Grid */}
                <div className="stats-grid">
                    <StatCard
                        title="Total Books"
                        value={stats?.summary.totalBooks || 0}
                        icon="📚"
                        color="#3b82f6"
                        subtitle="In library collection"
                    />
                    <StatCard
                        title="Available"
                        value={stats?.summary.availableBooks || 0}
                        icon="✅"
                        color="#10b981"
                        subtitle="Ready to borrow"
                    />
                    <StatCard
                        title="Borrowed"
                        value={stats?.summary.borrowedBooks || 0}
                        icon="📖"
                        color="#f59e0b"
                        subtitle="Currently checked out"
                    />
                    <StatCard
                        title="Authors"
                        value={stats?.summary.totalAuthors || 0}
                        icon="✍️"
                        color="#8b5cf6"
                        subtitle="In collection"
                    />
                    <StatCard
                        title="Active Borrows"
                        value={stats?.summary.activeBorrows || 0}
                        icon="🔄"
                        color="#06b6d4"
                        subtitle="Not yet returned"
                    />
                    <StatCard
                        title="Overdue"
                        value={stats?.summary.overdueCount || 0}
                        icon="⚠️"
                        color="#ef4444"
                        subtitle="Past due date"
                    />
                </div>

                {/* Recent Activity Section */}
                <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem' }}>
                    {/* Recent Borrows */}
                    <div className="activity-card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>📋 Recent Activity</h3>
                            <span className="badge badge-info">{stats?.recentActivity.length || 0} records</span>
                        </div>
                        <div className="activity-list">
                            {stats?.recentActivity.slice(0, 5).map((activity) => (
                                <div key={activity.id} className="activity-item">
                                    <div className="activity-icon">📖</div>
                                    <div style={{ flex: 1 }}>
                                        <p className="activity-book">{activity.book.title}</p>
                                        <p className="activity-user">Borrowed by {activity.user.name}</p>
                                        <p className="activity-date">{new Date(activity.borrowedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                            {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
                                <p className="text-muted text-center">No recent activity</p>
                            )}
                        </div>
                    </div>

                    {/* Overdue Books */}
                    <div className="activity-card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>⚠️ Overdue Books</h3>
                            <span className={`badge ${stats?.overdueBooks.length ? 'badge-danger' : 'badge-success'}`}>
                                {stats?.overdueBooks.length || 0}
                            </span>
                        </div>
                        <div className="activity-list">
                            {stats?.overdueBooks.slice(0, 5).map((overdue) => (
                                <div key={overdue.id} className="activity-item overdue-item">
                                    <div className="activity-icon">⚠️</div>
                                    <div style={{ flex: 1 }}>
                                        <p className="activity-book">{overdue.book.title}</p>
                                        <p className="activity-user">{overdue.user.name}</p>
                                        <p className="activity-date" style={{ color: 'var(--error)' }}>
                                            Due: {new Date(overdue.dueDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {(!stats?.overdueBooks || stats.overdueBooks.length === 0) && (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</p>
                                    <p className="text-success" style={{ fontWeight: '500' }}>All books returned on time!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600', color: 'white' }}>⚡ Quick Actions</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <button className="quick-action-btn" onClick={() => navigate('/manage')}>
                            <span style={{ fontSize: '1.5rem' }}>📚</span>
                            <span>View All Books</span>
                        </button>
                        <button className="quick-action-btn" onClick={() => navigate('/manage')}>
                            <span style={{ fontSize: '1.5rem' }}>✍️</span>
                            <span>Manage Authors</span>
                        </button>
                        <button className="quick-action-btn" onClick={() => navigate('/manage')}>
                            <span style={{ fontSize: '1.5rem' }}>👥</span>
                            <span>View Users</span>
                        </button>
                        <button className="quick-action-btn" onClick={() => navigate('/manage')}>
                            <span style={{ fontSize: '1.5rem' }}>📋</span>
                            <span>Borrowed Books</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
