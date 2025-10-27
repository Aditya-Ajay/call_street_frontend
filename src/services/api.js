/**
 * API Service Layer
 * Centralized Axios client with interceptors for authentication and error handling
 */

import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// Create Axios instance with cookie-based authentication
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // Important: Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add Authorization header from localStorage
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (fallback if cookies don't work)
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API] 🔑 Added Authorization header to ${config.url}`);
    } else {
      console.log(`[API] ⚠️ No token found in localStorage for ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Skip refresh if this is the refresh-token endpoint itself
      if (originalRequest.url?.includes('/auth/refresh-token')) {
        return Promise.reject(error);
      }

      // Skip refresh if this is the /auth/me check (avoid loop)
      if (originalRequest.url?.includes('/auth/me')) {
        return Promise.reject(error);
      }

      try {
        // Try to refresh the access token (cookie-based)
        await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Retry original request (cookies will be automatically sent)
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - just reject, don't redirect
        // Let the calling component handle the error
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data,
    });
  }
);

export default apiClient;

// ============================================
// AUTHENTICATION APIs
// ============================================

export const authAPI = {
  /**
   * Request OTP for phone number
   * @param {string} phone - Phone number (+91XXXXXXXXXX)
   * @param {string} userType - 'analyst' or 'trader' (optional)
   * @param {string} sebiNumber - SEBI registration number (for analysts only)
   */
  requestPhoneOTP: (phone, userType, sebiNumber = null) => {
    const payload = { phone, user_type: userType };
    if (sebiNumber) payload.sebi_number = sebiNumber;
    return apiClient.post('/auth/request-otp', payload);
  },

  /**
   * Request OTP for email
   * @param {string} email - Email address
   * @param {string} userType - 'analyst' or 'trader' (optional)
   * @param {string} sebiNumber - SEBI registration number (for analysts only)
   */
  requestEmailOTP: (email, userType, sebiNumber = null) => {
    const payload = { email, user_type: userType };
    if (sebiNumber) payload.sebi_number = sebiNumber;
    return apiClient.post('/auth/request-otp', payload);
  },

  /**
   * Unified request OTP (auto-detects phone or email)
   * @param {string} identifier - Phone or email
   * @param {string} userType - 'analyst' or 'trader' (optional)
   * @param {string} sebiNumber - SEBI registration number (for analysts only)
   */
  requestOTP: (identifier, userType, sebiNumber = null) => {
    const isEmail = identifier.includes('@');
    const payload = { user_type: userType };

    if (isEmail) {
      payload.email = identifier;
    } else {
      payload.phone = identifier;
    }

    if (sebiNumber) {
      payload.sebi_number = sebiNumber;
    }

    return apiClient.post('/auth/request-otp', payload);
  },

  /**
   * Signup with phone (sends OTP)
   * @param {string} phone - Phone number (+91XXXXXXXXXX)
   * @param {string} userType - 'analyst' or 'trader' (optional)
   */
  signupWithPhone: (phone, userType) =>
    apiClient.post('/auth/signup/phone', { phone }),

  /**
   * Signup with email (sends OTP)
   * @param {string} email - Email address
   * @param {string} userType - 'analyst' or 'trader' (optional)
   */
  signupWithEmail: (email, userType) =>
    apiClient.post('/auth/signup/email', { email, user_type: userType }),

  /**
   * Verify OTP and complete signup/login
   * @param {string} phone - Phone number (if phone-based auth)
   * @param {string} email - Email address (if email-based auth)
   * @param {string} otp - 6-digit OTP code
   * @param {string} userType - 'analyst' or 'trader' (optional, for signup)
   */
  verifyOTP: (phone, email, otp, userType) => {
    const payload = { otp };

    // Only include non-null fields
    if (phone) payload.phone = phone;
    if (email) payload.email = email;
    if (userType) payload.user_type = userType;

    return apiClient.post('/auth/verify-otp', payload);
  },

  /**
   * Resend OTP
   * @param {string} phone - Phone number (if phone-based)
   * @param {string} email - Email address (if email-based)
   */
  resendOTP: (phone, email) => {
    const payload = {};

    // Only include non-null fields
    if (phone) payload.phone = phone;
    if (email) payload.email = email;

    return apiClient.post('/auth/resend-otp', payload);
  },

  /**
   * Login with email and password
   * @param {string} email - Email address
   * @param {string} password - Password
   */
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),

  /**
   * Logout user
   */
  logout: () => apiClient.post('/auth/logout'),

  /**
   * Refresh access token
   */
  refreshToken: () => apiClient.post('/auth/refresh-token'),

  /**
   * Request password reset
   * @param {string} email - Email address
   */
  forgotPassword: (email) =>
    apiClient.post('/auth/forgot-password', { email }),

  /**
   * Reset password with token
   * @param {string} token - Reset token from email
   * @param {string} newPassword - New password
   */
  resetPassword: (token, newPassword) =>
    apiClient.post('/auth/reset-password', { token, new_password: newPassword }),

  /**
   * Get current user profile
   */
  getCurrentUser: () => apiClient.get('/auth/me'),
};

