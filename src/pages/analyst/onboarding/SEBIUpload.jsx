/**
 * SEBI Certificate Upload Screen (Onboarding Step 3/4)
 * Upload SEBI registration certificate
 */

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useToast } from '../../../contexts/ToastContext';
import { analystAPI } from '../../../services/api';
import Button from '../../../components/common/Button';
import OnboardingProgress from '../../../components/onboarding/OnboardingProgress';

const SEBIUpload = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, nextStep, prevStep, resetOnboarding } = useOnboarding();
  const { success, error } = useToast();
  const fileInputRef = useRef(null);

  const [sebiNumber, setSebiNumber] = useState(formData.sebi_number || '');
  const [riaNumber, setRiaNumber] = useState(formData.ria_number || '');
  const [certificateFile, setCertificateFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Handle file selection
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (PDF or images)
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        error('Please select a PDF or image file (JPG, PNG)');
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        error('File size must be less than 10MB');
        return;
      }

      setCertificateFile(file);
      setFileName(file.name);
    }
  };

  /**
   * Validate form
   */
  const validate = () => {
    const newErrors = {};

    if (sebiNumber.trim().length === 0) {
      newErrors.sebiNumber = 'SEBI registration number is required';
    }

    if (!certificateFile && !formData.sebi_certificate_file) {
      newErrors.certificateFile = 'Please upload your SEBI certificate';
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
      // Store file and SEBI info in context
      updateFormData({
        sebi_number: sebiNumber.trim(),
        ria_number: riaNumber.trim(),
        sebi_certificate_file: certificateFile, // Store file object
      });

      success('SEBI information saved! Redirecting to dashboard...');

      // For now, skip submission and go directly to dashboard
      setTimeout(() => {
        resetOnboarding();
        navigate('/dashboard', { replace: true });
      }, 1000);
    } catch (err) {
      console.error('SEBI save error:', err);
      error(err.message || 'Failed to save SEBI information');
    } finally {
      setUploading(false);
    }
  };

  /**
   * Handle back button
   */
  const handleBack = () => {
    prevStep();
    navigate('/analyst/onboarding/pricing');
  };

  return (
    <div className="sebi-upload min-h-screen bg-gray-50">
      <OnboardingProgress currentStep={3} totalSteps={4} />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            SEBI Credentials Verification
          </h1>
          <p className="text-gray-600">
            Upload your SEBI registration certificate for verification
          </p>
        </div>

        {/* Info Banner */}
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
              <p className="text-sm text-blue-800 font-medium mb-1">
                SEBI Registration Required
              </p>
              <p className="text-sm text-blue-700">
                All analysts must have a valid SEBI registration (Research Analyst or
                Investment Advisor). Your certificate will be verified by our team before
                your profile is approved.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
          {/* SEBI Number */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEBI Registration Number <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={sebiNumber}
              onChange={(e) => setSebiNumber(e.target.value)}
              placeholder="INA000001234"
              className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.sebiNumber ? 'border-danger' : 'border-gray-300'
              }`}
              required
            />
            {errors.sebiNumber && (
              <p className="text-xs text-danger mt-1">{errors.sebiNumber}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Example: INA000001234, INH000001234, etc.
            </p>
          </div>

          {/* RIA Number (Optional) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RIA Registration Number{' '}
              <span className="text-xs text-gray-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={riaNumber}
              onChange={(e) => setRiaNumber(e.target.value)}
              placeholder="INA000005678"
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              If you're also a Registered Investment Advisor (RIA), add your RIA number here
            </p>
          </div>

          {/* Certificate Upload */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEBI Certificate <span className="text-danger">*</span>
            </label>

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition hover:border-primary hover:bg-primary-light hover:bg-opacity-10 ${
                errors.certificateFile ? 'border-danger' : 'border-gray-300'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,image/jpeg,image/jpg,image/png"
                className="hidden"
              />

              {fileName || formData.sebi_certificate_file ? (
                <div className="flex flex-col items-center">
                  <svg
                    className="w-12 h-12 text-primary mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="font-medium text-gray-900 mb-1">
                    {fileName || formData.sebi_certificate_file?.name || 'Certificate uploaded'}
                  </p>
                  <p className="text-sm text-primary">Click to change file</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="font-medium text-gray-900 mb-1">
                    Click to upload SEBI certificate
                  </p>
                  <p className="text-sm text-gray-500">PDF or Image (JPG, PNG), max 10MB</p>
                </div>
              )}
            </div>

            {errors.certificateFile && (
              <p className="text-xs text-danger mt-1">{errors.certificateFile}</p>
            )}
          </div>

          {/* Example Section */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm font-medium text-gray-700 mb-2">
              What is a SEBI Registration?
            </p>
            <p className="text-sm text-gray-600 mb-3">
              SEBI (Securities and Exchange Board of India) requires all stock market
              analysts to be registered as:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Research Analyst (RA) - Registration number starts with INA</li>
              <li>
                • Registered Investment Advisor (RIA) - Registration number starts with INA or INH
              </li>
            </ul>
            <p className="text-sm text-gray-600 mt-3">
              If you hold both certifications, you can provide both numbers above.
            </p>
          </div>

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
            <Button type="submit" loading={uploading} fullWidth>
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SEBIUpload;
