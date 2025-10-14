# Feed Page - Discord-like Interface Implementation

## Overview

The Feed page provides a Discord-like interface for traders to view content from analysts they follow. It features a sidebar with analysts and their channels (free and locked premium), and a main feed area displaying posts based on the selected channel.

## File Structure

```
frontend/src/
├── pages/
│   └── Feed.jsx                          # Main feed page with Discord-like layout
├── components/
│   └── feed/
│       ├── UpgradeModal.jsx              # Modal for upgrading to premium subscription
│       ├── LockedChannelView.jsx         # View for locked premium channels
│       ├── SubscriptionBadge.jsx         # Badge showing subscription tier
│       └── AnalystSidebarItem.jsx        # Sidebar item for each analyst with channels
└── utils/
    ├── mockFeedData.js                   # Mock data for analysts, subscriptions, and posts
    └── constants.js                      # Constants for channel types and tiers
```

## Key Features

### 1. Discord-like Sidebar

**Left Sidebar** displays:
- List of analysts the user follows
- Expandable/collapsible channel list for each analyst
- Free channels (unlocked): 📢 free-announcements, 📞 free-calls
- Paid channels (locked): 🔒 paid-announcements, 🔒 paid-calls, 🔒 community-chat
- Quick stats (accuracy rate, subscriber count)
- Subscription status badges

**Responsive Behavior**:
- Desktop (>1024px): Fixed sidebar always visible
- Mobile (<1024px): Slide-in sidebar with hamburger menu
- Backdrop overlay on mobile when sidebar is open

### 2. Channel Access Control

**Free Channels**:
- Always accessible to all users
- Shows free announcements and basic calls
- No lock icon displayed

**Locked Channels**:
- Locked icon (🔒) displayed
- Clicking shows upgrade modal
- Grayed out appearance
- Only accessible after subscription

**Subscription Check**:
```javascript
const checkSubscription = (analystId) => {
  // Returns: { isSubscribed: boolean, tier: string, expiresAt: date }
}
```

### 3. Upgrade Modal

Triggered when user clicks a locked channel.

**Features**:
- Large lock icon with analyst info
- List of premium benefits
- Pricing tiers (Basic, Premium, Pro)
- "Recommended" badge on popular tier
- Direct navigation to subscription page
- "Maybe Later" option

**Props**:
- `isOpen`: boolean - Controls visibility
- `onClose`: function - Close handler
- `analyst`: object - Analyst data with pricing tiers

### 4. Main Feed Area

**Channel Header**:
- Channel name with icon
- Analyst name and verification badge
- Subscription tier badge

**Posts Display**:
- Uses existing `PostCard` component
- Shows trading calls with entry, target, stop loss
- Timestamp and engagement metrics
- Expandable reasoning text

**States**:
- Loading: Skeleton screens (3 cards)
- Empty: No posts message with call-to-action
- Content: Scrollable post feed
- No selection: Welcome message

### 5. Subscription Badge

Visual indicator of user's subscription status.

**Tiers**:
- **Free**: Gray (👤)
- **Basic**: Blue (⭐)
- **Premium**: Purple (💎)
- **Pro**: Gold gradient (👑)

**Props**:
- `tier`: string - Subscription tier
- `expiresAt`: date - Expiry date (optional)
- `size`: 'sm' | 'md' | 'lg'

**Expiry Warning**:
- Shows expiry date if provided
- Red warning if expired
- Yellow warning if expires within 7 days

### 6. Mock Data Structure

**Analysts**:
```javascript
{
  id: 'analyst-1',
  name: 'Rajesh Kumar',
  username: '@rajesh_trades',
  profile_photo: 'url',
  sebi_verified: true,
  specialization: 'Technical Analysis',
  subscribers_count: 2450,
  accuracy_rate: 87,
  pricing_tiers: [...]
}
```

**Subscriptions**:
```javascript
{
  analyst_id: 'analyst-1',
  tier: 'premium',
  isActive: true,
  startDate: Date,
  expiresAt: Date
}
```

**Posts**:
```javascript
{
  id: 'post-1',
  analyst_id: 'analyst-1',
  channel: 'paid-calls',
  stock_symbol: 'TCS',
  action: 'BUY',
  entry_price: '3780',
  target_price: '3950',
  stop_loss: '3720',
  strategy_type: 'swing',
  confidence: 'high',
  reasoning: 'Strong IT sector outlook...',
  created_at: Date,
  is_premium: true
}
```

