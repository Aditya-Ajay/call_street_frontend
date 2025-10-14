/**
 * Application Constants
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  INVITE_CODE: 'signup_invite_code',
  DISCOUNT_CODE: 'signup_discount_code',
};

// Post Strategy Types
export const STRATEGY_TYPES = {
  INTRADAY: 'intraday',
  SWING: 'swing',
  INVESTMENT: 'investment',
  OPTIONS: 'options',
};

// Post Action Types
export const ACTION_TYPES = {
  BUY: 'buy',
  SELL: 'sell',
  HOLD: 'hold',
};

// Confidence Levels
export const CONFIDENCE_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

// Subscription Billing Cycles
export const BILLING_CYCLES = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ANALYST: 'analyst',
  ADMIN: 'admin',
};

// Verification Statuses
export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};

// Chat Channel Types
export const CHANNEL_TYPES = {
  ANNOUNCEMENTS: 'announcements',
  GENERAL: 'general',
  STRATEGY_DISCUSSION: 'strategy_discussion',
  QA: 'qa',
};

// Filter Options
export const FILTER_OPTIONS = {
  ALL: 'all',
  TODAY: 'today',
  URGENT: 'urgent',
};

// Sort Options
export const SORT_OPTIONS = {
  HIGHEST_RATED: 'rating_desc',
  MOST_SUBSCRIBERS: 'subscribers_desc',
  LOWEST_PRICE: 'price_asc',
  NEWEST: 'created_desc',
};

// Debounce Delay (ms)
export const SEARCH_DEBOUNCE_DELAY = 300;

// Pagination
export const ITEMS_PER_PAGE = 20;

// Toast Duration (ms)
export const TOAST_DURATION = 3000;

// Analyst Specializations
export const SPECIALIZATIONS = [
  'Technical Analysis',
  'Fundamental Analysis',
  'Options Trading',
  'Commodity Trading',
  'Forex Trading',
  'Swing Trading',
  'Intraday Trading',
];

// Onboarding Storage Key
export const ONBOARDING_STORAGE_KEY = 'analyst_onboarding_data';

// Feed Channel Types
export const FEED_CHANNEL_TYPES = {
  FREE_ANNOUNCEMENTS: 'free-announcements',
  FREE_CALLS: 'free-calls',
  PAID_ANNOUNCEMENTS: 'paid-announcements',
  PAID_CALLS: 'paid-calls',
  COMMUNITY_CHAT: 'community-chat',
};

// Subscription Tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
  PRO: 'pro',
};
