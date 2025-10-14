/**
 * PricingCard Component
 * Displays subscription tier with features and CTA
 *
 * @param {Object} tier - Pricing tier data
 * @param {Function} onSubscribe - Subscribe button handler
 * @param {boolean} isPopular - Highlight as popular tier
 * @param {boolean} isCurrentPlan - User's current plan
 */

const PricingCard = ({ tier, onSubscribe, isPopular = false, isCurrentPlan = false }) => {
  const getTierColor = (tierName) => {
    switch (tierName?.toLowerCase()) {
      case 'free':
        return {
          border: 'border-gray-300',
          badge: 'bg-gray-100 text-gray-700',
          button: 'bg-gray-900 hover:bg-gray-800',
        };
      case 'pro':
        return {
          border: 'border-primary',
          badge: 'bg-primary-light text-primary',
          button: 'bg-primary hover:bg-primary-dark',
        };
      case 'premium':
        return {
          border: 'border-purple-500',
          badge: 'bg-purple-100 text-purple-700',
          button: 'bg-purple-600 hover:bg-purple-700',
        };
      default:
        return {
          border: 'border-gray-300',
          badge: 'bg-gray-100 text-gray-700',
          button: 'bg-gray-900 hover:bg-gray-800',
        };
    }
  };

  const colors = getTierColor(tier.tier_name);

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Free';
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div
      className={`
        relative bg-white rounded-2xl border-2 p-6
        transition-all duration-200
        ${colors.border}
        ${isPopular ? 'shadow-xl scale-105' : 'shadow-md hover:shadow-lg'}
      `}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-primary to-green-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md">
            MOST POPULAR
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            CURRENT PLAN
          </span>
        </div>
      )}

      {/* Tier Name & Badge */}
      <div className="text-center mb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${colors.badge}`}>
          {tier.tier_name?.toUpperCase() || 'PLAN'}
        </span>
        {tier.tier_description && (
          <p className="text-sm text-gray-600 mt-2">{tier.tier_description}</p>
        )}
      </div>

      {/* Pricing */}
      <div className="text-center mb-6">
        <div className="flex items-end justify-center gap-1">
          <span className="text-4xl font-bold text-gray-900">
            {formatPrice(tier.monthly_price)}
          </span>
          {tier.monthly_price > 0 && (
            <span className="text-gray-500 text-sm mb-2">/month</span>
          )}
        </div>

        {/* Yearly Discount */}
        {tier.yearly_price && tier.yearly_price > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              or {formatPrice(tier.yearly_price)}/year
            </p>
            {tier.monthly_price > 0 && (
              <p className="text-xs text-green-600 font-semibold">
                Save {Math.round(((tier.monthly_price * 12 - tier.yearly_price) / (tier.monthly_price * 12)) * 100)}% annually
              </p>
            )}
          </div>
        )}
      </div>

      {/* Features List */}
      <div className="mb-6 space-y-3">
        {tier.features && tier.features.length > 0 ? (
          tier.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center">No features listed</p>
        )}
      </div>

      {/* Limits (if any) */}
      {tier.limits && Object.keys(tier.limits).length > 0 && (
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Limits</h4>
          <div className="space-y-1">
            {tier.limits.daily_posts !== undefined && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Daily Posts</span>
                <span className="font-semibold">{tier.limits.daily_posts}</span>
              </div>
            )}
            {tier.limits.chat_access !== undefined && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Chat Access</span>
                <span className="font-semibold">
                  {tier.limits.chat_access ? 'Yes' : 'No'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={() => onSubscribe(tier)}
        disabled={isCurrentPlan}
        className={`
          w-full py-3 rounded-lg font-bold text-white
          transition-all duration-200
          ${isCurrentPlan ? 'bg-gray-400 cursor-not-allowed' : `${colors.button} hover:scale-102 active:scale-98 shadow-md`}
        `}
      >
        {isCurrentPlan ? 'Current Plan' : tier.monthly_price === 0 ? 'Get Started Free' : 'Subscribe Now'}
      </button>

      {/* Additional Info */}
      {tier.monthly_price > 0 && !isCurrentPlan && (
        <p className="text-xs text-gray-500 text-center mt-3">
          Cancel anytime. No hidden fees.
        </p>
      )}
    </div>
  );
};

export default PricingCard;
