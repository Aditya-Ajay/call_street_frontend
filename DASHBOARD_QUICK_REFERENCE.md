# Analyst Dashboard - Quick Reference

## Component Usage

### 1. Using the Dashboard Context

```javascript
import { useDashboard } from '../contexts/DashboardContext';

function MyComponent() {
  const {
    selectedChannel,      // Current channel ID
    channelConfig,        // Current channel config object
    changeChannel,        // Function to switch channels
    posts,               // Array of posts
    postsLoading,        // Loading state
    createPost,          // Create new post
    updatePost,          // Edit post
    deletePost,          // Remove post
    stats,               // Dashboard statistics
    composerMode,        // 'voice' or 'text'
    setComposerMode,     // Switch input mode
  } = useDashboard();

  return <div>...</div>;
}
```

### 2. Channel IDs

```javascript
import { CHANNELS } from '../contexts/DashboardContext';

CHANNELS.FREE_ANNOUNCEMENTS   // "free_announcements"
CHANNELS.FREE_CALLS          // "free_calls"
CHANNELS.PAID_ANNOUNCEMENTS  // "paid_announcements"
CHANNELS.PAID_CALLS          // "paid_calls"
CHANNELS.COMMUNITY_CHAT      // "community_chat"
```

### 3. Creating a Post

```javascript
// Trading Call
await createPost({
  stock_symbol: 'RELIANCE',
  action: 'BUY',
  entry_price: 2500,
  target_price: 2600,
  stop_loss: 2450,
  strategy_type: 'swing',
  notes: 'Breakout above resistance'
});

// Announcement
await createPost({
  post_type: 'update',
  title: 'Market Analysis',
  content: 'Today we saw strong momentum in IT sector...'
});
```

### 4. Using Voice Input

```javascript
import VoiceInput from '../components/dashboard/VoiceInput';

// Component automatically manages:
// - Speech recognition
// - Transcription display
// - AI formatting trigger
// - Error handling

<VoiceInput />
```

### 5. Socket.io Chat

```javascript
import socketService from '../services/socket';

// Connect (handled automatically in AuthContext)
socketService.connect();

// Join channel
socketService.joinChannel(channelId);

// Send message
socketService.sendMessage(channelId, 'Hello!');

// Listen for messages
socketService.onMessage((message) => {
  console.log('New message:', message);
});

// Send typing indicator
socketService.sendTyping(channelId, true);
```

## API Endpoints

### Analytics
```
GET /api/analytics/overview
Response: {
  total_subscribers, monthly_revenue, free_subscribers,
  paid_subscribers, win_rate, average_return, active_calls, total_tracked
}
```

### Posts
```
GET /api/posts?analyst_id=me&tier=free&post_type=call
POST /api/posts { stock_symbol, action, entry_price, ... }
PUT /api/posts/:id { ... }
DELETE /api/posts/:id
```

## Styling Guide

### Discord Colors
```css
--bg-primary: #36393f;      /* Main background */
--bg-secondary: #2f3136;    /* Sidebars */
--bg-tertiary: #202225;     /* Borders */
--bg-hover: #40444b;        /* Hover state */

--text-primary: #dcddde;    /* Main text */
--text-secondary: #b9bbbe;  /* Secondary text */
--text-muted: #8e9297;      /* Muted text */
```

### Common Classes
```jsx
// Sidebar item (unselected)
className="text-[#96989d] hover:bg-[#36393f] hover:text-[#dcddde]"

// Sidebar item (selected)
className="bg-[#40444b] text-white"

// Card background
className="bg-[#202225] rounded-lg p-4"

// Text styles
className="text-white"          // Headings
className="text-[#b9bbbe]"     // Body
className="text-[#8e9297]"     // Subtle
```

## Responsive Breakpoints

```javascript
// Tailwind breakpoints
sm: 640px   // Large phones
md: 768px   // Tablets
lg: 1024px  // Laptops (3-column layout)
xl: 1280px  // Desktops

// Usage
<div className="hidden lg:block">Desktop only</div>
<div className="lg:hidden">Mobile/Tablet only</div>
```

## Common Patterns

### Loading State
```jsx
{loading ? (
  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
) : (
  <Content />
)}
```

### Empty State
```jsx
{items.length === 0 ? (
  <div className="text-center py-16">
    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4">...</svg>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No items yet</h3>
    <p className="text-gray-500 mb-6">Start by creating your first item</p>
    <Button onClick={handleCreate}>Create Item</Button>
  </div>
) : (
  <ItemsList items={items} />
)}
```

