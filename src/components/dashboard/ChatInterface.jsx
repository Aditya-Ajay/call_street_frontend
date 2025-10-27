/**
 * Chat Interface Component
 * Real-time chat interface using GetStream.io for paid community channel
 *
 * FEATURES:
 * - Real-time messaging with Stream Chat
 * - Typing indicators
 * - Read receipts
 * - Online presence
 * - Member list
 * - Message reactions (optional)
 * - File/image sharing (optional)
 *
 * USAGE:
 * <ChatInterface channelId="analyst-123-community" />
 */

import { useState, useEffect } from 'react';
import { useStreamChat } from '../../contexts/StreamContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  ChannelList,
  LoadingIndicator
} from 'stream-chat-react';

// Import Stream Chat React CSS
import 'stream-chat-react/dist/css/v2/index.css';

const ChatInterface = ({ channelId }) => {
  const { client, isReady, error: streamError, retry } = useStreamChat();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFallback, setShowFallback] = useState(false);

  // Demo chat fallback function
  const renderDemoChat = () => {
    const demoMessages = [
      { id: 1, user: 'Analyst', message: 'Welcome to the community chat! 👋', time: '10:30 AM' },
      { id: 2, user: 'Trader1', message: 'Thanks for the latest call on RELIANCE!', time: '10:32 AM' },
      { id: 3, user: 'Analyst', message: 'You\'re welcome! Let me know if you have any questions.', time: '10:35 AM' },
      { id: 4, user: 'Trader2', message: 'What\'s your view on Nifty for tomorrow?', time: '10:40 AM' },
      { id: 5, user: 'Analyst', message: 'I\'ll post an analysis in the calls channel shortly.', time: '10:42 AM' },
    ];

    return (
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="font-semibold text-gray-900">Community Chat</h3>
            <p className="text-sm text-gray-500">Demo Mode - GetStream.io connecting...</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-primary hover:text-primary-dark"
          >
            Retry Connection
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {demoMessages.map((msg) => (
            <div key={msg.id} className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                {msg.user[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline space-x-2">
                  <span className="font-semibold text-gray-900">{msg.user}</span>
                  <span className="text-xs text-gray-400">{msg.time}</span>
                </div>
                <p className="text-gray-700 mt-1">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Type a message... (Demo mode)"
              disabled
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
            />
            <button
              disabled
              className="px-6 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Chat is in demo mode. GetStream.io connection will retry automatically.
          </p>
        </div>
      </div>
    );
  };

  // Initialize channel when client is ready
  useEffect(() => {
    if (!isReady || !client || !channelId) {
      setLoading(!isReady);
      return;
    }

    const initializeChannel = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('[Chat] Initializing channel:', channelId);

        // Get channel instance
        const streamChannel = client.channel('messaging', channelId);

        // Watch channel for updates
        await streamChannel.watch();

        console.log('[Chat] Channel initialized successfully');

        setChannel(streamChannel);
        setError(null);
      } catch (err) {
        console.error('[Chat] Channel initialization error:', err);

        let errorMessage = 'Failed to load chat channel';

        if (err.message.includes('not found')) {
          errorMessage = 'Chat channel not found. Please contact the analyst.';
        } else if (err.message.includes('permission')) {
          errorMessage = 'You do not have permission to access this channel.';
        } else if (err.message.includes('subscription')) {
          errorMessage = 'Active subscription required to access this channel.';
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    };

    initializeChannel();

    // Cleanup: Stop watching channel
    return () => {
      if (channel) {
        channel.stopWatching().catch(err => {
          console.error('[Chat] Error stopping channel watch:', err);
        });
      }
    };
  }, [isReady, client, channelId]);

  // Handle Stream context errors
  useEffect(() => {
    if (streamError) {
      setError(streamError);
    }
  }, [streamError]);

  // Loading state - add timeout fallback
  if (loading || !isReady) {
    // Show fallback demo chat after 3 seconds
    const [showFallback, setShowFallback] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowFallback(true);
      }, 3000);

      return () => clearTimeout(timer);
    }, []);

    if (showFallback) {
      return renderDemoChat();
    }

    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <LoadingIndicator size={40} />
          <p className="mt-4 text-gray-600">Connecting to chat...</p>
          <p className="mt-2 text-sm text-gray-400">This may take a few seconds...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || streamError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center max-w-md px-6">
          <svg
            className="w-16 h-16 mx-auto text-red-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Unable to Connect to Chat
          </h3>
          <p className="text-gray-600 mb-6">
            {error || streamError}
          </p>
          <button
            onClick={retry}
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // No channel loaded
  if (!channel) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-gray-500">No channel selected</p>
          <p className="text-sm text-gray-400 mt-1">
            Please select a channel to start chatting
          </p>
        </div>
      </div>
    );
  }

  // Render Stream Chat interface
  return (
    <div className="h-full stream-chat-container">
      <Chat client={client} theme="str-chat__theme-light">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>

      {/* Custom CSS to match design */}
      <style>{`
        .stream-chat-container {
          height: 100%;
          width: 100%;
        }

        /* Override Stream Chat default styles to match your design */
        .str-chat__channel {
          height: 100%;
        }

        .str-chat__main-panel {
          height: 100%;
        }

        .str-chat__channel-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 1rem 1.5rem;
        }

        .str-chat__message-list {
          background: white;
          padding: 1rem 1.5rem;
        }

        .str-chat__message-input {
          background: white;
          border-top: 1px solid #e5e7eb;
          padding: 1rem 1.5rem;
        }

        /* Custom message styles */
        .str-chat__message--me .str-chat__message-bubble {
          background-color: #3b82f6;
          color: white;
        }

        .str-chat__message--other .str-chat__message-bubble {
          background-color: #f3f4f6;
          color: #111827;
        }

        /* Typing indicator */
        .str-chat__typing-indicator {
          color: #6b7280;
          font-size: 0.875rem;
        }

        /* Message input */
        .str-chat__textarea textarea {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
        }

        .str-chat__textarea textarea:focus {
          border-color: #3b82f6;
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* Send button */
        .str-chat__send-button {
          background-color: #3b82f6;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
        }

        .str-chat__send-button:hover {
          background-color: #2563eb;
        }

        /* Avatar */
        .str-chat__avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        /* Online status indicator */
        .str-chat__avatar--online::after {
          background-color: #10b981;
        }

        /* Thread panel */
        .str-chat__thread {
          border-left: 1px solid #e5e7eb;
          background: white;
        }

        /* Loading indicator */
        .str-chat__loading-indicator {
          color: #3b82f6;
        }

        /* Empty state */
        .str-chat__empty-channel {
          padding: 4rem 1.5rem;
          text-align: center;
          color: #6b7280;
        }

        /* Reactions */
        .str-chat__reaction-list {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        /* Message actions */
        .str-chat__message-actions-list {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        /* Date separator */
        .str-chat__date-separator {
          color: #6b7280;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Unread messages indicator */
        .str-chat__unread-messages-notification {
          background-color: #3b82f6;
          color: white;
          border-radius: 9999px;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
