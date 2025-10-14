/**
 * Revenue Breakdown Component
 * Displays detailed revenue analytics with monthly breakdown and export functionality
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { analyticsAPI } from '../../services/api';

const RevenueBreakdown = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // State management
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('6months'); // 1month, 3months, 6months, 1year
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetch revenue data from backend API
   */
  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get analyst ID from user profile
      const analystId = user?.analystProfile?.id || user?._id;
      if (!analystId) {
        throw new Error('Analyst ID not found');
      }

      const response = await analyticsAPI.getRevenue({ period: selectedPeriod });

      if (response.success) {
        setData(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch revenue data:', err);
      setError(err.message || 'Failed to load revenue data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Refresh revenue data
   */
  const handleRefresh = () => {
    setRefreshing(true);
    fetchRevenueData();
  };

  /**
   * Export revenue data to CSV
   */
  const handleExport = () => {
    if (!data || !data.monthlyRevenue) {
      showToast('No data to export', 'error');
      return;
    }

    try {
      // Build CSV content
      let csvContent = 'data:text/csv;charset=utf-8,';

      // Headers
      csvContent += 'Month,Total Revenue,New Subscribers,Transactions\n';

      // Data rows
      data.monthlyRevenue.forEach(row => {
        csvContent += `${row.month || row.label},${row.revenue},${row.newSubscribers || 0},${row.transactions || 0}\n`;
      });

      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `revenue_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Revenue data exported successfully!', 'success');
    } catch (err) {
      console.error('Export failed:', err);
      showToast('Failed to export data', 'error');
    }
  };

  /**
   * Format currency
   */
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  // Fetch data on mount and when period changes
  useEffect(() => {
    if (user) {
      fetchRevenueData();
    }
  }, [user, selectedPeriod]);

  // Loading state with skeleton loaders
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-[#40444b] rounded animate-pulse" />
            <div className="h-4 w-64 bg-[#40444b] rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-32 bg-[#40444b] rounded-lg animate-pulse" />
            <div className="h-10 w-40 bg-[#40444b] rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#2f3136] rounded-lg p-6 border border-[#202225]">
              <div className="h-4 w-24 bg-[#40444b] rounded animate-pulse mb-3" />
              <div className="h-8 w-32 bg-[#40444b] rounded animate-pulse mb-2" />
              <div className="h-3 w-20 bg-[#40444b] rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="bg-[#2f3136] rounded-lg p-6 border border-[#202225]">
          <div className="h-6 w-48 bg-[#40444b] rounded animate-pulse mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-10 bg-[#40444b] rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Revenue Analytics</h1>
            <p className="text-sm text-[#b9bbbe] mt-1">
              Detailed breakdown of your earnings and transactions
            </p>
          </div>
        </div>

        {/* Error Message */}
        <div className="bg-[#2f3136] rounded-lg p-12 border border-[#202225] text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2">Failed to Load Revenue Data</h3>
          <p className="text-[#b9bbbe] mb-6">{error}</p>
          <button
            onClick={fetchRevenueData}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state - No revenue data
  if (!data || !data.monthlyRevenue || data.monthlyRevenue.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Revenue Analytics</h1>
            <p className="text-sm text-[#b9bbbe] mt-1">
              Detailed breakdown of your earnings and transactions
            </p>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-[#2f3136] rounded-lg p-12 border border-[#202225] text-center">
          <svg
            className="w-20 h-20 text-[#b9bbbe] mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2">No Revenue Data Yet</h3>
          <p className="text-[#b9bbbe] mb-4">
            Start earning revenue by getting paid subscribers!
          </p>
          <p className="text-sm text-[#72767d] max-w-md mx-auto">
            Share your profile, create valuable content, and engage with your audience to attract
            paid subscribers.
          </p>
        </div>
      </div>
    );
  }

  // Calculate totals from API data
  const totalRevenue = data.totalEarnings?.allTimeRevenue || 0;
  const avgRevenuePerMonth = data.monthlyRevenue.length > 0
    ? data.monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0) / data.monthlyRevenue.length
    : 0;
  const totalTransactions = data.monthlyRevenue.reduce((sum, m) => sum + (m.transactions || 0), 0);
  const currentMonthRevenue = data.currentMonthRevenue || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Revenue Analytics</h1>
          <p className="text-sm text-[#b9bbbe] mt-1">
            Detailed breakdown of your earnings and transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-[#40444b] hover:bg-[#4f545c] text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Export Data
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-[#40444b] hover:bg-[#4f545c] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#2f3136] rounded-lg p-6 border border-[#202225]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#b9bbbe] font-semibold uppercase">All-Time Revenue</p>
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-xs text-green-500 font-semibold">
            {data.totalEarnings?.uniqueCustomers || 0} unique customers
          </p>
        </div>

        <div className="bg-[#2f3136] rounded-lg p-6 border border-[#202225]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#b9bbbe] font-semibold uppercase">Avg per Month</p>
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {formatCurrency(Math.round(avgRevenuePerMonth))}
          </p>
          <p className="text-xs text-blue-500 font-semibold">Last {data.monthlyRevenue.length} months</p>
        </div>

        <div className="bg-[#2f3136] rounded-lg p-6 border border-[#202225]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#b9bbbe] font-semibold uppercase">Avg per Sub</p>
            <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {formatCurrency(data.totalEarnings?.averagePerSubscription || 0)}
          </p>
          <p className="text-xs text-purple-500 font-semibold">Per subscription</p>
        </div>

        <div className="bg-[#2f3136] rounded-lg p-6 border border-[#202225]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#b9bbbe] font-semibold uppercase">This Month</p>
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {formatCurrency(currentMonthRevenue)}
          </p>
          <p className="text-xs text-yellow-500 font-semibold">Current month</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-[#2f3136] rounded-lg p-6 border border-[#202225]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Monthly Revenue Trend</h2>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-[#202225] border border-[#40444b] rounded-lg text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>

        {/* Simple Bar Chart */}
        <div className="space-y-4">
          {data.monthlyRevenue.map((monthData, index) => {
            const maxRevenue = Math.max(...data.monthlyRevenue.map(d => d.revenue));
            const percentage = maxRevenue > 0 ? (monthData.revenue / maxRevenue) * 100 : 0;

            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#dcddde] w-32">
                    {monthData.month || monthData.label}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {formatCurrency(monthData.revenue)}
                  </span>
                </div>
                <div className="w-full h-8 bg-[#202225] rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-primary rounded-lg transition-all duration-500 flex items-center justify-end pr-3"
                    style={{ width: `${percentage}%` }}
                  >
                    {monthData.transactions && (
                      <span className="text-xs font-semibold text-white">
                        {monthData.transactions} txns
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Breakdown Table */}
      <div className="bg-[#2f3136] rounded-lg border border-[#202225] overflow-hidden">
        <div className="p-6 border-b border-[#202225]">
          <h2 className="text-lg font-bold text-white">Detailed Monthly Breakdown</h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#202225]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#b9bbbe] uppercase">
                  Month
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#b9bbbe] uppercase">
                  Total Revenue
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#b9bbbe] uppercase">
                  New Subs
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#b9bbbe] uppercase">
                  Transactions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202225]">
              {data.monthlyRevenue.map((monthData, index) => (
                <tr key={index} className="hover:bg-[#202225] transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-white">
                      {monthData.month || monthData.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-green-500">
                      {formatCurrency(monthData.revenue)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-blue-500">
                      {monthData.newSubscribers ? `+${monthData.newSubscribers}` : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-[#dcddde]">
                      {monthData.transactions || '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-[#202225]">
          {data.monthlyRevenue.map((monthData, index) => (
            <div key={index} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  {monthData.month || monthData.label}
                </h3>
                <span className="text-sm font-bold text-green-500">
                  {formatCurrency(monthData.revenue)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-[#b9bbbe] mb-1">New Subscribers</p>
                  <p className="font-semibold text-blue-500">
                    {monthData.newSubscribers ? `+${monthData.newSubscribers}` : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-[#b9bbbe] mb-1">Transactions</p>
                  <p className="font-semibold text-white">
                    {monthData.transactions || '-'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Tier */}
        {data.revenueByTier && data.revenueByTier.length > 0 && (
          <div className="bg-[#2f3136] rounded-lg p-6 border border-[#202225]">
            <h2 className="text-lg font-bold text-white mb-6">Revenue by Tier</h2>
            <div className="space-y-4">
              {data.revenueByTier.map((tier, index) => {
                const totalTierRevenue = data.revenueByTier.reduce((sum, t) => sum + t.total_revenue, 0);
                const percentage = totalTierRevenue > 0
                  ? Math.round((tier.total_revenue / totalTierRevenue) * 100)
                  : 0;
                const colors = ['bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-green-500'];

                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                        <span className="text-sm font-semibold text-[#dcddde]">
                          {tier.tier_name}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-white">{percentage}%</span>
                    </div>
                    <p className="text-xs text-[#b9bbbe] ml-5">
                      {formatCurrency(tier.total_revenue)} from {tier.active_subscriptions} subscribers
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Payment Methods */}
        {data.paymentMethods && data.paymentMethods.length > 0 && (
          <div className="bg-[#2f3136] rounded-lg p-6 border border-[#202225]">
            <h2 className="text-lg font-bold text-white mb-6">Payment Methods</h2>
            <div className="space-y-4">
              {data.paymentMethods.map((method, index) => {
                const totalAmount = data.paymentMethods.reduce((sum, m) => sum + m.amount, 0);
                const percentage = totalAmount > 0
                  ? Math.round((method.amount / totalAmount) * 100)
                  : 0;
                const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-yellow-500'];

                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-[#dcddde]">
                        {method.method}
                      </span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-white">{percentage}%</span>
                        <span className="text-xs text-[#b9bbbe] ml-2">({method.count})</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-[#202225] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[index % colors.length]} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueBreakdown;
