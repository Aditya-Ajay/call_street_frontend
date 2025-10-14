/**
 * Posts Feed Component
 * Displays list of posts with filters and infinite scroll
 */

import { useEffect, useRef, useCallback } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import PostCard from './PostCard';

const PostsFeed = () => {
  const {
    posts,
    postsLoading,
    postsFilter,
    setPostsFilter,
    hasMorePosts,
    loadMorePosts,
  } = useDashboard();

  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  // Filter options
  const filters = [
    { value: 'all', label: 'All Posts' },
    { value: 'active', label: 'Active' },
    { value: 'closed', label: 'Closed' },
    { value: 'expired', label: 'Expired' },
  ];

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMorePosts && !postsLoading) {
        loadMorePosts();
      }
    },
    [hasMorePosts, postsLoading, loadMorePosts]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver(handleObserver, option);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
          <div className="flex gap-3 mt-3">
            <div className="h-12 bg-gray-200 rounded flex-1" />
            <div className="h-12 bg-gray-200 rounded flex-1" />
            <div className="h-12 bg-gray-200 rounded flex-1" />
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="text-center py-16">
      <svg
        className="w-20 h-20 mx-auto text-gray-300 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
      <p className="text-gray-500 mb-6">
        {postsFilter === 'all'
          ? 'Start creating posts to share with your subscribers'
          : `No ${postsFilter} posts found`}
      </p>
      {postsFilter !== 'all' && (
        <button
          onClick={() => setPostsFilter('all')}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          View All Posts
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setPostsFilter(filter.value)}
            className={`
              px-4 py-2 rounded-lg font-semibold text-sm transition-all
              ${
                postsFilter === filter.value
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Posts List */}
      {postsLoading && posts.length === 0 ? (
        <LoadingSkeleton />
      ) : posts.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Infinite Scroll Trigger */}
          {hasMorePosts && (
            <div
              ref={loadMoreRef}
              className="flex justify-center py-8"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
            </div>
          )}

          {/* End of Feed */}
          {!hasMorePosts && posts.length > 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">
                You've reached the end of your posts
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostsFeed;
