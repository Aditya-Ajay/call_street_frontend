/**
 * Subscription Checkout Page
 * Razorpay payment integration for subscription
 * URL: /subscribe/:analystId/:tierId
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subscriptionAPI, analystAPI, inviteAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import { BILLING_CYCLES, RAZORPAY_KEY } from '../utils/constants';

const SubscriptionCheckout = () => {
  const { analystId, tierId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [analyst, setAnalyst] = useState(null);
  const [tier, setTier] = useState(null);
  const [billingCycle, setBillingCycle] = useState(BILLING_CYCLES.MONTHLY);
  const [discountCode, setDiscountCode] = useState('');
  const [validatingCode, setValidatingCode] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    fetchCheckoutData();
  }, [analystId, tierId]);

  const fetchCheckoutData = async () => {
    try {
      setLoading(true);
      const [analystData, tiersData] = await Promise.all([
        analystAPI.getAnalystById(analystId),
        subscriptionAPI.getPricingTiers(analystId),
      ]);

      setAnalyst(analystData.data);

      const selectedTier = tiersData.data?.find((t) => t._id === tierId);
      if (selectedTier) {
        setTier(selectedTier);
      } else {
        showToast('Pricing tier not found', 'error');
        navigate(`/analyst/${analystId}`);
      }
    } catch (error) {
      showToast(error.message || 'Failed to load checkout data', 'error');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateDiscountCode = async () => {
    if (!discountCode.trim()) {
      setDiscount(null);
      return;
    }

    try {
      setValidatingCode(true);
      const response = await inviteAPI.validateDiscountCode({
        code: discountCode,
        analyst_id: analystId,
        tier_id: tierId,
      });

      setDiscount(response.data);
      showToast('Discount code applied!', 'success');
    } catch (error) {
      setDiscount(null);
      showToast(error.message || 'Invalid discount code', 'error');
    } finally {
      setValidatingCode(false);
    }
  };

  const calculatePrice = () => {
    if (!tier) return { original: 0, discount: 0, final: 0 };

    const basePrice = billingCycle === BILLING_CYCLES.YEARLY
      ? tier.yearly_price
      : tier.monthly_price;

    let discountAmount = 0;
    if (discount) {
      if (discount.discount_type === 'percentage') {
        discountAmount = (basePrice * discount.discount_value) / 100;
      } else if (discount.discount_type === 'fixed') {
        discountAmount = discount.discount_value;
      }
    }

    const finalPrice = Math.max(0, basePrice - discountAmount);

    return {
      original: basePrice,
      discount: discountAmount,
      final: finalPrice,
    };
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!agreedToTerms) {
      showToast('Please agree to terms and conditions', 'error');
      return;
    }

    try {
      setProcessing(true);

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        showToast('Razorpay SDK failed to load', 'error');
        return;
      }

      // Create order on backend
      const orderData = {
        analyst_id: analystId,
        tier_id: tierId,
        billing_cycle: billingCycle,
        discount_code: discountCode || undefined,
      };

      const orderResponse = await subscriptionAPI.createOrder(orderData);
      const order = orderResponse.data;

      // Configure Razorpay options
      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Analyst Marketplace',
        description: `${tier.tier_name} Subscription - ${analyst.name}`,
        order_id: order.razorpay_order_id,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#10B981',
        },
        handler: async (response) => {
          // Payment successful, verify on backend
          try {
            await subscriptionAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            showToast('Subscription activated successfully!', 'success');
            navigate('/subscription-success', {
              state: { analyst, tier, billingCycle },
            });
          } catch (error) {
            showToast(error.message || 'Payment verification failed', 'error');
            navigate('/subscription-failed');
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            showToast('Payment cancelled', 'info');
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      showToast(error.message || 'Failed to initiate payment', 'error');
      console.error('Payment error:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleFreeSubscription = async () => {
    if (!agreedToTerms) {
      showToast('Please agree to terms and conditions', 'error');
      return;
    }

    try {
      setProcessing(true);

      // For free tiers, create subscription directly
      await subscriptionAPI.createOrder({
        analyst_id: analystId,
        tier_id: tierId,
        billing_cycle: billingCycle,
      });

      showToast('Free subscription activated!', 'success');
      navigate('/subscription-success', {
        state: { analyst, tier, billingCycle },
      });
    } catch (error) {
      showToast(error.message || 'Failed to activate subscription', 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!tier || !analyst) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Found</h2>
          <p className="text-gray-600 mb-6">The subscription tier you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/discovery')}>Browse Analysts</Button>
        </div>
      </div>
    );
  }

  const pricing = calculatePrice();
  const isFree = pricing.final === 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Analyst Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <img
              src={analyst.profile_photo || '/default-avatar.png'}
              alt={analyst.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{analyst.name}</h2>
              {analyst.tagline && (
                <p className="text-sm text-gray-600">{analyst.tagline}</p>
              )}
            </div>
          </div>
        </div>

        {/* Tier Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{tier.tier_name} Plan</h3>
              {tier.tier_description && (
                <p className="text-sm text-gray-600 mt-1">{tier.tier_description}</p>
              )}
            </div>
          </div>

          {/* Features */}
          {tier.features && tier.features.length > 0 && (
            <div className="space-y-2 mb-4 pt-4 border-t border-gray-200">
              {tier.features.map((feature, index) => (
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
              ))}
            </div>
          )}
        </div>

        {/* Billing Cycle */}
        {!isFree && tier.yearly_price && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Billing Cycle</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setBillingCycle(BILLING_CYCLES.MONTHLY)}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${billingCycle === BILLING_CYCLES.MONTHLY
                    ? 'border-primary bg-primary-light'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <p className="font-semibold text-gray-900">Monthly</p>
                <p className="text-lg font-bold text-primary mt-1">
                  ₹{tier.monthly_price}/mo
                </p>
              </button>

              <button
                onClick={() => setBillingCycle(BILLING_CYCLES.YEARLY)}
                className={`
                  p-4 rounded-lg border-2 transition-all relative
                  ${billingCycle === BILLING_CYCLES.YEARLY
                    ? 'border-primary bg-primary-light'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  SAVE {Math.round(((tier.monthly_price * 12 - tier.yearly_price) / (tier.monthly_price * 12)) * 100)}%
                </div>
                <p className="font-semibold text-gray-900">Yearly</p>
                <p className="text-lg font-bold text-primary mt-1">
                  ₹{tier.yearly_price}/yr
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Discount Code */}
        {!isFree && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Discount Code</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <Button
                onClick={validateDiscountCode}
                loading={validatingCode}
                disabled={!discountCode.trim()}
                variant="outline"
              >
                Apply
              </Button>
            </div>
            {discount && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-green-700 font-semibold">
                  {discount.discount_type === 'percentage'
                    ? `${discount.discount_value}% off applied`
                    : `₹${discount.discount_value} off applied`}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Price Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Price Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>₹{pricing.original.toLocaleString('en-IN')}</span>
            </div>

            {discount && pricing.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({discountCode})</span>
                <span>-₹{pricing.discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-primary">
                {isFree ? 'Free' : `₹${pricing.final.toLocaleString('en-IN')}`}
              </span>
            </div>

            {billingCycle === BILLING_CYCLES.YEARLY && !isFree && (
              <p className="text-xs text-gray-500">
                Billed annually. ₹{Math.round(pricing.final / 12).toLocaleString('en-IN')}/month
              </p>
            )}
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm text-gray-700">
              I agree to the{' '}
              <a href="/terms" className="text-primary hover:underline">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
              {!isFree && '. I understand that my subscription will auto-renew unless cancelled.'}
            </span>
          </label>
        </div>

        {/* Payment Button */}
        <div className="sticky bottom-0 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <Button
            onClick={isFree ? handleFreeSubscription : handlePayment}
            loading={processing}
            disabled={!agreedToTerms}
            fullWidth
            size="lg"
          >
            {isFree ? 'Activate Free Plan' : `Pay ₹${pricing.final.toLocaleString('en-IN')}`}
          </Button>
          {!isFree && (
            <p className="text-xs text-gray-500 text-center mt-3">
              Secure payment powered by Razorpay
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCheckout;
