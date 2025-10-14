# Frontend Integration Checklist

## Pre-Integration Setup

### Environment Configuration
- [ ] Set `VITE_API_BASE_URL` in `.env` file
- [ ] Set `VITE_SOCKET_URL` in `.env` file
- [ ] Set `VITE_RAZORPAY_KEY` (test key for development)
- [ ] Verify backend API is running
- [ ] Verify Socket.io server is running

### Dependencies Verification
```bash
cd frontend
npm install
npm run build  # Verify build succeeds
```

---

## Backend API Integration

### Authentication Endpoints
- [ ] `POST /api/auth/request-otp` - Returns success with OTP sent
- [ ] `POST /api/auth/verify-otp` - Returns access token & refresh token
- [ ] `POST /api/auth/refresh-token` - Refreshes access token
- [ ] `POST /api/auth/logout` - Invalidates tokens
- [ ] `GET /api/auth/me` - Returns current user data

**Test Flow:**
1. Request OTP via Login page
2. Verify OTP and receive tokens
3. Check tokens stored in localStorage
4. Navigate to protected route (should work)
5. Clear tokens and try again (should redirect to login)

---

### Analyst Endpoints
- [ ] `GET /api/analysts` - Returns paginated analyst list
- [ ] `GET /api/analysts/:id` - Returns single analyst profile
- [ ] `GET /api/analysts/:id/reviews` - Returns analyst reviews
- [ ] `GET /api/analysts/featured` - Returns featured analysts

**Test Flow:**
1. Open Discovery page
2. Verify analyst cards display correctly
3. Click analyst card → Navigate to profile
4. Verify all profile tabs load data
5. Check reviews tab populates

---

### Post Endpoints
- [ ] `GET /api/posts` - Returns paginated posts with filters
- [ ] `GET /api/posts/:id` - Returns single post
- [ ] `POST /api/posts/:id/bookmark` - Bookmarks post
- [ ] `DELETE /api/posts/:id/bookmark` - Removes bookmark
- [ ] `GET /api/posts/bookmarks` - Returns user's bookmarked posts

**Test Flow:**
1. Open Feed page
2. Verify posts display with all details
3. Apply filters (Today, Intraday, etc.)
4. Bookmark a post → Verify state updates
5. Test infinite scroll (scroll to bottom)
6. Verify post cards show correct data

---

### Subscription Endpoints
- [ ] `GET /api/subscriptions/tiers/:analystId` - Returns pricing tiers
- [ ] `POST /api/subscriptions/create-order` - Creates Razorpay order
- [ ] `POST /api/subscriptions/verify-payment` - Verifies payment signature
- [ ] `GET /api/subscriptions/my-subscriptions` - Returns user subscriptions
- [ ] `POST /api/subscriptions/:id/cancel` - Cancels subscription

**Test Flow:**
1. Navigate to analyst profile
2. Click pricing tab → Verify tiers display
3. Click Subscribe → Navigate to checkout
4. Verify order creation
5. Complete Razorpay payment (test mode)
6. Verify payment verification
7. Check subscription activation

---

### Chat Endpoints
- [ ] `GET /api/chat/channels/:analystId` - Returns chat channels
- [ ] `GET /api/chat/messages/:channelId` - Returns messages
- [ ] `POST /api/chat/messages/:channelId` - Sends message
- [ ] `DELETE /api/chat/messages/:messageId` - Deletes message

**Test Flow:**
1. Navigate to Chat page
2. Verify channels load
3. Select channel → Verify messages load
4. Send message → Verify appears in chat
5. Check subscription gate for non-subscribers

---

### Analytics Endpoints (Analyst Only)
- [ ] `GET /api/analytics/overview` - Returns dashboard overview
- [ ] `GET /api/analytics/revenue` - Returns revenue data
- [ ] `GET /api/analytics/subscribers` - Returns subscriber growth
- [ ] `GET /api/analytics/posts` - Returns post analytics
- [ ] `GET /api/analytics/reviews` - Returns review analytics

**Test Flow:**
1. Login as analyst
2. Navigate to Dashboard
3. Verify metric cards populate
4. Verify charts render with data
5. Change date range → Verify charts update

---

### Invite Endpoints
- [ ] `POST /api/invites/generate` - Creates invite link
- [ ] `GET /api/invites/my-links` - Returns analyst's invite links
- [ ] `GET /api/invites/:code` - Returns invite details (public)
- [ ] `POST /api/invites/:code/track-click` - Tracks invite click
- [ ] `POST /api/invites/discount-codes/validate` - Validates discount code

