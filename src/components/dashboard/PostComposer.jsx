/**
 * Post Composer Component
 * Allows analysts to create posts via voice or text input
 */

import { useState, useEffect } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { useToast } from '../../contexts/ToastContext';
import VoiceInput from './VoiceInput';

const STRATEGY_TYPES = [
  { value: 'longterm', label: 'Long Term' },
  { value: 'positional', label: 'Positional' },
  { value: 'swing', label: 'Swing' },
  { value: 'intraday', label: 'Intraday' },
  { value: 'overnight', label: 'Overnight' },
  { value: 'quant', label: 'Quant' },
];

const POST_TYPES = [
  { value: 'update', label: 'Update' },
  { value: 'analysis', label: 'Analysis' },
  { value: 'commentary', label: 'Commentary' },
  { value: 'educational', label: 'Educational' },
];

const PostComposer = () => {
  const {
    composerMode,
    setComposerMode,
    aiFormattedData,
    channelConfig,
    createPost,
  } = useDashboard();

  const { showToast } = useToast();

  const [submitting, setSubmitting] = useState(false);

  // Form data for trading calls
  const [callFormData, setCallFormData] = useState({
    stock_symbol: '',
    action: 'BUY',
    entry_price: '',
    target_price: '',
    stop_loss: '',
    strategy_type: 'swing',
    notes: '',
  });

  // Form data for announcements
  const [announcementFormData, setAnnouncementFormData] = useState({
    post_type: 'update',
    title: '',
    content: '',
  });

  const isCallChannel = channelConfig?.type === 'call';

  // Populate form when AI formatting is complete
  useEffect(() => {
    if (aiFormattedData && isCallChannel) {
      setCallFormData({
        stock_symbol: aiFormattedData.stock_symbol || '',
        action: aiFormattedData.action || 'BUY',
        entry_price: aiFormattedData.entry_price || '',
        target_price: aiFormattedData.target_price || '',
        stop_loss: aiFormattedData.stop_loss || '',
        strategy_type: aiFormattedData.strategy_type || 'swing',
        notes: aiFormattedData.notes || '',
      });

      // Switch to text mode to show the form
      setComposerMode('text');
    }
  }, [aiFormattedData, isCallChannel, setComposerMode]);

  const handleCallFormChange = (field, value) => {
    setCallFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnnouncementFormChange = (field, value) => {
    setAnnouncementFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateCallForm = () => {
    if (!callFormData.stock_symbol.trim()) {
      showToast('Stock symbol is required', 'warning');
      return false;
    }

    if (!callFormData.entry_price || callFormData.entry_price <= 0) {
      showToast('Entry price is required', 'warning');
      return false;
    }

    if (!callFormData.target_price || callFormData.target_price <= 0) {
      showToast('Target price is required', 'warning');
      return false;
    }

    if (!callFormData.stop_loss || callFormData.stop_loss <= 0) {
      showToast('Stop loss is required', 'warning');
      return false;
    }

    // Validate price logic
    if (callFormData.action === 'BUY') {
      if (parseFloat(callFormData.target_price) <= parseFloat(callFormData.entry_price)) {
        showToast('Target price must be higher than entry price for BUY', 'warning');
        return false;
      }
      if (parseFloat(callFormData.stop_loss) >= parseFloat(callFormData.entry_price)) {
        showToast('Stop loss must be lower than entry price for BUY', 'warning');
        return false;
      }
    } else if (callFormData.action === 'SELL') {
      if (parseFloat(callFormData.target_price) >= parseFloat(callFormData.entry_price)) {
        showToast('Target price must be lower than entry price for SELL', 'warning');
        return false;
      }
      if (parseFloat(callFormData.stop_loss) <= parseFloat(callFormData.entry_price)) {
        showToast('Stop loss must be higher than entry price for SELL', 'warning');
        return false;
      }
    }

    return true;
  };

  const validateAnnouncementForm = () => {
    if (!announcementFormData.title.trim()) {
      showToast('Title is required', 'warning');
      return false;
    }

    if (!announcementFormData.content.trim()) {
      showToast('Content is required', 'warning');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      let postData;

      if (isCallChannel) {
        if (!validateCallForm()) return;
        postData = {
          ...callFormData,
          stock_symbol: callFormData.stock_symbol.toUpperCase(),
        };
      } else {
        if (!validateAnnouncementForm()) return;
        postData = announcementFormData;
      }

      await createPost(postData);

      // Reset form
      if (isCallChannel) {
        setCallFormData({
          stock_symbol: '',
          action: 'BUY',
          entry_price: '',
          target_price: '',
          stop_loss: '',
          strategy_type: 'swing',
          notes: '',
        });
      } else {
        setAnnouncementFormData({
          post_type: 'update',
          title: '',
          content: '',
        });
      }
    } catch (error) {
      // Error already handled in context
      console.error('Post submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Tabs for Calls Channels */}
      {isCallChannel && (
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setComposerMode('voice')}
            className={`
              px-4 py-2 font-semibold text-sm transition-colors
              ${
                composerMode === 'voice'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            Voice Input
          </button>
          <button
            onClick={() => setComposerMode('text')}
            className={`
              px-4 py-2 font-semibold text-sm transition-colors
              ${
                composerMode === 'text'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            Text Input
          </button>
        </div>
      )}

      {/* Voice Input Mode (Calls Only) */}
      {isCallChannel && composerMode === 'voice' && <VoiceInput />}

      {/* Text Input Mode for Calls */}
      {isCallChannel && composerMode === 'text' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Stock Symbol */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stock Symbol *
            </label>
            <input
              type="text"
              value={callFormData.stock_symbol}
              onChange={(e) => handleCallFormChange('stock_symbol', e.target.value.toUpperCase())}
              placeholder="e.g., RELIANCE, TCS, INFY"
              required
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          {/* Action (BUY/SELL) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Action *
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleCallFormChange('action', 'BUY')}
                className={`
                  flex-1 h-12 rounded-lg font-semibold transition-all
                  ${
                    callFormData.action === 'BUY'
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                BUY
              </button>
              <button
                type="button"
                onClick={() => handleCallFormChange('action', 'SELL')}
                className={`
                  flex-1 h-12 rounded-lg font-semibold transition-all
                  ${
                    callFormData.action === 'SELL'
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                SELL
              </button>
            </div>
          </div>

          {/* Prices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Entry Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={callFormData.entry_price}
                onChange={(e) => handleCallFormChange('entry_price', e.target.value)}
                placeholder="0.00"
                required
                min="0.01"
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={callFormData.target_price}
                onChange={(e) => handleCallFormChange('target_price', e.target.value)}
                placeholder="0.00"
                required
                min="0.01"
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stop Loss *
              </label>
              <input
                type="number"
                step="0.01"
                value={callFormData.stop_loss}
                onChange={(e) => handleCallFormChange('stop_loss', e.target.value)}
                placeholder="0.00"
                required
                min="0.01"
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Strategy Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Strategy Type *
            </label>
            <select
              value={callFormData.strategy_type}
              onChange={(e) => handleCallFormChange('strategy_type', e.target.value)}
              required
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              {STRATEGY_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes/Rationale */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes / Rationale (Optional)
            </label>
            <textarea
              value={callFormData.notes}
              onChange={(e) => handleCallFormChange('notes', e.target.value)}
              placeholder="Add any additional context, technical analysis, or reasoning..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
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
                <span>Posting...</span>
              </>
            ) : (
              'Post Call'
            )}
          </button>
        </form>
      )}

      {/* Text Input Mode for Announcements */}
      {!isCallChannel && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Post Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Post Type *
            </label>
            <select
              value={announcementFormData.post_type}
              onChange={(e) => handleAnnouncementFormChange('post_type', e.target.value)}
              required
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              {POST_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={announcementFormData.title}
              onChange={(e) => handleAnnouncementFormChange('title', e.target.value)}
              placeholder="Enter announcement title..."
              required
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={announcementFormData.content}
              onChange={(e) => handleAnnouncementFormChange('content', e.target.value)}
              placeholder="Write your announcement content..."
              required
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
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
                <span>Posting...</span>
              </>
            ) : (
              'Post Announcement'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default PostComposer;
