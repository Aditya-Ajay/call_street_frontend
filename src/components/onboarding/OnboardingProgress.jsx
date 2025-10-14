/**
 * Onboarding Progress Component
 * Shows step-by-step progress indicator
 *
 * @param {number} currentStep - Current step (1-4)
 * @param {number} totalSteps - Total number of steps (default: 4)
 */

const OnboardingProgress = ({ currentStep = 1, totalSteps = 4 }) => {
  return (
    <div className="onboarding-progress w-full bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto">
        {/* Step Text */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </p>
          <p className="text-xs text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Labels (Mobile: Hidden, Desktop: Visible) */}
        <div className="hidden md:flex items-center justify-between mt-4">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
            const isCompleted = step < currentStep;
            const isCurrent = step === currentStep;
            const isPending = step > currentStep;

            return (
              <div
                key={step}
                className="flex flex-col items-center flex-1"
              >
                {/* Step Circle */}
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                    ${isCompleted && 'bg-primary text-white'}
                    ${isCurrent && 'bg-primary text-white ring-4 ring-primary-light'}
                    ${isPending && 'bg-gray-200 text-gray-500'}
                  `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step
                  )}
                </div>

                {/* Step Label */}
                <p
                  className={`
                    text-xs mt-2 text-center
                    ${isCurrent && 'font-semibold text-primary'}
                    ${isPending && 'text-gray-400'}
                    ${isCompleted && 'text-gray-600'}
                  `}
                >
                  {getStepLabel(step)}
                </p>

                {/* Connector Line */}
                {step < totalSteps && (
                  <div className="hidden" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * Get step label text
 * @param {number} step - Step number
 * @returns {string} Step label
 */
const getStepLabel = (step) => {
  const labels = {
    1: 'Profile',
    2: 'Pricing',
    3: 'SEBI',
    4: 'Complete',
  };
  return labels[step] || '';
};

export default OnboardingProgress;
