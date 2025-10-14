/**
 * Pricing Setup Screen (Onboarding Step 2/4)
 * Configure custom subscription tiers with weekly/monthly/yearly pricing
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useToast } from '../../../contexts/ToastContext';
import Button from '../../../components/common/Button';
import OnboardingProgress from '../../../components/onboarding/OnboardingProgress';

/**
 * Empty tier template
 */
const createEmptyTier = () => ({
  id: Date.now() + Math.random(),
  name: '',
  features: [''],
  weeklyPrice: '',
  monthlyPrice: '',
  yearlyPrice: '',
  isActive: true,
});

const PricingSetup = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, nextStep, prevStep } = useOnboarding();
  const { success, error } = useToast();

  // Initialize tiers from saved data or create one empty tier
  const [tiers, setTiers] = useState(
    formData.pricing_tiers && formData.pricing_tiers.length > 0
      ? formData.pricing_tiers
      : [createEmptyTier()]
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Add a new tier
   */
  const addTier = () => {
    if (tiers.length >= 5) {
      error('You can create a maximum of 5 tiers');
      return;
    }
    setTiers([...tiers, createEmptyTier()]);
  };

  /**
   * Remove a tier
   */
  const removeTier = (tierId) => {
    if (tiers.length === 1) {
      error('You must have at least one tier');
      return;
    }
    setTiers(tiers.filter((tier) => tier.id !== tierId));
  };

  /**
   * Update tier field
   */
  const updateTier = (tierId, field, value) => {
    setTiers(
      tiers.map((tier) =>
        tier.id === tierId ? { ...tier, [field]: value } : tier
      )
    );
  };

  /**
   * Add feature to tier
   */
  const addFeature = (tierId) => {
    setTiers(
      tiers.map((tier) =>
        tier.id === tierId
          ? { ...tier, features: [...tier.features, ''] }
          : tier
      )
    );
  };

  /**
   * Remove feature from tier
   */
  const removeFeature = (tierId, featureIndex) => {
    setTiers(
      tiers.map((tier) =>
        tier.id === tierId
          ? {
              ...tier,
              features: tier.features.filter((_, idx) => idx !== featureIndex),
            }
          : tier
      )
    );
  };

  /**
   * Update feature text
   */
  const updateFeature = (tierId, featureIndex, value) => {
    setTiers(
      tiers.map((tier) =>
        tier.id === tierId
          ? {
              ...tier,
              features: tier.features.map((feature, idx) =>
                idx === featureIndex ? value : feature
              ),
            }
          : tier
      )
    );
  };

  /**
   * Toggle tier active status
   */
  const toggleTierActive = (tierId) => {
    setTiers(
      tiers.map((tier) =>
        tier.id === tierId ? { ...tier, isActive: !tier.isActive } : tier
      )
    );
  };

  /**
   * Validate form
   */
  const validate = () => {
    const newErrors = {};

    // Check if at least one tier is active
    const hasActiveTier = tiers.some((tier) => tier.isActive);
    if (!hasActiveTier) {
      error('Please enable at least one tier');
      return false;
    }

    // Validate each active tier
    tiers.forEach((tier, index) => {
      if (!tier.isActive) return;

      const tierKey = `tier_${index}`;

      // Validate tier name
      if (!tier.name.trim()) {
        newErrors[`${tierKey}_name`] = 'Tier name is required';
      }

      // Validate features
      const validFeatures = tier.features.filter((f) => f.trim().length > 0);
      if (validFeatures.length === 0) {
        newErrors[`${tierKey}_features`] = 'Add at least one feature';
      }

      // Validate prices
      const weekly = parseFloat(tier.weeklyPrice);
      const monthly = parseFloat(tier.monthlyPrice);
      const yearly = parseFloat(tier.yearlyPrice);

      // Check if at least one price is provided
      if (!tier.weeklyPrice && !tier.monthlyPrice && !tier.yearlyPrice) {
        newErrors[`${tierKey}_prices`] =
          'Provide at least one pricing option (weekly, monthly, or yearly)';
      }

      // Validate price values
      if (tier.weeklyPrice && (isNaN(weekly) || weekly <= 0)) {
        newErrors[`${tierKey}_weekly`] = 'Invalid weekly price';
      }
      if (tier.monthlyPrice && (isNaN(monthly) || monthly <= 0)) {
        newErrors[`${tierKey}_monthly`] = 'Invalid monthly price';
      }
      if (tier.yearlyPrice && (isNaN(yearly) || yearly <= 0)) {
        newErrors[`${tierKey}_yearly`] = 'Invalid yearly price';
      }

      // Validate price logic: weekly < monthly < (yearly/12)
      if (tier.weeklyPrice && tier.monthlyPrice) {
        if (weekly * 4 >= monthly) {
          newErrors[`${tierKey}_price_logic`] =
            'Weekly price should be less than monthly when both are set';
        }
      }

      if (tier.monthlyPrice && tier.yearlyPrice) {
        if (monthly * 12 >= yearly) {
          newErrors[`${tierKey}_price_logic`] =
            'Yearly price should offer savings compared to monthly';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      error('Please fix the errors before continuing');
      return;
    }

    setLoading(true);

    try {
      // Clean up tiers data
      const cleanedTiers = tiers
        .filter((tier) => tier.isActive)
        .map((tier) => ({
          name: tier.name.trim(),
          features: tier.features.filter((f) => f.trim().length > 0),
          weeklyPrice: tier.weeklyPrice ? parseFloat(tier.weeklyPrice) : null,
          monthlyPrice: tier.monthlyPrice
            ? parseFloat(tier.monthlyPrice)
            : null,
          yearlyPrice: tier.yearlyPrice ? parseFloat(tier.yearlyPrice) : null,
          isActive: true,
        }));

      // Update onboarding context
      updateFormData({
        pricing_tiers: cleanedTiers,
      });

      success('Pricing configuration saved!');
      nextStep();
      navigate('/analyst/onboarding/sebi');
    } catch (err) {
      console.error('Pricing setup error:', err);
      error(err.message || 'Failed to save pricing configuration');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle back button
   */
  const handleBack = () => {
    prevStep();
    navigate('/analyst/onboarding/profile');
  };

  /**
   * Calculate estimated revenue
   */
  const calculateEstimatedRevenue = (tier) => {
    const monthly = tier.monthlyPrice ? parseFloat(tier.monthlyPrice) : 0;
    const yearly = tier.yearlyPrice ? parseFloat(tier.yearlyPrice) : 0;
    const weekly = tier.weeklyPrice ? parseFloat(tier.weeklyPrice) : 0;

    // Show monthly equivalent
    if (monthly > 0) return `₹${monthly}/month`;
    if (yearly > 0) return `₹${(yearly / 12).toFixed(0)}/month`;
    if (weekly > 0) return `₹${(weekly * 4).toFixed(0)}/month`;
    return '₹0/month';
  };

  return (
    <div className="pricing-setup min-h-screen bg-gray-50">
      <OnboardingProgress currentStep={2} totalSteps={4} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Create Your Pricing Tiers
          </h1>
          <p className="text-gray-600">
            Set up multiple subscription tiers with flexible pricing options
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-blue-800 font-medium mb-1">
                Flexible Pricing Options
              </p>
              <p className="text-sm text-blue-700">
                Create multiple tiers (Basic, Pro, Premium, etc.) with weekly,
                monthly, or yearly pricing. Subscribers can choose what works
                best for them.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Tiers */}
          <div className="space-y-6 mb-6">
            {tiers.map((tier, tierIndex) => {
              const tierKey = `tier_${tierIndex}`;
              const hasError = Object.keys(errors).some((key) =>
                key.startsWith(tierKey)
              );

              return (
                <div
                  key={tier.id}
                  className={`bg-white rounded-xl shadow-md p-6 border-2 transition ${
                    tier.isActive
                      ? hasError
                        ? 'border-danger'
                        : 'border-primary'
                      : 'border-gray-200 opacity-60'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        Tier {tierIndex + 1}
                        {tier.name && `: ${tier.name}`}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          tier.isActive
                            ? 'bg-primary-light text-primary'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {tier.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Toggle Active */}
                      <button
                        type="button"
                        onClick={() => toggleTierActive(tier.id)}
                        className={`w-12 h-7 rounded-full transition relative ${
                          tier.isActive ? 'bg-primary' : 'bg-gray-300'
                        }`}
                        title={tier.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <div
                          className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            tier.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>

                      {/* Remove Tier */}
                      {tiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTier(tier.id)}
                          className="w-8 h-8 flex items-center justify-center text-danger hover:bg-danger-light rounded-lg transition"
                          title="Remove tier"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {tier.isActive && (
                    <>
                      {/* Tier Name */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tier Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          value={tier.name}
                          onChange={(e) =>
                            updateTier(tier.id, 'name', e.target.value)
                          }
                          placeholder="e.g., Basic, Pro, Premium"
                          className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors[`${tierKey}_name`]
                              ? 'border-danger'
                              : 'border-gray-300'
                          }`}
                        />
                        {errors[`${tierKey}_name`] && (
                          <p className="text-xs text-danger mt-1">
                            {errors[`${tierKey}_name`]}
                          </p>
                        )}
                      </div>

                      {/* Pricing Options */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pricing Options{' '}
                          <span className="text-danger">*</span>
                          <span className="text-xs text-gray-500 font-normal ml-2">
                            (Set at least one)
                          </span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Weekly Price */}
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              Weekly (₹)
                            </label>
                            <input
                              type="number"
                              value={tier.weeklyPrice}
                              onChange={(e) =>
                                updateTier(
                                  tier.id,
                                  'weeklyPrice',
                                  e.target.value
                                )
                              }
                              placeholder="299"
                              min="0"
                              step="1"
                              className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                                errors[`${tierKey}_weekly`]
                                  ? 'border-danger'
                                  : 'border-gray-300'
                              }`}
                            />
                          </div>

                          {/* Monthly Price */}
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              Monthly (₹)
                            </label>
                            <input
                              type="number"
                              value={tier.monthlyPrice}
                              onChange={(e) =>
                                updateTier(
                                  tier.id,
                                  'monthlyPrice',
                                  e.target.value
                                )
                              }
                              placeholder="999"
                              min="0"
                              step="1"
                              className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                                errors[`${tierKey}_monthly`]
                                  ? 'border-danger'
                                  : 'border-gray-300'
                              }`}
                            />
                          </div>

                          {/* Yearly Price */}
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              Yearly (₹)
                            </label>
                            <input
                              type="number"
                              value={tier.yearlyPrice}
                              onChange={(e) =>
                                updateTier(
                                  tier.id,
                                  'yearlyPrice',
                                  e.target.value
                                )
                              }
                              placeholder="9999"
                              min="0"
                              step="1"
                              className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                                errors[`${tierKey}_yearly`]
                                  ? 'border-danger'
                                  : 'border-gray-300'
                              }`}
                            />
                          </div>
                        </div>
                        {(errors[`${tierKey}_prices`] ||
                          errors[`${tierKey}_price_logic`]) && (
                          <p className="text-xs text-danger mt-1">
                            {errors[`${tierKey}_prices`] ||
                              errors[`${tierKey}_price_logic`]}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Monthly equivalent: {calculateEstimatedRevenue(tier)}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="mb-0">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Features/Benefits{' '}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="space-y-2">
                          {tier.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex gap-2">
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) =>
                                  updateFeature(
                                    tier.id,
                                    featureIndex,
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., Daily market analysis"
                                className="flex-1 h-10 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                              {tier.features.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeFeature(tier.id, featureIndex)
                                  }
                                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-danger hover:bg-gray-100 rounded-lg transition"
                                  title="Remove feature"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => addFeature(tier.id)}
                          className="mt-2 text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Add Feature
                        </button>
                        {errors[`${tierKey}_features`] && (
                          <p className="text-xs text-danger mt-1">
                            {errors[`${tierKey}_features`]}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Tier Button */}
          {tiers.length < 5 && (
            <button
              type="button"
              onClick={addTier}
              className="w-full h-14 border-2 border-dashed border-gray-300 rounded-xl text-primary hover:border-primary hover:bg-primary-light hover:bg-opacity-10 font-medium transition flex items-center justify-center gap-2 mb-8"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Another Tier (Max 5)
            </button>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="w-full md:w-auto"
            >
              Back
            </Button>
            <Button type="submit" loading={loading} fullWidth>
              Continue to SEBI Verification
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PricingSetup;
