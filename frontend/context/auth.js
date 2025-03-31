// context/auth.js
'use client';
import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { apiClient } from '@/utils/api';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();

  const [user, setUser] = useState({
    email:null,
    id:null,
    username:null
  });

  const login = async (googleToken) => { // Parameter matches what GoogleButton passes
    console.log('Google Token:', googleToken);
    try {
      // Send Google token to the correct endpoint
      
      const { data } = await apiClient.post('auth/google/', {
        token: googleToken, // Use the passed googleToken
      });

      // Store JWT tokens from response
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      // Set user data from Django response
      setUser({
        email: data.email,
        id: data.user_id,
        username: data.username,
      });

      // Redirect to profile page
      router.push('/profile'); // Changed from '/' to '/profile' for consistency
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      logout(); // Clear state on failure
    }
  };

  const logout = async () => {
    try {
      // 1. Retrieve tokens before clearing them
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      // 2. Check if tokens exist
      if (!accessToken || !refreshToken) {
        console.warn('No tokens found, proceeding with client-side logout');
      } else {
        // 3. Send logout request to backend with tokens
        await apiClient.post(
          'auth/logout/', // Correct absolute URL
          { refresh: refreshToken }, // Send refresh token in body
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Send access token in header
            },
          }
        );
      }

      // 4. Clear tokens and user state after successful logout
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);

      // 5. Redirect to login page
      router.push('/login'); // Use router.push instead of window.location.href for Next.js
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
      // Proceed with client-side logout even if backend fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      router.push('/login');
    }
  };
  // const logout = () => {

  //   // Clear tokens
  //   localStorage.removeItem('access_token');
  //   localStorage.removeItem('refresh_token');
    
  //   // Clear user state
  //   setUser(null);
    
  //   // Optional: Invalidate tokens on backend
  //   axios.post('/api/auth/logout/', 
  //   {headers: {Authorization: `Bearer ${localStorage.getItem('access_token')}` } 
  //   }).catch(console.error);
    
  //   // // Redirect to login
  //   // window.location.href = '/login';
  // };

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

