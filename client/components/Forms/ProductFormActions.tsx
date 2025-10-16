"use client";

interface ProductFormActionsProps {
  isSubmitting: boolean;
  productId?: number;
  isDirty: boolean;
  submitButtonText: string;
  onReset: () => void;
  storageKey?: string;
}

export default function ProductFormActions({
  isSubmitting,
  productId,
  isDirty,
  submitButtonText,
  onReset,
  storageKey,
}: ProductFormActionsProps) {
  return (
    <>
      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || (productId !== undefined && !isDirty)}
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {productId !== undefined ? "Updating..." : "Creating..."}
            </span>
          ) : (
            submitButtonText
          )}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          {productId !== undefined ? "Reset Changes" : "Clear Form"}
        </button>
      </div>

      {/* Form Persistence Info */}
      {storageKey && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            💾 Your form progress is automatically saved locally
          </p>
        </div>
      )}
    </>
  );
}
