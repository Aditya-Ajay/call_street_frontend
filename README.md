# Analyst Marketplace Platform - Frontend

A complete, production-ready React frontend for connecting SEBI-verified stock market analysts with retail traders.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Socket.io Client** - Real-time chat
- **Chart.js** - Analytics visualizations

## Getting Started

### Installation

```bash
npm install
```

### Configure Environment

Copy `.env.example` to `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_RAZORPAY_KEY=your_razorpay_key_here
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Features

- Mobile-First Design (375px and up)
- Phone/Email OTP Authentication
- Analyst Discovery with Filters
- Real-Time Chat (Socket.io)
- Subscription Management (Razorpay)
- Analytics Dashboard
- Toast Notifications
- Skeleton Loading States

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── contexts/       # React Context providers
├── services/       # API and Socket.io clients
├── utils/          # Helper functions
└── assets/         # Images, icons
```

## Key Pages

- `/` - Landing Page
- `/discover` - Browse Analysts
- `/login` - Authentication
- `/feed` - User Feed (protected)
- `/analyst/:id` - Analyst Profile
- `/chat/:analystId` - Community Chat (protected)
- `/subscribe/:analystId` - Subscription Checkout
- `/dashboard` - Analyst Dashboard (protected)
- `/profile` - User Profile (protected)

## API Integration

Backend must be running at `http://localhost:5000`

All API calls use Axios with automatic token refresh on 401 errors.

## Troubleshooting

**Cannot connect to API:**
- Ensure backend is running
- Check `.env` has correct API URL
- Verify CORS is enabled in backend

**Socket connection failed:**
- Ensure Socket.io server is running
- Check auth token is valid

For more details, see full documentation in project root.
