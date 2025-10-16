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
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-300">
        Products Inventory
        {selectedCount > 0 && (
          <span className="ml-3 text-sm font-normal text-indigo-600">
            ({selectedCount} selected)
          </span>
        )}
      </h2>
      <div className="flex gap-3">
        {selectedCount > 0 && (
          <button
            onClick={onBulkDelete}
            className="inline-flex items-center px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium shadow-md"
          >
            <svg
              className="h-5 w-5 mr-2"
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
            Delete {selectedCount} item(s)
          </button>
        )}
        <button
          onClick={onExportToCSV}
          disabled={totalProducts === 0}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="h-5 w-5 mr-2"
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
          Export to CSV
        </button>
        <Link
          href="/products/create"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-md inline-flex items-center"
        >
          <svg
            className="h-5 w-5 mr-2"
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
          Add Product
        </Link>
      </div>
    </div>
  );
}
