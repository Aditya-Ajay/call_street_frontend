# Frontend Pages - Quick Reference

## Project Overview
**Analyst Marketplace Platform** - Mobile-first React application connecting SEBI-verified analysts with retail traders.

---

## Tech Stack
- **Framework:** React 18 (JavaScript)
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Router:** React Router v6
- **HTTP Client:** Axios
- **Real-time:** Socket.io Client
- **Charts:** Chart.js + react-chartjs-2
- **Date Formatting:** date-fns

---

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx          # Reusable button with variants
│   │   │   ├── Toast.jsx           # Toast notifications
│   │   │   ├── Modal.jsx           # Modal with mobile slide-up
│   │   │   └── BottomNav.jsx       # Mobile bottom navigation
│   │   ├── PostCard.jsx            # Trading post display
│   │   ├── AnalystCard.jsx         # Analyst preview card
│   │   └── PricingCard.jsx         # Subscription tier card
│   ├── pages/
│   │   ├── LandingPage.jsx         # Marketing homepage
│   │   ├── Login.jsx               # OTP authentication
│   │   ├── Discovery.jsx           # Browse analysts
│   │   ├── AnalystProfile.jsx      # Analyst profile with tabs
│   │   ├── Feed.jsx                # User feed with filters
│   │   ├── Chat.jsx                # Real-time chat
│   │   ├── SubscriptionCheckout.jsx # Payment checkout
│   │   └── AnalystDashboard.jsx    # Analyst analytics
│   ├── contexts/
│   │   ├── AuthContext.jsx         # Authentication state
│   │   └── ToastContext.jsx        # Toast notifications state
│   ├── services/
│   │   ├── api.js                  # Axios API client
│   │   └── socket.js               # Socket.io client
│   ├── utils/
│   │   ├── constants.js            # App constants
│   │   └── helpers.js              # Helper functions
│   ├── App.jsx                     # Main app with routes
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── public/
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## Quick Start

### Installation
```bash
cd frontend
npm install
```

### Environment Setup
```bash
cp .env.example .env
# Edit .env with your values
```

### Development
```bash
npm run dev
# Open http://localhost:5173
```

### Production Build
```bash
npm run build
npm run preview
```

---

## Pages Overview

### 1. Landing Page
**Route:** `/`
**Status:** ✅ Complete
**Features:** Hero, features, testimonials, pricing preview, CTAs

### 2. Login
**Route:** `/login`
**Status:** ✅ Complete
**Features:** Phone/Email OTP authentication, 2-step verification

### 3. Discovery
**Route:** `/discovery`
**Status:** ✅ Complete
**Features:** Search, filters, sort, analyst grid, pagination

### 4. Analyst Profile
**Route:** `/analyst/:id`
**Status:** ✅ Complete
**Features:** Hero, stats, tabs (Overview, Pricing, Samples, Reviews), CTA

### 5. Feed
**Route:** `/feed` (Protected)
**Status:** ✅ Complete
**Features:** Filter chips, infinite scroll, bookmarks, post cards

### 6. Chat
**Route:** `/chat/:analystId` (Protected)
**Status:** ✅ Complete
**Features:** Real-time messaging, channels, typing indicators, online count

### 7. Subscription Checkout
**Route:** `/subscribe/:analystId/:tierId` (Protected)
**Status:** ✅ Complete
**Features:** Tier summary, billing cycle, discount codes, Razorpay payment

### 8. Analyst Dashboard
**Route:** `/dashboard` (Protected - Analyst Only)
**Status:** ✅ Complete
**Features:** Metrics, charts, invite links, revenue tracking

---

## Components Overview

### Common Components
- **Button:** Variants (primary, secondary, outline, danger), sizes, loading states
- **Toast:** Success/error/info notifications with auto-dismiss
- **Modal:** Mobile slide-up, desktop center, keyboard navigation
- **BottomNav:** Mobile-only navigation with active states

### Feature Components
- **PostCard:** Full trading call display with bookmark
- **AnalystCard:** Analyst preview with stats and CTA
- **PricingCard:** Subscription tier with features and pricing

---

## API Integration

### Base Configuration
```javascript
// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

### Available APIs
- `authAPI` - Authentication (OTP, login, logout)
- `analystAPI` - Analyst data, reviews, profiles
- `postAPI` - Posts, bookmarks, feed
- `subscriptionAPI` - Tiers, orders, payments
- `chatAPI` - Channels, messages
- `analyticsAPI` - Dashboard metrics (analyst only)
- `inviteAPI` - Invite links, discount codes
- `userAPI` - User profile, settings

---

## Socket.io Integration

### Connection
```javascript
import socketService from './services/socket';

// Connect (automatic with auth token)
socketService.connect();

// Check status
socketService.isConnected();

// Disconnect
socketService.disconnect();
```

### Chat Events
```javascript
// Join channel
socketService.joinChannel(channelId);

// Send message
socketService.sendMessage(channelId, message);

// Listen for messages
socketService.onMessage((message) => {
  console.log('New message:', message);
});

// Typing indicator
socketService.sendTyping(channelId, true);
```

---

## State Management

### Auth Context
```javascript
import { useAuth } from './contexts/AuthContext';

const { user, isAuthenticated, login, logout } = useAuth();
```

### Toast Context
```javascript
import { useToast } from './contexts/ToastContext';

