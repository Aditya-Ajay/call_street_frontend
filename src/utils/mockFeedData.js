/**
 * Mock Data for Feed Page
 * Analysts, Subscriptions, and Posts
 */

export const mockAnalysts = [
  {
    id: 'analyst-1',
    name: 'Rajesh Kumar',
    username: '@rajesh_trades',
    profile_photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    sebi_verified: true,
    specialization: 'Technical Analysis',
    bio: 'SEBI Registered Research Analyst with 10+ years in equity markets',
    subscribers_count: 2450,
    accuracy_rate: 87,
    total_calls: 1250,
    pricing_tiers: [
      {
        id: 'basic',
        name: 'Basic',
        price: 999,
        billing_cycle: 'monthly',
        features: ['Access to paid calls', 'Basic support', 'Email notifications'],
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 2499,
        billing_cycle: 'monthly',
        features: ['All Basic features', 'Community chat access', 'Priority support', 'Exclusive webinars'],
        recommended: true,
      },
    ],
  },
  {
    id: 'analyst-2',
    name: 'Priya Sharma',
    username: '@priya_options',
    profile_photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    sebi_verified: true,
    specialization: 'Options Trading',
    bio: 'Options specialist focusing on high-probability setups',
    subscribers_count: 1890,
    accuracy_rate: 91,
    total_calls: 890,
    pricing_tiers: [
      {
        id: 'basic',
        name: 'Basic',
        price: 1499,
        billing_cycle: 'monthly',
        features: ['Access to paid calls', 'Basic support'],
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 3499,
        billing_cycle: 'monthly',
        features: ['All Basic features', 'Community chat', '1-on-1 consultation'],
        recommended: true,
      },
    ],
  },
  {
    id: 'analyst-3',
    name: 'Amit Verma',
    username: '@amit_swing',
    profile_photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
    sebi_verified: true,
    specialization: 'Swing Trading',
    bio: 'Swing trader focusing on mid-cap growth stocks',
    subscribers_count: 3120,
    accuracy_rate: 84,
    total_calls: 1680,
    pricing_tiers: [
      {
        id: 'basic',
        name: 'Basic',
        price: 799,
        billing_cycle: 'monthly',
        features: ['Access to paid calls', 'Email notifications'],
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 1999,
        billing_cycle: 'monthly',
        features: ['All Basic features', 'Community chat', 'Priority support'],
        recommended: true,
      },
    ],
  },
  {
    id: 'analyst-4',
    name: 'Neha Patel',
    username: '@neha_intraday',
    profile_photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha',
    sebi_verified: false,
    specialization: 'Intraday Trading',
    bio: 'Intraday specialist with focus on momentum stocks',
    subscribers_count: 980,
    accuracy_rate: 79,
    total_calls: 560,
    pricing_tiers: [
      {
        id: 'basic',
        name: 'Basic',
        price: 599,
        billing_cycle: 'monthly',
        features: ['Access to paid calls', 'Email notifications'],
      },
    ],
  },
  {
    id: 'analyst-5',
    name: 'Sanjay Gupta',
    username: '@sanjay_funds',
    profile_photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sanjay',
    sebi_verified: true,
    specialization: 'Fundamental Analysis',
    bio: 'Long-term investor focusing on fundamentally strong companies',
    subscribers_count: 4560,
    accuracy_rate: 93,
    total_calls: 2340,
    pricing_tiers: [
      {
        id: 'basic',
        name: 'Basic',
        price: 1299,
        billing_cycle: 'monthly',
        features: ['Access to paid calls', 'Monthly reports'],
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 2999,
        billing_cycle: 'monthly',
        features: ['All Basic features', 'Community chat', 'Quarterly portfolio review'],
        recommended: true,
      },
    ],
  },
];

// Mock user subscriptions
export const mockSubscriptions = [
  {
    analyst_id: 'analyst-1',
    tier: 'premium',
    isActive: true,
    startDate: new Date('2024-01-15'),
    expiresAt: new Date('2025-01-15'),
  },
  {
    analyst_id: 'analyst-3',
    tier: 'basic',
    isActive: true,
    startDate: new Date('2024-02-01'),
    expiresAt: new Date('2025-02-01'),
  },
  // analyst-2, analyst-4, analyst-5 are not subscribed (free only)
];

