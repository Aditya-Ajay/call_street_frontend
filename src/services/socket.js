/**
 * Socket.io Client Service
 * Handles real-time communication for chat
 */

import { io } from 'socket.io-client';
import { SOCKET_URL, STORAGE_KEYS } from '../utils/constants';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  /**
   * Connect to Socket.io server
   */
  connect() {
    // With cookie-based auth, we don't need to pass token explicitly
    // The browser will automatically send the cookie
    this.socket = io(SOCKET_URL, {
      withCredentials: true, // Send cookies with socket connection
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.connected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  /**
   * Disconnect from Socket.io server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  /**
   * Join a chat channel
   * @param {string} channelId - Channel ID to join
   */
  joinChannel(channelId) {
    if (this.socket) {
      this.socket.emit('join_channel', { channelId });
    }
  }

  /**
   * Leave a chat channel
   * @param {string} channelId - Channel ID to leave
   */
  leaveChannel(channelId) {
    if (this.socket) {
      this.socket.emit('leave_channel', { channelId });
    }
  }

  /**
   * Send a chat message
   * @param {string} channelId - Channel ID
   * @param {string} message - Message content
   */
  sendMessage(channelId, message) {
    if (this.socket) {
      this.socket.emit('send_message', {
        channelId,
        message,
      });
    }
  }

  /**
   * Send typing indicator
   * @param {string} channelId - Channel ID
   * @param {boolean} isTyping - Typing status
   */
  sendTyping(channelId, isTyping) {
    if (this.socket) {
      this.socket.emit('typing', {
        channelId,
        isTyping,
      });
    }
  }

  /**
   * Listen for new messages
   * @param {Function} callback - Callback function
   */
  onMessage(callback) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  /**
   * Listen for typing indicators
   * @param {Function} callback - Callback function
   */
  onTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  /**
   * Listen for user online status
   * @param {Function} callback - Callback function
   */
  onOnlineUsers(callback) {
    if (this.socket) {
      this.socket.on('online_users', callback);
    }
  }

  /**
   * Listen for message deleted
   * @param {Function} callback - Callback function
   */
  onMessageDeleted(callback) {
    if (this.socket) {
      this.socket.on('message_deleted', callback);
    }
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  /**
   * Check if socket is connected
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.connected && this.socket?.connected;
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
