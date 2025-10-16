"use client";

import { Product } from "@/types";

interface ProductsTableStatesProps {
  loading: boolean;
  products: Product[];
  filteredProducts: Product[];
  onClearSearch: () => void;
}

export default function ProductsTableStates({
  loading,
  products,
  filteredProducts,
  onClearSearch,
}: ProductsTableStatesProps) {
  if (loading) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600 text-sm sm:text-base">
          Loading products...
        </p>
      </div>
    );
  }

  if (products.length > 0 && filteredProducts.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="text-gray-500 mb-2 text-sm sm:text-base">
          No products match your search
        </div>
        <button
          onClick={onClearSearch}
          className="text-green-600 hover:text-green-700 font-medium text-xs sm:text-sm"
        >
          Clear search
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
        No products available
      </div>
    );
  }

  return null;
}
