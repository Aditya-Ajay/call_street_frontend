/**
 * PostCard Component
 * Displays a trading call/post with all details
 *
 * @param {Object} post - Post data
 * @param {Function} onBookmark - Bookmark handler
 * @param {boolean} isBookmarked - Bookmark status
 */

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post, onBookmark, isBookmarked = false }) => {
  const [expanded, setExpanded] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  const handleBookmark = async () => {
    setBookmarking(true);
    try {
      await onBookmark(post.id || post._id);
    } catch (error) {
      console.error('Bookmark failed:', error);
    } finally {
      setBookmarking(false);
    }
  };

  const getActionColor = (action) => {
    switch (action?.toLowerCase()) {
      case 'buy':
        return 'text-primary bg-primary-light';
      case 'sell':
        return 'text-danger bg-red-100';
      case 'hold':
        return 'text-warning bg-yellow-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStrategyColor = (strategy) => {
    switch (strategy?.toLowerCase()) {
      case 'intraday':
        return 'bg-blue-100 text-blue-700';
      case 'swing':
        return 'bg-purple-100 text-purple-700';
      case 'options':
        return 'bg-orange-100 text-orange-700';
      case 'investment':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getConfidenceBadge = (confidence) => {
    switch (confidence?.toLowerCase()) {
      case 'high':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const calculateRiskReward = () => {
    if (!post.entry_price || !post.target_price || !post.stop_loss) {
      return null;
    }

    const entry = parseFloat(post.entry_price);
    const target = parseFloat(post.target_price);
    const stopLoss = parseFloat(post.stop_loss);

    const reward = Math.abs(target - entry);
    const risk = Math.abs(entry - stopLoss);

    if (risk === 0) return null;

    const ratio = (reward / risk).toFixed(2);
    return `1:${ratio}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header: Analyst Info */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.analyst?.profile_photo || '/default-avatar.png'}
          alt={post.analyst?.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-primary"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900 text-sm">
              {post.analyst?.name || 'Unknown Analyst'}
            </h4>
            {post.analyst?.sebi_verified && (
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <p className="text-xs text-gray-500">{formatTime(post.created_at)}</p>
        </div>

        {/* Strategy Badge */}
        {post.strategy_type && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStrategyColor(post.strategy_type)}`}>
            {post.strategy_type.toUpperCase()}
          </span>
        )}
      </div>

      {/* Stock Symbol & Action */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-gray-900">{post.stock_symbol || 'N/A'}</h3>
          {post.action && (
            <span className={`px-4 py-2 rounded-lg text-sm font-bold ${getActionColor(post.action)}`}>
              {post.action.toUpperCase()}
            </span>
          )}
        </div>

        {post.stock_name && (
          <p className="text-sm text-gray-600">{post.stock_name}</p>
        )}
      </div>

      {/* Price Details */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {post.entry_price && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Entry</p>
            <p className="text-sm font-bold text-gray-900">₹{post.entry_price}</p>
          </div>
        )}
        {post.target_price && (
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Target</p>
            <p className="text-sm font-bold text-green-700">₹{post.target_price}</p>
          </div>
        )}
        {post.stop_loss && (
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Stop Loss</p>
            <p className="text-sm font-bold text-red-700">₹{post.stop_loss}</p>
          </div>
        )}
      </div>

      {/* Risk:Reward & Confidence */}
      <div className="flex items-center gap-3 mb-3">
        {calculateRiskReward() && (
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg">
            <span className="text-xs text-gray-600">Risk:Reward</span>
            <span className="text-sm font-bold text-blue-700">{calculateRiskReward()}</span>
          </div>
        )}
        {post.confidence && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getConfidenceBadge(post.confidence)}`}>
            <span className="text-xs font-semibold">{post.confidence.toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Reasoning */}
      {post.reasoning && (
        <div className="mb-3">
          <p className={`text-sm text-gray-700 ${!expanded && 'line-clamp-2'}`}>
            {post.reasoning}
          </p>
          {post.reasoning.length > 100 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-primary text-sm font-semibold mt-1 hover:underline"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <button
          onClick={() => navigator.clipboard.writeText(JSON.stringify(post, null, 2))}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium">Copy</span>
        </button>

        <button
          onClick={handleBookmark}
          disabled={bookmarking}
          className={`flex items-center gap-2 transition-colors ${
            isBookmarked ? 'text-primary' : 'text-gray-600 hover:text-primary'
          }`}
        >
          <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span className="text-sm font-medium">Save</span>
        </button>

        <button className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">More</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
