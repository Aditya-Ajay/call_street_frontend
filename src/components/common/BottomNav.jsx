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
      name: 'Chat',
      path: '/chat',
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
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
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
    return location.pathname.startsWith(path);
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
