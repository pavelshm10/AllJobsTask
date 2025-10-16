"use client";

interface SuccessBannerProps {
  message: string;
  onDismiss: () => void;
}

export default function SuccessBanner({
  message,
  onDismiss,
}: SuccessBannerProps) {
  return (
    <div className="mb-4 sm:mb-6 bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 rounded-lg animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-2 sm:ml-3">
            <p className="text-xs sm:text-sm font-medium text-green-800">
              {message}
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-green-500 hover:text-green-700 transition-colors"
        >
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
