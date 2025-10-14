/**
 * Utility Helper Functions
 */

/**
 * Format currency to Indian Rupees
 * @param {number} amount - Amount in paisa
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  const rupees = amount / 100;
  return `₹${rupees.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

/**
 * Format date to relative time (e.g., "2h ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return past.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Generate browser fingerprint for tracking
 * @returns {Promise<string>} Fingerprint hash
 */
export const generateBrowserFingerprint = async () => {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
  ];

  const text = components.join('|');
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);

  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Validate phone number (Indian format)
 * @param {string} phone - Phone number
 * @returns {boolean} Is valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate email
 * @param {string} email - Email address
 * @returns {boolean} Is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Format large numbers (e.g., 1234 -> 1.2K)
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatCompactNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

/**
 * Safely format rating from database (handles string/null/number)
 * @param {string|number|null} rating - Rating value from database
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted rating or 'N/A'
 */
export const formatRating = (rating, decimals = 1) => {
  if (!rating) return 'N/A';
  const numRating = Number(rating);
  if (isNaN(numRating)) return 'N/A';
  return numRating.toFixed(decimals);
};

/**
 * Get strategy badge color
 * @param {string} strategy - Strategy type
 * @returns {object} Badge colors
 */
export const getStrategyColor = (strategy) => {
  const colors = {
    intraday: { bg: '#FEF2F2', text: '#DC2626' },
    swing: { bg: '#FEF3C7', text: '#D97706' },
    investment: { bg: '#DBEAFE', text: '#1D4ED8' },
    options: { bg: '#F3E8FF', text: '#7C3AED' },
  };
  return colors[strategy] || { bg: '#F3F4F6', text: '#6B7280' };
};

/**
 * Calculate discount amount
 * @param {number} price - Original price in paisa
 * @param {string} discountType - 'percentage' or 'fixed_amount'
 * @param {number} discountValue - Discount value
 * @param {number} maxCap - Maximum discount cap (optional)
 * @returns {number} Discount amount in paisa
 */
export const calculateDiscount = (price, discountType, discountValue, maxCap = null) => {
  let discount = 0;

  if (discountType === 'percentage') {
    discount = Math.floor((price * discountValue) / 100);
    if (maxCap && discount > maxCap) {
      discount = maxCap;
    }
  } else if (discountType === 'fixed_amount') {
    discount = Math.min(discountValue, price);
  }

  return discount;
};

/**
 * Get action color
 * @param {string} action - Action type (buy/sell)
 * @returns {string} Tailwind color class
 */
export const getActionColor = (action) => {
  return action === 'buy' ? 'text-success' : 'text-danger';
};

/**
 * Format post for sharing
 * @param {object} post - Post object
 * @returns {string} Formatted text
 */
export const formatPostForSharing = (post) => {
  return `
${post.stock_symbol} ${post.action.toUpperCase()}
Entry: ${post.entry_price}
Target: ${post.target_price} (+${post.target_price - post.entry_price} pts)
Stop Loss: ${post.stop_loss} (-${post.entry_price - post.stop_loss} pts)
Confidence: ${post.confidence_level.toUpperCase()}

${post.reasoning || ''}

- ${post.analyst_name}
`.trim();
};

/**
 * Check if user is on mobile device
 * @returns {boolean} Is mobile
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Scroll to top of page
 */
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Load Razorpay script
 * @returns {Promise<boolean>} Success status
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
