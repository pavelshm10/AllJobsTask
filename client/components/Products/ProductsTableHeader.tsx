"use client";

import Link from "next/link";

interface ProductsTableHeaderProps {
  selectedCount: number;
  totalProducts: number;
  onBulkDelete: () => void;
  onExportToCSV: () => void;
}

export default function ProductsTableHeader({
  selectedCount,
  totalProducts,
  onBulkDelete,
  onExportToCSV,
}: ProductsTableHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-gray-300">
        Products Inventory
        {selectedCount > 0 && (
          <span className="ml-3 text-xs sm:text-sm font-normal text-indigo-600">
            ({selectedCount} selected)
          </span>
        )}
      </h2>
      <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
        {selectedCount > 0 && (
          <button
            onClick={onBulkDelete}
            className="button-responsive bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium shadow-md inline-flex items-center"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="hidden sm:inline">
              Delete {selectedCount} item(s)
            </span>
            <span className="sm:hidden">Delete ({selectedCount})</span>
          </button>
        )}
        <button
          onClick={onExportToCSV}
          disabled={totalProducts === 0}
          className="button-responsive bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="hidden sm:inline">Export to CSV</span>
          <span className="sm:hidden">Export</span>
        </button>
        <Link
          href="/products/create"
          className="button-responsive bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-md inline-flex items-center"
        >
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>
    </div>
  );
}
