/**
 * LockedChannelView Component
 * Shows blurred preview for locked premium channels
 *
 * @param {Object} analyst - Analyst data
 * @param {string} channelType - Type of locked channel
 * @param {function} onUpgrade - Handler for upgrade button click
 */

const LockedChannelView = ({ analyst, channelType, onUpgrade }) => {
  const getChannelInfo = () => {
    switch (channelType) {
      case 'paid-announcements':
        return {
          icon: '📢',
          title: 'Premium Announcements',
          description: 'Get exclusive market insights and trading alerts',
        };
      case 'paid-calls':
        return {
          icon: '📞',
          title: 'Premium Trading Calls',
          description: 'Access high-conviction trades with detailed analysis',
        };
      case 'community-chat':
        return {
          icon: '💬',
          title: 'Community Chat',
          description: 'Join the private community and discuss strategies',
        };
      default:
        return {
          icon: '🔒',
          title: 'Premium Content',
          description: 'Subscribe to unlock exclusive content',
        };
    }
  };

  const channelInfo = getChannelInfo();

  // Mock preview posts (blurred)
  const previewPosts = [
    {
      stock: 'RELIANCE',
      action: 'BUY',
      entry: '2,450',
      target: '2,650',
    },
    {
      stock: 'TCS',
      action: 'SELL',
      entry: '3,780',
      target: '3,550',
    },
  ];

  return (
    <div className="relative min-h-[500px] flex items-center justify-center">
      {/* Blurred Background Preview */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="filter blur-md opacity-40 space-y-4 p-4">
          {previewPosts.map((post, index) => (
            <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-300 rounded w-1/4" />
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-2xl font-bold text-gray-900">{post.stock}</h3>
                <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
                  post.action === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {post.action}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Entry</p>
                  <p className="text-sm font-bold">₹{post.entry}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Target</p>
                  <p className="text-sm font-bold">₹{post.target}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">SL</p>
                  <p className="text-sm font-bold">₹2,350</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lock Overlay */}
      <div className="relative z-10 text-center px-6 py-12 max-w-lg mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-gray-200">
        {/* Large Lock Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {/* Channel Info */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <span>{channelInfo.icon}</span>
          <span>{channelInfo.title}</span>
        </h2>
        <p className="text-gray-600 mb-6">{channelInfo.description}</p>

        {/* Analyst Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-600 mb-3">Subscribe to unlock content from</p>
          <div className="flex items-center justify-center gap-3">
            <img
              src={analyst?.profile_photo || '/default-avatar.png'}
              alt={analyst?.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary"
            />
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900">{analyst?.name || 'Analyst'}</h3>
                {analyst?.sebi_verified && (
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <p className="text-xs text-gray-500">{analyst?.specialization || 'Market Analyst'}</p>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-primary-light rounded-xl p-4 mb-6 text-left">
          <h4 className="font-bold text-gray-900 mb-3 text-center">Premium Benefits</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Exclusive trading calls with entry, target & SL
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Real-time notifications for urgent updates
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Community chat with fellow traders
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Priority support from the analyst
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <button
          onClick={onUpgrade}
          className="w-full h-14 bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-lg rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all mb-3 flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Unlock Premium Content
        </button>

        {/* Pricing hint */}
        <p className="text-sm text-gray-500">
          Plans starting from <span className="font-bold text-primary">₹999/month</span>
        </p>
      </div>
    </div>
  );
};

export default LockedChannelView;
