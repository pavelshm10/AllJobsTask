"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import ConfirmDialog from "./ConfirmDialog";
import ErrorBanner from "./ErrorBanner";
import SuccessBanner from "./SuccessBanner";
import { useProductDelete } from "@/hooks/useProductDelete";
import { getUserFriendlyMessage } from "@/utils/apiErrorHandler";
import { exportProductsToCSV } from "@/utils/csvExport";

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export default function ProductsTable({
  products,
  loading,
  error,
}: ProductsTableProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<
    string[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Delete states
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set()
  );
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  // Unified delete hook for both single and bulk operations
  const {
    deleteSingle,
    deleteBulk,
    isPending: isDeleting,
  } = useProductDelete();

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredProducts(products);
      setShowAutocomplete(false);
      return;
    }

    // Filter products by name or category
    const filtered = products.filter(
      (product) =>
        product.productName.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredProducts(filtered);

    // Generate autocomplete suggestions (unique product names and categories)
    const suggestions = new Set<string>();
    products.forEach((product) => {
      if (product.productName.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(product.productName);
      }
      if (product.category.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(product.category);
      }
    });

    setAutocompleteSuggestions(Array.from(suggestions).slice(0, 8));
    setShowAutocomplete(suggestions.size > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    const filtered = products.filter(
      (product) =>
        product.productName.toLowerCase().includes(suggestion.toLowerCase()) ||
        product.category.toLowerCase().includes(suggestion.toLowerCase())
    );
    setFilteredProducts(filtered);
    setShowAutocomplete(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredProducts(products);
    setShowAutocomplete(false);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  };

  // Delete handlers
  const handleSelectProduct = (productId: number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === paginatedProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(paginatedProducts.map((p) => p.id)));
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) {
      return;
    }

    try {
      setDeleteError(null);
      await deleteSingle(productToDelete.id);
      setDeleteSuccess(
        `Product "${productToDelete.productName}" deleted successfully!`
      );
      setShowDeleteConfirm(false);
      setProductToDelete(null);

      setTimeout(() => setDeleteSuccess(null), 5000);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? getUserFriendlyMessage(error)
          : "Failed to delete product";
      setDeleteError(errorMessage);
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedProducts.size === 0) return;
    setShowBulkDeleteConfirm(true);
  };

  const handleConfirmBulkDelete = async () => {
    try {
      setDeleteError(null);
      await deleteBulk(Array.from(selectedProducts));
      setDeleteSuccess(
        `${selectedProducts.size} product(s) deleted successfully!`
      );
      setShowBulkDeleteConfirm(false);
      setSelectedProducts(new Set());

      setTimeout(() => setDeleteSuccess(null), 5000);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? getUserFriendlyMessage(error)
          : "Failed to delete products";
      setDeleteError(errorMessage);
      setShowBulkDeleteConfirm(false);
    }
  };

  // CSV Export handler
  const handleExportToCSV = () => {
    const productsToExport =
      searchQuery.trim() !== "" ? filteredProducts : products;
    exportProductsToCSV(productsToExport, "products_export");
    setDeleteSuccess(
      `Exported ${productsToExport.length} product(s) to CSV successfully!`
    );
    setTimeout(() => setDeleteSuccess(null), 3000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 transition-colors duration-300">
      {/* Success Banner */}
      {deleteSuccess && (
        <SuccessBanner
          message={deleteSuccess}
          onDismiss={() => setDeleteSuccess(null)}
        />
      )}

      {/* Error Banner */}
      {deleteError && (
        <ErrorBanner
          message={deleteError}
          onDismiss={() => setDeleteError(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-300">
          Products Inventory
          {selectedProducts.size > 0 && (
            <span className="ml-3 text-sm font-normal text-indigo-600">
              ({selectedProducts.size} selected)
            </span>
          )}
        </h2>
        <div className="flex gap-3">
          {selectedProducts.size > 0 && (
            <button
              onClick={handleBulkDeleteClick}
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
              Delete {selectedProducts.size} item(s)
            </button>
          )}
          <button
            onClick={handleExportToCSV}
            disabled={products.length === 0}
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

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClear={clearSearch}
        suggestions={autocompleteSuggestions}
        showSuggestions={showAutocomplete}
        onSuggestionClick={handleSuggestionClick}
        resultCount={filteredProducts.length}
      />

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <span className="font-medium">Error:</span> {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedProducts.size === paginatedProducts.length &&
                      paginatedProducts.length > 0
                    }
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Units
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedProducts.map((product) => (
                <tr
                  key={product.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedProducts.has(product.id)
                      ? "bg-indigo-50 dark:bg-indigo-900"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-300">
                      {product.productName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {product.supplier}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm dark:text-gray-300">
                      ${product.unitPrice.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      <span
                        className={`font-medium`}
                      >
                        {product.units}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/products/${product.id}/edit`}
                        className="inline-flex items-center px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg
                          className="h-4 w-4 mr-1"
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
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageSize={pageSize}
              totalItems={filteredProducts.length}
              onPageSizeChange={handlePageSizeChange}
              itemLabel="products"
            />
          )}
        </div>
      )}

      {!loading &&
        !error &&
        products.length > 0 &&
        filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">
              No products match your search
            </div>
            <button
              onClick={clearSearch}
              className="text-green-600 hover:text-green-700 font-medium text-sm"
            >
              Clear search
            </button>
          </div>
        )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No products available
        </div>
      )}

      {/* Single Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm && productToDelete !== null}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.productName}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setProductToDelete(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="red"
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showBulkDeleteConfirm}
        title="Delete Multiple Products"
        message={`Are you sure you want to delete ${selectedProducts.size} product(s)? This action cannot be undone.`}
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setShowBulkDeleteConfirm(false)}
        confirmText={`Delete ${selectedProducts.size} item(s)`}
        cancelText="Cancel"
        confirmColor="red"
      />
    </div>
  );
}
