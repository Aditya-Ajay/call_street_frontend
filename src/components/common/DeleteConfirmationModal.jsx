/**
 * DeleteConfirmationModal Component
 * Confirmation dialog for destructive actions
 *
 * @param {boolean} isOpen - Modal visibility
 * @param {function} onClose - Called when modal closes
 * @param {function} onConfirm - Called when confirm button clicked
 * @param {string} title - Modal title
 * @param {string} message - Confirmation message
 * @param {string} itemName - Name of item being deleted (optional)
 * @param {boolean} loading - Loading state during deletion
 */

import Modal from './Modal';
import Button from './Button';

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  itemName,
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="py-4">
        {/* Warning Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-danger bg-opacity-10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-danger"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <p className="text-center text-gray-700 mb-2">{message}</p>

        {/* Item Name */}
        {itemName && (
          <p className="text-center font-semibold text-gray-900 mb-4">
            "{itemName}"
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            fullWidth
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            fullWidth
            loading={loading}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