// ============================================
// ANALYST APIs
// ============================================

export const analystAPI = {
  /**
   * Get all analysts (public, with filters and pagination)
   */
  getAnalysts: (params) => apiClient.get('/analysts/discovery', { params }),

  /**
   * Get analyst by ID (public)
   */
  getAnalystById: (id) => apiClient.get(`/analysts/profile/${id}`),

  /**
   * Get analyst profile (authenticated)
   */
  getAnalystProfile: (id) => apiClient.get(`/analysts/profile/${id}`),

  /**
   * Get featured analysts
   */
  getFeaturedAnalysts: () => apiClient.get('/analysts/featured'),

  /**
   * Apply to become analyst
   */
  applyAsAnalyst: (data) => apiClient.post('/analysts/apply', data),

  /**
   * Update analyst profile
   */
  updateProfile: (data) => apiClient.put('/analysts/profile', data),

  /**
   * Setup analyst profile (onboarding)
   */
  setupProfile: (data) => apiClient.post('/analysts/profile/setup', data),

  /**
   * Upload profile photo
   */
  uploadProfilePhoto: (formData) =>
    apiClient.post('/analysts/profile/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /**
   * Upload document for verification
   */
  uploadDocument: (formData) =>
    apiClient.post('/analysts/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /**
   * Get analyst reviews
   */
  getReviews: (analystId, params) =>
    apiClient.get(`/analysts/${analystId}/reviews`, { params }),

  /**
   * Submit review for analyst
   */
  submitReview: (analystId, data) =>
    apiClient.post(`/analysts/${analystId}/reviews`, data),
};

// ============================================
// POST APIs
// ============================================

export const postAPI = {
  /**
   * Get all posts (user feed)
   */
  getPosts: (params) => apiClient.get('/posts', { params }),

  /**
   * Get post by ID
   */
  getPostById: (id) => apiClient.get(`/posts/${id}`),

  /**
   * Create new post (analyst only)
   */
  createPost: (data) => apiClient.post('/posts', data),

  /**
   * Update post
   */
  updatePost: (id, data) => apiClient.put(`/posts/${id}`, data),

  /**
   * Delete post
   */
  deletePost: (id) => apiClient.delete(`/posts/${id}`),

  /**
   * Bookmark post
   */
  bookmarkPost: (postId) => apiClient.post(`/posts/${postId}/bookmark`),

  /**
   * Remove bookmark
   */
  removeBookmark: (postId) => apiClient.delete(`/posts/${postId}/bookmark`),

  /**
   * Get user bookmarks
   */
  getBookmarks: (params) => apiClient.get('/posts/bookmarks', { params }),
};

// ============================================
// SUBSCRIPTION APIs
// ============================================

export const subscriptionAPI = {
  /**
   * Get analyst pricing tiers
   */
  getPricingTiers: (analystId) =>
    apiClient.get(`/subscriptions/tiers/${analystId}`),

  /**
   * Create subscription order
   */
  createOrder: (data) => apiClient.post('/subscriptions/create-order', data),

  /**
   * Verify payment and activate subscription
   */
  verifyPayment: (data) => apiClient.post('/subscriptions/verify-payment', data),

  /**
   * Get user subscriptions
   */
  getUserSubscriptions: () => apiClient.get('/subscriptions/my-subscriptions'),

  /**
   * Cancel subscription
   */
  cancelSubscription: (subscriptionId) =>
    apiClient.post(`/subscriptions/${subscriptionId}/cancel`),

  /**
   * Get analyst subscribers (analyst only)
   */
  getSubscribers: (params) =>
    apiClient.get('/subscriptions/my-subscribers', { params }),
};

// ============================================
// CHAT APIs
// ============================================

export const chatAPI = {
  /**
   * Get chat channels for analyst
   */
  getChannels: (analystId) => apiClient.get(`/chat/channels/${analystId}`),

  /**
   * Get messages for channel
   */
  getMessages: (channelId, params) =>
    apiClient.get(`/chat/messages/${channelId}`, { params }),

  /**
   * Send message
   */
  sendMessage: (channelId, data) =>
    apiClient.post(`/chat/messages/${channelId}`, data),

  /**
   * Delete message
   */
  deleteMessage: (messageId) => apiClient.delete(`/chat/messages/${messageId}`),
};

// ============================================
// INVITE & DISCOUNT APIs
// ============================================

export const inviteAPI = {
  /**
   * Generate invite link (analyst only)
   */
  generateInviteLink: (data) => apiClient.post('/invites/generate', data),

  /**
   * Get analyst invite links
   */
  getMyInviteLinks: (params) => apiClient.get('/invites/my-links', { params }),

  /**
   * Get invite details (public)
   */
  getInviteDetails: (code) => apiClient.get(`/invites/${code}`),

  /**
   * Track invite click (public)
   */
  trackInviteClick: (code, data) =>
    apiClient.post(`/invites/${code}/track-click`, data),

  /**
   * Validate discount code
   */
  validateDiscountCode: (data) =>
    apiClient.post('/invites/discount-codes/validate', data),

  /**
   * Get analyst discount codes
   */
  getMyDiscountCodes: () => apiClient.get('/invites/my-discount-codes'),

  /**
   * Create discount code
   */
  createDiscountCode: (data) => apiClient.post('/invites/discount-codes', data),
};

// ============================================
// ANALYTICS APIs (Analyst Only)
// ============================================

export const analyticsAPI = {
  /**
   * Get dashboard overview
   */
  getOverview: () => apiClient.get('/analytics/overview'),

  /**
   * Get revenue analytics
   */
  getRevenue: (params) => apiClient.get('/analytics/revenue', { params }),

  /**
   * Get subscriber analytics
   */
  getSubscribers: (params) => apiClient.get('/analytics/subscribers', { params }),

  /**
   * Get post analytics
   */
  getPosts: (params) => apiClient.get('/analytics/posts', { params }),

  /**
   * Get review analytics
   */
  getReviews: () => apiClient.get('/analytics/reviews'),
};

// ============================================
// USER APIs
// ============================================

export const userAPI = {
  /**
   * Get user profile
   */
  getProfile: () => apiClient.get('/users/profile'),

  /**
   * Update user profile
   */
  updateProfile: (data) => apiClient.put('/users/profile', data),

  /**
   * Upload profile photo
   */
  uploadPhoto: (formData) =>
    apiClient.post('/users/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// ============================================
// SETTINGS APIs (Analyst Only)
// ============================================

export const settingsAPI = {
  /**
   * Get analyst profile settings
   */
  getProfile: () => apiClient.get('/settings/profile'),

  /**
   * Update analyst profile settings
   */
  updateProfile: (data) => apiClient.put('/settings/profile', data),

  /**
   * Upload profile photo
   */
  uploadProfilePhoto: (formData) =>
    apiClient.post('/settings/profile/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /**
   * Get all pricing tiers
   */
  getPricingTiers: () => apiClient.get('/settings/pricing-tiers'),

  /**
   * Create new pricing tier
   */
  createPricingTier: (data) => apiClient.post('/settings/pricing-tiers', data),

  /**
   * Update pricing tier
   */
  updatePricingTier: (id, data) => apiClient.put(`/settings/pricing-tiers/${id}`, data),

  /**
   * Delete pricing tier
   */
  deletePricingTier: (id) => apiClient.delete(`/settings/pricing-tiers/${id}`),

  /**
   * Get preferences
   */
  getPreferences: () => apiClient.get('/settings/preferences'),

  /**
   * Update preferences
   */
  updatePreferences: (data) => apiClient.put('/settings/preferences', data),
};