// Mock posts for different channels
export const mockPosts = {
  'analyst-1': {
    'free-announcements': [
      {
        id: 'post-1',
        analyst_id: 'analyst-1',
        channel: 'free-announcements',
        content: 'Market outlook for this week: Expecting consolidation in Nifty around 22,000 levels. Bank Nifty showing strength.',
        created_at: new Date('2024-10-14T09:00:00'),
        likes: 145,
        comments: 23,
      },
      {
        id: 'post-2',
        analyst_id: 'analyst-1',
        channel: 'free-announcements',
        content: 'Important: Market will be closed on Monday due to public holiday. Plan your trades accordingly.',
        created_at: new Date('2024-10-13T18:30:00'),
        likes: 89,
        comments: 12,
      },
    ],
    'free-calls': [
      {
        id: 'post-3',
        analyst_id: 'analyst-1',
        channel: 'free-calls',
        stock_symbol: 'RELIANCE',
        stock_name: 'Reliance Industries Ltd.',
        action: 'BUY',
        entry_price: '2450',
        target_price: '2550',
        stop_loss: '2400',
        strategy_type: 'swing',
        confidence: 'medium',
        reasoning: 'Stock showing strong support at 2400 levels. RSI indicating oversold conditions with potential reversal.',
        created_at: new Date('2024-10-14T10:15:00'),
        likes: 234,
        comments: 45,
      },
    ],
    'paid-calls': [
      {
        id: 'post-4',
        analyst_id: 'analyst-1',
        channel: 'paid-calls',
        stock_symbol: 'TCS',
        stock_name: 'Tata Consultancy Services',
        action: 'BUY',
        entry_price: '3780',
        target_price: '3950',
        stop_loss: '3720',
        strategy_type: 'swing',
        confidence: 'high',
        reasoning: 'Strong IT sector outlook. TCS showing breakout above resistance with good volume. Expecting 5-7% upside.',
        created_at: new Date('2024-10-14T11:30:00'),
        likes: 567,
        comments: 89,
        is_premium: true,
      },
      {
        id: 'post-5',
        analyst_id: 'analyst-1',
        channel: 'paid-calls',
        stock_symbol: 'HDFCBANK',
        stock_name: 'HDFC Bank Ltd.',
        action: 'BUY',
        entry_price: '1645',
        target_price: '1720',
        stop_loss: '1610',
        strategy_type: 'swing',
        confidence: 'high',
        reasoning: 'Banking sector showing strength. HDFC forming higher highs pattern with institutional buying.',
        created_at: new Date('2024-10-13T14:20:00'),
        likes: 423,
        comments: 67,
        is_premium: true,
      },
    ],
  },
  'analyst-2': {
    'free-calls': [
      {
        id: 'post-6',
        analyst_id: 'analyst-2',
        channel: 'free-calls',
        stock_symbol: 'NIFTY',
        stock_name: 'Nifty 50 Index',
        action: 'BUY',
        entry_price: '22000',
        target_price: '22300',
        stop_loss: '21850',
        strategy_type: 'options',
        confidence: 'medium',
        reasoning: 'Nifty showing support at 22000. Consider ATM call options for short-term gains.',
        created_at: new Date('2024-10-14T09:45:00'),
        likes: 189,
        comments: 34,
      },
    ],
    'paid-calls': [
      {
        id: 'post-7',
        analyst_id: 'analyst-2',
        channel: 'paid-calls',
        stock_symbol: 'BANKNIFTY',
        stock_name: 'Bank Nifty Index',
        action: 'BUY',
        entry_price: '48500',
        target_price: '49200',
        stop_loss: '48200',
        strategy_type: 'options',
        confidence: 'high',
        reasoning: 'Strong bullish setup in Bank Nifty. Recommended strategy: Buy 48500 CE and sell 49500 CE for defined risk spread.',
        created_at: new Date('2024-10-14T10:00:00'),
        likes: 678,
        comments: 112,
        is_premium: true,
      },
    ],
  },
  'analyst-3': {
    'free-announcements': [
      {
        id: 'post-8',
        analyst_id: 'analyst-3',
        channel: 'free-announcements',
        content: 'Mid-cap stocks showing strong momentum this week. Focus on quality names with good fundamentals.',
        created_at: new Date('2024-10-14T08:30:00'),
        likes: 201,
        comments: 28,
      },
    ],
    'paid-calls': [
      {
        id: 'post-9',
        analyst_id: 'analyst-3',
        channel: 'paid-calls',
        stock_symbol: 'TATAMOTORS',
        stock_name: 'Tata Motors Ltd.',
        action: 'BUY',
        entry_price: '920',
        target_price: '1020',
        stop_loss: '880',
        strategy_type: 'swing',
        confidence: 'high',
        reasoning: 'Auto sector recovery play. Tata Motors showing strong technical setup with breakout confirmation.',
        created_at: new Date('2024-10-14T11:00:00'),
        likes: 445,
        comments: 73,
        is_premium: true,
      },
    ],
  },
};

// Helper function to check if user is subscribed to analyst
export const checkSubscription = (analystId) => {
  const subscription = mockSubscriptions.find(
    (sub) => sub.analyst_id === analystId && sub.isActive
  );

  if (!subscription) {
    return {
      isSubscribed: false,
      tier: 'free',
      expiresAt: null,
    };
  }

  return {
    isSubscribed: true,
    tier: subscription.tier,
    expiresAt: subscription.expiresAt,
  };
};

// Helper function to get posts for a specific channel
export const getChannelPosts = (analystId, channelId) => {
  const analystPosts = mockPosts[analystId];
  if (!analystPosts) return [];

  const channelPosts = analystPosts[channelId];
  if (!channelPosts) return [];

  return channelPosts;
};

// Get all analysts user follows
export const getFollowedAnalysts = () => {
  // For demo, return first 3 analysts as "followed"
  return mockAnalysts.slice(0, 3);
};

// Get analyst by ID
export const getAnalystById = (analystId) => {
  return mockAnalysts.find((analyst) => analyst.id === analystId);
};
