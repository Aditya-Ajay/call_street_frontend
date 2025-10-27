/**
 * Dashboard Context
 * Manages analyst dashboard state including channel selection, posts, and stats
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { postAPI, analyticsAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { DUMMY_POSTS, DUMMY_ANALYTICS, DUMMY_RECENT_ACTIVITY } from '../utils/dummyData';

const DashboardContext = createContext(null);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

// Channel types
export const CHANNELS = {
  FREE_ANNOUNCEMENTS: 'free_announcements',
  FREE_CALLS: 'free_calls',
  PAID_ANNOUNCEMENTS: 'paid_announcements',
  PAID_CALLS: 'paid_calls',
  COMMUNITY_CHAT: 'community_chat',
};

// Channel configurations
export const CHANNEL_CONFIG = {
  [CHANNELS.FREE_ANNOUNCEMENTS]: {
    id: CHANNELS.FREE_ANNOUNCEMENTS,
    name: 'Free Announcements',
    icon: '📢',
    tier: 'free',
    type: 'announcement',
    description: 'General updates and educational content',
  },
  [CHANNELS.FREE_CALLS]: {
    id: CHANNELS.FREE_CALLS,
    name: 'Free Calls',
    icon: '📞',
    tier: 'free',
    type: 'call',
    description: 'Trading calls for free subscribers',
  },
  [CHANNELS.PAID_ANNOUNCEMENTS]: {
    id: CHANNELS.PAID_ANNOUNCEMENTS,
    name: 'Paid Announcements',
    icon: '📢',
    tier: 'paid',
    type: 'announcement',
    description: 'Premium updates and analysis',
  },
  [CHANNELS.PAID_CALLS]: {
    id: CHANNELS.PAID_CALLS,
    name: 'Paid Calls',
    icon: '📞',
    tier: 'paid',
    type: 'call',
    description: 'Premium trading calls',
  },
  [CHANNELS.COMMUNITY_CHAT]: {
    id: CHANNELS.COMMUNITY_CHAT,
    name: 'Community Chat',
    icon: '💬',
    tier: 'paid',
    type: 'chat',
    description: 'Real-time chat with paid subscribers',
  },
};

export const DashboardProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Channel and navigation state
  const [selectedChannel, setSelectedChannel] = useState(CHANNELS.FREE_CALLS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  // Posts state
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsFilter, setPostsFilter] = useState('all'); // all, active, closed, expired
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Post composer state
  const [composerMode, setComposerMode] = useState('voice'); // voice, text
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [aiFormattedData, setAiFormattedData] = useState(null);

  // Stats state - Initialize with dummy data
  const [stats, setStats] = useState(DUMMY_ANALYTICS);
  const [statsLoading, setStatsLoading] = useState(false);

  // Activity state - Initialize with dummy data
  const [recentActivity, setRecentActivity] = useState(DUMMY_RECENT_ACTIVITY);

  // Unread counts (placeholder for future real-time implementation)
  const [unreadCounts, setUnreadCounts] = useState({
    [CHANNELS.FREE_ANNOUNCEMENTS]: 0,
    [CHANNELS.FREE_CALLS]: 0,
    [CHANNELS.PAID_ANNOUNCEMENTS]: 0,
    [CHANNELS.PAID_CALLS]: 0,
    [CHANNELS.COMMUNITY_CHAT]: 0,
  });

  /**
   * Fetch dashboard stats
   */
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const response = await analyticsAPI.getOverview();

      if (response.success) {
        const data = response.data;
        setStats({
          activeSubscribers: data.total_subscribers || 0,
          monthlyRevenue: data.monthly_revenue || 0,
          freeSubscribers: data.free_subscribers || 0,
          paidSubscribers: data.paid_subscribers || 0,
          winRate: data.win_rate || 0,
          averageReturn: data.average_return || 0,
          activeCalls: data.active_calls || 0,
          totalTracked: data.total_tracked || 0,
        });

        // Set recent activity if available
        if (data.recent_activity) {
          setRecentActivity(data.recent_activity);
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Don't show error toast, just log it
    } finally {
      setStatsLoading(false);
    }
  }, []);

  /**
   * Fetch posts for selected channel
   */
  const fetchPosts = useCallback(async (page = 1, append = false) => {
    try {
      setPostsLoading(true);

      const channelConfig = CHANNEL_CONFIG[selectedChannel];
      if (!channelConfig || channelConfig.type === 'chat') {
        // Don't fetch posts for chat channels
        setPosts([]);
        setPostsLoading(false);
        return;
      }

      // Fetch from API
      try {
        const params = {
          page,
          limit: 20,
        };

        // Filter by current user (analyst's own posts)
        if (user?.id) {
          params.analyst_id = user.id;
        }

        // Filter by audience (free/paid based on channel)
        if (channelConfig.tier) {
          params.audience = channelConfig.tier;
        }

        // Filter by post type (call or announcement)
        if (channelConfig.type === 'call') {
          params.post_type = 'call';
        } else if (channelConfig.type === 'announcement') {
          params.post_type = 'update';
        }

        // Add status filter if not 'all'
        if (postsFilter !== 'all') {
          // Map UI filter to backend status
          // 'active' -> 'open', 'closed' -> 'closed', 'expired' -> 'expired'
          if (postsFilter === 'active') {
            params.call_status = 'open';
          } else {
            params.call_status = postsFilter;
          }
        }

        console.log('Fetching posts with params:', params);

        const response = await postAPI.getPosts(params);

        if (response.success) {
          const newPosts = response.data.posts || response.data || [];

          console.log('Fetched posts:', newPosts);

          if (append) {
            setPosts(prev => [...prev, ...newPosts]);
          } else {
            setPosts(newPosts);
          }

          setHasMorePosts(newPosts.length === params.limit);
          setCurrentPage(page);
          return;
        }
      } catch (apiError) {
        console.error('API fetch failed:', apiError);
        showToast('Failed to load posts from database', 'error');
        // Clear posts on error
        setPosts([]);
        setHasMorePosts(false);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      showToast('Failed to load posts', 'error');
    } finally {
      setPostsLoading(false);
    }
  }, [selectedChannel, postsFilter, user, showToast]);

  /**
   * Load more posts (infinite scroll)
   */
  const loadMorePosts = useCallback(() => {
    if (!postsLoading && hasMorePosts) {
      fetchPosts(currentPage + 1, true);
    }
  }, [postsLoading, hasMorePosts, currentPage, fetchPosts]);

  /**
   * Create a new post
   */
  const createPost = useCallback(async (postData) => {
    try {
      const channelConfig = CHANNEL_CONFIG[selectedChannel];

      // Map frontend field names to backend expected field names
      const payload = {
        post_type: channelConfig.type === 'call' ? 'call' : postData.post_type || 'update',
        audience: channelConfig.tier, // 'free' or 'paid'
        language: 'en',
      };

      // For call channels - map call form data to backend format
      if (channelConfig.type === 'call') {
        // Build raw_content from structured call data
        const rawContent = `${postData.action} ${postData.stock_symbol} at ${postData.entry_price}, target ${postData.target_price}, stop loss ${postData.stop_loss}. Strategy: ${postData.strategy_type}. ${postData.notes || ''}`.trim();

        payload.raw_content = rawContent;
        payload.use_ai = false; // Don't use AI formatting since we have structured data

        // Include structured data directly in content_formatted
        payload.content_formatted = {
          stock: postData.stock_symbol,
          stock_symbol: postData.stock_symbol,
          action: postData.action,
          entry_price: parseFloat(postData.entry_price),
          target_price: parseFloat(postData.target_price),
          stop_loss: parseFloat(postData.stop_loss),
          strategy_type: postData.strategy_type,
          notes: postData.notes || '',
          reasoning: postData.notes || ''
        };

        // Also send as top-level fields for backend processing
        payload.stock_symbol = postData.stock_symbol;
        payload.action = postData.action;
        payload.entry_price = parseFloat(postData.entry_price);
        payload.target_price = parseFloat(postData.target_price);
        payload.stop_loss = parseFloat(postData.stop_loss);
        payload.strategy_type = postData.strategy_type;
      } else {
        // For announcement channels - map announcement form data
        if (!postData.content || !postData.content.trim()) {
          throw new Error('Content is required');
        }

        payload.raw_content = postData.content; // Backend expects 'raw_content'
        payload.title = postData.title;
        payload.use_ai = false; // Don't use AI for announcements
      }

      console.log('Creating post with payload:', payload);

      const response = await postAPI.createPost(payload);

      if (response.success) {
        showToast('Post created successfully!', 'success');

        // Refresh posts
        fetchPosts(1, false);

        // Clear composer state
        setTranscription('');
        setAiFormattedData(null);

        return response.data;
      }
    } catch (error) {
      console.error('Create post error:', error);
      showToast(error.message || 'Failed to create post', 'error');
      throw error;
    }
  }, [selectedChannel, showToast, fetchPosts]);

  /**
   * Update an existing post
   */
  const updatePost = useCallback(async (postId, postData) => {
    try {
      const response = await postAPI.updatePost(postId, postData);

      if (response.success) {
        showToast('Post updated successfully!', 'success');

        // Update post in local state
        setPosts(prev =>
          prev.map(post => (post._id === postId ? { ...post, ...response.data } : post))
        );

        return response.data;
      }
    } catch (error) {
      showToast(error.message || 'Failed to update post', 'error');
      throw error;
    }
  }, [showToast]);

  /**
   * Delete a post
   */
  const deletePost = useCallback(async (postId) => {
    try {
      const response = await postAPI.deletePost(postId);

      if (response.success) {
        showToast('Post deleted successfully!', 'success');

        // Remove post from local state
        setPosts(prev => prev.filter(post => post._id !== postId));
      }
    } catch (error) {
      showToast(error.message || 'Failed to delete post', 'error');
      throw error;
    }
  }, [showToast]);

  /**
   * Change selected channel
   */
  const changeChannel = useCallback((channelId) => {
    setSelectedChannel(channelId);
    setPosts([]);
    setCurrentPage(1);
    setHasMorePosts(true);

    // Close mobile sidebar
    setSidebarOpen(false);
  }, []);

  /**
   * Toggle sidebars (mobile)
   */
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
    setRightSidebarOpen(false);
  }, []);

  const toggleRightSidebar = useCallback(() => {
    setRightSidebarOpen(prev => !prev);
    setSidebarOpen(false);
  }, []);

  // Fetch stats on mount
  useEffect(() => {
    if (user?.user_type === 'analyst') {
      fetchStats();
    }
  }, [user, fetchStats]);

  // Fetch posts when channel or filter changes
  useEffect(() => {
    if (user?.user_type === 'analyst') {
      fetchPosts(1, false);
    }
  }, [selectedChannel, postsFilter, user, fetchPosts]);

  const value = {
    // Channel state
    selectedChannel,
    changeChannel,
    channelConfig: CHANNEL_CONFIG[selectedChannel],

    // Sidebar state
    sidebarOpen,
    rightSidebarOpen,
    toggleSidebar,
    toggleRightSidebar,
    setSidebarOpen,
    setRightSidebarOpen,

    // Posts state
    posts,
    postsLoading,
    postsFilter,
    setPostsFilter,
    hasMorePosts,
    loadMorePosts,
    fetchPosts,

    // Post actions
    createPost,
    updatePost,
    deletePost,

    // Composer state
    composerMode,
    setComposerMode,
    isRecording,
    setIsRecording,
    transcription,
    setTranscription,
    aiFormattedData,
    setAiFormattedData,

    // Stats
    stats,
    statsLoading,
    fetchStats,

    // Activity
    recentActivity,

    // Unread counts
    unreadCounts,
    setUnreadCounts,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;
