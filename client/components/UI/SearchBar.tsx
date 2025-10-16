"use client";

import { useState } from "react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClear: () => void;
  suggestions: string[];
  showSuggestions: boolean;
  onSuggestionClick: (suggestion: string) => void;
  resultCount: number;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  onClear,
  suggestions,
  showSuggestions,
  onSuggestionClick,
  resultCount,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    if (searchQuery) {
      // Show suggestions when refocusing if there's a query
    }
  };

  const handleBlur = () => {
    // Delay to allow click on suggestions
    setTimeout(() => setIsFocused(false), 200);
  };

  return (
    <div className="mb-4 sm:mb-6 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="w-full relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Search by product name or category..."
              className="w-full px-3 py-2 sm:px-4 sm:py-3 pl-10 sm:pl-12 pr-8 sm:pr-10 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:border-green-500 dark:focus:border-green-400 transition-colors text-sm sm:text-base"
            />
            <svg
              className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={onClear}
                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
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
            )}
          </div>

          {/* Custom Autocomplete Dropdown */}
          {showSuggestions && isFocused && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-xl max-h-64 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      {suggestion}
                    </span>
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {searchQuery && (
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 w-full sm:w-auto text-center sm:text-left">
            Found{" "}
            <span className="font-semibold text-green-600 dark:text-green-400">
              {resultCount}
            </span>{" "}
            product{resultCount !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