**Test Flow:**
1. Open Dashboard
2. Create invite link → Verify appears in table
3. Copy invite link → Verify format
4. Use discount code in checkout → Verify discount applies

---

## Socket.io Integration

### Connection
- [ ] Socket connects on chat page load
- [ ] Authentication token sent in connection
- [ ] Connection status tracked correctly
- [ ] Reconnection works after disconnect

**Test:**
```javascript
// In browser console on Chat page
socketService.isConnected() // Should return true
```

### Events (Emit)
- [ ] `join_channel` - User joins channel
- [ ] `leave_channel` - User leaves channel
- [ ] `send_message` - User sends message
- [ ] `typing` - User typing indicator

### Events (Listen)
- [ ] `new_message` - Receive new message
- [ ] `user_typing` - User typing notification
- [ ] `online_users` - Online user count update
- [ ] `message_deleted` - Message deletion notification

**Test Flow:**
1. Open chat in two browser windows
2. Send message in window 1 → Verify appears in window 2
3. Type in window 1 → Verify typing indicator in window 2
4. Join channel → Verify online count increases
5. Leave channel → Verify online count decreases

---

## Razorpay Payment Integration

### Configuration
- [ ] Razorpay SDK loads from CDN
- [ ] Test API key configured (`VITE_RAZORPAY_KEY`)
- [ ] Checkout modal opens correctly
- [ ] Payment options display (cards, UPI, netbanking)

### Payment Flow
- [ ] Order creation on backend
- [ ] Razorpay checkout opens
- [ ] Test payment completes (test card: 4111 1111 1111 1111)
- [ ] Payment ID returned
- [ ] Signature verification on backend
- [ ] Subscription activation
- [ ] Redirect to success page

**Test Cards (Razorpay Test Mode):**
- Success: `4111 1111 1111 1111`
- Failure: `4000 0000 0000 0002`

**Test Flow:**
1. Navigate to checkout page
2. Fill checkout form
3. Click Pay button
4. Razorpay modal opens
5. Enter test card details
6. Complete payment
7. Verify payment success callback
8. Verify redirect to success page

---

## UI/UX Testing

### Responsive Design
- [ ] Mobile (375px) - All pages render correctly
- [ ] Tablet (768px) - Layout adjusts appropriately
- [ ] Desktop (1280px+) - Full layout displays
- [ ] No horizontal scroll on any breakpoint
- [ ] Touch targets ≥ 44px on mobile

**Test Devices:**
- iPhone SE (375px)
- iPad (768px)
- MacBook (1280px)

### Components
- [ ] Modal - Opens/closes, keyboard navigation
- [ ] BottomNav - Active states, navigation
- [ ] PostCard - Expand/collapse, bookmark
- [ ] AnalystCard - Click navigation, hover
- [ ] PricingCard - Subscribe CTA, pricing display
- [ ] Button - All variants, loading states
- [ ] Toast - Success/error/info messages

### Pages
- [ ] Landing - All sections, CTAs work
- [ ] Login - OTP flow, validation
- [ ] Discovery - Search, filters, pagination
- [ ] AnalystProfile - All tabs, sticky nav, bottom CTA
- [ ] Feed - Filters, infinite scroll, bookmarks
- [ ] Chat - Real-time messages, typing indicators
- [ ] SubscriptionCheckout - Payment flow, discount codes
- [ ] AnalystDashboard - Charts, metrics, invite links

---

## Performance Testing

### Load Times
- [ ] Initial page load < 2s
- [ ] Subsequent navigation < 500ms
- [ ] API responses < 1s
- [ ] Chart rendering < 500ms

### Optimizations
- [ ] Images lazy load
- [ ] Infinite scroll smooth
- [ ] No layout shift (CLS)
- [ ] 60fps animations
- [ ] No memory leaks (check with Chrome DevTools)

**Testing Tools:**
- Chrome DevTools Lighthouse
- Network throttling (Fast 3G)
- Performance profiler

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter to activate buttons/links
- [ ] Escape to close modals
- [ ] Arrow keys for navigation (where applicable)

### Screen Reader
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] ARIA labels on icons
- [ ] Semantic HTML structure
- [ ] Focus indicators visible

**Testing Tools:**
- Chrome DevTools Accessibility audit
- WAVE browser extension
- VoiceOver (Mac) / NVDA (Windows)

---

## Error Handling

