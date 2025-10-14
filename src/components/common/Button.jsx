/**
 * Button Component
 * Reusable button with variants, sizes, and loading states
 *
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} loading - Show spinner if true
 * @param {boolean} disabled - Disable button if true
 * @param {boolean} fullWidth - Full width button
 * @param {function} onClick - Click handler
 * @param {ReactNode} children - Button content
 * @param {string} className - Additional CSS classes
 * @param {string} as - Render as different element (e.g., 'span' for labels)
 */

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  children,
  className = '',
  type = 'button',
  as,
  ...props
}) => {
  const baseClasses = 'rounded-lg font-semibold transition-all duration-200 ease-out inline-flex items-center justify-center cursor-pointer';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark active:scale-98 shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:text-gray-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:scale-98 disabled:bg-gray-100 disabled:text-gray-400',
    outline: 'border-2 border-primary text-primary hover:bg-primary-light active:scale-98 disabled:border-gray-300 disabled:text-gray-400',
    danger: 'bg-danger text-white hover:bg-red-600 active:scale-98 shadow-md disabled:bg-gray-300 disabled:text-gray-500',
  };

  const sizeClasses = {
    sm: 'h-10 px-4 text-sm min-h-touch',
    md: 'h-12 px-6 text-base min-h-touch',
    lg: 'h-14 px-8 text-lg min-h-touch',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClass}
    ${(disabled || loading) && 'cursor-not-allowed opacity-50'}
    ${className}
  `;

  const content = loading ? (
    <div className="flex items-center gap-2">
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
      <span>Loading...</span>
    </div>
  ) : (
    children
  );

  if (as === 'span') {
    return (
      <span className={combinedClasses} {...props}>
        {content}
      </span>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClasses}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
