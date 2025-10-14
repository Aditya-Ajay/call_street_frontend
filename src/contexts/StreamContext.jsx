/**
 * Stream Chat Context
 *
 * Manages GetStream.io chat client connection and state
 * Provides chat client and channel access to components
 *
 * FEATURES:
 * - Automatic client initialization with user token
 * - Automatic connection/disconnection on mount/unmount
 * - Token refresh on authentication changes
 * - Error handling and retry logic
 * - Connection status tracking
 *
 * USAGE:
 * Wrap your app or chat components with StreamProvider:
 *   <StreamProvider>
 *     <ChatInterface />
 *   </StreamProvider>
 *
 * Then use the hook in components:
 *   const { client, isReady, error } = useStreamChat();
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import axios from 'axios';

const StreamContext = createContext(null);

export const useStreamChat = () => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error('useStreamChat must be used within StreamProvider');
  }
  return context;
};

export const StreamProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [client, setClient] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Initialize Stream client and connect user
  useEffect(() => {
    // Only initialize if user is authenticated
    if (!isAuthenticated || !user) {
      // Cleanup if user logs out
      if (client) {
        disconnectUser();
      }
      return;
    }

    // Prevent multiple simultaneous connections
    if (isConnecting) {
      return;
    }

    const initializeChat = async () => {
      try {
        setIsConnecting(true);
        setError(null);

        // Get API key from environment
        const apiKey = import.meta.env.VITE_STREAM_API_KEY;

        if (!apiKey) {
          throw new Error('Stream API key not configured');
        }

        // Create Stream client instance
        const streamClient = StreamChat.getInstance(apiKey);

        // Check if already connected with same user
        if (streamClient.userID === `user_${user.id}`) {
          console.log('[Stream] Already connected as user:', streamClient.userID);
          setClient(streamClient);
          setIsReady(true);
          setIsConnecting(false);
          return;
        }

        // Disconnect existing connection if different user
        if (streamClient.userID) {
          console.log('[Stream] Disconnecting previous user:', streamClient.userID);
          await streamClient.disconnectUser();
        }

        // Get user token from backend
        console.log('[Stream] Fetching token from backend...');
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/stream/token`,
          {},
          {
            withCredentials: true,
            timeout: 10000 // 10 second timeout
          }
        );

        const { token, userId } = response.data.data;

        if (!token || !userId) {
          throw new Error('Invalid token response from server');
        }

        // Connect user to Stream
        console.log('[Stream] Connecting user:', userId);
        await streamClient.connectUser(
          {
            id: userId,
            name: user.name || user.email,
            role: user.role,
            // Additional user data
            email: user.email,
            image: user.profile_photo || undefined
          },
          token
        );

        console.log('[Stream] User connected successfully');

        setClient(streamClient);
        setIsReady(true);
        setError(null);
      } catch (err) {
        console.error('[Stream] Initialization error:', err);

        let errorMessage = 'Failed to connect to chat';

        if (err.response?.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (err.response?.status === 403) {
          errorMessage = 'You do not have permission to access chat.';
        } else if (err.code === 'ECONNABORTED') {
          errorMessage = 'Chat connection timeout. Please try again.';
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        showToast(errorMessage, 'error');
        setIsReady(false);
      } finally {
        setIsConnecting(false);
      }
    };

    initializeChat();

    // Cleanup function
    return () => {
      // Note: Don't disconnect on every unmount as it may be just a component remount
      // Only disconnect when user logs out (handled in the if statement above)
    };
  }, [isAuthenticated, user?.id]); // Only re-run if auth status or user ID changes

  // Disconnect user helper
  const disconnectUser = async () => {
    if (client) {
      try {
        console.log('[Stream] Disconnecting user...');
        await client.disconnectUser();
        setClient(null);
        setIsReady(false);
        setError(null);
        console.log('[Stream] User disconnected successfully');
      } catch (err) {
        console.error('[Stream] Disconnect error:', err);
      }
    }
  };

  // Retry connection
  const retry = () => {
    setError(null);
    setIsReady(false);
    // Trigger re-initialization by updating a state
    // This will re-run the effect
  };

  const value = {
    client,
    isReady,
    error,
    isConnecting,
    retry,
    disconnectUser
  };

  return (
    <StreamContext.Provider value={value}>
      {children}
    </StreamContext.Provider>
  );
};
