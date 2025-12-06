import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types';
import api from '../lib/axios';

interface AuthContextType {
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        const { user, access_token } = response.data;

        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    };

    const register = async (data: RegisterData) => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        const { user, access_token } = response.data;

        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                isAuthenticated: !!user,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
