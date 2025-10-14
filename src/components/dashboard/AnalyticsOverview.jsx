/**
 * Analytics Overview Component
 * Shows comprehensive analytics dashboard with stats and charts
 */

import { useDashboard } from '../../contexts/DashboardContext';
import { useNavigate } from 'react-router-dom';

const AnalyticsOverview = () => {
  const { stats, statsLoading } = useDashboard();
  const navigate = useNavigate();

  // Dummy growth data for charts
  const monthlyGrowth = [
    { month: 'Jul', subscribers: 245, revenue: 73500 },
    { month: 'Aug', subscribers: 312, revenue: 93600 },
    { month: 'Sep', subscribers: 389, revenue: 116700 },
    { month: 'Oct', subscribers: 456, revenue: 136800 },
  ];

  const performanceData = [
    { metric: 'Total Calls', value: stats.totalTracked || 0, change: '+12%', positive: true },
    { metric: 'Active Calls', value: stats.activeCalls || 0, change: '+5%', positive: true },
    { metric: 'Win Rate', value: `${stats.winRate}%`, change: '+3%', positive: true },
    { metric: 'Avg Return', value: `${stats.averageReturn}%`, change: '+2.5%', positive: stats.averageReturn >= 0 },
  ];

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-sm text-[#b9bbbe] mt-1">
            Overview of your performance and earnings
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-[#40444b] hover:bg-[#4f545c] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Revenue & Subscriber Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-[#2f3136] rounded-lg p-6 border border-[#202225]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#b9bbbe] font-semibold uppercase">Total Revenue</p>
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ₹{stats.monthlyRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-green-500 font-semibold">+18% from last month</p>
        </div>

        {/* Active Subscribers */}
        <div className="bg-[#2f3136] rounded-lg p-6 border border-[#202225]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#b9bbbe] font-semibold uppercase">Active Subscribers</p>
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {stats.activeSubscribers.toLocaleString()}
          </p>
          <p className="text-xs text-blue-500 font-semibold">+24% from last month</p>
        </div>

        {/* Paid Subscribers */}
        <div className="bg-[#2f3136] rounded-lg p-6 border border-[#202225]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#b9bbbe] font-semibold uppercase">Paid Subscribers</p>
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {stats.paidSubscribers.toLocaleString()}
          </p>
          <p className="text-xs text-yellow-500 font-semibold">+31% from last month</p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-[#2f3136] rounded-lg p-6 border border-[#202225]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#b9bbbe] font-semibold uppercase">Conversion Rate</p>
            <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {stats.freeSubscribers > 0
              ? ((stats.paidSubscribers / (stats.freeSubscribers + stats.paidSubscribers)) * 100).toFixed(1)
              : 0}%
          </p>
          <p className="text-xs text-purple-500 font-semibold">+5.2% from last month</p>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-[#2f3136] rounded-lg p-6 border border-[#202225]">
        <h2 className="text-lg font-bold text-white mb-6">Subscriber Growth (Last 4 Months)</h2>
        <div className="space-y-4">
          {monthlyGrowth.map((data, index) => (
            <div key={data.month}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#dcddde]">{data.month}</span>
                <span className="text-sm font-bold text-white">{data.subscribers} subscribers</span>
              </div>
              <div className="w-full h-3 bg-[#202225] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(data.subscribers / 500) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-[#2f3136] rounded-lg p-6 border border-[#202225]">
        <h2 className="text-lg font-bold text-white mb-6">Trading Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceData.map((item) => (
            <div key={item.metric} className="bg-[#202225] rounded-lg p-4">
              <p className="text-xs text-[#b9bbbe] font-semibold mb-2">{item.metric}</p>
              <p className="text-2xl font-bold text-white mb-1">{item.value}</p>
              <p className={`text-xs font-semibold ${item.positive ? 'text-green-500' : 'text-red-500'}`}>
                {item.change}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Tier */}
        <div className="bg-[#2f3136] rounded-lg p-6 border border-[#202225]">
          <h2 className="text-lg font-bold text-white mb-6">Revenue by Tier</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#dcddde]">Premium Tier</span>
                <span className="text-sm font-bold text-white">₹95,000</span>
              </div>
              <div className="w-full h-3 bg-[#202225] rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '70%' }} />
              </div>
              <p className="text-xs text-[#b9bbbe] mt-1">70% of total revenue</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#dcddde]">Basic Tier</span>
                <span className="text-sm font-bold text-white">₹41,800</span>
              </div>
              <div className="w-full h-3 bg-[#202225] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '30%' }} />
              </div>
              <p className="text-xs text-[#b9bbbe] mt-1">30% of total revenue</p>
            </div>
          </div>
        </div>

        {/* Top Performing Calls */}
        <div className="bg-[#2f3136] rounded-lg p-6 border border-[#202225]">
          <h2 className="text-lg font-bold text-white mb-6">Top Performing Calls</h2>
          <div className="space-y-3">
            {[
              { stock: 'RELIANCE', return: '+12.5%', status: 'Target Hit' },
              { stock: 'TCS', return: '+8.3%', status: 'Target Hit' },
              { stock: 'INFY', return: '+7.8%', status: 'Active' },
              { stock: 'HDFCBANK', return: '+6.2%', status: 'Target Hit' },
            ].map((call) => (
              <div
                key={call.stock}
                className="flex items-center justify-between p-3 bg-[#202225] rounded-lg"
              >
                <div>
                  <p className="text-sm font-bold text-white">{call.stock}</p>
                  <p className="text-xs text-[#b9bbbe]">{call.status}</p>
                </div>
                <p className="text-sm font-bold text-green-500">{call.return}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Create New Post
        </button>

        <button
          onClick={() => window.location.href = '/subscribers'}
          className="bg-[#40444b] hover:bg-[#4f545c] text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          View Subscribers
        </button>

        <button
          onClick={() => window.location.href = '/revenue'}
          className="bg-[#40444b] hover:bg-[#4f545c] text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
          Revenue Details
        </button>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
