import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      loadUserProfile();
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await authAPI.getProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await authAPI.login(credentials);
      
      if (data.token) {
        setSuccess('Login successful!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data._id);
        setIsLoggedIn(true);
        await loadUserProfile();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await authAPI.register(userData);
      
      if (data.token) {
        setSuccess('Registration successful! You are now logged in.');
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data._id);
        setIsLoggedIn(true);
        await loadUserProfile();
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserProfile(null);
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return {
    isLoggedIn,
    loading,
    error,
    success,
    userProfile,
    login,
    register,
    logout,
    clearMessages,
    loadUserProfile,
    setError, // <-- Added to fix runtime error
    setSuccess // <-- Added to fix runtime error
  };
}; 