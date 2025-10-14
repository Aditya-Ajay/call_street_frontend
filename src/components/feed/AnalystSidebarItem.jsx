/**
 * AnalystSidebarItem Component
 * Displays analyst with their channels in Discord-like sidebar
 *
 * @param {Object} analyst - Analyst data
 * @param {boolean} isSubscribed - Whether user is subscribed
 * @param {boolean} isExpanded - Whether channels are visible
 * @param {function} onToggle - Toggle expansion handler
 * @param {function} onChannelSelect - Channel selection handler
 * @param {string} activeChannel - Currently active channel
 */

import { useState } from 'react';
import SubscriptionBadge from './SubscriptionBadge';

const AnalystSidebarItem = ({
  analyst,
  isSubscribed = false,
  isExpanded = false,
  onToggle,
  onChannelSelect,
  activeChannel,
}) => {
  const channels = [
    {
      id: 'free-announcements',
      name: 'free-announcements',
      icon: '📢',
      isLocked: false,
      type: 'announcements',
    },
    {
      id: 'free-calls',
      name: 'free-calls',
      icon: '📞',
      isLocked: false,
      type: 'calls',
    },
    {
      id: 'paid-announcements',
      name: 'paid-announcements',
      icon: '📢',
      isLocked: !isSubscribed,
      type: 'announcements',
      premium: true,
    },
    {
      id: 'paid-calls',
      name: 'paid-calls',
      icon: '📞',
      isLocked: !isSubscribed,
      type: 'calls',
      premium: true,
    },
    {
      id: 'community-chat',
      name: 'community-chat',
      icon: '💬',
      isLocked: !isSubscribed,
      type: 'chat',
      premium: true,
    },
  ];

  return (
    <div className="mb-2">
      {/* Analyst Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors group"
      >
        {/* Expand/Collapse Arrow */}
        <svg
          className={`w-3 h-3 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>

        {/* Analyst Avatar */}
        <img
          src={analyst.profile_photo || '/default-avatar.png'}
          alt={analyst.name}
          className="w-8 h-8 rounded-full object-cover border-2 border-primary"
        />

        {/* Analyst Name */}
        <span className="flex-1 text-left font-semibold text-gray-900 text-sm truncate">
          {analyst.name}
        </span>

        {/* Subscription Badge (small) */}
        {isSubscribed && (
          <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
            PRO
          </span>
        )}

        {/* SEBI Verified Badge */}
        {analyst.sebi_verified && (
          <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {/* Channels List */}
      {isExpanded && (
        <div className="ml-4 mt-1 space-y-1">
          {channels.map((channel) => {
            const isActive = activeChannel === `${analyst.id}-${channel.id}`;

            return (
              <button
                key={channel.id}
                onClick={() => onChannelSelect(analyst.id, channel.id, channel.isLocked)}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm
                  ${isActive
                    ? 'bg-primary text-white font-semibold'
                    : channel.isLocked
                    ? 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {/* Channel Icon */}
                <span className={`text-base ${channel.isLocked && !isActive ? 'grayscale opacity-50' : ''}`}>
                  {channel.icon}
                </span>

                {/* Channel Name */}
                <span className="flex-1 text-left font-mono text-xs">
                  # {channel.name}
                </span>

                {/* Lock Icon */}
                {channel.isLocked && (
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}

                {/* New Message Indicator */}
                {!channel.isLocked && channel.unreadCount > 0 && (
                  <span className="w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {channel.unreadCount > 9 ? '9+' : channel.unreadCount}
                  </span>
                )}
              </button>
            );
          })}

          {/* Divider */}
          <div className="border-t border-gray-200 my-2" />

          {/* Quick Stats */}
          <div className="px-3 py-2 text-xs text-gray-500 space-y-1">
            <div className="flex items-center justify-between">
              <span>Accuracy</span>
              <span className="font-semibold text-primary">{analyst.accuracy_rate || 85}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Subscribers</span>
              <span className="font-semibold">{analyst.subscribers_count || 0}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalystSidebarItem;
