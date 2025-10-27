/**
 * Authentication Context
 * Manages user authentication state and provides login/logout functions
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { STORAGE_KEYS } from '../utils/constants';
import socketService from '../services/socket';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check authentication status
   */
  const checkAuth = async () => {
    try {
      // Try to fetch current user (cookies are sent automatically)
      const response = await authAPI.getCurrentUser();
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);

        // Connect to socket (non-blocking)
        try {
          socketService.connect();
        } catch (socketError) {
          console.error('Socket connection failed:', socketError);
          // Don't fail auth check if socket fails
        }
      }
    } catch (error) {
      // User is not authenticated or session expired
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Request OTP for login
   * @param {string} identifier - Phone or email
   * @param {string} type - 'phone' or 'email'
   * @param {string} userType - 'trader' or 'analyst'
   * @param {string} sebiNumber - SEBI registration number (for analysts only)
   */
  const requestOTP = async (identifier, type, userType = 'trader', sebiNumber = null) => {
    try {
      let formattedIdentifier = identifier;

      // Format phone number with +91 prefix if needed
      if (type === 'phone') {
        // Remove any non-digit characters
        const digitsOnly = identifier.replace(/\D/g, '');

        // Add +91 prefix if not present
        if (digitsOnly.length === 10) {
          formattedIdentifier = `+91${digitsOnly}`;
        } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
          formattedIdentifier = `+${digitsOnly}`;
        } else if (!identifier.startsWith('+91')) {
          formattedIdentifier = `+91${digitsOnly}`;
        } else {
          formattedIdentifier = identifier;
        }
      }

      const response = await authAPI.requestOTP(formattedIdentifier, userType, sebiNumber);
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Verify OTP and login
   * @param {string} identifier - Phone or email
   * @param {string} otp - OTP code
   * @param {string} type - 'phone' or 'email'
   * @param {string} userType - 'trader' or 'analyst' (for new signups)
   */
  const verifyOTP = async (identifier, otp, type, userType = null) => {
    try {
      let formattedIdentifier = identifier;

      // Format phone number with +91 prefix if needed
      if (type === 'phone') {
        const digitsOnly = identifier.replace(/\D/g, '');
        if (digitsOnly.length === 10) {
          formattedIdentifier = `+91${digitsOnly}`;
        } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
          formattedIdentifier = `+${digitsOnly}`;
        } else if (!identifier.startsWith('+91')) {
          formattedIdentifier = `+91${digitsOnly}`;
        } else {
          formattedIdentifier = identifier;
        }
      }

      const response = await authAPI.verifyOTP(
        type === 'phone' ? formattedIdentifier : null,
        type === 'email' ? formattedIdentifier : null,
        otp,
        userType
      );

      if (response.success) {
        const { user: userData, tokens } = response.data;

        // Debug: Log user data to see what we're getting
        console.log('✅ Login successful! User data:', userData);
        console.log('👤 User type:', userData.user_type);
        console.log('📋 Profile completed:', userData.profile_completed);
        console.log('🔑 Tokens received:', tokens ? 'Yes' : 'No');

        // Validate user_type
        if (!userData.user_type || (userData.user_type !== 'trader' && userData.user_type !== 'analyst')) {
          console.error('⚠️ Invalid or missing user_type in response:', userData.user_type);
          throw new Error('Invalid user type received from server');
        }

        // Store tokens in localStorage (fallback for when cookies don't work)
        if (tokens) {
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
          console.log('💾 Tokens stored in localStorage');
        }

        // Update state
        setUser(userData);
        setIsAuthenticated(true);

        // Connect to socket (non-blocking)
        try {
          socketService.connect();
        } catch (socketError) {
          console.error('Socket connection failed:', socketError);
          // Don't fail login if socket fails
        }

        return response;
      }
    } catch (error) {
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear all auth data from localStorage
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

      // Disconnect socket
      socketService.disconnect();

      // Update state
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Update user data in state
   * @param {object} userData - Updated user data
   */
  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    requestOTP,
    verifyOTP,
    logout,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