const { showToast } = useToast();
showToast('Success!', 'success');
showToast('Error occurred', 'error');
showToast('Info message', 'info');
```

---

## Routing

### Public Routes
- `/` - Landing Page
- `/login` - Login
- `/discovery` - Browse Analysts
- `/analyst/:id` - Analyst Profile

### Protected Routes
- `/feed` - User Feed
- `/chat/:analystId` - Chat
- `/subscribe/:analystId/:tierId` - Checkout
- `/dashboard` - Analyst Dashboard

### Navigation
```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/feed');
navigate(`/analyst/${analystId}`);
navigate(-1); // Back
```

---

## Styling

### Tailwind CSS
All styling uses Tailwind utility classes:
```jsx
<div className="bg-white rounded-xl shadow-sm p-6">
  <h1 className="text-2xl font-bold text-gray-900">Title</h1>
</div>
```

### Custom Colors
- Primary: `#10B981` (Green)
- Primary Dark: `#059669`
- Primary Light: `#D1FAE5`
- Danger: `#EF4444` (Red)
- Warning: `#F59E0B` (Amber)
- Info: `#3B82F6` (Blue)

### Responsive Breakpoints
- `sm`: 640px (large phones)
- `md`: 768px (tablets)
- `lg`: 1024px (laptops)
- `xl`: 1280px (desktops)

---

## Mobile-First Design

### Key Principles
1. Design for 375px width first
2. Touch targets ≥ 44px
3. Bottom navigation on mobile
4. Slide-up modals on mobile
5. Thumb-reachable actions
6. Pull-to-refresh on feeds

### Example
```jsx
<div className="
  px-4           // Mobile padding
  sm:px-6        // Tablet padding
  lg:px-8        // Desktop padding
  pb-20          // Mobile (account for bottom nav)
  sm:pb-8        // Desktop (no bottom nav)
">
  Content
</div>
```

---

## Performance Optimizations

### Implemented
- Lazy loading images
- Infinite scroll (Intersection Observer)
- Skeleton loading screens
- Debounced inputs (300ms)
- Memoization where applicable

### Future
- Route-based code splitting
- PWA features
- Service Worker caching
- Image optimization (Cloudinary)

---

## Accessibility

### Features
- Semantic HTML
- ARIA labels and roles
- Keyboard navigation
- Focus indicators
- Screen reader friendly
- WCAG AA color contrast

### Testing
```bash
# Run Lighthouse audit
npm run build
npm run preview
# Open Chrome DevTools > Lighthouse
```

---

## Testing

### Build Test
```bash
npm run build
```

### Development Test
```bash
npm run dev
# Manual testing in browser
```

### Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Environment Variables

```env
# .env file
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxxx
```

**Note:** All Vite env vars must start with `VITE_`

---

## Common Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (if configured)
npm run lint

# Format code (if configured)
npm run format
```

---

## Troubleshooting

### Issue: Build fails
**Solution:** Delete `node_modules` and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: API requests fail
**Solution:** Check `.env` file has correct `VITE_API_BASE_URL`

### Issue: Socket won't connect
**Solution:** Verify `VITE_SOCKET_URL` and backend Socket.io server running

### Issue: Razorpay doesn't load
**Solution:** Check `VITE_RAZORPAY_KEY` is set and valid

### Issue: Hot reload not working
**Solution:** Restart dev server
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## Code Quality

### Best Practices
- ✅ Functional components only
- ✅ Custom hooks for reusable logic
- ✅ JSDoc comments on all components
- ✅ Consistent naming (PascalCase components, camelCase functions)
- ✅ Error handling on all async operations
- ✅ Loading states for all async operations
- ✅ Empty states with helpful CTAs
- ✅ Responsive design (mobile-first)
- ✅ Accessibility features

### Example Component
```jsx
/**
 * Example Component
 * @param {string} title - Component title
 * @param {Function} onClick - Click handler
 */
const Example = ({ title, onClick }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      await onClick();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Loading...' : title}
    </button>
  );
};
```

---

## File Naming Conventions

- Components: `PascalCase.jsx` (e.g., `Button.jsx`, `PostCard.jsx`)
- Utils: `camelCase.js` (e.g., `helpers.js`, `validators.js`)
- Pages: `PascalCase.jsx` (e.g., `Feed.jsx`, `Login.jsx`)
- Contexts: `PascalCase.jsx` ending with `Context` (e.g., `AuthContext.jsx`)
- Services: `camelCase.js` (e.g., `api.js`, `socket.js`)

---

## Git Workflow (Recommended)

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request on GitHub
```

---

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

### Manual (Any host)
```bash
# Build
npm run build

# Upload dist/ folder to host
```

---

## Next Steps

1. **Complete Integration Testing**
   - Test all API endpoints with backend
   - Verify Socket.io real-time features
   - Test Razorpay payment in sandbox

2. **Build Missing Pages**
   - `/profile` - User profile settings
   - `/subscription-success` - Post-payment success
   - `/create-post` - Analyst post composer

3. **Performance Optimization**
   - Implement route-based code splitting
   - Add image lazy loading placeholders
   - Optimize Chart.js bundle

4. **PWA Features**
   - Add service worker
   - Create app manifest
   - Enable offline mode

5. **Analytics**
   - Add Google Analytics
   - Set up error monitoring (Sentry)
   - Track user events

---

## Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)
- [Socket.io Client](https://socket.io/docs/v4/client-api/)
- [Chart.js](https://www.chartjs.org/)
- [Razorpay Docs](https://razorpay.com/docs/)

---

## Support

For issues or questions:
1. Check this README
2. Review `FRONTEND_PAGES_SUMMARY.md`
3. Check `INTEGRATION_CHECKLIST.md`
4. Review `ROUTING_GUIDE.md`

---

**Status:** ✅ Production Ready (Pending Backend Integration)
**Version:** 1.0.0
**Last Updated:** 2025-10-09
