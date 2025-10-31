/**
 * Trader Onboarding Page
 * Multi-step form to collect trader information before OTP verification
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/common/Button';

const TraderOnboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { requestOTP } = useAuth();
  const { showToast } = useToast();

  // Get contact info from login page
  const { identifier, type } = location.state || {};

  // If no identifier, redirect back to login
  if (!identifier || !type) {
    navigate('/login', { replace: true });
    return null;
  }

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    age: '',
    tradingExperience: '',
    portfolioSize: '',
    tradingStyle: '',
    riskTolerance: '',
    interests: [],
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Trading experience options
  const experienceOptions = [
    { value: 'beginner', label: 'Beginner (0-1 year)', icon: '🌱' },
    { value: 'intermediate', label: 'Intermediate (1-3 years)', icon: '📈' },
    { value: 'advanced', label: 'Advanced (3-5 years)', icon: '🎯' },
    { value: 'expert', label: 'Expert (5+ years)', icon: '🏆' },
  ];

  // Portfolio size options
  const portfolioOptions = [
    { value: 'micro', label: 'Under ₹1 Lakh', icon: '💰' },
    { value: 'small', label: '₹1L - ₹5L', icon: '💵' },
    { value: 'medium', label: '₹5L - ₹25L', icon: '💸' },
    { value: 'large', label: '₹25L - ₹1Cr', icon: '💎' },
    { value: 'institutional', label: 'Above ₹1Cr', icon: '🏦' },
  ];

  // Trading style options
  const tradingStyleOptions = [
    { value: 'intraday', label: 'Intraday', icon: '⚡' },
    { value: 'swing', label: 'Swing Trading', icon: '🌊' },
    { value: 'positional', label: 'Positional', icon: '📊' },
    { value: 'longterm', label: 'Long-term Investment', icon: '🎯' },
    { value: 'mixed', label: 'Mixed Approach', icon: '🔄' },
  ];

  // Risk tolerance options
  const riskToleranceOptions = [
    { value: 'conservative', label: 'Conservative', desc: 'Safety first', icon: '🛡️' },
    { value: 'moderate', label: 'Moderate', desc: 'Balanced approach', icon: '⚖️' },
    { value: 'aggressive', label: 'Aggressive', desc: 'High risk, high reward', icon: '🚀' },
  ];

  // Interest options
  const interestOptions = [
    { value: 'stocks', label: 'Stocks', icon: '📈' },
    { value: 'options', label: 'Options & Derivatives', icon: '🎲' },
    { value: 'commodities', label: 'Commodities', icon: '🥇' },
    { value: 'forex', label: 'Forex', icon: '💱' },
    { value: 'crypto', label: 'Cryptocurrency', icon: '₿' },
    { value: 'mutual_funds', label: 'Mutual Funds', icon: '📊' },
  ];

  // Handle input change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Toggle interest
  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
    setErrors((prev) => ({ ...prev, interests: '' }));
  };

  // Validate username
  const validateUsername = (username) => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (username.length > 20) return 'Username must be less than 20 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
    return '';
  };

  // Validate step 1
  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      newErrors.username = usernameError;
    }

    const age = parseInt(formData.age);
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(age) || age < 18) {
      newErrors.age = 'You must be at least 18 years old';
    } else if (age > 100) {
      newErrors.age = 'Please enter a valid age';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate step 2
  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.tradingExperience) {
      newErrors.tradingExperience = 'Please select your trading experience';
    }

    if (!formData.portfolioSize) {
      newErrors.portfolioSize = 'Please select your portfolio size';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate step 3
  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.tradingStyle) {
      newErrors.tradingStyle = 'Please select your trading style';
    }

    if (!formData.riskTolerance) {
      newErrors.riskTolerance = 'Please select your risk tolerance';
    }

    if (formData.interests.length === 0) {
      newErrors.interests = 'Please select at least one area of interest';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    let isValid = false;

    if (step === 1) {
      isValid = validateStep1();
    } else if (step === 2) {
      isValid = validateStep2();
    }

    if (isValid) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle back
  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep3()) {
      return;
    }

    setLoading(true);

    try {
      // Store onboarding data in localStorage temporarily
      localStorage.setItem('traderOnboardingData', JSON.stringify(formData));

      // Request OTP
      const response = await requestOTP(identifier, type, 'trader');

      if (response.success) {
        showToast('OTP sent successfully!', 'success');
        // Navigate to OTP verification with state
        navigate('/verify-otp', {
          state: {
            identifier,
            type,
            userType: 'trader',
            onboardingData: formData,
          },
        });
      }
    } catch (error) {
      showToast(error.message || 'Failed to send OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">
              Step {step} of 3
            </span>
            <span className="text-sm text-gray-600">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {step === 1 && 'Welcome to AnalystHub!'}
              {step === 2 && 'Your Trading Profile'}
              {step === 3 && 'Trading Preferences'}
            </h1>
            <p className="text-gray-600">
              {step === 1 && "Let's start with the basics"}
              {step === 2 && 'Tell us about your trading experience'}
              {step === 3 && 'Customize your experience'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.fullName
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-primary focus:border-transparent'
                    }`}
                    autoFocus
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      @
                    </span>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleChange('username', e.target.value.toLowerCase())}
                      placeholder="choose_username"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.username
                          ? 'border-red-300 focus:ring-red-200'
                          : 'border-gray-200 focus:ring-primary focus:border-transparent'
                      }`}
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Letters, numbers, and underscores only
                  </p>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    placeholder="18"
                    min="18"
                    max="100"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.age
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-primary focus:border-transparent'
                    }`}
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    You must be 18 or older to use AnalystHub
                  </p>
                </div>

                {/* Contact Info Display */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-sm text-gray-600">
                    {type === 'phone' ? 'Phone Number' : 'Email'}: <span className="font-semibold text-gray-900">{identifier}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Trading Experience */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Trading Experience */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Trading Experience *
                  </label>
                  <div className="grid gap-3">
                    {experienceOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleChange('tradingExperience', option.value)}
                        className={`p-4 border-2 rounded-xl text-left transition-all ${
                          formData.tradingExperience === option.value
                            ? 'border-primary bg-primary-light bg-opacity-10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{option.icon}</span>
                          <span className="font-semibold text-gray-900">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.tradingExperience && (
                    <p className="mt-2 text-sm text-red-600">{errors.tradingExperience}</p>
                  )}
                </div>

                {/* Portfolio Size */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Current Portfolio Size *
                  </label>
                  <div className="grid gap-3">
                    {portfolioOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleChange('portfolioSize', option.value)}
                        className={`p-4 border-2 rounded-xl text-left transition-all ${
                          formData.portfolioSize === option.value
                            ? 'border-primary bg-primary-light bg-opacity-10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{option.icon}</span>
                          <span className="font-semibold text-gray-900">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.portfolioSize && (
                    <p className="mt-2 text-sm text-red-600">{errors.portfolioSize}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Trading Preferences */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Trading Style */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Preferred Trading Style *
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {tradingStyleOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleChange('tradingStyle', option.value)}
                        className={`p-4 border-2 rounded-xl text-left transition-all ${
                          formData.tradingStyle === option.value
                            ? 'border-primary bg-primary-light bg-opacity-10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{option.icon}</span>
                          <span className="font-semibold text-gray-900">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.tradingStyle && (
                    <p className="mt-2 text-sm text-red-600">{errors.tradingStyle}</p>
                  )}
                </div>

                {/* Risk Tolerance */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Risk Tolerance *
                  </label>
                  <div className="grid gap-3">
                    {riskToleranceOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleChange('riskTolerance', option.value)}
                        className={`p-4 border-2 rounded-xl text-left transition-all ${
                          formData.riskTolerance === option.value
                            ? 'border-primary bg-primary-light bg-opacity-10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{option.icon}</span>
                            <div>
                              <div className="font-semibold text-gray-900">{option.label}</div>
                              <div className="text-sm text-gray-600">{option.desc}</div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.riskTolerance && (
                    <p className="mt-2 text-sm text-red-600">{errors.riskTolerance}</p>
                  )}
                </div>

                {/* Areas of Interest */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Areas of Interest * <span className="text-xs text-gray-500">(Select all that apply)</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {interestOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleInterest(option.value)}
                        className={`p-3 border-2 rounded-xl text-center transition-all ${
                          formData.interests.includes(option.value)
                            ? 'border-primary bg-primary-light bg-opacity-10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{option.icon}</div>
                        <div className="text-xs font-semibold text-gray-900">{option.label}</div>
                      </button>
                    ))}
                  </div>
                  {errors.interests && (
                    <p className="mt-2 text-sm text-red-600">{errors.interests}</p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex gap-3">
              {step > 1 && (
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Back
                </Button>
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1"
                  size="lg"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1"
                  size="lg"
                  loading={loading}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default TraderOnboarding;
