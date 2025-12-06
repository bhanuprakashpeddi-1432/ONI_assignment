import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login({ email, password });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ marginBottom: '0.5rem' }}>📚 Library System</h1>
                    <p className="text-muted">Sign in to your account</p>
                </div>

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="admin@library.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
                    <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Demo Credentials:</p>
                    <p className="text-muted" style={{ marginBottom: '0.25rem' }}>Admin: admin@library.com / admin123</p>
                    <p className="text-muted">User: john@example.com / user123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
