/**
 * AnalystCard Component
 * Displays analyst preview in discovery grid
 *
 * @param {Object} analyst - Analyst data
 * @param {Function} onClick - Click handler to view profile (optional)
 */

import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatCompactNumber } from '../utils/helpers';

const AnalystCard = ({ analyst, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(analyst);
    } else {
      navigate(`/analyst/${analyst._id || analyst.id}`);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Free';
    return formatCurrency(price);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-5 hover:shadow-xl hover:border-primary transition-all cursor-pointer group"
    >
      {/* Header: Profile Photo & Name */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative flex-shrink-0">
          <img
            src={analyst.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(analyst.name || analyst.full_name)}&background=10B981&color=fff&size=128`}
            alt={analyst.name || analyst.full_name}
            className="w-16 h-16 rounded-full object-cover border-3 border-primary-light"
            loading="lazy"
          />
          {(analyst.sebi_verified || analyst.verified) && (
            <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 shadow-lg" title="SEBI Verified">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-primary transition">
            {analyst.name || analyst.full_name || analyst.display_name}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {analyst.tagline || analyst.specializations?.[0] || 'Market Analyst'}
          </p>
        </div>
      </div>

      {/* Rating & Subscribers */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-1">
          <svg className={`w-5 h-5 ${getRatingColor(analyst.rating || analyst.avg_rating)}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-bold text-gray-900">
            {analyst.rating || analyst.avg_rating ? Number(analyst.rating || analyst.avg_rating).toFixed(1) : 'New'}
          </span>
          {(analyst.total_reviews || analyst.review_count) > 0 && (
            <span className="text-xs text-gray-500">
              ({formatCompactNumber(analyst.total_reviews || analyst.review_count)})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="text-xs font-medium">
            {formatCompactNumber(analyst.subscriber_count || analyst.total_subscribers || 0)}
          </span>
        </div>
      </div>

      {/* Specializations Tags */}
      {(analyst.specializations || analyst.expertise_areas) && (analyst.specializations || analyst.expertise_areas).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {(analyst.specializations || analyst.expertise_areas).slice(0, 2).map((spec, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary-light text-primary text-xs font-medium rounded-full"
            >
              {spec}
            </span>
          ))}
          {(analyst.specializations || analyst.expertise_areas).length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              +{(analyst.specializations || analyst.expertise_areas).length - 2}
            </span>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Calls</p>
          <p className="text-sm font-bold text-gray-900">
            {formatCompactNumber(analyst.total_posts || analyst.total_calls_made || 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Accuracy</p>
          <p className={`text-sm font-bold ${analyst.accuracy >= 80 ? 'text-green-600' : analyst.accuracy >= 70 ? 'text-blue-600' : 'text-gray-900'}`}>
            {analyst.accuracy || analyst.success_rate ? `${analyst.accuracy || analyst.success_rate}%` : 'N/A'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Response</p>
          <p className="text-sm font-bold text-gray-900">
            {analyst.avg_reply_time || '< 1h'}
          </p>
        </div>
      </div>

      {/* Free Audience Badge (if available) */}
      {analyst.has_free_audience && (
        <div className="mb-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Free Content Available
          </span>
        </div>
      )}

      {/* Price & CTA */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Starting at</p>
          <p className="text-lg font-bold text-primary">
            {formatPrice(analyst.min_price)}
            {analyst.min_price > 0 && <span className="text-xs text-gray-500 font-normal">/month</span>}
          </p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark active:scale-98 transition-all text-sm min-h-touch shadow-md">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default AnalystCard;
