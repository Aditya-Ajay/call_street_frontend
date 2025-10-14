/**
 * Subscribers List Component
 * Displays detailed list of all subscribers with filtering and search
 */

import { useState } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { useNavigate } from 'react-router-dom';

// Dummy subscriber data
const DUMMY_SUBSCRIBERS = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh@example.com', tier: 'premium', joinedDate: '2024-08-15', status: 'active', avatar: null },
  { id: 2, name: 'Priya Sharma', email: 'priya@example.com', tier: 'basic', joinedDate: '2024-09-01', status: 'active', avatar: null },
  { id: 3, name: 'Amit Patel', email: 'amit@example.com', tier: 'premium', joinedDate: '2024-07-20', status: 'active', avatar: null },
  { id: 4, name: 'Sneha Reddy', email: 'sneha@example.com', tier: 'basic', joinedDate: '2024-09-10', status: 'active', avatar: null },
  { id: 5, name: 'Vikram Singh', email: 'vikram@example.com', tier: 'premium', joinedDate: '2024-08-05', status: 'active', avatar: null },
  { id: 6, name: 'Anita Desai', email: 'anita@example.com', tier: 'basic', joinedDate: '2024-09-18', status: 'active', avatar: null },
  { id: 7, name: 'Rahul Verma', email: 'rahul@example.com', tier: 'premium', joinedDate: '2024-07-30', status: 'active', avatar: null },
  { id: 8, name: 'Deepika Joshi', email: 'deepika@example.com', tier: 'basic', joinedDate: '2024-09-25', status: 'active', avatar: null },
  { id: 9, name: 'Arjun Malhotra', email: 'arjun@example.com', tier: 'premium', joinedDate: '2024-08-20', status: 'active', avatar: null },
  { id: 10, name: 'Kavita Nair', email: 'kavita@example.com', tier: 'premium', joinedDate: '2024-09-05', status: 'active', avatar: null },
  { id: 11, name: 'Sanjay Gupta', email: 'sanjay@example.com', tier: 'basic', joinedDate: '2024-09-12', status: 'active', avatar: null },
  { id: 12, name: 'Neha Chopra', email: 'neha@example.com', tier: 'basic', joinedDate: '2024-09-20', status: 'active', avatar: null },
  { id: 13, name: 'Karan Kapoor', email: 'karan@example.com', tier: 'premium', joinedDate: '2024-08-10', status: 'active', avatar: null },
  { id: 14, name: 'Pooja Mehta', email: 'pooja@example.com', tier: 'basic', joinedDate: '2024-09-28', status: 'active', avatar: null },
  { id: 15, name: 'Rohit Agarwal', email: 'rohit@example.com', tier: 'premium', joinedDate: '2024-07-25', status: 'active', avatar: null },
  { id: 16, name: 'Simran Kaur', email: 'simran@example.com', tier: 'premium', joinedDate: '2024-08-28', status: 'active', avatar: null },
  { id: 17, name: 'Vishal Rao', email: 'vishal@example.com', tier: 'basic', joinedDate: '2024-09-15', status: 'active', avatar: null },
  { id: 18, name: 'Isha Bhatt', email: 'isha@example.com', tier: 'basic', joinedDate: '2024-09-22', status: 'active', avatar: null },
  { id: 19, name: 'Manish Jain', email: 'manish@example.com', tier: 'premium', joinedDate: '2024-08-18', status: 'active', avatar: null },
  { id: 20, name: 'Tanvi Shah', email: 'tanvi@example.com', tier: 'basic', joinedDate: '2024-09-30', status: 'active', avatar: null },
];

const SubscribersList = () => {
  const { stats } = useDashboard();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all'); // all, premium, basic
  const [sortBy, setSortBy] = useState('recent'); // recent, name

  // Filter and sort subscribers
  const filteredSubscribers = DUMMY_SUBSCRIBERS
    .filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           sub.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = tierFilter === 'all' || sub.tier === tierFilter;
      return matchesSearch && matchesTier;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      // Sort by date (most recent first)
      return new Date(b.joinedDate) - new Date(a.joinedDate);
    });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get tier badge
  const getTierBadge = (tier) => {
    if (tier === 'premium') {
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
          PREMIUM
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
        BASIC
      </span>
    );
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscribers</h1>
          <p className="text-sm text-[#b9bbbe] mt-1">
            Manage your {stats.activeSubscribers} active subscribers
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-[#40444b] hover:bg-[#4f545c] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#2f3136] rounded-lg p-4 border border-[#202225]">
          <p className="text-xs text-[#b9bbbe] font-semibold mb-2">Total Subscribers</p>
          <p className="text-2xl font-bold text-white">{stats.activeSubscribers}</p>
        </div>
        <div className="bg-[#2f3136] rounded-lg p-4 border border-[#202225]">
          <p className="text-xs text-[#b9bbbe] font-semibold mb-2">Premium Members</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.paidSubscribers}</p>
        </div>
        <div className="bg-[#2f3136] rounded-lg p-4 border border-[#202225]">
          <p className="text-xs text-[#b9bbbe] font-semibold mb-2">Basic Members</p>
          <p className="text-2xl font-bold text-blue-500">{stats.freeSubscribers}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-[#2f3136] rounded-lg p-4 border border-[#202225]">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#b9bbbe]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full h-12 pl-10 pr-4 bg-[#202225] border border-[#40444b] rounded-lg text-white placeholder-[#b9bbbe] focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Tier Filter */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="h-12 px-4 bg-[#202225] border border-[#40444b] rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="all">All Tiers</option>
            <option value="premium">Premium Only</option>
            <option value="basic">Basic Only</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-12 px-4 bg-[#202225] border border-[#40444b] rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="recent">Most Recent</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-[#2f3136] rounded-lg border border-[#202225] overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#202225]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#b9bbbe] uppercase tracking-wide">
                  Subscriber
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#b9bbbe] uppercase tracking-wide">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#b9bbbe] uppercase tracking-wide">
                  Tier
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#b9bbbe] uppercase tracking-wide">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#b9bbbe] uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#b9bbbe] uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202225]">
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-[#202225] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
                        {getInitials(subscriber.name)}
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {subscriber.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#dcddde]">{subscriber.email}</span>
                  </td>
                  <td className="px-6 py-4">{getTierBadge(subscriber.tier)}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#dcddde]">
                      {formatDate(subscriber.joinedDate)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      ACTIVE
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm text-primary hover:text-primary-dark font-semibold">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-[#202225]">
          {filteredSubscribers.map((subscriber) => (
            <div key={subscriber.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {getInitials(subscriber.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {subscriber.name}
                    </h3>
                    {getTierBadge(subscriber.tier)}
                  </div>
                  <p className="text-xs text-[#b9bbbe] mb-2 truncate">
                    {subscriber.email}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[#b9bbbe]">
                    <span>Joined {formatDate(subscriber.joinedDate)}</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 font-semibold rounded-full">
                      ACTIVE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSubscribers.length === 0 && (
          <div className="text-center py-16">
            <svg
              className="w-16 h-16 mx-auto text-[#40444b] mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-[#b9bbbe]">No subscribers found</p>
            <p className="text-sm text-[#8e9297] mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Pagination Info */}
      {filteredSubscribers.length > 0 && (
        <div className="flex items-center justify-between text-sm text-[#b9bbbe]">
          <p>
            Showing {filteredSubscribers.length} of {DUMMY_SUBSCRIBERS.length} subscribers
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscribersList;
