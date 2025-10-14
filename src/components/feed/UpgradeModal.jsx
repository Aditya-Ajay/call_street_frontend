/**
 * UpgradeModal Component
 * Modal for upgrading to premium analyst subscription
 *
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Called when modal should close
 * @param {Object} analyst - Analyst data with pricing info
 */

import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';

const UpgradeModal = ({ isOpen, onClose, analyst }) => {
  const navigate = useNavigate();

  if (!analyst) return null;

  const handleSubscribe = (tierId) => {
    navigate(`/subscribe/${analyst.id}/${tierId}`);
  };

  const pricingTiers = analyst.pricing_tiers || [
    {
      id: 'basic',
      name: 'Basic',
      price: 999,
      billing_cycle: 'monthly',
      features: ['Access to paid calls', 'Basic support', 'Email notifications'],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 2499,
      billing_cycle: 'monthly',
      features: ['All Basic features', 'Community chat access', 'Priority support', 'Exclusive webinars'],
      recommended: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 4999,
      billing_cycle: 'monthly',
      features: ['All Premium features', '1-on-1 consultation', 'Direct message access', 'Early access to calls'],
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="">
      <div className="text-center">
        {/* Lock Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-primary-light rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium Content Locked</h2>
        <p className="text-gray-600 mb-6">
          Subscribe to <span className="font-semibold text-primary">{analyst.name}</span> to access exclusive trading calls and the community chat.
        </p>

        {/* Analyst Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center gap-4">
          <img
            src={analyst.profile_photo || '/default-avatar.png'}
            alt={analyst.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary"
          />
          <div className="text-left flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900">{analyst.name}</h3>
              {analyst.sebi_verified && (
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-600">{analyst.specialization || 'Market Analyst'}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span>{analyst.subscribers_count || 0} subscribers</span>
              <span>•</span>
              <span>{analyst.accuracy_rate || 85}% accuracy</span>
            </div>
          </div>
        </div>

        {/* Benefits List */}
        <div className="bg-primary-light rounded-xl p-4 mb-6 text-left">
          <h4 className="font-bold text-gray-900 mb-3">What you'll get:</h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-700">Exclusive premium trading calls with detailed analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-700">Access to private community chat</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-700">Real-time notifications for urgent calls</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-700">Priority support and faster response times</span>
            </li>
          </ul>
        </div>

        {/* Pricing Tiers */}
        <div className="space-y-3 mb-6">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`
                border-2 rounded-xl p-4 text-left cursor-pointer transition-all hover:shadow-md
                ${tier.recommended
                  ? 'border-primary bg-primary-light'
                  : 'border-gray-200 bg-white hover:border-primary'
                }
              `}
              onClick={() => handleSubscribe(tier.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">{tier.name}</h3>
                    {tier.recommended && (
                      <span className="px-2 py-0.5 bg-primary text-white text-xs font-semibold rounded-full">
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{tier.billing_cycle}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">₹{tier.price}</p>
                  <p className="text-xs text-gray-500">/month</p>
                </div>
              </div>
              <ul className="space-y-1">
                {tier.features.map((feature, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-center gap-1">
                    <svg className="w-3 h-3 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => handleSubscribe(pricingTiers.find(t => t.recommended)?.id || pricingTiers[0].id)}
          className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors mb-3"
        >
          Subscribe Now
        </button>

        <button
          onClick={onClose}
          className="w-full h-12 text-gray-600 font-semibold hover:text-gray-900 transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </Modal>
  );
};

export default UpgradeModal;
