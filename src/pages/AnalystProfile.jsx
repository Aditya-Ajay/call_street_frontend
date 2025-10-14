/**
 * Analyst Profile Page
 * Complete profile page showing analyst information, stats, pricing tiers, and posts
 * URL: /analyst/:id
 *
 * Features:
 * - Professional profile section with photo, bio, and verification badges
 * - Real-time stats grid (posts, subscribers, rating, reviews)
 * - Subscription pricing tiers with features
 * - Recent posts/calls from the analyst
 * - Specializations and languages
 * - Mobile-first responsive design
 * - Loading states with skeleton screens
 * - Error handling with user-friendly messages
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analystAPI, subscriptionAPI, postAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { formatCurrency, formatRating, formatCompactNumber } from '../utils/helpers';
import PricingCard from '../components/PricingCard';
import PostCard from '../components/PostCard';
import Button from '../components/common/Button';

const AnalystProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [analyst, setAnalyst] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalystData();
  }, [id]);

  const fetchAnalystData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch analyst profile and pricing tiers in parallel
      const [analystResponse, tiersResponse] = await Promise.all([
        analystAPI.getAnalystById(id),
        subscriptionAPI.getPricingTiers(id).catch(() => ({ data: { tiers: [] } })) // Graceful fallback
      ]);

      const profileData = analystResponse.data?.profile || analystResponse.data;
      console.log('Profile data:', profileData);
      setAnalyst(profileData);
      setTiers(tiersResponse.data?.tiers || []);

      // Fetch recent posts after profile loads using user_id from profile
      if (profileData?.user_id) {
        console.log('Fetching posts for user_id:', profileData.user_id);
        fetchRecentPosts(profileData.user_id);
      } else {
        console.warn('No user_id found in profile data');
      }
    } catch (error) {
      console.error('Failed to load analyst profile:', error);
      setError(error.message || 'Failed to load analyst profile');
      showToast('Failed to load analyst profile. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentPosts = async (userId) => {
    try {
      setLoadingPosts(true);
      const response = await postAPI.getPosts({
        analyst_id: userId,
        limit: 5,
        sort: 'recent'
      });

      console.log('Posts API response:', response);

      // Handle different response structures
      // Case 1: Interceptor worked - response = { success: true, data: { posts: [...] } }
      // Case 2: Direct access - response = { posts: [...] }
      let posts = [];

      if (response.data && Array.isArray(response.data.posts)) {
        posts = response.data.posts;
      } else if (Array.isArray(response.posts)) {
        posts = response.posts;
      } else if (Array.isArray(response.data)) {
        posts = response.data;
      } else if (Array.isArray(response)) {
        posts = response;
      }

      console.log('Extracted posts:', posts.length, 'posts');
      setRecentPosts(posts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      // Don't show error toast for posts - just fail silently
      setRecentPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleSubscribe = (tier) => {
    if (!tier) return;

    // If it's a free tier, navigate to follow flow
    if (tier.is_free_tier || tier.price_monthly === 0) {
      showToast('Following analyst...', 'info');
      // TODO: Implement follow functionality
      return;
    }

    // Navigate to subscription checkout
    navigate(`/subscribe/${id}/${tier._id || tier.id}`);
  };

  const handleBookmark = async (postId) => {
    try {
      await postAPI.bookmarkPost(postId);
      showToast('Post saved to bookmarks', 'success');
    } catch (error) {
      showToast('Failed to bookmark post', 'error');
    }
  };

  // Loading State - Skeleton Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="animate-pulse">
          {/* Hero Skeleton */}
          <div className="bg-gradient-to-br from-primary to-green-600 h-64 sm:h-72" />

          <div className="max-w-4xl mx-auto px-4">
            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 -mt-16 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md h-24" />
              ))}
            </div>

            {/* Content Skeleton */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl h-32" />
              <div className="bg-white rounded-xl h-48" />
              <div className="bg-white rounded-xl h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State - Analyst Not Found
  if (error || !analyst) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyst not found</h2>
          <p className="text-gray-600 mb-6">
            The analyst profile you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/discovery')} size="lg">
            Browse Analysts
          </Button>
        </div>
      </div>
    );
  }

  // Find recommended tier (usually the middle tier or "Pro")
  const recommendedTier = tiers.find(t =>
    t.tier_name?.toLowerCase() === 'pro' ||
    t.tier_name?.toLowerCase() === 'premium'
  ) || tiers[1] || tiers[0];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* ============================================ */}
      {/* HERO SECTION - Profile Header */}
      {/* ============================================ */}
      <div className="bg-gradient-to-br from-primary to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Profile Photo */}
            <div className="relative flex-shrink-0">
              <img
                src={analyst.photo_url || analyst.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(analyst.display_name || analyst.name)}&size=200&background=10b981&color=fff&bold=true`}
                alt={analyst.display_name || analyst.name}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-2xl"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(analyst.display_name || analyst.name)}&size=200&background=10b981&color=fff&bold=true`;
                }}
              />

              {/* SEBI Verified Badge */}
              {(analyst.sebi_verified || analyst.sebi_number) && (
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg" title="SEBI Verified">
                  <svg className="w-7 h-7 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {/* Featured Badge */}
              {analyst.is_featured && (
                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full shadow-lg">
                  <span className="text-xs font-bold">FEATURED</span>
                </div>
              )}
            </div>

            {/* Name, Bio & Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                {analyst.display_name || analyst.name}
              </h1>

              {analyst.bio && (
                <p className="text-white/95 text-base sm:text-lg mb-4 leading-relaxed max-w-2xl">
                  {analyst.bio}
                </p>
              )}

              {/* Rating & Subscriber Count */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(analyst.avg_rating || analyst.rating || 0)
                            ? 'text-yellow-300'
                            : 'text-white/30'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-bold text-lg">
                    {formatRating(analyst.avg_rating || analyst.rating)}
                  </span>
                  {(analyst.total_reviews > 0) && (
                    <span className="text-white/90 text-sm">
                      ({analyst.total_reviews} {analyst.total_reviews === 1 ? 'review' : 'reviews'})
                    </span>
                  )}
                </div>

                {/* Subscribers */}
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-white/90" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span className="font-bold text-lg">
                    {formatCompactNumber(analyst.active_subscribers || analyst.subscriber_count || 0)}
                  </span>
                  <span className="text-white/90 text-sm">subscribers</span>
                </div>
              </div>

              {/* Specializations & Languages */}
              <div className="mt-6 space-y-3">
                {/* Specializations */}
                {analyst.specializations && analyst.specializations.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-white/90 text-sm font-semibold mr-1">Specializations:</span>
                    {analyst.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/30"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}

                {/* Languages */}
                {analyst.languages && analyst.languages.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-white/90 text-sm font-semibold mr-1">Languages:</span>
                    {analyst.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white rounded-full text-xs font-medium"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* STATS GRID */}
      {/* ============================================ */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Posts */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center hover:shadow-xl transition-shadow">
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
              {formatCompactNumber(analyst.total_posts || 0)}
            </p>
            <p className="text-sm text-gray-600 font-medium">Total Calls</p>
          </div>

          {/* Active Subscribers */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center hover:shadow-xl transition-shadow">
            <p className="text-3xl sm:text-4xl font-bold text-primary mb-1">
              {formatCompactNumber(analyst.active_subscribers || analyst.subscriber_count || 0)}
            </p>
            <p className="text-sm text-gray-600 font-medium">Subscribers</p>
          </div>

          {/* Average Rating */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center gap-1 mb-1">
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                {formatRating(analyst.avg_rating || analyst.rating)}
              </p>
            </div>
            <p className="text-sm text-gray-600 font-medium">Avg Rating</p>
          </div>

          {/* Total Reviews */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center hover:shadow-xl transition-shadow">
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
              {formatCompactNumber(analyst.total_reviews || 0)}
            </p>
            <p className="text-sm text-gray-600 font-medium">Reviews</p>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* PRICING TIERS SECTION */}
      {/* ============================================ */}
      {tiers.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mb-12">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Subscription Plans
            </h2>
            <p className="text-gray-600">
              Choose the plan that works best for you. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <PricingCard
                key={tier._id || tier.id}
                tier={tier}
                onSubscribe={handleSubscribe}
                isPopular={tier._id === recommendedTier?._id || tier.tier_name?.toLowerCase() === 'pro'}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State - No Pricing Tiers */}
      {tiers.length === 0 && (
        <div className="max-w-4xl mx-auto px-4 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Pricing Plans Yet
            </h3>
            <p className="text-gray-600">
              This analyst hasn't set up subscription plans yet. Check back soon!
            </p>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* RECENT POSTS SECTION */}
      {/* ============================================ */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Recent Calls & Analysis
          </h2>
          <p className="text-gray-600">
            Latest trading calls and market analysis from {analyst.display_name || analyst.name}
          </p>
        </div>

        {/* Loading Posts */}
        {loadingPosts && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm h-64 animate-pulse" />
            ))}
          </div>
        )}

        {/* Posts List */}
        {!loadingPosts && recentPosts.length > 0 && (
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <PostCard
                key={post._id || post.id}
                post={post}
                onBookmark={handleBookmark}
                isBookmarked={false}
              />
            ))}
          </div>
        )}

        {/* Empty State - No Posts */}
        {!loadingPosts && recentPosts.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Posts Yet
            </h3>
            <p className="text-gray-600 mb-6">
              This analyst hasn't published any trading calls yet. Subscribe to get notified when they post!
            </p>
            {recommendedTier && (
              <Button onClick={() => handleSubscribe(recommendedTier)} size="lg">
                Subscribe Now
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* FIXED BOTTOM CTA (Mobile Only) */}
      {/* ============================================ */}
      {recommendedTier && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-40 sm:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Starting at</p>
              <p className="text-xl font-bold text-primary">
                {recommendedTier.price_monthly === 0 || !recommendedTier.price_monthly
                  ? 'Free'
                  : formatCurrency(recommendedTier.price_monthly)}
                {recommendedTier.price_monthly > 0 && <span className="text-sm text-gray-600">/mo</span>}
              </p>
            </div>
            <Button
              onClick={() => handleSubscribe(recommendedTier)}
              size="lg"
              className="flex-shrink-0"
            >
              {recommendedTier.price_monthly === 0 ? 'Follow Free' : 'Subscribe Now'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalystProfile;
