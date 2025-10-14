/**
 * Onboarding Success Screen (Step 4/4)
 * Application submitted confirmation
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { analystAPI } from '../../../services/api';
import Button from '../../../components/common/Button';
import OnboardingProgress from '../../../components/onboarding/OnboardingProgress';

const OnboardingSuccess = () => {
  const navigate = useNavigate();
  const { formData, resetOnboarding } = useOnboarding();
  const { updateUser } = useAuth();
  const { success, error } = useToast();

  const [submitting, setSubmitting] = useState(true);
  const [submitError, setSubmitError] = useState(null);

  /**
   * Submit complete onboarding data to backend
   */
  useEffect(() => {
    const submitOnboarding = async () => {
      try {
        // Prepare payload
        const payload = {
          display_name: formData.display_name,
          bio: formData.bio,
          specializations: formData.specializations,
          languages: formData.languages,
          years_of_experience: formData.years_of_experience,
          allow_free_audience: formData.allow_free_audience,
          profile_photo_url: formData.profile_photo_url,
          pricing_tiers: formData.pricing_tiers,
          sebi_number: formData.sebi_number,
          ria_number: formData.ria_number,
          sebi_certificate_url: formData.sebi_certificate_url,
        };

        // Submit to backend
        const response = await analystAPI.setupProfile(payload);

        if (response.success) {
          // Update user in auth context
          updateUser({
            display_name: formData.display_name,
            profile_completed: false, // Still needs admin verification
            verification_status: 'pending',
          });

          // Clear onboarding data from localStorage
          resetOnboarding();

          success('Application submitted successfully!');
        }
      } catch (err) {
        console.error('Onboarding submission error:', err);
        setSubmitError(err.message || 'Failed to submit application');
        error(err.message || 'Failed to submit application');
      } finally {
        setSubmitting(false);
      }
    };

    submitOnboarding();
  }, []);

  /**
   * Navigate to dashboard
   */
  const handleGoToDashboard = () => {
    navigate('/dashboard', { replace: true });
  };

  /**
   * Retry submission if failed
   */
  const handleRetry = () => {
    setSubmitting(true);
    setSubmitError(null);
    window.location.reload();
  };

  if (submitting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">
            Submitting your application...
          </p>
          <p className="text-sm text-gray-600 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (submitError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
          <svg
            className="w-16 h-16 text-danger mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Submission Failed
          </h2>
          <p className="text-gray-600 mb-6">{submitError}</p>
          <Button onClick={handleRetry} fullWidth>
            Retry Submission
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-success min-h-screen bg-gray-50">
      <OnboardingProgress currentStep={4} totalSteps={4} />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Application Submitted Successfully!
          </h1>
          <p className="text-gray-600">
            Your profile has been submitted for verification. We will review your SEBI credentials within 24-48 hours.
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Application Summary
          </h2>

          {/* Checklist */}
          <div className="space-y-3">
            {/* Profile */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-0.5">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Profile Completed</p>
                <p className="text-sm text-gray-600">
                  {formData.display_name} • {formData.years_of_experience} years
                  experience
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-0.5">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Pricing Configured</p>
                <p className="text-sm text-gray-600">
                  {formData.pricing_tiers && formData.pricing_tiers.length > 0
                    ? `${formData.pricing_tiers.length} tier${
                        formData.pricing_tiers.length > 1 ? 's' : ''
                      } created (${formData.pricing_tiers.map((t) => t.name).join(', ')})`
                    : 'No pricing tiers configured'}
                </p>
              </div>
            </div>

            {/* SEBI */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-0.5">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">SEBI Certificate Uploaded</p>
                <p className="text-sm text-gray-600">
                  SEBI: {formData.sebi_number}
                  {formData.ria_number && ` • RIA: ${formData.ria_number}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
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
              <p className="text-sm text-blue-800 font-medium mb-1">What's Next?</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • Our team will review your SEBI certificate (usually 24-48 hours)
                </li>
                <li>• You'll receive an email/SMS notification once verified</li>
                <li>
                  • After approval, you can start posting calls and building your
                  community
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button onClick={handleGoToDashboard} fullWidth>
          Go to Dashboard
        </Button>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Need help?{' '}
          <a href="mailto:support@callstreet.com" className="text-primary hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default OnboardingSuccess;
