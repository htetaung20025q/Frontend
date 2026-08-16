import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-final-3ouo.onrender.com';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // ဤနေရာတွင် login function ကို အပြည့်အစုံ ပြန်ထည့်ပေးထားပါသည်
  const login = async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: email, 
        email: email,
        password: password
    });
    // အကယ်၍ backend က token ပြန်ပေးလျှင် အောက်ပါအတိုင်း သိမ်းနိုင်ပါသည်
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    setToken(access_token);
  };

  const register = async (username, email, password) => {
    // ဤနေရာတွင် API_BASE_URL ကို အစားထိုးလိုက်ပါသည်
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username,
      email,
      password
    });
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    setToken(access_token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
