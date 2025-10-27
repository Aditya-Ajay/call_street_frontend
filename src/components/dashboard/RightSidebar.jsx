/**
 * Right Sidebar Component
 * Shows stats, performance metrics, and quick actions
 */

import { useDashboard } from '../../contexts/DashboardContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';

const RightSidebar = () => {
  const { stats, statsLoading, recentActivity } = useDashboard();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleShareInvite = () => {
    const inviteLink = `${window.location.origin}/analyst/${user?._id}`;
    navigator.clipboard.writeText(inviteLink);
    showToast('Invite link copied to clipboard!', 'success');
  };

  const handleViewProfile = () => {
    navigate(`/analyst/${user?._id}`);
  };

  const handleManageTiers = () => {
    navigate('/pricing-setup');
  };

  if (statsLoading) {
    return (
      <div className="w-80 bg-[#2f3136] h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-80 bg-[#2f3136] text-[#dcddde] h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Quick Stats Card */}
        <div className="bg-[#202225] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Quick Stats
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#b9bbbe]">Active Subscribers</span>
              <span className="text-sm font-bold text-white">
                {stats.activeSubscribers.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[#b9bbbe]">Monthly Revenue</span>
              <span className="text-sm font-bold text-green-500">
                ₹{stats.monthlyRevenue.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="h-px bg-[#40444b]" />

            <div className="flex items-center justify-between">
              <span className="text-xs text-[#b9bbbe]">Free Subscribers</span>
              <span className="text-sm font-semibold text-[#dcddde]">
                {stats.freeSubscribers.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[#b9bbbe]">Paid Subscribers</span>
              <span className="text-sm font-semibold text-[#dcddde]">
                {stats.paidSubscribers.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Card - PRIVATE */}
        <div className="bg-[#202225] rounded-lg p-4 border-2 border-yellow-500/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Performance
            </h3>
            <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded font-semibold">
              PRIVATE
            </span>
          </div>

          <p className="text-xs text-[#8e9297] mb-3">Only you can see this</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#b9bbbe]">Win Rate</span>
              <span className="text-sm font-bold text-green-500">
                {stats.winRate}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[#b9bbbe]">Average Return</span>
              <span
                className={`text-sm font-bold ${
                  stats.averageReturn >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {stats.averageReturn >= 0 ? '+' : ''}
                {stats.averageReturn}%
              </span>
            </div>

            <div className="h-px bg-[#40444b]" />

            <div className="flex items-center justify-between">
              <span className="text-xs text-[#b9bbbe]">Active Calls</span>
              <span className="text-sm font-semibold text-[#dcddde]">
                {stats.activeCalls}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[#b9bbbe]">Total Tracked</span>
              <span className="text-sm font-semibold text-[#dcddde]">
                {stats.totalTracked}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/performance')}
            className="w-full mt-3 px-3 py-2 bg-[#40444b] hover:bg-[#4f545c] text-white text-xs font-semibold rounded transition-colors"
          >
            View Details
          </button>
        </div>

        {/* Recent Activity */}
        {recentActivity && recentActivity.length > 0 && (
          <div className="bg-[#202225] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Recent Activity
            </h3>

            <div className="space-y-2">
              {recentActivity.slice(0, 5).map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-xs text-[#b9bbbe] pb-2 border-b border-[#40444b] last:border-0"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{activity.text}</p>
                    <p className="text-[#8e9297] text-[10px] mt-0.5">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-[#202225] rounded-lg p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
            Quick Actions
          </h3>

          <div className="space-y-2">
            {/* Only show Share Invite for analysts */}
            {user?.user_type === 'analyst' && (
              <button
                onClick={handleShareInvite}
                className="w-full px-3 py-2.5 bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold rounded transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share Invite Link
              </button>
            )}

            {/* View Public Profile - Only for analysts */}
            {user?.user_type === 'analyst' && (
              <button
                onClick={handleViewProfile}
                className="w-full px-3 py-2.5 bg-[#40444b] hover:bg-[#4f545c] text-white text-xs font-semibold rounded transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  />
                </svg>
                View Public Profile
              </button>
            )}

            {/* Manage Tiers - Only for analysts */}
            {user?.user_type === 'analyst' && (
              <button
                onClick={handleManageTiers}
                className="w-full px-3 py-2.5 bg-[#40444b] hover:bg-[#4f545c] text-white text-xs font-semibold rounded transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Manage Tiers
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
