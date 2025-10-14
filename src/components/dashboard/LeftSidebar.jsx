/**
 * Left Sidebar Component
 * Discord-like channel list with analyst profile and navigation
 */

import { useDashboard, CHANNELS, CHANNEL_CONFIG } from '../../contexts/DashboardContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LeftSidebar = () => {
  const { user, logout } = useAuth();
  const { selectedChannel, changeChannel, unreadCounts, setSidebarOpen } = useDashboard();
  const navigate = useNavigate();

  // Group channels by tier
  const freeChannels = [CHANNELS.FREE_ANNOUNCEMENTS, CHANNELS.FREE_CALLS];
  const paidChannels = [
    CHANNELS.PAID_ANNOUNCEMENTS,
    CHANNELS.PAID_CALLS,
    CHANNELS.COMMUNITY_CHAT,
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="w-64 bg-[#2f3136] text-[#dcddde] h-full flex flex-col">
      {/* Profile Section */}
      <div className="p-4 border-b border-[#202225]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={user?.profile_photo || '/default-avatar.png'}
              alt={user?.name || 'Analyst'}
              className="w-12 h-12 rounded-full object-cover"
            />
            {/* Online indicator */}
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#2f3136]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm truncate">
              {user?.name || 'Analyst'}
            </h3>
            <div className="flex items-center gap-1">
              {user?.verification_status === 'verified' && (
                <svg
                  className="w-3.5 h-3.5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="text-xs text-[#b9bbbe]">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* Free Tier Channels */}
        <div className="mb-6">
          <div className="px-4 mb-2">
            <h4 className="text-xs font-semibold text-[#8e9297] uppercase tracking-wide">
              Free Tier
            </h4>
          </div>
          {freeChannels.map((channelId) => {
            const config = CHANNEL_CONFIG[channelId];
            const isSelected = selectedChannel === channelId;
            const unreadCount = unreadCounts[channelId];

            return (
              <button
                key={channelId}
                onClick={() => changeChannel(channelId)}
                className={`
                  w-full px-4 py-2.5 flex items-center justify-between gap-2
                  transition-colors text-left group
                  ${
                    isSelected
                      ? 'bg-[#40444b] text-white'
                      : 'text-[#96989d] hover:bg-[#36393f] hover:text-[#dcddde]'
                  }
                `}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-lg flex-shrink-0">{config.icon}</span>
                  <span className="text-sm font-medium truncate">{config.name}</span>
                </div>
                {unreadCount > 0 && (
                  <span className="flex-shrink-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Paid Tier Channels */}
        <div className="mb-6">
          <div className="px-4 mb-2">
            <h4 className="text-xs font-semibold text-[#8e9297] uppercase tracking-wide">
              Paid Tier
            </h4>
          </div>
          {paidChannels.map((channelId) => {
            const config = CHANNEL_CONFIG[channelId];
            const isSelected = selectedChannel === channelId;
            const unreadCount = unreadCounts[channelId];

            return (
              <button
                key={channelId}
                onClick={() => changeChannel(channelId)}
                className={`
                  w-full px-4 py-2.5 flex items-center justify-between gap-2
                  transition-colors text-left group
                  ${
                    isSelected
                      ? 'bg-[#40444b] text-white'
                      : 'text-[#96989d] hover:bg-[#36393f] hover:text-[#dcddde]'
                  }
                `}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-lg flex-shrink-0">{config.icon}</span>
                  <span className="text-sm font-medium truncate">{config.name}</span>
                </div>
                {unreadCount > 0 && (
                  <span className="flex-shrink-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings Section */}
      <div className="border-t border-[#202225] py-2">
        <button
          onClick={() => handleNavigate('/analytics')}
          className="w-full px-4 py-2.5 flex items-center gap-3 text-[#96989d] hover:bg-[#36393f] hover:text-[#dcddde] transition-colors text-left"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          <span className="text-sm font-medium">Analytics</span>
        </button>

        <button
          onClick={() => handleNavigate('/revenue')}
          className="w-full px-4 py-2.5 flex items-center gap-3 text-[#96989d] hover:bg-[#36393f] hover:text-[#dcddde] transition-colors text-left"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">Revenue</span>
        </button>

        <button
          onClick={() => handleNavigate('/subscribers')}
          className="w-full px-4 py-2.5 flex items-center gap-3 text-[#96989d] hover:bg-[#36393f] hover:text-[#dcddde] transition-colors text-left"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <span className="text-sm font-medium">Subscribers</span>
        </button>

        <button
          onClick={() => handleNavigate('/settings')}
          className="w-full px-4 py-2.5 flex items-center gap-3 text-[#96989d] hover:bg-[#36393f] hover:text-[#dcddde] transition-colors text-left"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">Settings</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-2.5 flex items-center gap-3 text-red-400 hover:bg-[#36393f] hover:text-red-300 transition-colors text-left"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;
