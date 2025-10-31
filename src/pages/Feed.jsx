/**
 * Feed Page - Discord-like Interface for Traders
 * Shows analysts with free and locked paid channels
 * URL: /feed
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import PostCard from '../components/PostCard';
import BottomNav from '../components/common/BottomNav';
import AnalystSidebarItem from '../components/feed/AnalystSidebarItem';
import LockedChannelView from '../components/feed/LockedChannelView';
import UpgradeModal from '../components/feed/UpgradeModal';
import SubscriptionBadge from '../components/feed/SubscriptionBadge';
import {
  mockAnalysts,
  checkSubscription,
  getChannelPosts,
  getFollowedAnalysts,
  getAnalystById,
} from '../utils/mockFeedData';

const Feed = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  // State
  const [analysts, setAnalysts] = useState([]);
  const [expandedAnalysts, setExpandedAnalysts] = useState({});
  const [activeChannel, setActiveChannel] = useState(null);
  const [selectedAnalyst, setSelectedAnalyst] = useState(null);
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [channelPosts, setChannelPosts] = useState([]);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeAnalyst, setUpgradeAnalyst] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load analysts on mount
  useEffect(() => {
    const followedAnalysts = getFollowedAnalysts();

    // If no analysts followed, redirect to discovery
    if (followedAnalysts.length === 0) {
      navigate('/discovery', { replace: true });
      showToast('Browse and subscribe to analysts to see their content', 'info');
      return;
    }

    setAnalysts(followedAnalysts);

    // Auto-expand first analyst and select first free channel
    if (followedAnalysts.length > 0) {
      const firstAnalyst = followedAnalysts[0];
      setExpandedAnalysts({ [firstAnalyst.id]: true });
      handleChannelSelect(firstAnalyst.id, 'free-announcements', false);
    }
  }, [navigate, showToast]);

  // Toggle analyst expansion
  const toggleAnalyst = (analystId) => {
    setExpandedAnalysts((prev) => ({
      ...prev,
      [analystId]: !prev[analystId],
    }));
  };

  // Handle channel selection
  const handleChannelSelect = (analystId, channelId, isLocked) => {
    // Redirect to community page for community chat
    if (channelId === 'community-chat') {
      navigate('/community');
      return;
    }

    if (isLocked) {
      // Show upgrade modal
      const analyst = getAnalystById(analystId);
      setUpgradeAnalyst(analyst);
      setIsUpgradeModalOpen(true);
      return;
    }

    // Load channel posts
    setLoading(true);
    setActiveChannel(`${analystId}-${channelId}`);
    setSelectedAnalyst(getAnalystById(analystId));
    setSelectedChannelId(channelId);

    // Simulate API call
    setTimeout(() => {
      const posts = getChannelPosts(analystId, channelId);
      setChannelPosts(posts);
      setLoading(false);
      setIsSidebarOpen(false); // Close sidebar on mobile
    }, 300);
  };

  // Get channel display name
  const getChannelDisplayName = () => {
    if (!selectedChannelId) return 'Select a channel';

    const channelNames = {
      'free-announcements': '📢 Free Announcements',
      'free-calls': '📞 Free Calls',
      'paid-announcements': '📢 Paid Announcements',
      'paid-calls': '📞 Paid Calls',
      'community-chat': '💬 Community Chat',
    };

    return channelNames[selectedChannelId] || selectedChannelId;
  };

  // Close upgrade modal
  const handleCloseUpgradeModal = () => {
    setIsUpgradeModalOpen(false);
    setUpgradeAnalyst(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header - Mobile/Desktop */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Menu + Title */}
          <div className="flex items-center gap-3">
            {/* Hamburger Menu - Mobile Only */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Title */}
            <h1 className="text-xl font-bold text-primary">AnalystHub</h1>
          </div>

          {/* Right: User Actions */}
          <div className="flex items-center gap-2">
            {/* Username - Desktop Only */}
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <span className="text-sm font-semibold text-gray-700">@{user?.username || 'user'}</span>
            </div>

            {/* Notifications */}
            <button
              onClick={() => navigate('/notifications')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors relative"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
            </button>

            {/* Profile Dropdown */}
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary"
            >
              <img
                src={user?.profile_photo || '/default-avatar.png'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Analysts List */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-30
            w-72 bg-white border-r border-gray-200
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            overflow-y-auto
          `}
          style={{ top: '57px' }}
        >
          <div className="p-4">
            {/* Sidebar Header */}
            <div className="mb-4">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Your Analysts
              </h2>
            </div>

            {/* Analysts List */}
            <div className="space-y-1">
              {analysts.map((analyst) => {
                const subscription = checkSubscription(analyst.id);
                return (
                  <AnalystSidebarItem
                    key={analyst.id}
                    analyst={analyst}
                    isSubscribed={subscription.isSubscribed}
                    isExpanded={expandedAnalysts[analyst.id]}
                    onToggle={() => toggleAnalyst(analyst.id)}
                    onChannelSelect={handleChannelSelect}
                    activeChannel={activeChannel}
                  />
                );
              })}
            </div>

            {/* Discover More */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate('/discovery')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Discover Analysts
              </button>
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
          {selectedAnalyst && (
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900">{getChannelDisplayName()}</h2>
                {selectedAnalyst && (
                  <>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-2">
                      <img
                        src={selectedAnalyst.profile_photo}
                        alt={selectedAnalyst.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm font-semibold text-gray-700">{selectedAnalyst.name}</span>
                      {selectedAnalyst.sebi_verified && (
                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Subscription Badge */}
              {selectedAnalyst && (
                <SubscriptionBadge
                  tier={checkSubscription(selectedAnalyst.id).tier}
                  expiresAt={checkSubscription(selectedAnalyst.id).expiresAt}
                  size="sm"
                />
              )}
            </div>
          )}

          {/* Posts Feed / Content Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50 pb-20 lg:pb-6">
            {!selectedAnalyst ? (
              // Empty State - No channel selected
              <div className="flex items-center justify-center h-full px-4">
                <div className="text-center max-w-md">
                  <div className="mb-6">
                    <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to AnalystHub</h3>
                  <p className="text-gray-600 mb-6">
                    Select an analyst and channel from the sidebar to view trading calls and updates.
                  </p>
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                  >
                    Browse Channels
                  </button>
                </div>
              </div>
            ) : loading ? (
              // Loading State
              <div className="p-4 space-y-4 max-w-4xl mx-auto">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />
                        <div className="h-3 bg-gray-300 rounded w-1/4" />
                      </div>
                    </div>
                    <div className="h-6 bg-gray-300 rounded w-1/2 mb-3" />
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-16 bg-gray-300 rounded" />
                      <div className="h-16 bg-gray-300 rounded" />
                      <div className="h-16 bg-gray-300 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : channelPosts.length > 0 ? (
              // Posts Feed
              <div className="p-4 space-y-4 max-w-4xl mx-auto">
                {channelPosts.map((post) => {
                  // Add analyst info to post
                  const postWithAnalyst = {
                    ...post,
                    analyst: selectedAnalyst,
                  };

                  return (
                    <PostCard
                      key={post.id}
                      post={postWithAnalyst}
                      onBookmark={() => showToast('Bookmark feature coming soon!', 'info')}
                      isBookmarked={false}
                    />
                  );
                })}
              </div>
            ) : (
              // Empty State - No posts
              <div className="flex items-center justify-center h-full px-4">
                <div className="text-center max-w-md">
                  <div className="mb-6">
                    <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-600">
                    {selectedAnalyst.name} hasn't posted anything in this channel yet. Check back later!
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={handleCloseUpgradeModal}
        analyst={upgradeAnalyst}
      />
    </div>
  );
};

export default Feed;
