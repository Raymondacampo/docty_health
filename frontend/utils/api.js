// utils/api.js
import axios from 'axios';

export const getProfile = async () => {
  const accessToken = localStorage.getItem('access_token');
  
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/auth/me/', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data.user;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw error;
  }
};