# Frontend Routing Guide

## Route Overview

### Public Routes (No Authentication Required)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPage | Marketing homepage with features and CTAs |
| `/login` | Login | OTP-based authentication |
| `/discovery` | Discovery | Browse and search analysts (public) |
| `/analyst/:id` | AnalystProfile | View analyst profile, pricing, samples, reviews |

### Protected Routes (Authentication Required)

| Route | Component | Description | Role Required |
|-------|-----------|-------------|---------------|
| `/feed` | Feed | User's personalized feed of posts from subscribed analysts | User/Analyst |
| `/chat/:analystId?` | Chat | Real-time community chat channels | User/Analyst (Subscription) |
| `/subscribe/:analystId/:tierId` | SubscriptionCheckout | Payment checkout with Razorpay | User/Analyst |
| `/dashboard` | AnalystDashboard | Analytics, revenue, invite links | Analyst Only |

---

## Route Parameters

### Dynamic Routes

**Analyst Profile:**
```
/analyst/:id
Example: /analyst/507f1f77bcf86cd799439011
```

**Chat:**
```
/chat/:analystId?
Examples:
- /chat (shows list or error)
- /chat/507f1f77bcf86cd799439011
```

**Subscription Checkout:**
```
/subscribe/:analystId/:tierId
Example: /subscribe/507f1f77bcf86cd799439011/507f191e810c19729de860ea
```

---

## Navigation Flow

### New User Journey
```
/ (Landing)
  → /login (OTP)
    → /discovery (Browse)
      → /analyst/:id (View Profile)
        → /subscribe/:analystId/:tierId (Checkout)
          → /feed (Post-subscription)
```

### Existing User Journey
```
/feed (Default landing for authenticated users)
  → Filter posts
  → Click post → View details
  → /chat/:analystId → Join discussion
  → /discovery → Find new analysts
```

### Analyst Journey
```
/dashboard (Analytics & Management)
  → Create invite links
  → View revenue charts
  → Create posts (via FAB or button)
  → /chat/:analystId (Moderate channels)
```

---

## Route Guards & Redirects

### ProtectedRoute Component
```jsx
// Redirects to /login if not authenticated
<ProtectedRoute>
  <Feed />
</ProtectedRoute>
```

### Role-Based Access
```jsx
// In AnalystDashboard.jsx
if (user?.role !== 'analyst') {
  navigate('/');
  return;
}
```

---

## Query Parameters Support

### Feed Page
```
/feed?filter=intraday
/feed?filter=today
/feed?filter=urgent
```

### Discovery Page
```
/discovery?search=reliance
/discovery?sort=rating_desc
/discovery?specialization=options
```

---

## Navigation Methods

### Link Component (React Router)
```jsx
import { Link } from 'react-router-dom';

<Link to="/feed">Go to Feed</Link>
<Link to={`/analyst/${analystId}`}>View Profile</Link>
```

### Programmatic Navigation
```jsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Navigate forward
navigate('/feed');
navigate(`/analyst/${analystId}`);

// Navigate back
navigate(-1);

// Navigate with state
navigate('/subscription-success', {
  state: { analyst, tier, billingCycle }
});
```

### Button Navigation
```jsx
<Button onClick={() => navigate('/discovery')}>
  Browse Analysts
</Button>
```

---

## Bottom Navigation (Mobile)

Routes accessible via bottom nav:
- `/feed` - Feed icon
- `/discovery` - Discover icon
- `/chat` - Chat icon
- `/profile` - Profile icon (not yet implemented)

Component: `<BottomNav />`
Display: Mobile only (hidden sm:hidden)

---

## Deep Linking Support

All routes support direct URL access:
- Users can bookmark any page
- Share specific analyst profiles
- Direct links to checkout pages
- Deep links to specific chat channels

---

## Fallback & 404

```jsx
<Route path="*" element={<Navigate to="/" replace />} />
```

Any unknown route redirects to homepage.

---

## State Management in Routes

### Route State (useLocation)
```jsx
import { useLocation } from 'react-router-dom';

const location = useLocation();
const { analyst, tier } = location.state || {};
```

### URL Parameters (useParams)
```jsx
import { useParams } from 'react-router-dom';

const { analystId, tierId } = useParams();
```

### Query Parameters (useSearchParams)
```jsx
import { useSearchParams } from 'react-router-dom';

const [searchParams] = useSearchParams();
const filter = searchParams.get('filter');
```

---

## Route-Based Code Splitting (Future)

To optimize bundle size, implement lazy loading:

```jsx
import { lazy, Suspense } from 'react';

const Feed = lazy(() => import('./pages/Feed'));
const Chat = lazy(() => import('./pages/Chat'));

<Route
  path="/feed"
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <ProtectedRoute>
        <Feed />
      </ProtectedRoute>
    </Suspense>
  }
/>
```

---

## Browser History

Using React Router's BrowserRouter:
- Clean URLs (no hash)
- Back/forward buttons work
- Browser history maintained
- Server-side configuration needed for deployment

### Deployment Note
Configure server to serve `index.html` for all routes:

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Vercel/Netlify:**
Already configured automatically

---

## SEO Considerations

### Meta Tags per Route
Add to each page component:

```jsx
import { Helmet } from 'react-helmet'; // Install if needed

<Helmet>
  <title>Feed - Analyst Marketplace</title>
  <meta name="description" content="View trading calls from verified analysts" />
</Helmet>
```

### Sitemap (Static Routes)
```
/
/login
/discovery
/feed
/dashboard
```

### Dynamic Routes (Excluded from sitemap)
- `/analyst/:id`
- `/chat/:analystId`
- `/subscribe/:analystId/:tierId`

---

## Testing Routes

### Manual Testing Checklist
- [ ] Landing page loads
- [ ] Login flow works
- [ ] Discovery browse/search
- [ ] Analyst profile all tabs
- [ ] Feed filters and infinite scroll
- [ ] Chat real-time messaging
- [ ] Checkout payment flow
- [ ] Dashboard charts and data
- [ ] Protected routes redirect to login
- [ ] Analyst-only routes restrict access
- [ ] Back button works correctly
- [ ] Direct URL access works

---

## Common Navigation Patterns

### After Login
```jsx
const handleLoginSuccess = () => {
  // Redirect to intended destination or feed
  const redirectTo = location.state?.from?.pathname || '/feed';
  navigate(redirectTo, { replace: true });
};
```

### After Subscription
```jsx
const handlePaymentSuccess = () => {
  navigate('/subscription-success', {
    state: { analyst, tier, billingCycle }
  });
};
```

### Cancel Actions
```jsx
const handleCancel = () => {
  navigate(-1); // Go back
};
```

---

## Route Performance

### Current Bundle Size
- Total: 563.82 kB
- Gzipped: 181.24 kB

### Optimization Opportunities
1. Lazy load routes (reduce initial bundle)
2. Code split by feature
3. Optimize Chart.js imports
4. Image lazy loading
5. Prefetch on hover (analyst profiles)

---

## Future Routes (Not Yet Implemented)

| Route | Purpose | Priority |
|-------|---------|----------|
| `/profile` | User profile settings | High |
| `/subscription-success` | Post-payment success | High |
| `/subscription-failed` | Payment failure | High |
| `/create-post` | Analyst post composer | High |
| `/bookmarks` | User saved posts | Medium |
| `/settings` | App settings | Medium |
| `/notifications` | Notification center | Medium |
| `/terms` | Terms & conditions | Low |
| `/privacy` | Privacy policy | Low |
| `/invite/:code` | Invite landing page | Low |

---

**Last Updated:** 2025-10-09
