/**
 * ToggleSwitch Component
 * Accessible toggle switch with smooth animations
 *
 * @param {boolean} checked - Toggle state
 * @param {function} onChange - Called when toggle changes
 * @param {string} label - Label text (optional)
 * @param {boolean} disabled - Disable toggle
 * @param {string} id - HTML id for accessibility
 * @param {string} className - Additional CSS classes
 */

const ToggleSwitch = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  id,
  className = '',
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`mr-3 text-sm font-medium ${
            disabled ? 'text-gray-400' : 'text-gray-700'
          }`}
        >
          {label}
        </label>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${checked ? 'bg-primary' : 'bg-gray-300'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white
            transition-transform duration-200 ease-in-out
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