### Network Errors
- [ ] API timeout handled (show retry)
- [ ] 500 errors show user-friendly message
- [ ] 404 errors redirect appropriately
- [ ] Token refresh on 401
- [ ] Socket disconnect handled gracefully

### User Errors
- [ ] Form validation messages clear
- [ ] Invalid input prevented
- [ ] Empty states helpful
- [ ] Loading states everywhere
- [ ] Success feedback on actions

**Test Scenarios:**
1. Disconnect internet → Try action → Verify error message
2. Invalid form input → Verify validation
3. API timeout → Verify retry option
4. Empty data sets → Verify empty states

---

## Security Testing

### Authentication
- [ ] Tokens stored in localStorage (not cookies for now)
- [ ] Tokens included in API requests
- [ ] Protected routes require auth
- [ ] Auto-logout on token expiry
- [ ] Refresh token flow works

### Data Protection
- [ ] No sensitive data in URLs
- [ ] No API keys in client code (use env vars)
- [ ] HTTPS in production
- [ ] XSS protection (React handles by default)
- [ ] CSRF protection (backend responsibility)

---

## Browser Compatibility

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Samsung Internet

---

## Integration Test Scenarios

### Complete User Flow
1. [ ] Land on homepage → Click CTA
2. [ ] Navigate to Discovery → Browse analysts
3. [ ] Click analyst → View profile
4. [ ] View all tabs (Overview, Pricing, Samples, Reviews)
5. [ ] Click Subscribe → Proceed to checkout
6. [ ] Complete payment → Subscription activated
7. [ ] Navigate to Feed → See posts from subscribed analyst
8. [ ] Bookmark a post → Verify bookmark saved
9. [ ] Navigate to Chat → Join channel
10. [ ] Send message → Verify appears in real-time
11. [ ] Logout → Verify tokens cleared

### Complete Analyst Flow
1. [ ] Login as analyst
2. [ ] Navigate to Dashboard → View metrics
3. [ ] Create invite link → Copy link
4. [ ] View revenue chart → Change date range
5. [ ] Navigate to Chat → View subscriber messages
6. [ ] Create post (future feature)

---

## Deployment Checklist

### Pre-Deployment
- [ ] Production environment variables set
- [ ] Build succeeds (`npm run build`)
- [ ] Bundle size acceptable (< 1MB)
- [ ] No console errors/warnings
- [ ] Lighthouse score > 90

### Post-Deployment
- [ ] All routes accessible
- [ ] API endpoints work (production URLs)
- [ ] Socket.io connects (production server)
- [ ] Razorpay production keys configured
- [ ] HTTPS enabled
- [ ] Error monitoring setup (Sentry)

---

## Known Issues & Limitations

### Current Limitations
- [ ] No offline mode (requires Service Worker)
- [ ] No PWA features yet
- [ ] No push notifications
- [ ] Bundle size > 500KB (code splitting needed)
- [ ] No image optimization (use Cloudinary)

### Future Improvements
- [ ] Lazy load routes
- [ ] Optimize Chart.js bundle
- [ ] Add PWA manifest
- [ ] Implement Service Worker
- [ ] Add push notifications
- [ ] Optimize images

---

## Support & Debugging

### Common Issues

**Issue: API requests fail with CORS error**
- Solution: Ensure backend allows frontend origin in CORS config

**Issue: Socket.io won't connect**
- Solution: Check VITE_SOCKET_URL matches backend server

**Issue: Razorpay checkout doesn't open**
- Solution: Verify SDK loaded, check browser console for errors

**Issue: Images don't load**
- Solution: Check image URLs, verify CORS for image CDN

**Issue: Charts don't render**
- Solution: Verify Chart.js registered, check data format

### Debug Tools
- React DevTools
- Redux DevTools (if state management added)
- Network tab (API requests)
- Console (errors/warnings)
- Performance profiler

---

## Sign-Off Criteria

Frontend is ready for production when:
- [x] All pages built and functional
- [x] All components working
- [x] Build succeeds without errors
- [ ] All API endpoints integrated and tested
- [ ] Socket.io real-time features working
- [ ] Payment flow tested end-to-end
- [ ] Responsive on all devices
- [ ] Accessibility audit passed
- [ ] Performance targets met
- [ ] Browser compatibility verified
- [ ] Error handling comprehensive
- [ ] Security measures in place

---

**Integration Status:** Ready for Backend Integration
**Last Updated:** 2025-10-09
**Next Steps:** Backend API integration testing
