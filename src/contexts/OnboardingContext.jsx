/**
 * Onboarding Context
 * Manages analyst onboarding flow state and persistence
 */

import { createContext, useContext, useState, useEffect } from 'react';

const OnboardingContext = createContext(null);

const ONBOARDING_STORAGE_KEY = 'analyst_onboarding_data';

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Profile data
    display_name: '',
    bio: '',
    specializations: [],
    languages: [],
    years_of_experience: '',
    allow_free_audience: false,
    profile_photo_url: '',

    // Pricing data (custom tiers)
    pricing_tiers: [],

    // SEBI data
    sebi_number: '',
    ria_number: '',
    sebi_certificate_url: '',
  });

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed.formData || formData);
        setCurrentStep(parsed.currentStep || 1);
      } catch (error) {
        console.error('Failed to parse saved onboarding data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      formData,
      currentStep,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(dataToSave));
  }, [formData, currentStep]);

  /**
   * Update form data
   * @param {object} data - Partial form data to update
   */
  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  /**
   * Go to next step
   */
  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  /**
   * Go to previous step
   */
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  /**
   * Go to specific step
   * @param {number} step - Step number (1-4)
   */
  const goToStep = (step) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  };

  /**
   * Reset onboarding data
   */
  const resetOnboarding = () => {
    setFormData({
      display_name: '',
      bio: '',
      specializations: [],
      languages: [],
      years_of_experience: '',
      allow_free_audience: false,
      profile_photo_url: '',
      pricing_tiers: [],
      sebi_number: '',
      ria_number: '',
      sebi_certificate_url: '',
    });
    setCurrentStep(1);
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  };

  /**
   * Check if current step is valid
   * @param {number} step - Step number to validate
   * @returns {boolean} Is step valid
   */
  const isStepValid = (step) => {
    switch (step) {
      case 1: // Profile Setup
        return (
          formData.display_name.trim().length >= 3 &&
          formData.display_name.trim().length <= 50 &&
          formData.bio.trim().length >= 50 &&
          formData.bio.trim().length <= 500 &&
          formData.specializations.length > 0 &&
          formData.languages.length > 0 &&
          formData.years_of_experience !== '' &&
          Number(formData.years_of_experience) >= 0 &&
          Number(formData.years_of_experience) <= 50
        );

      case 2: // Pricing Setup
        return (
          formData.pricing_tiers &&
          formData.pricing_tiers.length > 0 &&
          formData.pricing_tiers.some((tier) => tier.isActive)
        );

      case 3: // SEBI Upload
        return (
          formData.sebi_number.trim().length > 0 &&
          formData.sebi_certificate_url.trim().length > 0
        );

      default:
        return true;
    }
  };

  const value = {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    resetOnboarding,
    isStepValid,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export default OnboardingContext;
