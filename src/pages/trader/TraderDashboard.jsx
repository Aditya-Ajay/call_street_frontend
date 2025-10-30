/**
 * Trader Dashboard Page
 * Main dashboard for traders showing subscriptions, bookmarks, and personalized feed
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { traderAPI } from '../../services/api';
import TraderHeader from '../../components/common/TraderHeader';
import Button from '../../components/common/Button';

const TraderDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    profile: null,
    subscriptions: [],
    bookmarks_count: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await traderAPI.getDashboard();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TraderHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-4" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TraderHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {dashboardData.profile?.display_name || user?.name || 'Trader'}!
          </h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your subscriptions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Subscriptions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.subscriptions.length}</p>
              <p className="text-sm text-gray-600 mt-1">Active Subscriptions</p>
            </div>
            <button
              onClick={() => navigate('/subscriptions')}
              className="mt-4 text-sm text-primary font-medium hover:underline"
            >
              View all →
            </button>
          </div>

          {/* Bookmarks */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.bookmarks_count}</p>
              <p className="text-sm text-gray-600 mt-1">Saved Calls</p>
            </div>
            <button
              onClick={() => navigate('/bookmarks')}
              className="mt-4 text-sm text-secondary font-medium hover:underline"
            >
              View bookmarks →
            </button>
          </div>

          {/* Discovery */}
          <div className="bg-gradient-to-br from-primary to-secondary rounded-xl shadow-sm p-6 text-white hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold">Discover More</p>
              <p className="text-sm text-white/80 mt-1">Find expert analysts</p>
            </div>
            <button
              onClick={() => navigate('/discovery')}
              className="mt-4 text-sm font-medium hover:underline flex items-center gap-1"
            >
              Explore analysts →
            </button>
          </div>
        </div>

        {/* Active Subscriptions Section */}
        {dashboardData.subscriptions.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Active Subscriptions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={subscription.analyst_photo || '/default-avatar.png'}
                      alt={subscription.analyst_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {subscription.analyst_name}
                      </h3>
                      <p className="text-sm text-gray-600">{subscription.tier_name}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className={`font-medium ${
                        subscription.status === 'active' ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {subscription.status === 'active' ? '✓ Active' : subscription.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Monthly</span>
                      <span className="font-medium text-gray-900">
                        ₹{(subscription.price_monthly / 100).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Renews on</span>
                      <span className="font-medium text-gray-900">
                        {new Date(subscription.current_period_end).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/analyst/${subscription.analyst_id}`)}
                    className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-12 text-center mb-8">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No active subscriptions</h3>
            <p className="text-gray-600 mb-6">
              Start following expert analysts to get trade calls and market insights
            </p>
            <Button variant="primary" size="md" onClick={() => navigate('/discovery')}>
              Discover Analysts
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              Latest Calls
            </h3>
            <p className="text-sm text-gray-600 mb-4">Stay updated with the latest trade calls from your analysts</p>
            <Button variant="outline" size="sm" fullWidth onClick={() => navigate('/feed')}>
              View Feed
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Customize Profile
            </h3>
            <p className="text-sm text-gray-600 mb-4">Update your preferences and trading interests</p>
            <Button variant="outline" size="sm" fullWidth onClick={() => navigate('/settings')}>
              Go to Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraderDashboard;
