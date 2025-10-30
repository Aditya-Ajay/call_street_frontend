/**
 * Settings Page
 * Comprehensive settings page for analysts to manage profile, pricing, and preferences
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { settingsAPI } from '../services/api';
import Button from '../components/common/Button';
import ToggleSwitch from '../components/common/ToggleSwitch';
import PricingTierCard from '../components/common/PricingTierCard';
import PricingTierModal from '../components/common/PricingTierModal';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';

// Constants for specializations and languages
const SPECIALIZATIONS = [
  'Equity Trading',
  'F&O Trading',
  'Commodity Trading',
  'Technical Analysis',
  'Options Trading',
  'Intraday Trading',
  'Swing Trading',
  'Investment Advisory',
  'Forex Trading',
  'Crypto Trading',
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

const Settings = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { logout } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState('profile');

  // Loading States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    display_name: '',
    bio: '',
    profile_photo_url: '',
    specializations: [],
    languages: [],
    years_of_experience: '',
    allow_free_subscribers: false,
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Pricing Tiers State
  const [pricingTiers, setPricingTiers] = useState([]);
  const [tierModalOpen, setTierModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
  const [deleteTierModal, setDeleteTierModal] = useState(false);
  const [tierToDelete, setTierToDelete] = useState(null);

  // Preferences State
  const [preferences, setPreferences] = useState({
    email_notifications: {
      new_subscriber: true,
      subscription_renewal: true,
      subscription_cancellation: true,
      new_review: true,
    },
    push_notifications: true,
    sms_notifications: false,
    marketing_emails: true,
    privacy: {
      show_subscriber_count: true,
      show_revenue: false,
      allow_subscriber_dms: true,
    },
  });

  // Fetch data on mount
  const fetchAllSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [profileData, tiersData, prefsData] = await Promise.all([
        settingsAPI.getProfile(),
        settingsAPI.getPricingTiers(),
        settingsAPI.getPreferences(),
      ]);

      setProfile(profileData.data || profileData);
      setPricingTiers(tiersData.data || tiersData);
      setPreferences(prefsData.data || prefsData);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAllSettings();
  }, []);

  // ========================================
  // PROFILE TAB HANDLERS
  // ========================================

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (profileErrors[field]) {
      setProfileErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSpecializationToggle = (spec) => {
    setProfile((prev) => {
      const specializations = prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec];
      return { ...prev, specializations };
    });
  };

  const handleLanguageToggle = (lang) => {
    setProfile((prev) => {
      const languages = prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang];
      return { ...prev, languages };
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const validateProfile = () => {
    const errors = {};

    if (!profile.display_name.trim()) {
      errors.display_name = 'Display name is required';
    } else if (profile.display_name.length < 3 || profile.display_name.length > 50) {
      errors.display_name = 'Display name must be 3-50 characters';
    }

    if (profile.bio && profile.bio.length > 500) {
      errors.bio = 'Bio must be 500 characters or less';
    }

    if (profile.specializations.length === 0) {
      errors.specializations = 'Select at least one specialization';
    }

    if (profile.languages.length === 0) {
      errors.languages = 'Select at least one language';
    }

    if (profile.years_of_experience && (profile.years_of_experience < 0 || profile.years_of_experience > 50)) {
      errors.years_of_experience = 'Years of experience must be between 0 and 50';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setSaving(true);
    try {
      // Upload photo if changed
      if (photoFile) {
        const formData = new FormData();
        formData.append('photo', photoFile);
        await settingsAPI.uploadProfilePhoto(formData);
      }

      // Save profile data
      await settingsAPI.updateProfile(profile);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // PRICING TIERS TAB HANDLERS
  // ========================================

  const handleAddTier = () => {
    setEditingTier(null);
    setTierModalOpen(true);
  };

  const handleEditTier = (tier) => {
    setEditingTier(tier);
    setTierModalOpen(true);
  };

  const handleDeleteTier = (tier) => {
    setTierToDelete(tier);
    setDeleteTierModal(true);
  };

  const handleToggleTierActive = async (tierId, isActive) => {
    try {
      await settingsAPI.updatePricingTier(tierId, { is_active: isActive });
      setPricingTiers((prev) =>
        prev.map((t) => (t.id === tierId ? { ...t, is_active: isActive } : t))
      );
      toast.success(`Tier ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Failed to toggle tier:', error);
      toast.error('Failed to update tier status');
    }
  };

  const handleSaveTier = async (tierData) => {
    setSaving(true);
    try {
      if (editingTier) {
        // Update existing tier
        await settingsAPI.updatePricingTier(editingTier.id, tierData);
        setPricingTiers((prev) =>
          prev.map((t) => (t.id === editingTier.id ? { ...t, ...tierData } : t))
        );
        toast.success('Tier updated successfully');
      } else {
        // Create new tier
        const response = await settingsAPI.createPricingTier(tierData);
        setPricingTiers((prev) => [...prev, response.data || response]);
        toast.success('Tier created successfully');
      }
      setTierModalOpen(false);
      setEditingTier(null);
    } catch (error) {
      console.error('Failed to save tier:', error);
      toast.error(error.message || 'Failed to save tier');
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteTier = async () => {
    if (!tierToDelete) return;

    setSaving(true);
    try {
      await settingsAPI.deletePricingTier(tierToDelete.id);
      setPricingTiers((prev) => prev.filter((t) => t.id !== tierToDelete.id));
      toast.success('Tier deleted successfully');
      setDeleteTierModal(false);
      setTierToDelete(null);
    } catch (error) {
      console.error('Failed to delete tier:', error);
      toast.error(error.message || 'Failed to delete tier');
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // PREFERENCES TAB HANDLERS
  // ========================================

  const handleEmailNotificationToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      email_notifications: {
        ...prev.email_notifications,
        [key]: !prev.email_notifications[key],
      },
    }));
  };

  const handlePrivacyToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key],
      },
    }));
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      await settingsAPI.updatePreferences(preferences);
      toast.success('Preferences updated successfully');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast.error(error.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // RENDER HELPERS
  // ========================================

  const renderProfileTab = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 space-y-6">
        {/* Profile Photo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Profile Photo
          </label>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {photoPreview || profile.profile_photo_url ? (
                <img
                  src={photoPreview || profile.profile_photo_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <label htmlFor="photo-upload">
                <Button variant="outline" size="sm" as="span">
                  Change Photo
                </Button>
              </label>
              <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 5MB.</p>
            </div>
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label htmlFor="display-name" className="block text-sm font-semibold text-gray-700 mb-2">
            Display Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="display-name"
            value={profile.display_name}
            onChange={(e) => handleProfileChange('display_name', e.target.value)}
            placeholder="Your display name"
            className={`
              w-full h-12 px-4 rounded-lg border-2
              focus:outline-none focus:ring-2 focus:ring-primary
              ${profileErrors.display_name ? 'border-danger' : 'border-gray-300'}
            `}
          />
          {profileErrors.display_name && (
            <p className="text-danger text-sm mt-1">{profileErrors.display_name}</p>
          )}
        </div>

        {/* Bio */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="bio" className="block text-sm font-semibold text-gray-700">
              Bio / About
            </label>
            <span className="text-xs text-gray-500">
              {profile.bio.length}/500
            </span>
          </div>
          <textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => handleProfileChange('bio', e.target.value)}
            placeholder="Tell traders about yourself..."
            rows={4}
            maxLength={500}
            className={`
              w-full px-4 py-3 rounded-lg border-2
              focus:outline-none focus:ring-2 focus:ring-primary resize-none
              ${profileErrors.bio ? 'border-danger' : 'border-gray-300'}
            `}
          />
          {profileErrors.bio && (
            <p className="text-danger text-sm mt-1">{profileErrors.bio}</p>
          )}
        </div>

        {/* Specializations */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Specializations <span className="text-danger">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SPECIALIZATIONS.map((spec) => (
              <label
                key={spec}
                className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={profile.specializations.includes(spec)}
                  onChange={() => handleSpecializationToggle(spec)}
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{spec}</span>
              </label>
            ))}
          </div>
          {profileErrors.specializations && (
            <p className="text-danger text-sm mt-2">{profileErrors.specializations}</p>
          )}
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Languages <span className="text-danger">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {LANGUAGES.map((lang) => (
              <label
                key={lang}
                className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={profile.languages.includes(lang)}
                  onChange={() => handleLanguageToggle(lang)}
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{lang}</span>
              </label>
            ))}
          </div>
          {profileErrors.languages && (
            <p className="text-danger text-sm mt-2">{profileErrors.languages}</p>
          )}
        </div>

        {/* Years of Experience */}
        <div>
          <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-2">
            Years of Experience
          </label>
          <input
            type="number"
            id="experience"
            value={profile.years_of_experience}
            onChange={(e) => handleProfileChange('years_of_experience', e.target.value)}
            placeholder="0"
            min="0"
            max="50"
            className={`
              w-full sm:w-48 h-12 px-4 rounded-lg border-2
              focus:outline-none focus:ring-2 focus:ring-primary
              ${profileErrors.years_of_experience ? 'border-danger' : 'border-gray-300'}
            `}
          />
          {profileErrors.years_of_experience && (
            <p className="text-danger text-sm mt-1">{profileErrors.years_of_experience}</p>
          )}
        </div>

        {/* Allow Free Subscribers */}
        <div className="pt-4 border-t border-gray-200">
          <ToggleSwitch
            checked={profile.allow_free_subscribers}
            onChange={(checked) => handleProfileChange('allow_free_subscribers', checked)}
            label="Allow free subscribers (they can view your free content)"
            id="allow-free"
          />
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={saving}
            onClick={handleSaveProfile}
          >
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPricingTab = () => (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Your Pricing Tiers</h2>
          <p className="text-sm text-gray-600 mt-1">Manage subscription plans for your followers</p>
        </div>
        <Button variant="primary" size="md" onClick={handleAddTier}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Tier
        </Button>
      </div>

      {pricingTiers.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No pricing tiers yet</h3>
          <p className="text-gray-600 mb-4">Create your first pricing tier to start earning from subscriptions</p>
          <Button variant="primary" size="md" onClick={handleAddTier}>
            Create First Tier
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingTiers.map((tier) => (
            <PricingTierCard
              key={tier.id}
              tier={tier}
              onEdit={handleEditTier}
              onDelete={handleDeleteTier}
              onToggleActive={handleToggleTierActive}
            />
          ))}
        </div>
      )}
    </div>
  );

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await logout();
        toast.success('Logged out successfully');
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('Failed to logout');
      }
    }
  };

  const renderAccountTab = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Logout Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Account Actions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Logout</h4>
              <p className="text-sm text-gray-600">Sign out of your account</p>
            </div>
            <Button
              variant="outline"
              size="md"
              onClick={handleLogout}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Account Section - For Future */}
      <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
        <h3 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Delete Account</h4>
              <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
            </div>
            <Button
              variant="outline"
              size="md"
              onClick={() => toast.info('Contact support to delete your account')}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Email Notifications */}
      <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <ToggleSwitch
            checked={preferences.email_notifications.new_subscriber}
            onChange={() => handleEmailNotificationToggle('new_subscriber')}
            label="New subscriber"
            id="email-new-subscriber"
          />
          <ToggleSwitch
            checked={preferences.email_notifications.subscription_renewal}
            onChange={() => handleEmailNotificationToggle('subscription_renewal')}
            label="Subscription renewal"
            id="email-renewal"
          />
          <ToggleSwitch
            checked={preferences.email_notifications.subscription_cancellation}
            onChange={() => handleEmailNotificationToggle('subscription_cancellation')}
            label="Subscription cancellation"
            id="email-cancellation"
          />
          <ToggleSwitch
            checked={preferences.email_notifications.new_review}
            onChange={() => handleEmailNotificationToggle('new_review')}
            label="New review"
            id="email-review"
          />
        </div>
      </div>

      {/* Other Notifications */}
      <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Other Notifications</h3>
        <div className="space-y-4">
          <ToggleSwitch
            checked={preferences.push_notifications}
            onChange={(checked) => setPreferences((prev) => ({ ...prev, push_notifications: checked }))}
            label="Push notifications"
            id="push-notifications"
          />
          <ToggleSwitch
            checked={preferences.sms_notifications}
            onChange={(checked) => setPreferences((prev) => ({ ...prev, sms_notifications: checked }))}
            label="SMS notifications"
            id="sms-notifications"
          />
          <ToggleSwitch
            checked={preferences.marketing_emails}
            onChange={(checked) => setPreferences((prev) => ({ ...prev, marketing_emails: checked }))}
            label="Marketing emails"
            id="marketing-emails"
          />
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <ToggleSwitch
            checked={preferences.privacy.show_subscriber_count}
            onChange={() => handlePrivacyToggle('show_subscriber_count')}
            label="Show subscriber count publicly"
            id="show-subscribers"
          />
          <ToggleSwitch
            checked={preferences.privacy.show_revenue}
            onChange={() => handlePrivacyToggle('show_revenue')}
            label="Show revenue publicly"
            id="show-revenue"
          />
          <ToggleSwitch
            checked={preferences.privacy.allow_subscriber_dms}
            onChange={() => handlePrivacyToggle('allow_subscriber_dms')}
            label="Allow DMs from subscribers"
            id="allow-dms"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={saving}
          onClick={handleSavePreferences}
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );

  // ========================================
  // MAIN RENDER
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Tab Skeleton */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 w-24 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-8">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 sm:py-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
            <button
              onClick={() => navigate(-1)}
              className="sm:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
              aria-label="Go back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" role="tablist">
            <button
              onClick={() => setActiveTab('profile')}
              className={`
                py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap
                transition-colors
                ${activeTab === 'profile'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }
              `}
              role="tab"
              aria-selected={activeTab === 'profile'}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`
                py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap
                transition-colors
                ${activeTab === 'pricing'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }
              `}
              role="tab"
              aria-selected={activeTab === 'pricing'}
            >
              Pricing Tiers
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`
                py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap
                transition-colors
                ${activeTab === 'preferences'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }
              `}
              role="tab"
              aria-selected={activeTab === 'preferences'}
            >
              Preferences
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`
                py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap
                transition-colors
                ${activeTab === 'account'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }
              `}
              role="tab"
              aria-selected={activeTab === 'account'}
            >
              Account
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'pricing' && renderPricingTab()}
        {activeTab === 'preferences' && renderPreferencesTab()}
        {activeTab === 'account' && renderAccountTab()}
      </div>

      {/* Modals */}
      <PricingTierModal
        isOpen={tierModalOpen}
        onClose={() => {
          setTierModalOpen(false);
          setEditingTier(null);
        }}
        onSave={handleSaveTier}
        tier={editingTier}
        loading={saving}
      />

      <DeleteConfirmationModal
        isOpen={deleteTierModal}
        onClose={() => {
          setDeleteTierModal(false);
          setTierToDelete(null);
        }}
        onConfirm={confirmDeleteTier}
        title="Delete Pricing Tier"
        message="Are you sure you want to delete this pricing tier? Active subscribers will not be affected, but new users won't be able to subscribe to this tier."
        itemName={tierToDelete?.name}
        loading={saving}
      />
    </div>
  );
};

export default Settings;
