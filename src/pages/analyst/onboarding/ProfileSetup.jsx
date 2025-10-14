/**
 * Profile Setup Screen (Onboarding Step 1/4)
 * Collect analyst profile information
 */

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useToast } from '../../../contexts/ToastContext';
import { analystAPI } from '../../../services/api';
import Button from '../../../components/common/Button';
import OnboardingProgress from '../../../components/onboarding/OnboardingProgress';

const SPECIALIZATIONS = [
  'Equity',
  'Derivatives',
  'Commodities',
  'Forex',
  'Technical Analysis',
  'Fundamental Analysis',
  'Options Trading',
  'Swing Trading',
  'Intraday Trading',
];

const LANGUAGES = [
  'English',
  'Hindi',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Marathi',
  'Bengali',
  'Gujarati',
];

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, nextStep } = useOnboarding();
  const { success, error } = useToast();
  const fileInputRef = useRef(null);

  const [displayName, setDisplayName] = useState(formData.display_name || '');
  const [bio, setBio] = useState(formData.bio || '');
  const [specializations, setSpecializations] = useState(formData.specializations || []);
  const [languages, setLanguages] = useState(formData.languages || []);
  const [yearsOfExperience, setYearsOfExperience] = useState(formData.years_of_experience || '');
  const [allowFreeAudience, setAllowFreeAudience] = useState(formData.allow_free_audience ?? false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(formData.profile_photo_url || '');
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Handle specialization toggle
   */
  const toggleSpecialization = (spec) => {
    if (specializations.includes(spec)) {
      setSpecializations(specializations.filter((s) => s !== spec));
    } else {
      setSpecializations([...specializations, spec]);
    }
  };

  /**
   * Handle language toggle
   */
  const toggleLanguage = (lang) => {
    if (languages.includes(lang)) {
      setLanguages(languages.filter((l) => l !== lang));
    } else {
      setLanguages([...languages, lang]);
    }
  };

  /**
   * Handle photo file selection
   */
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        error('Please select an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        error('Image size must be less than 5MB');
        return;
      }

      setProfilePhoto(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Validate form
   */
  const validate = () => {
    const newErrors = {};

    if (displayName.trim().length < 3 || displayName.trim().length > 50) {
      newErrors.displayName = 'Display name must be between 3 and 50 characters';
    }

    if (bio.trim().length < 50 || bio.trim().length > 500) {
      newErrors.bio = 'Bio must be between 50 and 500 characters';
    }

    if (specializations.length === 0) {
      newErrors.specializations = 'Please select at least one specialization';
    }

    if (languages.length === 0) {
      newErrors.languages = 'Please select at least one language';
    }

    if (yearsOfExperience === '' || Number(yearsOfExperience) < 0 || Number(yearsOfExperience) > 50) {
      newErrors.yearsOfExperience = 'Years of experience must be between 0 and 50';
    }

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

    setUploading(true);

    try {
      let photoUrl = formData.profile_photo_url;

      // Upload photo if selected
      if (profilePhoto) {
        const photoFormData = new FormData();
        photoFormData.append('photo', profilePhoto);

        const uploadResponse = await analystAPI.uploadProfilePhoto(photoFormData);
        if (uploadResponse.success) {
          photoUrl = uploadResponse.data.photo_url;
        }
      }

      // Update onboarding context
      updateFormData({
        display_name: displayName.trim(),
        bio: bio.trim(),
        specializations,
        languages,
        years_of_experience: Number(yearsOfExperience),
        allow_free_audience: allowFreeAudience,
        profile_photo_url: photoUrl,
      });

      success('Profile information saved!');
      nextStep();
      navigate('/analyst/onboarding/pricing');
    } catch (err) {
      console.error('Profile setup error:', err);
      error(err.message || 'Failed to save profile information');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-setup min-h-screen bg-gray-50">
      <OnboardingProgress currentStep={1} totalSteps={4} />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Tell us about yourself and your expertise
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
          {/* Profile Photo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo (Optional)
            </label>
            <div className="flex items-center gap-4">
              {/* Preview */}
              <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Photo
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              JPG, PNG or GIF. Max size 5MB
            </p>
          </div>

          {/* Display Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="John Doe"
              className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.displayName ? 'border-danger' : 'border-gray-300'
              }`}
              required
            />
            {errors.displayName && (
              <p className="text-xs text-danger mt-1">{errors.displayName}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {displayName.length}/50 characters
            </p>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio <span className="text-danger">*</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell traders about your experience, trading philosophy, and what makes you unique..."
              rows={5}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
                errors.bio ? 'border-danger' : 'border-gray-300'
              }`}
              required
            />
            {errors.bio && (
              <p className="text-xs text-danger mt-1">{errors.bio}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {bio.length}/500 characters (minimum 50)
            </p>
          </div>

          {/* Specializations */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specializations <span className="text-danger">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SPECIALIZATIONS.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => toggleSpecialization(spec)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition border-2 ${
                    specializations.includes(spec)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
            {errors.specializations && (
              <p className="text-xs text-danger mt-2">{errors.specializations}</p>
            )}
          </div>

          {/* Languages */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Languages <span className="text-danger">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition border-2 ${
                    languages.includes(lang)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            {errors.languages && (
              <p className="text-xs text-danger mt-2">{errors.languages}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Select languages you can communicate in with your subscribers
            </p>
          </div>

          {/* Years of Experience */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              placeholder="5"
              min="0"
              max="50"
              className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.yearsOfExperience ? 'border-danger' : 'border-gray-300'
              }`}
              required
            />
            {errors.yearsOfExperience && (
              <p className="text-xs text-danger mt-1">{errors.yearsOfExperience}</p>
            )}
          </div>

          {/* Free Audience Option */}
          <div className="mb-8">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="flex items-center h-6">
                <input
                  type="checkbox"
                  checked={allowFreeAudience}
                  onChange={(e) => setAllowFreeAudience(e.target.checked)}
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition">
                  Allow free audience
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Users can follow you for free and see your free content. You can still create paid tiers for premium content.
                </p>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <Button type="submit" fullWidth loading={uploading}>
            Continue to Pricing
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
