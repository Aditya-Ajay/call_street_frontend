/**
 * Community Chat Page
 * Real-time chat with Socket.io integration
 * URL: /chat/:analystId?
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chatAPI, subscriptionAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import socketService from '../services/socket';
import BottomNav from '../components/common/BottomNav';
import Modal from '../components/common/Modal';
import { formatDistanceToNow } from 'date-fns';

const Chat = () => {
  const { analystId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [showChannelSelector, setShowChannelSelector] = useState(false);
  const [hasAccess, setHasAccess] = useState(true);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (analystId) {
      fetchChannels();
    } else {
      // Show list of subscribed analysts
      navigate('/discovery');
    }

    return () => {
      if (selectedChannel) {
        socketService.leaveChannel(selectedChannel._id);
      }
      socketService.removeAllListeners();
    };
  }, [analystId]);

  useEffect(() => {
    if (selectedChannel) {
      joinChannel(selectedChannel._id);
      fetchMessages(selectedChannel._id);
    }
  }, [selectedChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket event listeners
  useEffect(() => {
    socketService.onMessage(handleNewMessage);
    socketService.onTyping(handleTyping);
    socketService.onOnlineUsers(handleOnlineUsers);
    socketService.onMessageDeleted(handleMessageDeleted);

    return () => {
      socketService.removeAllListeners();
    };
  }, []);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getChannels(analystId);
      const channelList = response.data || [];
      setChannels(channelList);

      if (channelList.length > 0) {
        setSelectedChannel(channelList[0]);
      }
    } catch (error) {
      if (error.status === 403) {
        setHasAccess(false);
        showToast('Subscribe to access chat', 'error');
      } else {
        showToast(error.message || 'Failed to load channels', 'error');
      }
      console.error('Fetch channels error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (channelId) => {
    try {
      const response = await chatAPI.getMessages(channelId, { page: 1, limit: 50 });
      setMessages(response.data || []);
    } catch (error) {
      showToast(error.message || 'Failed to load messages', 'error');
    }
  };

  const joinChannel = (channelId) => {
    if (!socketService.isConnected()) {
      socketService.connect();
    }
    socketService.joinChannel(channelId);
  };

  const handleNewMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleTyping = ({ userId, userName, isTyping }) => {
    if (isTyping) {
      setTypingUsers((prev) => {
        if (!prev.find((u) => u.userId === userId)) {
          return [...prev, { userId, userName }];
        }
        return prev;
      });
    } else {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
    }
  };

  const handleOnlineUsers = ({ count }) => {
    setOnlineCount(count);
  };

  const handleMessageDeleted = ({ messageId }) => {
    setMessages((prev) => prev.filter((m) => m._id !== messageId));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageInput.trim() || !selectedChannel) return;

    if (!hasAccess) {
      showToast('Subscribe to send messages', 'error');
      return;
    }

    try {
      setSending(true);
      await chatAPI.sendMessage(selectedChannel._id, { message: messageInput.trim() });
      setMessageInput('');
      socketService.sendTyping(selectedChannel._id, false);
    } catch (error) {
      showToast(error.message || 'Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    // Send typing indicator
    if (selectedChannel && hasAccess) {
      socketService.sendTyping(selectedChannel._id, true);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        socketService.sendTyping(selectedChannel._id, false);
      }, 2000);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Just now';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Required</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to this analyst to access community chat and exclusive discussions.
          </p>
          <button
            onClick={() => navigate(`/analyst/${analystId}`)}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            View Pricing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Channel Info */}
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors sm:hidden"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => setShowChannelSelector(true)}
                className="flex items-center gap-2 flex-1"
              >
                <div className="flex-1 text-left">
                  <h1 className="text-lg font-bold text-gray-900">
                    {selectedChannel?.channel_name || 'Select Channel'}
                  </h1>
                  <p className="text-xs text-gray-500">
                    {onlineCount} online
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Actions */}
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((message, index) => {
            const isOwnMessage = message.user_id?._id === user?._id;
            const showAvatar = index === 0 || messages[index - 1].user_id?._id !== message.user_id?._id;

            return (
              <div
                key={message._id}
                className={`flex items-end gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                {showAvatar ? (
                  <img
                    src={message.user_id?.profile_photo || '/default-avatar.png'}
                    alt={message.user_id?.name}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 flex-shrink-0" />
                )}

                {/* Message Bubble */}
                <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                  {showAvatar && !isOwnMessage && (
                    <p className="text-xs text-gray-600 mb-1 px-3">
                      {message.user_id?.name}
                    </p>
                  )}
                  <div
                    className={`
                      px-4 py-2 rounded-2xl
                      ${isOwnMessage
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                      }
                    `}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {message.message}
                    </p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 px-3 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                    {formatMessageTime(message.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        )}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 px-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="text-xs text-gray-500">
              {typingUsers.map((u) => u.userName).join(', ')} typing...
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4 pb-safe">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary transition-all">
            <textarea
              value={messageInput}
              onChange={handleInputChange}
              placeholder={hasAccess ? 'Type a message...' : 'Subscribe to send messages'}
              disabled={!hasAccess || sending}
              rows={1}
              className="w-full bg-transparent resize-none outline-none text-gray-900 placeholder-gray-500 max-h-32"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!messageInput.trim() || sending || !hasAccess}
            className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            )}
          </button>
        </form>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Channel Selector Modal */}
      <Modal
        isOpen={showChannelSelector}
        onClose={() => setShowChannelSelector(false)}
        title="Select Channel"
      >
        <div className="space-y-2">
          {channels.map((channel) => (
            <button
              key={channel._id}
              onClick={() => {
                setSelectedChannel(channel);
                setShowChannelSelector(false);
              }}
              className={`
                w-full text-left px-4 py-3 rounded-lg transition-colors
                ${selectedChannel?._id === channel._id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }
              `}
            >
              <h3 className="font-semibold">{channel.channel_name}</h3>
              {channel.description && (
                <p className={`text-sm mt-1 ${selectedChannel?._id === channel._id ? 'text-white/80' : 'text-gray-600'}`}>
                  {channel.description}
                </p>
              )}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Chat;
