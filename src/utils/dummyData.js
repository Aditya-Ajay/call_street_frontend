/**
 * Dummy Data for Testing
 * Provides realistic sample data for development and testing
 */

// Sample Posts for different channels
export const DUMMY_POSTS = {
  free_announcements: [
    {
      _id: 'fa1',
      post_type: 'update',
      tier: 'free',
      title: 'Market Analysis: Nifty 50 Outlook for October',
      content: 'The Nifty 50 index is showing strong bullish momentum as we enter October. Key resistance levels to watch are at 19,800 and 20,000. Support is strong at 19,400. Banking and IT sectors are leading the rally.',
      view_count: 1247,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      _id: 'fa2',
      post_type: 'analysis',
      tier: 'free',
      title: 'Weekly Sectoral Review: IT vs Banking',
      content: 'This week saw IT stocks outperform banking stocks by a significant margin. TCS, Infosys, and HCL Tech all closed in the green. Banking sector faced headwinds due to RBI policy concerns.',
      view_count: 856,
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    },
    {
      _id: 'fa3',
      post_type: 'educational',
      tier: 'free',
      title: 'Understanding Support and Resistance Levels',
      content: 'Support and resistance are foundational concepts in technical analysis. Support is a price level where a downtrend can be expected to pause due to buying interest. Resistance is where an uptrend may pause due to selling pressure.',
      view_count: 2103,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
      _id: 'fa4',
      post_type: 'update',
      tier: 'free',
      title: 'FII and DII Activity Update',
      content: 'Foreign Institutional Investors (FII) have been net buyers for the 5th consecutive session. DIIs also showing positive momentum. Combined inflow of ₹3,200 crores today.',
      view_count: 645,
      created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
      _id: 'fa5',
      post_type: 'commentary',
      tier: 'free',
      title: 'Impact of Global Markets on Indian Indices',
      content: 'US markets closed higher yesterday, with the Dow Jones gaining 0.8%. Asian markets are trading mixed. SGX Nifty indicates a positive opening for Indian markets today.',
      view_count: 478,
      created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
  ],

  free_calls: [
    {
      _id: 'fc1',
      post_type: 'call',
      tier: 'free',
      stock_symbol: 'RELIANCE',
      action: 'BUY',
      entry_price: 2450.50,
      target_price: 2580.00,
      stop_loss: 2390.00,
      strategy_type: 'swing',
      notes: 'Strong bullish momentum above 2450. RSI showing strength. Volume pickup indicates institutional buying.',
      status: 'active',
      view_count: 892,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'fc2',
      post_type: 'call',
      tier: 'free',
      stock_symbol: 'TCS',
      action: 'BUY',
      entry_price: 3580.00,
      target_price: 3720.00,
      stop_loss: 3520.00,
      strategy_type: 'positional',
      notes: 'Breakout above resistance. Good quarterly results expected. Long-term bullish setup.',
      status: 'target_hit',
      view_count: 1156,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'fc3',
      post_type: 'call',
      tier: 'free',
      stock_symbol: 'INFY',
      action: 'BUY',
      entry_price: 1450.25,
      target_price: 1520.00,
      stop_loss: 1415.00,
      strategy_type: 'swing',
      notes: 'Triangle pattern breakout. Volume confirmation present. Target 1:2 risk-reward ratio.',
      status: 'active',
      view_count: 734,
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'fc4',
      post_type: 'call',
      tier: 'free',
      stock_symbol: 'HDFCBANK',
      action: 'SELL',
      entry_price: 1680.00,
      target_price: 1620.00,
      stop_loss: 1710.00,
      strategy_type: 'intraday',
      notes: 'Resistance rejection at 1690. Bearish engulfing pattern on 15-min chart.',
      status: 'sl_hit',
      view_count: 623,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],

  paid_announcements: [
    {
      _id: 'pa1',
      post_type: 'analysis',
      tier: 'paid',
      title: 'Premium: Multi-bagger Stock Analysis',
      content: 'Detailed fundamental and technical analysis of a potential multi-bagger in the pharma sector. Strong financials, debt-free balance sheet, and upcoming product launches. Target price 3x in 18 months.',
      view_count: 456,
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'pa2',
      post_type: 'update',
      tier: 'paid',
      title: 'Exclusive: Insider Trading Alert',
      content: 'Significant insider buying detected in XYZ Ltd. Promoter increased stake by 2.5%. This often precedes major positive announcements. Watch this space.',
      view_count: 389,
      created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'pa3',
      post_type: 'analysis',
      tier: 'paid',
      title: 'Deep Dive: Upcoming IPO Analysis',
      content: 'Comprehensive analysis of the upcoming ABC Tech IPO. Valuation looks attractive compared to peers. Grey market premium at 18%. Recommend subscribe for listing gains.',
      view_count: 512,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],

  paid_calls: [
    {
      _id: 'pc1',
      post_type: 'call',
      tier: 'paid',
      stock_symbol: 'TATAMOTORS',
      action: 'BUY',
      entry_price: 625.50,
      target_price: 685.00,
      stop_loss: 605.00,
      strategy_type: 'swing',
      notes: 'Premium call: Strong accumulation pattern. Breakout confirmed with high volume. Auto sector showing strength. JLR numbers expected to be positive.',
      status: 'active',
      view_count: 345,
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'pc2',
      post_type: 'call',
      tier: 'paid',
      stock_symbol: 'ASIANPAINT',
      action: 'BUY',
      entry_price: 3250.00,
      target_price: 3480.00,
      stop_loss: 3180.00,
      strategy_type: 'positional',
      notes: 'Premium: Cup and handle pattern. Strong fundamentals. Paint demand picking up. Festive season ahead.',
      status: 'target_hit',
      view_count: 412,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'pc3',
      post_type: 'call',
      tier: 'paid',
      stock_symbol: 'BAJFINANCE',
      action: 'BUY',
      entry_price: 7250.00,
      target_price: 7650.00,
      stop_loss: 7100.00,
      strategy_type: 'swing',
      notes: 'Exclusive: Institutional accumulation visible. Quarterly results beat estimates. Credit growth robust.',
      status: 'active',
      view_count: 289,
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'pc4',
      post_type: 'call',
      tier: 'paid',
      stock_symbol: 'BHARTIARTL',
      action: 'BUY',
      entry_price: 895.00,
      target_price: 965.00,
      stop_loss: 870.00,
      strategy_type: 'positional',
      notes: 'Premium: 5G rollout momentum. ARPU improvement. Market share gains. Long-term structural story.',
      status: 'active',
      view_count: 367,
      created_at: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

// Sample Chat Messages
export const DUMMY_CHAT_MESSAGES = [
  {
    _id: 'msg1',
    sender: {
      _id: 'analyst1',
      name: 'Analyst',
      profile_photo: null,
    },
    content: 'Good morning everyone! Markets looking strong today.',
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    _id: 'msg2',
    sender: {
      _id: 'user1',
      name: 'Rajesh Kumar',
      profile_photo: null,
    },
    content: 'What are your views on Reliance for today?',
    created_at: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
  },
  {
    _id: 'msg3',
    sender: {
      _id: 'analyst1',
      name: 'Analyst',
      profile_photo: null,
    },
    content: 'Reliance is showing strength above 2450. Can hold with 2430 SL for 2500 target.',
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    _id: 'msg4',
    sender: {
      _id: 'user2',
      name: 'Priya Sharma',
      profile_photo: null,
    },
    content: 'Thanks for the insights!',
    created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    _id: 'msg5',
    sender: {
      _id: 'user3',
      name: 'Amit Patel',
      profile_photo: null,
    },
    content: 'Banking stocks looking weak. Any specific stocks to watch?',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    _id: 'msg6',
    sender: {
      _id: 'analyst1',
      name: 'Analyst',
      profile_photo: null,
    },
    content: 'HDFC Bank and ICICI Bank are at key support levels. Wait for confirmation before entering.',
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
];

// Sample Analytics Stats
export const DUMMY_ANALYTICS = {
  activeSubscribers: 456,
  monthlyRevenue: 136800,
  freeSubscribers: 234,
  paidSubscribers: 222,
  winRate: 68.5,
  averageReturn: 8.3,
  activeCalls: 12,
  totalTracked: 87,
};

// Sample Recent Activity
export const DUMMY_RECENT_ACTIVITY = [
  {
    text: 'New premium subscriber: Rajesh K.',
    timestamp: '5 mins ago',
  },
  {
    text: 'RELIANCE call target hit - +5.3%',
    timestamp: '23 mins ago',
  },
  {
    text: 'New basic subscriber: Priya S.',
    timestamp: '1 hour ago',
  },
  {
    text: 'Posted new analysis in paid channel',
    timestamp: '2 hours ago',
  },
  {
    text: 'TCS call closed with +8.2% profit',
    timestamp: '5 hours ago',
  },
];

// Export all dummy data
export default {
  DUMMY_POSTS,
  DUMMY_CHAT_MESSAGES,
  DUMMY_ANALYTICS,
  DUMMY_RECENT_ACTIVITY,
};
