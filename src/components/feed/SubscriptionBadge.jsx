/**
 * SubscriptionBadge Component
 * Displays user's subscription tier with color coding
 *
 * @param {string} tier - Subscription tier ('free', 'basic', 'premium', 'pro')
 * @param {Date} expiresAt - Subscription expiry date (optional)
 * @param {string} size - 'sm' | 'md' | 'lg'
 */

import { formatDistanceToNow } from 'date-fns';

const SubscriptionBadge = ({ tier = 'free', expiresAt, size = 'md' }) => {
  const getTierConfig = (tierName) => {
    const configs = {
      free: {
        label: 'Free',
        color: 'bg-gray-100 text-gray-700 border-gray-300',
        icon: '👤',
      },
      basic: {
        label: 'Basic',
        color: 'bg-blue-100 text-blue-700 border-blue-300',
        icon: '⭐',
      },
      premium: {
        label: 'Premium',
        color: 'bg-purple-100 text-purple-700 border-purple-300',
        icon: '💎',
      },
      pro: {
        label: 'Pro',
        color: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-300',
        icon: '👑',
      },
    };

    return configs[tierName.toLowerCase()] || configs.free;
  };

  const tierConfig = getTierConfig(tier);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const formatExpiry = () => {
    if (!expiresAt) return null;

    try {
      const expiryDate = new Date(expiresAt);
      const now = new Date();

      if (expiryDate < now) {
        return <span className="text-red-600">Expired</span>;
      }

      const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry <= 7) {
        return <span className="text-warning">Expires in {daysUntilExpiry} days</span>;
      }

      return <span className="text-gray-500">Expires {formatDistanceToNow(expiryDate, { addSuffix: true })}</span>;
    } catch {
      return null;
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <span
        className={`
          inline-flex items-center gap-1 font-semibold rounded-full border
          ${tierConfig.color}
          ${sizeClasses[size]}
        `}
      >
        <span>{tierConfig.icon}</span>
        <span>{tierConfig.label}</span>
      </span>
      {expiresAt && size !== 'sm' && (
        <span className="text-xs">{formatExpiry()}</span>
      )}
    </div>
  );
};

export default SubscriptionBadge;
