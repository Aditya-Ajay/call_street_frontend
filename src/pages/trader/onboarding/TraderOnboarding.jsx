/**
 * Trader Onboarding Page
 * Simple onboarding flow for traders to complete their profile
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { traderAPI } from '../../../services/api';
import Button from '../../../components/common/Button';

// Constants from backend
const TRADING_INTERESTS = [
  'Intraday',
  'Swing',
  'Options',
  'Investment',
  'Technical',
  'Fundamental',
];

const LANGUAGES = [
  'English',
  'Hindi',
  'Hinglish',
  'Tamil',
  'Telugu',
  'Gujarati',
  'Marathi',
];

const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'New to trading' },
  { value: 'intermediate', label: 'Intermediate', description: '1-3 years experience' },
  { value: 'advanced', label: 'Advanced', description: '3+ years experience' },
];

const TraderOnboarding = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    trading_interests: [],
    preferred_languages: ['English'],
    experience_level: 'beginner',
    receive_notifications: true,
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => {
      const trading_interests = prev.trading_interests.includes(interest)
        ? prev.trading_interests.filter((i) => i !== interest)
        : [...prev.trading_interests, interest];
      return { ...prev, trading_interests };
    });
    if (errors.trading_interests) {
      setErrors((prev) => ({ ...prev, trading_interests: null }));
    }
  };

  const handleLanguageToggle = (language) => {
    setFormData((prev) => {
      const preferred_languages = prev.preferred_languages.includes(language)
        ? prev.preferred_languages.filter((l) => l !== language)
        : [...prev.preferred_languages, language];
      return { ...prev, preferred_languages };
    });
    if (errors.preferred_languages) {
      setErrors((prev) => ({ ...prev, preferred_languages: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (formData.display_name.trim() && formData.display_name.length < 2) {
      newErrors.display_name = 'Display name must be at least 2 characters';
    }

    if (formData.display_name.length > 50) {
      newErrors.display_name = 'Display name must be 50 characters or less';
    }

    if (formData.preferred_languages.length === 0) {
      newErrors.preferred_languages = 'Select at least one language';
    }

    if (!formData.experience_level) {
      newErrors.experience_level = 'Select your experience level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors before continuing');
      return;
    }

    setLoading(true);
    try {
      const response = await traderAPI.completeOnboarding(formData);

      if (response.success) {
        // Update user context
        updateUser({ profile_completed: true });

        toast.success('Welcome to CallStreet! Your profile is all set up.');

        // Redirect to discovery page
        navigate('/discovery');
      }
    } catch (error) {
      console.error('Onboarding failed:', error);
      toast.error(error.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-3xl font-bold text-primary mb-4">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <span>CallStreet</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome to CallStreet!
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Let's set up your profile to help you discover the best analysts
          </p>
        </div>

        {/* Onboarding Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-8">
          {/* Display Name */}
          <div>
            <label htmlFor="display-name" className="block text-sm font-semibold text-gray-700 mb-2">
              Display Name <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              id="display-name"
              value={formData.display_name}
              onChange={(e) => handleInputChange('display_name', e.target.value)}
              placeholder="How should we call you?"
              maxLength={50}
              className={`w-full h-12 px-4 rounded-lg border-2 transition-colors
                ${errors.display_name ? 'border-red-500' : 'border-gray-300'}
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              `}
            />
            {errors.display_name && (
              <p className="text-red-500 text-sm mt-1">{errors.display_name}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">This is how other traders will see you</p>
          </div>

          {/* Trading Interests */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Trading Interests <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TRADING_INTERESTS.map((interest) => (
                <label
                  key={interest}
                  className={`relative flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${formData.trading_interests.includes(interest)
                      ? 'border-primary bg-primary/5 text-primary font-medium'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={formData.trading_interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                    className="sr-only"
                  />
                  <span className="text-sm">{interest}</span>
                  {formData.trading_interests.includes(interest) && (
                    <svg className="w-5 h-5 absolute top-2 right-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Select the types of trading you're interested in</p>
          </div>

          {/* Preferred Languages */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Preferred Languages <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {LANGUAGES.map((language) => (
                <label
                  key={language}
                  className={`relative flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${formData.preferred_languages.includes(language)
                      ? 'border-primary bg-primary/5 text-primary font-medium'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={formData.preferred_languages.includes(language)}
                    onChange={() => handleLanguageToggle(language)}
                    className="sr-only"
                  />
                  <span className="text-sm">{language}</span>
                  {formData.preferred_languages.includes(language) && (
                    <svg className="w-5 h-5 absolute top-2 right-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </label>
              ))}
            </div>
            {errors.preferred_languages && (
              <p className="text-red-500 text-sm mt-2">{errors.preferred_languages}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">We'll show you analysts who speak these languages</p>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Trading Experience <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3">
              {EXPERIENCE_LEVELS.map((level) => (
                <label
                  key={level.value}
                  className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${formData.experience_level === level.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="experience_level"
                    value={level.value}
                    checked={formData.experience_level === level.value}
                    onChange={(e) => handleInputChange('experience_level', e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${formData.experience_level === level.value
                        ? 'border-primary'
                        : 'border-gray-300'
                      }
                    `}>
                      {formData.experience_level === level.value && (
                        <div className="w-3 h-3 rounded-full bg-primary" />
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${formData.experience_level === level.value ? 'text-primary' : 'text-gray-900'}`}>
                        {level.label}
                      </p>
                      <p className="text-sm text-gray-500">{level.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.experience_level && (
              <p className="text-red-500 text-sm mt-2">{errors.experience_level}</p>
            )}
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Receive Notifications</p>
              <p className="text-sm text-gray-600">Get updates about new calls and market insights</p>
            </div>
            <button
              type="button"
              onClick={() => handleInputChange('receive_notifications', !formData.receive_notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${formData.receive_notifications ? 'bg-primary' : 'bg-gray-300'}
              `}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${formData.receive_notifications ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Complete Setup
            </Button>
          </div>
        </form>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => navigate('/discovery')}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TraderOnboarding;
