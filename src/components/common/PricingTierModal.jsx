/**
 * PricingTierModal Component
 * Modal for creating or editing pricing tiers
 *
 * @param {boolean} isOpen - Modal visibility
 * @param {function} onClose - Called when modal closes
 * @param {function} onSave - Called when save button clicked
 * @param {object} tier - Existing tier data (null for new tier)
 * @param {boolean} loading - Loading state during save
 */

import { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import ToggleSwitch from './ToggleSwitch';

const PricingTierModal = ({ isOpen, onClose, onSave, tier = null, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    weekly_price: '',
    monthly_price: '',
    yearly_price: '',
    features: [''],
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  // Initialize form with tier data if editing
  useEffect(() => {
    if (tier) {
      setFormData({
        name: tier.name || '',
        description: tier.description || '',
        weekly_price: tier.weekly_price || '',
        monthly_price: tier.monthly_price || '',
        yearly_price: tier.yearly_price || '',
        features: tier.features?.length > 0 ? tier.features : [''],
        is_active: tier.is_active ?? true,
      });
    } else {
      // Reset form for new tier
      setFormData({
        name: '',
        description: '',
        weekly_price: '',
        monthly_price: '',
        yearly_price: '',
        features: [''],
        is_active: true,
      });
    }
    setErrors({});
  }, [tier, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const removeFeature = (index) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, features: newFeatures }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Tier name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Tier name must be at least 3 characters';
    }

    // At least one price must be provided
    const hasPrice = formData.weekly_price || formData.monthly_price || formData.yearly_price;
    if (!hasPrice) {
      newErrors.pricing = 'At least one pricing option is required';
    }

    // Price validation
    if (formData.weekly_price && (isNaN(formData.weekly_price) || formData.weekly_price <= 0)) {
      newErrors.weekly_price = 'Weekly price must be a positive number';
    }
    if (formData.monthly_price && (isNaN(formData.monthly_price) || formData.monthly_price <= 0)) {
      newErrors.monthly_price = 'Monthly price must be a positive number';
    }
    if (formData.yearly_price && (isNaN(formData.yearly_price) || formData.yearly_price <= 0)) {
      newErrors.yearly_price = 'Yearly price must be a positive number';
    }

    // Price relationship validation
    if (formData.weekly_price && formData.monthly_price) {
      const weeklyMonthly = parseFloat(formData.weekly_price) * 4;
      if (weeklyMonthly >= parseFloat(formData.monthly_price)) {
        newErrors.monthly_price = 'Monthly price should be less than 4x weekly price';
      }
    }

    if (formData.monthly_price && formData.yearly_price) {
      const monthlyYearly = parseFloat(formData.monthly_price) * 12;
      if (monthlyYearly >= parseFloat(formData.yearly_price)) {
        newErrors.yearly_price = 'Yearly price should be less than 12x monthly price';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Filter out empty features
    const cleanedData = {
      ...formData,
      features: formData.features.filter((f) => f.trim() !== ''),
      weekly_price: formData.weekly_price ? parseFloat(formData.weekly_price) : null,
      monthly_price: formData.monthly_price ? parseFloat(formData.monthly_price) : null,
      yearly_price: formData.yearly_price ? parseFloat(formData.yearly_price) : null,
    };

    onSave(cleanedData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tier ? 'Edit Pricing Tier' : 'Create New Pricing Tier'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tier Name */}
        <div>
          <label htmlFor="tier-name" className="block text-sm font-semibold text-gray-700 mb-2">
            Tier Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="tier-name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Premium Plan"
            className={`
              w-full h-12 px-4 rounded-lg border-2
              focus:outline-none focus:ring-2 focus:ring-primary
              ${errors.name ? 'border-danger' : 'border-gray-300'}
            `}
            disabled={loading}
          />
          {errors.name && <p className="text-danger text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="tier-description" className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="tier-description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of this tier"
            rows={2}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            disabled={loading}
          />
        </div>

        {/* Pricing */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Pricing <span className="text-danger">*</span>
          </label>
          {errors.pricing && <p className="text-danger text-sm mb-2">{errors.pricing}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Weekly Price */}
            <div>
              <label htmlFor="weekly-price" className="block text-xs text-gray-600 mb-1">
                Weekly Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  id="weekly-price"
                  value={formData.weekly_price}
                  onChange={(e) => handleChange('weekly_price', e.target.value)}
                  placeholder="999"
                  min="0"
                  step="1"
                  className={`
                    w-full h-12 pl-8 pr-4 rounded-lg border-2
                    focus:outline-none focus:ring-2 focus:ring-primary
                    ${errors.weekly_price ? 'border-danger' : 'border-gray-300'}
                  `}
                  disabled={loading}
                />
              </div>
              {errors.weekly_price && <p className="text-danger text-xs mt-1">{errors.weekly_price}</p>}
            </div>

            {/* Monthly Price */}
            <div>
              <label htmlFor="monthly-price" className="block text-xs text-gray-600 mb-1">
                Monthly Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  id="monthly-price"
                  value={formData.monthly_price}
                  onChange={(e) => handleChange('monthly_price', e.target.value)}
                  placeholder="2999"
                  min="0"
                  step="1"
                  className={`
                    w-full h-12 pl-8 pr-4 rounded-lg border-2
                    focus:outline-none focus:ring-2 focus:ring-primary
                    ${errors.monthly_price ? 'border-danger' : 'border-gray-300'}
                  `}
                  disabled={loading}
                />
              </div>
              {errors.monthly_price && <p className="text-danger text-xs mt-1">{errors.monthly_price}</p>}
            </div>

            {/* Yearly Price */}
            <div>
              <label htmlFor="yearly-price" className="block text-xs text-gray-600 mb-1">
                Yearly Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  id="yearly-price"
                  value={formData.yearly_price}
                  onChange={(e) => handleChange('yearly_price', e.target.value)}
                  placeholder="29999"
                  min="0"
                  step="1"
                  className={`
                    w-full h-12 pl-8 pr-4 rounded-lg border-2
                    focus:outline-none focus:ring-2 focus:ring-primary
                    ${errors.yearly_price ? 'border-danger' : 'border-gray-300'}
                  `}
                  disabled={loading}
                />
              </div>
              {errors.yearly_price && <p className="text-danger text-xs mt-1">{errors.yearly_price}</p>}
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Features
          </label>
          <div className="space-y-3">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder="e.g., Daily intraday calls"
                  className="flex-1 h-12 px-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={loading}
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-danger text-danger hover:bg-danger hover:text-white transition-colors"
                    disabled={loading}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addFeature}
            className="mt-3 text-sm text-primary font-semibold hover:underline"
            disabled={loading}
          >
            + Add Feature
          </button>
        </div>

        {/* Active Toggle */}
        <div className="pt-4 border-t border-gray-200">
          <ToggleSwitch
            checked={formData.is_active}
            onChange={(checked) => handleChange('is_active', checked)}
            label="Active (visible to users)"
            id="tier-active"
            disabled={loading}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            fullWidth
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            {tier ? 'Update Tier' : 'Create Tier'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PricingTierModal;
