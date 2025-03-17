// context/auth.js
'use client';
import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();

  const [user, setUser] = useState({
    email:null,
    id:null,
    username:null
  });

  const login = async () => {
    try {
      // 1. Send Google token to your Django endpoint
      const { data } = await axios.post('https://juanpabloduarte.com/api/auth/login/', {
        token: googleToken
      });
  
      // 2. Store JWT tokens from response
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
  
      // 3. Set user data from Django response
      setUser({
        email: data.email,
        id: data.user_id,
        username: data.username
      });
      router.push('/')
  
    } catch (error) {
      console.error('Login failed:', error);
      logout();
    }


  };

  const logout = () => {

    // Clear tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Clear user state
    setUser(null);
    
    // Optional: Invalidate tokens on backend
    axios.post('/api/auth/logout/', {refresh: localStorage.getItem('access_token')}).catch(console.error);
    
    // // Redirect to login
    // window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
  };