## Responsive Design

### Mobile (<640px)
- Hamburger menu for sidebar
- Slide-in sidebar animation
- Full-width main feed
- Bottom navigation visible
- Touch-optimized targets (44px minimum)

### Tablet (640px - 1024px)
- Collapsible sidebar
- Optimized content width
- Touch and click interactions

### Desktop (>1024px)
- Fixed sidebar (288px width)
- Max-width content area (1024px)
- Hover states on all interactive elements
- Keyboard navigation support

## API Integration Points

When connecting to real backend:

### Get Following Analysts
```javascript
GET /api/analysts/following
Response: Array<Analyst>
```

### Get User Subscriptions
```javascript
GET /api/subscriptions/my-subscriptions
Response: Array<Subscription>
```

### Get Channel Posts
```javascript
GET /api/posts/feed?analystId={id}&channel={channel}
Response: Array<Post>
```

### Subscribe to Analyst
```javascript
POST /api/subscriptions/create
Body: { analyst_id, tier_id }
Response: { subscription, payment_url }
```

## Usage Example

```jsx
import Feed from './pages/Feed';

// In your router
<Route path="/feed" element={<Feed />} />
```

## Component Props Reference

### AnalystSidebarItem
```jsx
<AnalystSidebarItem
  analyst={analystObject}
  isSubscribed={boolean}
  isExpanded={boolean}
  onToggle={function}
  onChannelSelect={function}
  activeChannel={string}
/>
```

### UpgradeModal
```jsx
<UpgradeModal
  isOpen={boolean}
  onClose={function}
  analyst={analystObject}
/>
```

### SubscriptionBadge
```jsx
<SubscriptionBadge
  tier="premium"
  expiresAt={Date}
  size="md"
/>
```

### LockedChannelView
```jsx
<LockedChannelView
  analyst={analystObject}
  channelType="paid-calls"
  onUpgrade={function}
/>
```

## Accessibility Features

- Semantic HTML elements
- ARIA labels on all interactive elements
- Keyboard navigation support (Tab, Enter, Escape)
- Focus indicators on all focusable elements
- Screen reader friendly text
- Alt text on all images
- Color contrast meets WCAG AA standards

## Performance Optimizations

1. **Code Splitting**: Components loaded on demand
2. **Memoization**: Expensive computations memoized
3. **Virtual Scrolling**: For long post lists (future)
4. **Debounced Search**: 300ms debounce delay
5. **Lazy Loading**: Images and routes
6. **Optimistic Updates**: Immediate UI feedback

## Known Limitations

1. **Mock Data**: Currently uses mock data, needs API integration
2. **Real-time Updates**: Socket.io integration pending for community chat
3. **Pagination**: Infinite scroll not yet implemented for posts
4. **Bookmarks**: Bookmark persistence pending
5. **Notifications**: Push notifications integration pending

## Testing Checklist

- [ ] Sidebar opens/closes on mobile
- [ ] Analyst expansion/collapse works
- [ ] Free channels load posts correctly
- [ ] Locked channels show upgrade modal
- [ ] Upgrade modal navigates to subscription page
- [ ] Subscription badge shows correct tier
- [ ] Posts display all fields correctly
- [ ] Loading states show skeleton screens
- [ ] Empty states show helpful messages
- [ ] Responsive on all screen sizes
- [ ] Keyboard navigation works
- [ ] Screen reader accessible

## Future Enhancements

1. **Search**: Search posts within channel
2. **Filters**: Filter by strategy type, confidence, date
3. **Sort**: Sort posts by time, popularity
4. **Bookmarks**: Save posts for later
5. **Share**: Share posts to social media
6. **Comments**: Comment on posts
7. **Reactions**: React to posts with emojis
8. **Notifications**: Real-time notifications for new posts
9. **Chat**: Live community chat integration
10. **Voice**: Voice input for post composer

## Support

For questions or issues with the Feed implementation:
- Check console for errors
- Verify all components are imported correctly
- Ensure mock data is properly structured
- Test responsive behavior on different screen sizes
- Validate accessibility with screen reader

---

**Built with**: React 18, Tailwind CSS, React Router v6
**Last Updated**: October 14, 2025
**Version**: 1.0.0
