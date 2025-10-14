/**
 * Login Page
 * Phone/Email OTP authentication with tabbed interface for Traders and Analysts
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/common/Button';
import { isValidPhone, isValidEmail } from '../utils/helpers';

const Login = () => {
  const [step, setStep] = useState('input'); // 'input' | 'sebi' | 'otp'
  const [identifier, setIdentifier] = useState('');
  const [sebiNumber, setSebiNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [type, setType] = useState('phone'); // 'phone' | 'email'

  // Remember last selected user type from localStorage
  const getInitialUserType = () => {
    const saved = localStorage.getItem('preferredUserType');
    return saved || 'trader';
  };

  const [userType, setUserType] = useState(getInitialUserType());
  const [loading, setLoading] = useState(false);
  const [sebiError, setSebiError] = useState('');

  const { requestOTP, verifyOTP, isAuthenticated, user, loading: authLoading } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  // Save user type preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('preferredUserType', userType);
  }, [userType]);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      // Check if analyst needs onboarding
      if (user.user_type === 'analyst' && !user.profile_completed) {
        navigate('/analyst/onboarding/profile', { replace: true });
      } else {
        const redirectPath = user.user_type === 'analyst' ? '/dashboard' : '/feed';
        navigate(redirectPath, { replace: true });
      }
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  const handleRequestOTP = async (e) => {
    e.preventDefault();

    // Validation
    if (type === 'phone' && !isValidPhone(identifier)) {
      error('Please enter a valid 10-digit phone number');
      return;
    }

    if (type === 'email' && !isValidEmail(identifier)) {
      error('Please enter a valid email address');
      return;
    }

    // For analysts, go to SEBI verification step first
    if (userType === 'analyst') {
      setStep('sebi');
      return;
    }

    // For traders, request OTP directly
    setLoading(true);

    try {
      const response = await requestOTP(identifier, type, userType);
      if (response.success) {
        success('OTP sent successfully!');
        setStep('otp');
      }
    } catch (err) {
      error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validate SEBI registration number format
   * Format: INA followed by 9 digits (e.g., INA000001234)
   */
  const isValidSebiNumber = (sebi) => {
    const sebiRegex = /^INA\d{9}$/;
    return sebiRegex.test(sebi);
  };

  const handleSebiSubmit = async (e) => {
    e.preventDefault();
    setSebiError('');

    // Validate SEBI number format
    if (!sebiNumber.trim()) {
      setSebiError('SEBI registration number is required');
      return;
    }

    if (!isValidSebiNumber(sebiNumber.trim())) {
      setSebiError('Invalid SEBI format. Must be INA followed by 9 digits (e.g., INA000001234)');
      return;
    }

    // Request OTP with SEBI number
    setLoading(true);

    try {
      const response = await requestOTP(identifier, type, userType, sebiNumber.trim());
      if (response.success) {
        success('OTP sent successfully!');
        setStep('otp');
      }
    } catch (err) {
      // Handle specific SEBI-related errors
      if (err.message && err.message.toLowerCase().includes('sebi')) {
        setSebiError(err.message);
      } else {
        error(err.message || 'Failed to send OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      error('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await verifyOTP(identifier, otp, type, userType);
      console.log('Login response:', response);

      if (response.success) {
        success('Login successful!');
        // Note: Navigation will happen via useEffect when auth state updates
      }
    } catch (err) {
      console.error('Login error:', err);
      error(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change - reset form when switching tabs
  const handleTabChange = (newUserType) => {
    if (newUserType !== userType) {
      setUserType(newUserType);
      // Reset form when switching tabs
      setStep('input');
      setIdentifier('');
      setSebiNumber('');
      setOtp('');
      setSebiError('');
    }
  };

  return (
    <div className="login-page min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">AnalystHub</h1>
          <p className="text-gray-600 mt-2">Welcome back! Sign in to continue</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => handleTabChange('trader')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all relative ${
                userType === 'trader'
                  ? 'text-primary bg-primary-light bg-opacity-20'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Trader
              </span>
              {userType === 'trader' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('analyst')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all relative ${
                userType === 'analyst'
                  ? 'text-primary bg-primary-light bg-opacity-20'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Analyst
              </span>
              {userType === 'analyst' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {/* Tab Description */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 text-center">
                {userType === 'trader'
                  ? 'Access expert trading insights and subscribe to top analysts'
                  : 'Share your expertise and build your community of traders'
                }
              </p>
            </div>

            {step === 'input' ? (
              <form onSubmit={handleRequestOTP}>
                {/* Type Toggle */}
                <div className="flex gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setType('phone')}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                      type === 'phone'
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Phone
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('email')}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                      type === 'email'
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </span>
                  </button>
                </div>

                {/* Input Field */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {type === 'phone' ? 'Phone Number' : 'Email Address'}
                  </label>
                  <div className="relative">
                    {type === 'phone' && (
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        +91
                      </div>
                    )}
                    <input
                      type={type === 'phone' ? 'tel' : 'email'}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        type === 'phone' ? '9876543210' : 'you@example.com'
                      }
                      className={`w-full h-14 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        type === 'phone' ? 'pl-14' : ''
                      }`}
                      required
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {type === 'phone'
                      ? 'Enter your 10-digit mobile number'
                      : 'Enter your email address'
                    }
                  </p>
                </div>

                <Button type="submit" fullWidth loading={loading} size="lg">
                  {loading ? 'Sending OTP...' : userType === 'analyst' ? 'Continue' : 'Send OTP'}
                </Button>
              </form>
            ) : step === 'sebi' ? (
              <form onSubmit={handleSebiSubmit}>
                {/* SEBI Verification Step */}
                <div className="mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 className="text-sm font-semibold text-blue-900 mb-1">SEBI Verification Required</h3>
                        <p className="text-xs text-blue-700">
                          To ensure the authenticity of our analyst community, please provide your SEBI registration number.
                        </p>
                      </div>
                    </div>
                  </div>

                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    SEBI Registration Number
                  </label>
                  <input
                    type="text"
                    value={sebiNumber}
                    onChange={(e) => {
                      setSebiNumber(e.target.value.toUpperCase());
                      setSebiError('');
                    }}
                    placeholder="INA000001234"
                    className={`w-full h-14 px-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all uppercase font-mono tracking-wider ${
                      sebiError
                        ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                        : 'border-gray-200 focus:ring-primary focus:border-transparent'
                    }`}
                    required
                    autoFocus
                    maxLength={12}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Format: INA followed by 9 digits (e.g., INA000001234)
                  </p>
                  {sebiError && (
                    <div className="mt-3 flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{sebiError}</span>
                    </div>
                  )}
                </div>

                <Button type="submit" fullWidth loading={loading} size="lg">
                  {loading ? 'Verifying...' : 'Continue to OTP Verification'}
                </Button>

                {/* Back to identifier input */}
                <button
                  type="button"
                  onClick={() => {
                    setStep('input');
                    setSebiNumber('');
                    setSebiError('');
                  }}
                  className="w-full mt-4 text-sm text-gray-600 hover:text-primary font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Change {type === 'phone' ? 'phone number' : 'email'}
                </button>

                {/* What is SEBI? Help link */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <details className="text-xs text-gray-600">
                    <summary className="cursor-pointer font-semibold text-primary hover:underline">
                      What is a SEBI registration number?
                    </summary>
                    <p className="mt-2 text-gray-600 leading-relaxed">
                      A SEBI registration number is a unique identifier issued by the Securities and Exchange Board of India
                      to authorized investment advisors and research analysts. It starts with "INA" followed by 9 digits.
                      You can find this on your SEBI registration certificate.
                    </p>
                  </details>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP}>
                {/* OTP Sent Message */}
                <div className="bg-primary-light bg-opacity-30 border border-primary-light rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-700 text-center">
                    Enter the 6-digit OTP sent to{' '}
                    <span className="font-semibold text-primary">{identifier}</span>
                  </p>
                </div>

                {/* OTP Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full h-16 px-4 border-2 border-gray-200 rounded-xl text-center text-3xl font-mono tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Check your {type === 'phone' ? 'SMS' : 'email inbox'}
                  </p>
                </div>

                <Button type="submit" fullWidth loading={loading} size="lg">
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </Button>

                {/* Change Identifier */}
                <button
                  type="button"
                  onClick={() => {
                    setStep('input');
                    setOtp('');
                  }}
                  className="w-full mt-4 text-sm text-gray-600 hover:text-primary font-medium transition-colors"
                >
                  Change {type === 'phone' ? 'phone number' : 'email'}
                </button>

                {/* Resend OTP */}
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      setLoading(true);
                      await requestOTP(identifier, type, userType);
                      success('OTP resent successfully!');
                    } catch (err) {
                      error(err.message || 'Failed to resend OTP');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="w-full mt-2 text-sm text-primary hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Resend OTP
                </button>
              </form>
            )}

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                {userType === 'trader' ? (
                  <>
                    New to AnalystHub?{' '}
                    <Link to="/discover" className="text-primary font-semibold hover:underline">
                      Browse Analysts
                    </Link>
                  </>
                ) : (
                  <>
                    Want to join as an analyst? Login to complete your profile and start sharing insights.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
