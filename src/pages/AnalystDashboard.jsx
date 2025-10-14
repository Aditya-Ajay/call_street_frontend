/**
 * Analyst Dashboard Page
 * Discord-like 3-column layout with channel-based navigation
 * URL: /dashboard, /analytics, /subscribers, /revenue
 */

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DashboardProvider, useDashboard } from '../contexts/DashboardContext';
import LeftSidebar from '../components/dashboard/LeftSidebar';
import RightSidebar from '../components/dashboard/RightSidebar';
import PostComposer from '../components/dashboard/PostComposer';
import PostsFeed from '../components/dashboard/PostsFeed';
import ChatInterface from '../components/dashboard/ChatInterface';
import AnalyticsOverview from '../components/dashboard/AnalyticsOverview';
import SubscribersList from '../components/dashboard/SubscribersList';
import RevenueBreakdown from '../components/dashboard/RevenueBreakdown';

/**
 * Main Dashboard Content
 * Displays content based on selected channel or analytics view
 */
const DashboardContent = () => {
  const {
    channelConfig,
    sidebarOpen,
    rightSidebarOpen,
    toggleSidebar,
    toggleRightSidebar,
    setSidebarOpen,
    setRightSidebarOpen,
  } = useDashboard();

  const { user } = useAuth();
  const location = useLocation();

  const isChatChannel = channelConfig?.type === 'chat';

  // Determine which view to show based on URL
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/analytics')) {
      setCurrentView('analytics');
    } else if (path.includes('/subscribers')) {
      setCurrentView('subscribers');
    } else if (path.includes('/revenue')) {
      setCurrentView('revenue');
    } else {
      setCurrentView('dashboard');
    }
  }, [location]);

  // Close sidebars on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
        setRightSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen, setRightSidebarOpen]);

  return (
    <div className="h-screen flex flex-col bg-[#36393f]">
      {/* Top Header (Mobile Only) */}
      <header className="lg:hidden bg-[#2f3136] text-white border-b border-[#202225] px-4 py-3 flex items-center justify-between z-50">
        {/* Left: Menu Button */}
        <button
          onClick={toggleSidebar}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#40444b] transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Center: Channel Name */}
        <div className="flex items-center gap-2 flex-1 justify-center">
          <span className="text-lg">{channelConfig?.icon}</span>
          <h1 className="text-base font-bold truncate">{channelConfig?.name}</h1>
        </div>

        {/* Right: Stats Button */}
        <button
          onClick={toggleRightSidebar}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#40444b] transition-colors"
          aria-label="Toggle stats"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Desktop Always Visible, Mobile Slide-in */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <LeftSidebar />
        </aside>

        {/* Mobile Overlay */}
        {(sidebarOpen || rightSidebarOpen) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => {
              setSidebarOpen(false);
              setRightSidebarOpen(false);
            }}
          />
        )}

        {/* Center Content */}
        <main className="flex-1 overflow-hidden bg-[#36393f] flex flex-col">
          {/* Desktop Header - Only show for dashboard view */}
          {currentView === 'dashboard' && (
            <div className="hidden lg:flex items-center justify-between px-6 py-4 bg-[#2f3136] border-b border-[#202225]">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{channelConfig?.icon}</span>
                <div>
                  <h1 className="text-lg font-bold text-white">{channelConfig?.name}</h1>
                  <p className="text-xs text-[#b9bbbe]">{channelConfig?.description}</p>
                </div>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#b9bbbe]">{user?.name}</span>
                <img
                  src={user?.profile_photo || '/default-avatar.png'}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full border-2 border-primary"
                />
              </div>
            </div>
          )}

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            {currentView === 'analytics' ? (
              // Analytics Overview
              <AnalyticsOverview />
            ) : currentView === 'subscribers' ? (
              // Subscribers List
              <SubscribersList />
            ) : currentView === 'revenue' ? (
              // Revenue Breakdown
              <RevenueBreakdown />
            ) : isChatChannel ? (
              // Chat Interface
              <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
                <ChatInterface channelId={user?._id} />
              </div>
            ) : (
              // Post Composer + Feed
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Post Composer */}
                <PostComposer />

                {/* Posts Feed */}
                <PostsFeed />
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar - Desktop Always Visible, Mobile Slide-in */}
        <aside
          className={`
            fixed lg:static inset-y-0 right-0 z-40
            transform transition-transform duration-300 ease-in-out
            ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          `}
        >
          <RightSidebar />
        </aside>
      </div>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="lg:hidden bg-[#2f3136] border-t border-[#202225] safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          <button
            onClick={() => {
              // Navigate to home/dashboard
            }}
            className="flex flex-col items-center justify-center gap-1 text-[#b9bbbe] hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={toggleSidebar}
            className="flex flex-col items-center justify-center gap-1 text-[#b9bbbe] hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            <span className="text-xs font-medium">Channels</span>
          </button>

          <button
            onClick={() => {
              // Scroll to composer or open modal
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center justify-center w-12 h-12 -mt-6 bg-primary rounded-full shadow-lg text-white hover:bg-primary-dark transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>

          <button
            onClick={toggleRightSidebar}
            className="flex flex-col items-center justify-center gap-1 text-[#b9bbbe] hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <span className="text-xs font-medium">Stats</span>
          </button>

          <button
            onClick={() => {
              // Navigate to profile
            }}
            className="flex flex-col items-center justify-center gap-1 text-[#b9bbbe] hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

/**
 * Main Dashboard Component with Provider
 */
const AnalystDashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Check authentication and user type
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      if (user?.user_type !== 'analyst') {
        navigate('/feed');
        return;
      }
    }
  }, [user, isAuthenticated, loading, navigate]);

  // Show loading state
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#36393f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default AnalystDashboard;
