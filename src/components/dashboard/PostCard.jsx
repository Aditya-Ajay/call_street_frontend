/**
 * Post Card Component (Dashboard Version)
 * Displays a single post with edit/delete actions for analyst
 */

import { useState } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { useToast } from '../../contexts/ToastContext';
import Modal from '../common/Modal';

const PostCard = ({ post }) => {
  const { updatePost, deletePost } = useDashboard();
  const { showToast } = useToast();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isCall = post.post_type === 'call';

  // Format timestamp
  const formatTimestamp = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return postDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: postDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  // Get status badge
  const getStatusBadge = () => {
    if (!isCall) return null;

    const status = post.status || 'active';

    const statusConfig = {
      active: { label: 'Active', color: 'bg-blue-100 text-blue-800' },
      target_hit: { label: 'Target Hit', color: 'bg-green-100 text-green-800' },
      sl_hit: { label: 'SL Hit', color: 'bg-red-100 text-red-800' },
      expired: { label: 'Expired', color: 'bg-gray-100 text-gray-800' },
    };

    const config = statusConfig[status] || statusConfig.active;

    return (
      <span
        className={`text-xs font-semibold px-2 py-1 rounded-full ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  // Get tier badge
  const getTierBadge = () => {
    const tier = post.tier || 'free';
    return tier === 'paid' ? (
      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
        PAID
      </span>
    ) : (
      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-800">
        FREE
      </span>
    );
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deletePost(post._id);
      setShowDeleteModal(false);
    } catch (error) {
      // Error already handled in context
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getTierBadge()}
            {getStatusBadge()}
          </div>
          <div className="flex items-center gap-2">
            {/* View Count */}
            <div className="flex items-center gap-1 text-gray-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-medium">
                {post.view_count || 0}
              </span>
            </div>

            {/* Actions Dropdown */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowEditModal(true)}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="Edit post"
              >
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-1.5 hover:bg-red-50 rounded transition-colors"
                title="Delete post"
              >
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {isCall ? (
          // Trading Call Layout
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">
                {post.stock_symbol}
              </h3>
              <span
                className={`text-sm font-semibold px-2 py-0.5 rounded ${
                  post.action === 'BUY'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {post.action}
              </span>
              <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
                {post.strategy_type?.toUpperCase() || 'SWING'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Entry</p>
                <p className="text-sm font-semibold text-gray-900">
                  ₹{parseFloat(post.entry_price).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Target</p>
                <p className="text-sm font-semibold text-green-600">
                  ₹{parseFloat(post.target_price).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Stop Loss</p>
                <p className="text-sm font-semibold text-red-600">
                  ₹{parseFloat(post.stop_loss).toFixed(2)}
                </p>
              </div>
            </div>

            {post.notes && (
              <p className="text-sm text-gray-700 leading-relaxed border-t border-gray-100 pt-2">
                {post.notes}
              </p>
            )}
          </div>
        ) : (
          // Announcement Layout
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
                {post.post_type?.toUpperCase() || 'UPDATE'}
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900">
              {post.title}
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
              {post.content}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {formatTimestamp(post.created_at)}
          </span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Post"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
              className="flex-1 h-12 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 h-12 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {deleting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Deleting...</span>
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal - Placeholder for future implementation */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Post"
        size="md"
      >
        <div className="text-center py-8 text-gray-500">
          <p>Edit functionality will be implemented in the next phase.</p>
          <button
            onClick={() => setShowEditModal(false)}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};

export default PostCard;
