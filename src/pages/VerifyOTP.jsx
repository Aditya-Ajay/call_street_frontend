/**
 * OTP Verification Page
 * Verifies OTP and completes trader onboarding
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { traderAPI } from '../services/api';
import Button from '../components/common/Button';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, requestOTP } = useAuth();
  const { showToast } = useToast();

  // Get data from previous page
  const { identifier, type, userType, onboardingData } = location.state || {};

  // If no identifier, redirect back to login
  useEffect(() => {
    if (!identifier || !type) {
      navigate('/login', { replace: true });
      showToast('Session expired. Please start again.', 'error');
    }
  }, [identifier, type, navigate, showToast]);

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Handle OTP input change
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  // Handle verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      showToast('Please enter a 6-digit OTP', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await verifyOTP(identifier, otp, type, userType);

      if (response.success) {
        // If trader with onboarding data, send profile completion request
        if (userType === 'trader' && onboardingData) {
          try {
            // Prepare onboarding data for API
            const profileData = {
              full_name: onboardingData.fullName,
              username: onboardingData.username,
              age: parseInt(onboardingData.age),
              trading_experience: onboardingData.tradingExperience,
              portfolio_size: onboardingData.portfolioSize,
              trading_style: onboardingData.tradingStyle,
              risk_tolerance: onboardingData.riskTolerance,
              interests: onboardingData.interests,
            };

            await traderAPI.completeOnboarding(profileData);
            console.log('✅ Trader profile completed successfully');
          } catch (profileError) {
            console.error('Failed to save profile data:', profileError);
            // Don't block login if profile update fails - user can complete later
          }
        }

        showToast('Welcome to AnalystHub!', 'success');
        // Navigation will be handled by Login.jsx useEffect
      }
    } catch (error) {
      showToast(error.message || 'Invalid OTP. Please try again.', 'error');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (!canResend || resendLoading) return;

    setResendLoading(true);

    try {
      await requestOTP(identifier, type, userType);
      showToast('OTP sent successfully!', 'success');
      setResendTimer(30);
      setCanResend(false);
    } catch (error) {
      showToast(error.message || 'Failed to resend OTP', 'error');
    } finally {
      setResendLoading(false);
    }
  };

  if (!identifier || !type) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">AnalystHub</h1>
          <p className="text-gray-600 mt-2">Verify your {type === 'phone' ? 'phone number' : 'email'}</p>
        </div>

        {/* OTP Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {/* OTP Sent Message */}
          <div className="bg-primary-light bg-opacity-30 border border-primary-light rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  OTP sent successfully
                </p>
                <p className="text-sm text-gray-700">
                  We've sent a 6-digit code to{' '}
                  <span className="font-semibold text-primary break-all">{identifier}</span>
                </p>
              </div>
            </div>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                maxLength={6}
                className="w-full h-16 px-4 border-2 border-gray-200 rounded-xl text-center text-3xl font-mono tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
                autoFocus
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Check your {type === 'phone' ? 'SMS messages' : 'email inbox'}
              </p>
            </div>

            <Button type="submit" fullWidth loading={loading} size="lg">
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            {canResend ? (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendLoading}
                className="text-sm text-primary hover:underline font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            ) : (
              <p className="text-sm text-gray-600">
                Resend OTP in <span className="font-semibold text-primary">{resendTimer}s</span>
              </p>
            )}
          </div>

          {/* Change Contact Info */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                if (userType === 'trader' && onboardingData) {
                  navigate('/trader-onboarding', {
                    state: { identifier, type },
                  });
                } else {
                  navigate('/login');
                }
              }}
              className="text-sm text-gray-600 hover:text-primary font-medium transition-colors"
            >
              Change {type === 'phone' ? 'phone number' : 'email'}
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <details className="text-xs text-gray-600">
              <summary className="cursor-pointer font-semibold text-gray-700 hover:text-primary">
                Didn't receive the OTP?
              </summary>
              <ul className="mt-3 space-y-2 text-gray-600 list-disc list-inside">
                <li>Check your spam/junk folder (for email)</li>
                <li>Make sure you entered the correct {type === 'phone' ? 'phone number' : 'email'}</li>
                <li>Wait for {resendTimer}s and click "Resend OTP"</li>
                <li>Check your network connection</li>
              </ul>
            </details>
          </div>
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

export default VerifyOTP;
