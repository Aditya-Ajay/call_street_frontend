/**
 * Bottom Navigation Component
 * Mobile-first navigation bar with active state highlighting
 *
 * Usage: Displayed at bottom of screen on mobile, hidden on desktop
 */

import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    {
      name: 'Feed',
      path: '/feed',
      icon: (isActive) => (
        <svg
          className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-gray-500'}`}
          fill={isActive ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isActive ? 0 : 2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      ),
    },
    {
      name: 'Discover',
      path: '/discovery',
      icon: (isActive) => (
        <svg
          className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-gray-500'}`}
          fill={isActive ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isActive ? 0 : 2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      name: 'Community',
      path: '/community',
      icon: (isActive) => (
        <svg
          className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-gray-500'}`}
          fill={isActive ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isActive ? 0 : 2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: (isActive) => (
        <svg
          className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-gray-500'}`}
          fill={isActive ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isActive ? 0 : 2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  // Check if current path matches nav item path
  const isActive = (path) => {
    if (path === '/feed') {
      return location.pathname === '/feed' || location.pathname === '/';
    }
    // Exact match for other paths to avoid conflicts
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe sm:hidden z-40">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full transition-colors"
            >
              <div className="flex flex-col items-center gap-1">
                {item.icon(active)}
                <span
                  className={`text-xs font-medium ${
                    active ? 'text-primary' : 'text-gray-500'
                  }`}
                >
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
