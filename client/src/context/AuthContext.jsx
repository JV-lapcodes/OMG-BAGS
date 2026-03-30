import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                const parsed = JSON.parse(userInfo);
                try {
                    const { data } = await axios.get('/api/users/profile', {
                        headers: { Authorization: `Bearer ${parsed.token}` }
                    });
                    const updatedUser = { ...data, token: parsed.token };
                    setUser(updatedUser);
                    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                } catch (error) {
                    setUser(null);
                    localStorage.removeItem('userInfo');
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post('/api/users/login', { email, password });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const signup = async (name, email, password) => {
        const { data } = await axios.post('/api/users/signup', { name, email, password });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
