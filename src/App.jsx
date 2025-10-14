/**
 * Main App Component
 * Sets up routing and global providers
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { StreamProvider } from './contexts/StreamContext';
import Toast from './components/common/Toast';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Discovery from './pages/Discovery';
import AnalystProfile from './pages/AnalystProfile';
import Feed from './pages/Feed';
import Chat from './pages/Chat';
import SubscriptionCheckout from './pages/SubscriptionCheckout';
import AnalystDashboard from './pages/AnalystDashboard';
import Settings from './pages/Settings';

// Analyst Onboarding Pages
import ProfileSetup from './pages/analyst/onboarding/ProfileSetup';
import PricingSetup from './pages/analyst/onboarding/PricingSetup';
import SEBIUpload from './pages/analyst/onboarding/SEBIUpload';
import OnboardingSuccess from './pages/analyst/onboarding/OnboardingSuccess';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Analyst Onboarding Route Component
const OnboardingRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.user_type !== 'analyst') {
    return <Navigate to="/feed" replace />;
  }

  return children;
};

// Main App Routes
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/discovery" element={<Discovery />} />
      <Route path="/analyst/:id" element={<AnalystProfile />} />

      {/* Protected Routes */}
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:analystId?"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscribe/:analystId/:tierId"
        element={
          <ProtectedRoute>
            <SubscriptionCheckout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AnalystDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalystDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscribers"
        element={
          <ProtectedRoute>
            <AnalystDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/revenue"
        element={
          <ProtectedRoute>
            <AnalystDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Analyst Onboarding Routes */}
      <Route
        path="/analyst/onboarding/profile"
        element={
          <OnboardingRoute>
            <ProfileSetup />
          </OnboardingRoute>
        }
      />
      <Route
        path="/analyst/onboarding/pricing"
        element={
          <OnboardingRoute>
            <PricingSetup />
          </OnboardingRoute>
        }
      />
      <Route
        path="/analyst/onboarding/sebi"
        element={
          <OnboardingRoute>
            <SEBIUpload />
          </OnboardingRoute>
        }
      />
      <Route
        path="/analyst/onboarding/submit"
        element={
          <OnboardingRoute>
            <OnboardingSuccess />
          </OnboardingRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OnboardingProvider>
          <ToastProvider>
            <StreamProvider>
              <div className="app min-h-screen bg-gray-50">
                <AppRoutes />
                <Toast />
              </div>
            </StreamProvider>
          </ToastProvider>
        </OnboardingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
