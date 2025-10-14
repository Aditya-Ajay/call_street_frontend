/**
 * PricingTierCard Component
 * Displays a pricing tier with edit and delete actions
 *
 * @param {object} tier - Pricing tier data
 * @param {function} onEdit - Called when edit button clicked
 * @param {function} onDelete - Called when delete button clicked
 * @param {function} onToggleActive - Called when active toggle changes
 */

import ToggleSwitch from './ToggleSwitch';
import Button from './Button';

const PricingTierCard = ({ tier, onEdit, onDelete, onToggleActive }) => {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
          {tier.description && (
            <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
          )}
        </div>
        <ToggleSwitch
          checked={tier.is_active}
          onChange={(checked) => onToggleActive(tier.id, checked)}
          id={`tier-active-${tier.id}`}
        />
      </div>

      {/* Pricing */}
      <div className="flex flex-wrap gap-4 mb-6">
        {tier.weekly_price && (
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary">
              ₹{tier.weekly_price.toLocaleString('en-IN')}
            </span>
            <span className="text-sm text-gray-600">per week</span>
          </div>
        )}
        {tier.monthly_price && (
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary">
              ₹{tier.monthly_price.toLocaleString('en-IN')}
            </span>
            <span className="text-sm text-gray-600">per month</span>
          </div>
        )}
        {tier.yearly_price && (
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary">
              ₹{tier.yearly_price.toLocaleString('en-IN')}
            </span>
            <span className="text-sm text-gray-600">per year</span>
          </div>
        )}
      </div>

      {/* Features */}
      {tier.features && tier.features.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Features:</h4>
          <ul className="space-y-2">
            {tier.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <svg
                  className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Subscriber Count */}
      {tier.subscriber_count !== undefined && (
        <div className="text-sm text-gray-600 mb-4">
          {tier.subscriber_count} subscriber{tier.subscriber_count !== 1 ? 's' : ''}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(tier)}
          className="flex-1"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(tier)}
          className="flex-1"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default PricingTierCard;
