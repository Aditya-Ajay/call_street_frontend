/**
 * Community Chat Page
 * Global chat channels for all traders to interact
 * URL: /community
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import socketService from '../services/socket';
import TraderHeader from '../components/common/TraderHeader';
import BottomNav from '../components/common/BottomNav';
import { formatDistanceToNow } from 'date-fns';

const CommunityChat = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to Socket.io server
    if (!socketService.isConnected()) {
      socketService.connect();
    }

    fetchCommunityChannels();

    return () => {
      if (selectedChannel) {
        socketService.leaveChannel(selectedChannel.id);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      joinChannel(selectedChannel.id);
      fetchMessages(selectedChannel.id);
    }
  }, [selectedChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket event listeners
  useEffect(() => {
    socketService.onMessage(handleNewMessage);
    socketService.onOnlineUsers(handleOnlineUsers);

    // Listen for successful channel join with message history
    if (socketService.socket) {
      socketService.socket.on('channel_joined', (data) => {
        console.log('Channel joined successfully:', data);
        if (data.messages) {
          setMessages(data.messages);
        }
        if (data.online_count) {
          setOnlineCount(data.online_count);
        }
      });
    }

    return () => {
      socketService.removeAllListeners();
    };
  }, []);

  const fetchCommunityChannels = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getCommunityChannels();
      const channelList = response.data.channels || [];
      setChannels(channelList);

      if (channelList.length > 0) {
        setSelectedChannel(channelList[0]);
      }
    } catch (error) {
      console.error('Fetch channels error:', error);
      toast.error(error.message || 'Failed to load community channels');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (channelId) => {
    try {
      const response = await chatAPI.getCommunityMessages(channelId, { limit: 50 });
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Fetch messages error:', error);
      toast.error('Failed to load messages');
    }
  };

  const joinChannel = (channelId) => {
    socketService.joinChannel(channelId, user?.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageInput.trim() || !selectedChannel) return;

    try {
      setSending(true);

      // Send message via Socket.io
      socketService.sendMessage(selectedChannel.id, messageInput.trim());

      setMessageInput('');
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleNewMessage = (message) => {
    if (message.channel_id === selectedChannel?.id) {
      setMessages((prev) => [...prev, message]);
    }
  };

  const handleOnlineUsers = (data) => {
    setOnlineCount(data.count || 0);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TraderHeader />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TraderHeader />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Left Sidebar - Channels List */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-30
            w-72 bg-white border-r border-gray-200
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            overflow-y-auto
          `}
          style={{ top: '64px' }}
        >
          <div className="p-4">
            {/* Sidebar Header */}
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Community Chat</h2>
              <p className="text-xs text-gray-600">Connect with fellow traders</p>
            </div>

            {/* Channels List */}
            <div className="space-y-1">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => {
                    setSelectedChannel(channel);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    selectedChannel?.id === channel.id
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="text-xl">{channel.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{channel.channel_name}</div>
                    {channel.total_messages > 0 && (
                      <div className="text-xs text-gray-500">{channel.total_messages} messages</div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Info Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-sm font-semibold text-blue-900 mb-1">Community Guidelines</h3>
                    <p className="text-xs text-blue-700">
                      Be respectful, share knowledge, and help fellow traders grow!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Channel Header */}
          {selectedChannel && (
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <span className="text-xl">{selectedChannel.icon}</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedChannel.channel_name}</h2>
                  <p className="text-xs text-gray-600">{selectedChannel.channel_description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 rounded-full">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-green-700">{onlineCount} online</span>
                </div>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
            {!selectedChannel ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a channel</h3>
                  <p className="text-gray-600">Choose a channel from the sidebar to start chatting</p>
                </div>
              </div>
            ) : messages.length > 0 ? (
              messages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <img
                    src={message.user_photo || '/default-avatar.png'}
                    alt={message.user_name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{message.user_name}</span>
                      <span className="text-xs text-gray-500">
                        {message.created_at && formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                  <p className="text-gray-600">Be the first to start the conversation!</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          {selectedChannel && (
            <div className="bg-white border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Message ${selectedChannel.channel_name}...`}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={sending || selectedChannel.is_read_only}
                />
                <button
                  type="submit"
                  disabled={sending || !messageInput.trim() || selectedChannel.is_read_only}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sending ? (
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    'Send'
                  )}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav />
    </div>
  );
};

export default CommunityChat;