### Confirmation Modal
```jsx
<Modal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  title="Delete Post"
  size="sm"
>
  <p>Are you sure you want to delete this post?</p>
  <div className="flex gap-3 mt-4">
    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
      Cancel
    </Button>
    <Button variant="danger" onClick={handleDelete} loading={deleting}>
      Delete
    </Button>
  </div>
</Modal>
```

## Testing

### Desktop (Chrome DevTools)
```
1. Open DevTools (F12)
2. Device Toolbar (Ctrl+Shift+M)
3. Select "Responsive"
4. Set width: 1280px
5. Test 3-column layout
```

### Mobile (Chrome DevTools)
```
1. Open DevTools
2. Device Toolbar
3. Select "iPhone 12 Pro" or "Pixel 5"
4. Test sidebars, bottom nav, touch targets
```

### Voice Input (Chrome)
```
1. Open in Chrome (not Firefox)
2. Allow microphone permissions
3. Click microphone button
4. Speak clearly
5. Verify transcription appears
```

## Troubleshooting

### Voice Input Not Working
- ✅ Check browser (Chrome/Edge/Safari only)
- ✅ Allow microphone permissions
- ✅ Check `isSupported` flag in component
- ✅ Look for errors in console

### Posts Not Loading
- ✅ Check network tab for API errors
- ✅ Verify user is authenticated analyst
- ✅ Check `posts` state in React DevTools
- ✅ Look for error toasts

### Chat Not Connecting
- ✅ Verify backend Socket.io server running
- ✅ Check `socketService.isConnected()`
- ✅ Look for socket errors in console
- ✅ Verify channelId is correct

### Sidebars Not Sliding
- ✅ Check `sidebarOpen` state
- ✅ Verify Tailwind transforms applied
- ✅ Test on mobile viewport (< 1024px)
- ✅ Check for CSS conflicts

## Performance Tips

1. **Infinite Scroll:** Uses Intersection Observer (native, performant)
2. **Memoization:** Use `React.memo` for PostCard if re-renders slow
3. **Image Loading:** Add `loading="lazy"` to images
4. **Code Splitting:** Dashboard already lazy-loaded via routes
5. **Debouncing:** Already implemented for typing indicator

## Security Notes

1. **API Calls:** All use authenticated Axios client (cookies)
2. **Input Validation:** Form validation on client + backend
3. **XSS Prevention:** React escapes all rendered strings
4. **CSRF Protection:** Handled by backend cookies
5. **Content Sanitization:** Avoid `dangerouslySetInnerHTML`

## Key Shortcuts (Future)

```
Ctrl/Cmd + K  - Quick channel search
Ctrl/Cmd + N  - New post
Ctrl/Cmd + /  - Toggle sidebar
Esc           - Close modal/sidebar
Tab           - Navigate elements
Enter         - Submit form/send message
```

## Browser Support

| Browser | Version | Voice Input | Chat | Notes |
|---------|---------|-------------|------|-------|
| Chrome  | 90+     | ✅          | ✅   | Recommended |
| Edge    | 90+     | ✅          | ✅   | Recommended |
| Safari  | 14+     | ✅          | ✅   | iOS/macOS |
| Firefox | 90+     | ❌          | ✅   | No voice |

## Component Props Reference

### LeftSidebar
```javascript
// No props - uses context
<LeftSidebar />
```

### RightSidebar
```javascript
// No props - uses context
<RightSidebar />
```

### PostComposer
```javascript
// No props - uses context
<PostComposer />
```

### PostCard
```javascript
<PostCard
  post={{
    _id: string,
    post_type: 'call' | 'announcement',
    tier: 'free' | 'paid',
    stock_symbol?: string,
    action?: 'BUY' | 'SELL',
    entry_price?: number,
    target_price?: number,
    stop_loss?: number,
    strategy_type?: string,
    notes?: string,
    title?: string,
    content?: string,
    status?: 'active' | 'target_hit' | 'sl_hit' | 'expired',
    view_count?: number,
    created_at: string,
  }}
/>
```

### PostsFeed
```javascript
// No props - uses context
<PostsFeed />
```

### VoiceInput
```javascript
// No props - uses context
<VoiceInput />
```

### ChatInterface
```javascript
<ChatInterface
  channelId={string}  // Analyst ID or channel ID
/>
```

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_RAZORPAY_KEY=your_razorpay_key
```

## Next Steps

1. Test on real devices (iOS, Android)
2. Integrate Claude API for voice formatting
3. Add error boundaries
4. Implement post editing
5. Add image upload
6. Set up E2E tests (Cypress/Playwright)
7. Performance monitoring (Lighthouse)
8. Analytics tracking (GA4)

## Support

For issues or questions:
1. Check console for errors
2. Review this guide
3. Check ANALYST_DASHBOARD_IMPLEMENTATION.md
4. Test in incognito mode (clean state)
5. Verify backend is running
