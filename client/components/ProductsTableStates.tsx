"use client";

import { Product } from "@/types";

interface ProductsTableStatesProps {
  loading: boolean;
  error: string | null;
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  onClearSearch: () => void;
}

export default function ProductsTableStates({
  loading,
  error,
  products,
  filteredProducts,
  searchQuery,
  onClearSearch,
}: ProductsTableStatesProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (products.length > 0 && filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-2">No products match your search</div>
        <button
          onClick={onClearSearch}
          className="text-green-600 hover:text-green-700 font-medium text-sm"
        >
          Clear search
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No products available
      </div>
    );
  }

  return null;
}
